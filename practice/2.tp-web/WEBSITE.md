# MuseumHub API

# Objectif

Créer un site web et une API pour interroger différents musées. 

Le premier musée pour construire la base du site est :

https://metmuseum.github.io/ 

Voici une représentation simplifiée des interactions entre les différents éléments de notre application. Toutes les requêtes vers l’API se feront comme cela :

Utilisateur utilise notre site web (http://127.0.0.1:5500)
Notre site web fait des requêtes vers notre API MuseumHub (http://127.0.0.1:5500)
Notre API MuseumHub fait des requêtes vers https://collectionapi.metmuseum.org/public/collection/v1 



NOTE : Cela signifie bien que notre Site Web ne connaît pas l’API Metropolitan Art Museum, ni Harvard Museum

Comme les requêtes sont des aller et retour avec des réponses au format JSON, voici la représentation des réponses en retour :

Le Musée https://collectionapi.metmuseum.org/public/collection/v1 répond à notre API avec un résultat en JSON ( {“cle”:”valeur”} )

Notre API MuseumHub reçoit la réponse, fait un traitement s’il le faut et répond à notre site web avec un résultat JSON 

Notre site web reçoit le résultat via javascript , effectue un traitement pour afficher le résultat de façon lisible pour un humain

# Séquence des requêtes à produire (2 requêtes)

## Séquence 1 : Charger sur le site la liste des départements

L’utilisateur va vers la page http://localhost:5500
Le navigateur charge la page qui contient un code javascript
le code javascript effectue une requête vers notre API Museum Hub http://localhost:5000/departement (@app.route("/departement"))
Le serveur API Python Flask reçoit la requête 
Le serveur API Python Flask effectue une reqûete vers l’API du musée https://collectionapi.metmuseum.org/public/collection/v1 et reçoit un résultat en JSON
Le serveur API Python Flask renvoie le résultat de la requête au format JSON
Le code javascript reçoit la requête et l’utilise pour créer des éléments HTML
Le code javascript créer des éléments HTML et les injectent dans la page

## Séquence 2 : Faire une recherche

L’utilisateur remplit le champ du formulaire “keyword”
L’utilisateur choisi ou non une catégorie dans la liste déroulante
L’utilisateur appuie sur le bouton “Rechercher”
Le code javascript capte cette action (document.addEventListener) et déclenche une fonction
La fonction javascript déclenchée effectue une requête vers notre API MuseumHub http://localhost:5000/search
Notre API Python reçoit la requête (@app.route("/search"))
Notre API Python interroge le musée Metropolitan Art Museum en 2 temps : 
Une première requête vers /search pour effectuer la recherche
Une série de requête pour récupérer le détail de chaque objet renvoyé par la recherche 
Notre API python retourne au site web le résultat obtenu dans 7.b au dessus
Le code javascript reçoit le résultat et boucle sur les différents objets reçus pour créer des éléments HTML
Le code javascript inject les résultats dans la page



Ready ? Page suivante, les TP. Ils ne sont pas obligatoires si vous êtes à l’aise techniquement. Ils sont là pour aider à comprendre la technique

# TP 

Le but du TP est de vous faire revoir toutes les étapes pour interroger une API et afficher son résultat.

## Avant de commencer

Vous pouvez récupérer une base de serveur d’API : https://drive.google.com/file/d/1sT6a69PdRG-3rpXYxm02ERSbYCy8woNV/view?usp=drive_link 
Pour le lancer, ou si vous n’avez pas Flask, il faut l’installer https://docs.google.com/document/d/1Ca1Wzh3J5JCYTq5hX_3rPOKC7LdMjUaW91yCZYLXitE/edit?usp=sharing 

## Etape 1 : créer la page Web

Faire une page HTML statique nommé index.html qui permet d’afficher une liste de départements (catégorie du musée). Exemple :

<html>
   <head>
       <title>Departement</title>
   </head>
   <body>
       <section>
           <h1>Départements</h1>
           <article>


               <ul id="category">
                   <li>Catégorie 1</li>
                   <li>Catégorie 2</li>
               </ul>


           </article>
       </section>
   </body>
</html>



NOTE : le <UL> permet d’afficher des listes (Unordoned List) dont chaque élément est un <LI>. La valeur de l’attribut “id” est très importante car cela permettra à JavaScript plus tard de manipuler la liste.

## Etape 2 : Ajouter un script JavaScript

Créer un fichier JavaScript index.js et ajouter la balise <script> à la page HTML index.html pour le prendre en compte. Exemple :

Le fichier index.js :

alert(“Mon premier script”)

Le script dans index.html : 

<html>
   <head>
       <title>Departement</title>
   </head>
   <body>
...
       <script src="index.js" ></script>
   </body>
</html>

NOTE : index.js se situe au même niveau que index.html dans le dossier projet. Si le script était dans un dossier nommé “js”, l’attribut src précisera le chemin “js/index.js”

## Etape 3 : Faire un appel vers un serveur (Une API)

C’est javascript qui va faire l’appel et qui va recevoir le résultat. Ceci est fait avec la fonction “fetch”.

Ajoutez au script index.js la fonction fetch pour appeler votre API. Exemple :



   //Afficher un message dans la console d'un navigateur
   console.log("Fetch existe dans le navigateur, trop cool");


   fetch("http://localhost:5000/departement")
   .then(
       response => response.json()
   ).then(
       response => maFonction(response)
   )
   .catch(
       error => alert("Erreur : " + error)
   );

Sauvegarder et relancer votre page index.html. Ce code affiche une erreur car il manque quelque chose : 

Erreur : TypeError: NetworkError when attempting to fetch resource.

Cette première erreur intervient si le serveur python n’est pas démarré. pour démarrer le serveur python, ouvrez un terminal et se positionner au niveau du script python, puis lancer flask.

Si vous rechargez la page, l’erreur va changer : 

Erreur : ReferenceError: maFonction is not defined

Ce code semble barbare, et il l’est ;). Quelques informations pour s’y retrouver : 
Fetch appelle une ressource Web. 

Fetch prend un argument qui est le lien du serveur à contacter. Ici c’est notre API “http://localhost:5000/departement”.

Dans le premier “then”, il reçoit un résultat brut dans “response” au format texte qu’il faut transformer en un JSON. Ce qui est fait ici avec la fonction .json(). La syntaxe => n’est qu’un raccourci de “function maFonction(response)” pour ne pas écrire trop de ligne alors que la fonction est très simple

Dans le deuxième “then”, on donne une fonction “maFonction()” à nous qui va traiter le résultat. Cette fonction n’existe pas, il va falloir la créer. Pour que la fonction que l’on va faire puisse avoir les résultats de la requête, on lui donne en argument “maFonction(response)”

NOTE : vous pouvez aller dans la console du navigateur pour voir les erreurs

## Etape 4 : Afficher la réponse que JavaScript récupère

Il faut donc ajouter une fonction qui va permettre de manipuler le résultat que JavaScript a récupéré. Comme nous avons définis la fonction “maFonction”, il faut créer une fonction qui porte ce nom :

Ajouter au fichier index.js à la fin : 

function maFonction(response){
   alert ("La réponse est "+response)
}

Le message indique que la réponse est un “Object”. On peut afficher son contenu en disant à JavaScript que c’est un JSON : 

function maFonction(response){
   console.log(JSON.stringify(response));
}

On peut aussi le parcourir avec JavaScript grâce à la fonction “for”. Exemple :

function maFonction(response){
   for (const unElement in response) {
       console.log(`${unElement}: ${JSON.stringify(response[unElement])}`);
     }
}

NOTE : on ne voit toujours pas la donnée telle qu’un utilisateur doit la voir. On voudrait afficher  “fake departement” au lieu de {"title":"fake departement"}. Pour cela, on va rajouter le nom de la clé JSON que l’on veut afficher, ici “title”. . exemple : 

## Etape 5 : afficher dans la page HTML Le résultat
Maintenant il faut faire afficher ces résultats dans une liste à l’utilisateur. Pour cela il faut appeler en JavaScript l’élément HTML et le remplir. Cela se fait avec “querySelector” en appelant l’id à manipuler, ici id="category", exemple : 


function maFonction(response){


   ulElement = document.querySelector("#category");
…

document.querySelector prend un argument qui est l’identifiant d’un élément dans le code HTML. il faut ajouter le caractère “#” pour que javascript comprenne que vous donner un ID. un “.” à la place aurait signifier que vous cherchez un élément HTML de l’attribut class=””

Maintenant, à chaque boucle for, il faut créer un élément HTML avec JavaScript, lui attribuer la valeur JSON et l’ajouter à cette liste “ulElement”. Exemple :

function maFonction(response){


   //cherche et récupère l'élément UL qui a l'id "category"
   ulElement = document.querySelector("#category");
  


   //on boucle parcourt les résultats JSON qui sont dans une liste []
   /** Le format de réponse est une liste avec 0 ou plusieurs objets
    *
    * [
    *      {"title", "objet 1"},
    *      {"title", "objet 2"}
    * ]
    */
   for (const unElement in response) {


       //A chaque boucle, "unElement vaut un objet en cours"


       //On Met la valeur JSON de l'élément en cours dans "value"
       let value = response[unElement].title;
      
       //On créer un élément de type LI (<LI></LI>)
       let li = document.createElement("li");
      
       //Donne à li la valeur "value" qui contient la valeur JSON
       li.textContent = value;
      
       //Ajoute li à la liste UL. IL s'ajoute à la fin
       ulElement.appendChild(li);


     }
}

## Etape 6 : Ajouter un élément à JSON dans le serveur pour le voir apparaître

L’idée est de se rendre compte de l’effet “liste”. POur cela on va ajouter un élément au JSON qui est renvoyé par le serveur. Dans le fichier myMuseum.py, on peut modifier la réponse comme ceci : 

@app.route("/departement")
def getDepartement():
   response = [
       {"title":"fake departement"},
       {"title":"fake Egypte"}
   ]
   return response

Relancez le serveur Python et recharger le site web, la liste se complète.

## Etape 7 : Transformer cette liste en formulaire

Maintenant que l’on a fait une liste standard (en utilisant <LI>), on peut remplacer par un formulaire qui contient une liste déroulante. Pour cela, on va utiliser les balises <select> et <option>

               <form>
                   <select id="category">
                       <option value="1">Option 1</option>
                       <option value="2">Option 2</option>
                   </select>
               </form>


Il faut également modifier le code JavaScript pour créer des éléments <option> au lieu de <LI> sinon HTML ne comprendra pas. Exemple : 

let htmlElement = document.createElement("option");

NOTE : seul “option” dans createElement change. Cependant, pour maintenir une compréhension à la lecture du code, on va changer le nom des variables. Attention à ne pas oublier de changer partout. Exemple avec la fonction réécrite : 

function maFonction(response){


   //cherche et récupère l'élément UL qui a l'id "category"
   selectElement = document.querySelector("#category");
  


   //on boucle parcourt les résultats JSON qui sont dans une liste []
   /** Le format de réponse est une liste avec 0 ou plusieurs objets
    *
    * [
    *      {"title", "objet 1"},
    *      {"title", "objet 2"}
    * ]
    */
   for (const unElement in response) {


       //A chaque boucle, "unElement vaut un objet en cours"


       //On Met la valeur JSON de l'élément en cours dans "value"
       let value = response[unElement].title;
      
       //On créer un élément de type LI (<LI></LI>)
       let optionEl = document.createElement("option");
      
       //Donne à li la valeur "value" qui contient la valeur JSON
       optionEl.textContent = value;
      
       //Ajoute li à la liste UL. IL s'ajoute à la fin
       selectElement.appendChild(optionEl);


     }
}

## Etape 8 : Aller chercher des vraies données

Maintenant que notre liste déroulante affiche les valeurs provenant de notre API, il est temps que notre API renvoie de vraies données, c’est-à-dire des données provenant d’autres API, celle du musée.

Pour cela, dans le code Python, on va faire une requête vers le museum, récupérer le résultat et le transmettre au site web. Voici une fonction qui effectue une requête GET vers le musée pour aller récupérer les départements : 


@app.route("/departement")
def getDepartement():
   #appeler l'url des département sur API Art museum
   res=requests.get('https://collectionapi.metmuseum.org/public/collection/v1/departments')
   print(res.status_code)
   return res.content


NOTE : requests permet de faire des requêtes. GET correspond au type de requête à faire, cela dépend de la documentation que l’API que vous appelez vous donne (GET, POST, PUT….)

Quand le résultat arrive, “res” contient un tas d’informations. 2 sont très importantes : 
res.status_code : le code HTTP qui correspond au resultat (200 si tout va bien )
res.content : le contenu du résulat, donc le JSON



TIPS 1 : il peut être pratique d’afficher ce que l’on reçoit. Ici on le fait avec print(res.status_code)


TODO: JavaSCript

La fonction JavaSCript va évoluer pour récupérer les bons attributs dans JSON. Exemple : 


function maFonction(response){


   //cherche et récupère l'élément UL qui a l'id "category"
   selectElement = document.querySelector("#category");
  
   departementList = response.departments


   //on boucle parcourt les résultats JSON qui sont dans une liste []
   /** Le format de réponse est une liste avec 0 ou plusieurs objets
    *
    * [
    *      {"title", "objet 1"},
    *      {"title", "objet 2"}
    * ]
    */
   for (const unElement in departementList) {


       //A chaque boucle, "unElement vaut un objet en cours"


       //On Met la valeur JSON de l'élément en cours dans "value"
       //{
           //"departmentId":1,
           //"displayName":"American Decorative Arts"
      // }
       let value = departementList[unElement].displayName;
       let valueId = departementList[unElement].departmentId;


       //On créer un élément de type LI (<LI></LI>)
       let optionEl = document.createElement("option");
      
       //Donne à li la valeur "value" qui contient la valeur JSON
       optionEl.textContent = value;
       optionEl.value = valueId;
       //Ajoute li à la liste UL. IL s'ajoute à la fin
       selectElement.appendChild(optionEl);


     }
}


TIPS 2 : Pour savoir à quoi ressemble l’object de retour, vous pouvez utiliser : 

console.log(JSON.stringify(response.departments))






Bonus

Intégrer un autre musée, exemple : https://harvardartmuseums.org/collections/api
Intégrer un compteur de page : https://letscountapi.com/ 
