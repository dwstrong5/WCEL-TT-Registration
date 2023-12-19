from flask import Flask, render_template, request, redirect, url_for, jsonify, session, send_file
from datetime import datetime
import pymongo, os, json, certifi, bcrypt
from bson.objectid import ObjectId
import pandas as pd 
from io import BytesIO

app = Flask(__name__)

# Language options for registration
languages = ["Latin", 
             "Spanish", 
             "Portuguese", 
             "German", 
             "Japanese", 
             "Korean", 
             "Russian", 
             "French", 
             "Punjabi",
             "Chinese",
             "Mandarin",
             "Arabic",
             "Italian"
             ]
headers = {
        '_id': "ID",
        'date': "Date",
        'parent-name': 'Guardian Name',
        'relationship': "Relationship",
        'email': 'Email',
        'phone': 'Phone',
        'languages': 'Languages',
        'reference': 'Reference',
        'consultation-photo-permission': 'Consultation Photo Permission',
        'outreach-photo-permission': 'Media Photo Permission',
        'child-name-1': 'Child 1',
        'child-name-2': "Child 2",
        'child-name-3': 'Child 3',
        'child-name-4': 'Child 4',
        'child-name-5': 'Child 5',
        'child-age-1': 'Child 1 DOB',
        'child-age-2': 'Child 2 DOB',
        'child-age-3': 'Child 3 DOB',
        'child-age-4': 'Child 4 DOB',
        'child-age-5': 'Child 5 DOB',
        'receiving-services-1': 'Receiving Services?',
        'receiving-services-2': 'Receiving Services?',
        'receiving-services-3': 'Receiving Services?',
        'receiving-services-4': 'Receiving Services?',
        'receiving-services-5': 'Receiving Services?',
}

def generatePreviewData(numRecords):
    records = entries.find({}).sort("date", -1).limit(numRecords)
    
    res = pd.DataFrame(columns= ["ID", "Date", "Guardian Name", "Relationship", "Consultation Photo Permission", "Media Photo Permission"])
    for entry in records:
        new_row = {}
        for key in entry.keys():
            if headers.get(key) in res.columns:
                new_row[headers.get(key)] = entry[key]
        res.loc[len(res)] = new_row
    return res.fillna('')

# Establish connection with database
with open('config.txt') as f:
    credentials = json.load(f)

uri = "mongodb+srv://" + os.environ.get("MONGO_USERNAME") + ":" + os.environ.get("MONGO_PASS") + "@wcel-cluster.wtcxphf.mongodb.net/?retryWrites=true&w=majority"
client = pymongo.MongoClient(uri, tlsCAFile=certifi.where())
# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

db = client['toddler-time-registration']
#entries = db.get_collection('entries')
entries = db.get_collection('test-entries')
users = db.get_collection('users')
app = Flask(__name__)
app.secret_key = os.urandom(24)

# Format phone number to (XXX) XXX-XXXX 
def formatPhone(num):
    return"({}) {}-{}".format(num[0:3], num[3:6], num[6:])
    
# Function that takes in form data and returns a dictionary with data formatted to
# keys used in mongoDB    
def generateNewEntry(data):

    # Create date stamp for new record entry
    new_entry = dict()
    new_entry["date"] = datetime.today().strftime('%m/%d/%Y')

    # For each item in form data
    for item in list(data.lists()):
        curr_item = list(item)

        # If user provided phone number, format to desired format
        if curr_item[0] == 'phone' and curr_item[1]:
            curr_item[1][0] = standardize(curr_item[1][0])

        # If multiple options submitted for languages, create a semi-colon delimited list of 
        # each selected language
        entry = ""
        for sub_item in curr_item[1]:
            if sub_item != '':
                entry = entry + str(sub_item) + ";"
        new_entry[curr_item[0]] = entry[:-1]

    return new_entry


def getChildNames(entry):
    res=[]
    for key in entry:
        if "child-name" in key:
            res.append(entry.get(key))
    return res

# Remove any (, ), ' ', or '-' from phone number form data
def standardize(num):
    return num.replace("(", "").replace(")","").replace("-","").replace(" ","")

    
@app.route("/", methods=["GET"])
def index():
    if request.method == "GET":
        return render_template("register.html", languages = languages)
    else:
        return redirect("/")

@app.route("/confirm-registration", methods=["GET", "POST"])
def confirmRegistration():
    if request.method=="POST":
        id = entries.insert_one(generateNewEntry(request.form))
        if(id):
            return render_template("confirmation.html", entry=getChildNames(entries.find_one(id.inserted_id)))
        else:
            return redirect("/")
    else:
        return redirect("/")

@app.route("/confirm-checkin", methods=["GET","POST"])
def confirmCheckin():
    if request.method == "POST":
        id = entries.insert_one(generateNewEntry(request.form))
        if(id):
            return render_template("confirmation.html", entry=getChildNames(entries.find_one(id.inserted_id)))
        else:
            return redirect("/")
    else:
        return redirect("/checkin")

@app.route("/checkin")
def checkin():
    return render_template("checkin.html")

@app.route("/check_existing", methods=["GET","POST"])
def check_existing():
    if request.method == "POST":
        currEntries = list(entries.find({"phone": standardize(request.form["phone"])}).sort("date", -1))
        if currEntries and len(currEntries) > 0:
            currEntry = currEntries[0]
            return render_template("review.html", entry=currEntry)
        else:
            return redirect("/")
    else:
        return redirect("/checkin")
                
