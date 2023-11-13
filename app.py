from flask import Flask, render_template, request, redirect, url_for, jsonify, session
from datetime import datetime
import pymongo, os, json, certifi, bcrypt
from pymongo.server_api import ServerApi
import pandas as pd 

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

# Establish connection with database
with open('config.txt') as f:
    credentials = json.load(f)

uri = "mongodb+srv://" + credentials["username"] + ":" + credentials["password"] + "@wcel-cluster.wtcxphf.mongodb.net/?retryWrites=true&w=majority"
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

def formatPhone(num):
    return"({}) {}-{}".format(num[0:3], num[3:6], num[6:])
    
def generateNewEntry(data):
    new_entry = dict()
    new_entry["date"] = datetime.today().strftime('%m/%d/%Y')
    for item in list(data.lists()):
        curr_item = list(item)
        if curr_item[0] == 'phone' and curr_item[1]:
            curr_item[1][0] = standardize(curr_item[1][0])
        entry = ""
        for sub_item in curr_item[1]:
            if(sub_item != ''):
                entry = entry + str(sub_item) + ";"
            new_entry[curr_item[0]] = entry[:-1]
    print(new_entry)
    return new_entry
    
def getChildNames(entry):
    res=[]
    for key in entry:
        if "child-name" in key:
            res.append(entry.get(key))
    return res

def standardize(num):
    return num.replace("(", "").replace(")","").replace("-","").replace(" ","")

def getPreviewData():
    cursor = list(entries.find({}).sort("date", 1).limit(15))
    data = []
    # Pick out only the data we want to preview
    for item in cursor:
        contents = {
            "Date": item["date"],
            "Guardian Name": item["parent-name"],
            "Child 1": item["child-name-1"]
        }
        if "child-name-2" in item:
            contents["Child 2"] = item["child-name-2"]
        else: 
            contents["Child 2"] = ""
        if "child-name-3" in item:
            contents["Child 3"] = item["child-name-3"]
        else:
            contents["Child 3"] = ""
        data.append(contents)
         
    return pd.DataFrame(data)    
    
    
    
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
            data = getPreviewData()

    
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
                print(entry["email"])
                session["email"] = entry["email"]
                data = getPreviewData()
                return render_template("home.html", data=data)
            else:
                return render_template("login.html", message="Incorrect password. Please try again.")
            
    # User is logged in and stored in session, render homepage
    return render_template("home.html", data=data)

@app.route("/reports", methods=["GET"])
def reports():
    if "email" in session:
        return render_template("reports.html")
    return redirect("/login")

@app.route("/logout", methods=["GET"])
def logout():
    if "email" in session:
        session.pop("email", None)
        return render_template("login.html", message="Logged out successfully.")

if __name__ == "__main__":
    app.run()
