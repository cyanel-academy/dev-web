import requests
import museums
import config
import json

from flask      import Flask, request, jsonify, render_template, abort
from flask_cors import CORS
from markupsafe import escape

app = Flask(__name__)
CORS(app)

app.logger.setLevel("INFO")

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/departement")
def getDepartement():
    response = [
        {"title":"fake departement"},
        {"title":"fake Egypt"},
    ]
    return response

@app.route("/search-raw")
def searchRaw():
    args = request.args
    defaultMuseumId = museums.defaultMuseumId()
    criteria = args.get("q", "")
    museumId = args.get("museum_id", defaultMuseumId)

    if (criteria == ""):
        abort(400)

    #validation de donnees
    museumUrl = museums.museumUrlOf(int(museumId))
    res = requests.get(museumUrl+'search?q='+criteria).content

    return res


@app.route("/search")
def search():
    args = request.args
    defaultMuseumId = museums.defaultMuseumId()
    defaultListSize = config.defaultListSize()

    criteria = args.get("q", "")
    museumId = args.get("museum_id", defaultMuseumId)
    listSize = args.get("list_size", defaultListSize)

    if (criteria == ""):
        abort(400)

    #validation de donnees
    museumUrl = museums.museumUrlOf(int(museumId))
    allMuseumId = requests.get(museumUrl+'search?q='+criteria).text

    res = getAllFor(json.loads(allMuseumId)["objectIDs"], museumId, 5300)
    return res

def getAllFor(objectList, museumId, listSize):
    museumUrl = museums.museumUrlOf(int(museumId))
    objects=[]

    app.logger.info("Limit"+str(listSize))

    limit = 0
    for i in objectList :
        if (limit == listSize):
            break
        anObject = requests.get(museumUrl+'objects/'+str(i)).text
        app.logger.info(anObject)
        objects.append(anObject)
        limit += 1
        
    return objects
    
#errors
@app.errorhandler(400)
def page_not_found(error):
    return render_template('error.html', message="bad request", code=400), 400