@app.route("/login", methods=["GET"])
def login():
    if request.method == "GET":
        return render_template("login.html")
    
@app.route("/add-record", methods=['POST'])
def addRecord():
    # Check if the user is logged in. Return a 401 error if not
    if "email" not in session:
        return render_template("home.html", {'status': 401, 'message': 'Unauthorized. User is not authenticated.'})
    
    # Get the date from the form data
    selected_date = request.form.get("date")

    # Convert the date format
    try:
        formatted_date = datetime.strptime(selected_date, "%Y-%m-%d").strftime("%m/%d/%Y")
    except ValueError:
        # Handle the case where the date format is incorrect
        return jsonify({'status': 400, 'message': 'Invalid date format.'}), 400
    newEntry = generateNewEntry(request.form)
    newEntry["date"] = formatted_date
    id = entries.insert_one(newEntry)
    if(id):
        return render_template("home.html", data=generatePreviewData(numRecords=10))
    else:
        return jsonify({'status': 400, 'message': 'Error inserting new entry into database.'}), 400

@app.route("/delete-record", methods=["POST"])
def deleteRecord():
    # If user is not logged in, redirect to login screen
    if "email" not in session:
        return redirect("/login")
    else:
        string_ids = request.get_json()
        if len(string_ids) <= 0:
            return jsonify({'status': 400, 'message': 'Error deleting entry from database.'}), 400
        elif len(string_ids) == 1:
            entries.delete_one({"_id": ObjectId(request.get_json()[0])})
        else:
            object_ids = [ObjectId(str_id) for str_id in string_ids]
            entries.delete_many({"_id": { "$in": object_ids }})
        return jsonify({'status': 200, 'message': 'Record deleted successfully'}), 200

@app.route("/view-record", methods=["POST"])
def viewRecord():
    req = request.get_json()
    if len(req) != 1:
        return jsonify({'status': 400, 'message': 'Error fetching ID.'}), 400
    else:
        target_id = req[0]
        entry = entries.find_one({"_id": ObjectId(target_id)})
        if (entry):
            entry['_id'] = str(entry['_id'])
            return jsonify({'status': 200, 'record': entry, 'message': 'Record retrieved successfully'}), 200
        else:
            return jsonify({'status': 400, 'message': 'Error fetching requested ID.'}), 400


@app.route("/download", methods=['POST'])
def download():
    # Check if the user is logged in. Return a 401 error if not
    if "email" not in session:
        return jsonify({'status': 401, 'message': 'Unauthorized. User is not authenticated.'}), 401

    data = list(entries.find().sort("date", -1))

    # Check if any data is available
    if not data:
        return jsonify({'status': 404, 'message': 'No data available.'}), 404

    # Create a DataFrame from the MongoDB data
    result = pd.DataFrame(data)

    # Create a BytesIO object to store the Excel file
    excel_file = BytesIO()

    # Write the DataFrame to the BytesIO object as an Excel file
    result.to_excel(excel_file, index=False, engine='openpyxl')

    # Move the file cursor to the beginning of the BytesIO object
    excel_file.seek(0)

    # Return the Excel file as an attachment
    return send_file(
        excel_file,
        as_attachment=True,
        download_name="output.xlsx",
        mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
   
    
@app.route("/register", methods=["GET"])
def register():
    return render_template("registerUser.html")
                
@app.route("/home", methods=["GET", "POST"])
def home():
    if request.method == "GET":
        
        # If user is not logged in, redirect to login screen
        if "email" not in session:
            return redirect("/login")
        else:
            # User is logged in, fetch data from DB
            username = session["email"]

    # Check if login submission is valid
    if request.method == "POST":
        username = request.form.get("email").strip()
        password = request.form.get("password").strip()

        # If login attempt (user did not provide username or password) is invalid, return to login screen
        if not username or not password:
            return render_template("login.html", message="Invalid attempt. Please try again.")
        
        entry = users.find_one({"email": username})

        # If user is not registered, redirect to login screen
        if not entry:
            return render_template("login.html", message = "No account found. Please register for an account before logging in.")

        # User account found, check password and log session
        else:
            # If password is correct, log user in and return homepage
            # Else, return user to login page and display incorrect password 
            if bcrypt.checkpw(password.encode('utf-8'), entry['password']):
                session["email"] = entry["email"]
                return render_template("home.html", data=generatePreviewData(numRecords=10))
            else:
                return render_template("login.html", message="Incorrect password. Please try again.")
            
    # User is logged in and stored in session, render homepage
    return render_template("home.html", data=generatePreviewData(numRecords=10))

@app.route("/logout", methods=["GET"])
def logout():
    if "email" in session:
        session.pop("email", None)
        return render_template("login.html", message="Logged out successfully.")
    else:
        return render_template("login.html", message="No user currently signed in.")

@app.route("/update-record", methods=["POST"])
def updateRecord():
    # If user is not logged in, redirect to login screen
    if "email" not in session:
        return redirect("/login")
    else:
        req = dict(request.get_json())
        if((len(req) < 2) or ('_id' not in req.keys())):
            return jsonify({'status': 400, 'message': 'Bad request. Did you provide an ID?'}), 400
        else:
            filter = {"_id": ObjectId(req.pop("_id"))}
            values = {"$set": req}
            if(entries.update_one(filter, values)):
                return jsonify({'status': 200, 'message': 'Record updated successfully'}), 200
            else:
                return jsonify({'status': 500, 'message': 'Error updating database.'}), 500

if __name__ == "__main__":
    app.run()
