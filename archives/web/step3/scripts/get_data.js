//function to call an URL and push json result in a function
function getJsonData(urlGet, func){
    if (window.fetch) {

        console.log("Fetch is available");
    
        fetch(urlGet)
        .then(response => response.json())
        .then(response => func(response))
        .catch(error => alert("Erreur : " + error));
    
    } else {
        // Faire quelque chose avec XMLHttpRequest?
        console.log("Fetch is disabled")
    }
}

//example
//1. Create a "scripts" directory and create get_data.js inside.
//1.b Insert script in your page index.html by adding the script
//<body>
//    ....
//    <script src="scripts/get_data.js"></script> 
//</body>

//2. Create a function to use the future result and give one argument called "data"
function testGetData(data) {
    //disploy in console of your browser, you should see an object
    //This list in the exemple has only one property "departments" so you have to use this as an array
    console.log(data);
    console.log(data.departments);
    //loop to get each result in data
    for (var eachItem of data.departments) {
        console.log(eachItem);
    }

}

//3. Call the getJsonDataFunction (uncomment to test). The argument 2 is the name of your function for result "testGetData"
getJsonData("https://collectionapi.metmuseum.org/public/collection/v1/departments", testGetData);
