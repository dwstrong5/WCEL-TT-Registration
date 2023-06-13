from flask import Flask, render_template, request
from datetime import datetime
import pymongo, os
from werkzeug.datastructures import ImmutableMultiDict

app = Flask(__name__)

# Establish connection with database
client = pymongo.MongoClient(open("config.txt").read())
db = client['toddler-time-registration']
entries = db.get_collection('entries')

app = Flask(__name__)
app.secret_key = os.urandom(24)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/confirm", methods=["POST"])
def confirm():
    data = request.form
    new_entry = dict()
    new_entry["date"] = datetime.today().strftime('%b-%d-%Y')
    for item in list(data.lists()):
        entry = ""
        for sub_item in item[1]:
            if(sub_item != ''):
                entry = entry + str(sub_item) + ";"
            new_entry[item[0]] = entry[:-1]
    id = entries.insert_one(new_entry)
    print(new_entry)

    #return render_template("confirmation.html", entry=entries.find_one(id.inserted_id))
    return render_template("confirmation.html")



