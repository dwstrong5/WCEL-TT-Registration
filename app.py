from flask import Flask, render_template, request, redirect, url_for, jsonify, session
from datetime import datetime
import pymongo, os, json, certifi, bcrypt
from pymongo.server_api import ServerApi

app = Flask(__name__)

# Language options for registration
languages = ["Latin", 
             "Spanish", 
             "Portugese", 
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
entries = db.get_collection('entries')
users = db.get_collection('users')
app = Flask(__name__)
app.secret_key = os.urandom(24)

def formatPhone(num):
    return"({}) {}-{}".format(num[0:3], num[3:6], num[6:])
    
def generateNewEntry(data):
    new_entry = dict()
    new_entry["date"] = datetime.today().strftime('%b-%d-%Y')
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
        currEntry = entries.find_one({"phone": standardize(request.form["phone"])})
        if currEntry:
            currEntry['phone'] = formatPhone(currEntry['phone'])
            return render_template("review.html", entry=currEntry)
        else:
            return redirect("/")
    else:
        return redirect("/checkin")
                
@app.route("/login", methods=["GET", "POST"])
def login():
    # If user navigates to /login, prompt them to login
    if request.method == "GET":
        return render_template("login.html")
    
    # User is being redirected to login after registering from an account
    else:
        username = request.form.get("email").strip()
        password = request.form.get("password").strip()
        confPassword = request.form.get("confirmPassword").strip()

        if not username or not password or not confPassword:
            return render_template("login.html", message="Invalid attempt. Please try again.")
        elif (password != confPassword):
            return render_template("login.html", message = "Passwords don't match. Please try again.")
        elif (users.find_one(username)):
            return render_template("login.html", message = "Account already exists. Please login.")
        else:
            hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
            users.insert_one({"email": username, "password": hashed})
            return render_template("login.html", message=f"User {username} created successfully. Please login.")
    
@app.route("/register", methods=["GET"])
def register():
    return render_template("registerUser.html")
                
@app.route("/home", methods=["GET", "POST"])
def home():
    if request.method == "GET":
        if "email" in session:
            return render_template("home.html", message={"user": session["email"]})
        return redirect("/login")
    
    if request.method == "POST":
        username = request.form.get("email").strip()
        password = request.form.get("password").strip()

        if not username or not password:
            return render_template("login.html", message="Invalid attempt. Please try again.")

        entry = users.find_one({"email": username})

        if not entry:
            return render_template("login.html", message = "No account found. Please register for an account before logging in.")

        else:
            # If password is correct, log user in and return homepage
            # Else, return user to login page and display incorrect password 
            if bcrypt.checkpw(password.encode('utf-8'), entry['password']):
                session["email"] = entry["email"]
                return render_template("home.html", message={"user": username})
            else:
                return render_template("login.html", message="Incorrect password. Please try again.")

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
