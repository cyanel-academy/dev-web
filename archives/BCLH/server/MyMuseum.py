from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
import requests
import json

app = Flask(__name__)
CORS(app)

@app.route("/")
def index():
    return "true"

@app.route("/department")
def get_departments():
    url = "https://collectionapi.metmuseum.org/public/collection/v1/departments"
    try:
        response = requests.get(url)
        response.raise_for_status()  # Lève une exception si la réponse est une erreur
        return jsonify(response.json())  # Renvoie les départements sous forme JSON
    except requests.RequestException as e:
        app.logger.error(f"Erreur API Metropolitain Museum : {e}")
        return jsonify({"error": "Impossible de récupérer les départements"}), 500

@app.route("/search")
def search_objects():
    category = request.args.get("category")
    keywords = request.args.get("keywords", "")
    offset = request.args.get("offset", 0)

    if not category:
        return jsonify({"error": "Catégorie manquante"}), 400

    # URL de recherche avec les mots-clés et la catégorie
    url = f"https://collectionapi.metmuseum.org/public/collection/v1/search?departmentIds={category}&q={keywords}"
    print(url)

    try:
        response = requests.get(url)
        response.raise_for_status()
        
        # Extraction des objectIDs de la réponse JSON
        data = response.json()
        object_ids = data.get('objectIDs', [])
        
        # Limitation des résultats à 10 objets
        limit = 10
        objects = object_ids[:limit]
        objects = object_ids[0..10]

        return jsonify(objects)  # Retourne les 10 premiers objets
    except requests.RequestException as e:
        app.logger.error(f"Erreur API Metropolitan Museum : {e}")
        app.logger.error(f"Réponse reçue : {response.text if response else 'Pas de réponse'}")
        return jsonify({"error": "Impossible de récupérer les objets"}), 500

@app.route("/object/<object_id>")
def get_object(object_id):
    # Récupérer les détails d'un objet par son ID
    url = f"https://collectionapi.metmuseum.org/public/collection/v1/objects/{object_id}"
    try:
        response = requests.get(url)
        response.raise_for_status()
        # Renvoie les détails de l'objet sous forme JSON
        return jsonify(response.json())
    except requests.RequestException as e:
        app.logger.error(f"Erreur lors de la récupération de l'objet {object_id} : {e}")
        return jsonify({"error": "Impossible de récupérer l'objet"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
