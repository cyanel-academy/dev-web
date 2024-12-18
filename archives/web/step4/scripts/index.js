const apiUrl = "https://collectionapi.metmuseum.org/public/collection/v1"
var dataSearch = [];
var offset = 0;
var limit = offset + 100;

//INIT
getJsonData("https://collectionapi.metmuseum.org/public/collection/v1/departments", fillOptionDepartment);

function fillOptionDepartment(data) {
    //This get the list of your HTML template
    const select = document.querySelector('#departmentId');

    console.log("Load Departments list"+ data);

    //This loop on the json result
    for (const item of data.departments) {
        //this line create option HTML Object with one value of json list
        newOption = new Option(item.displayName, item.departmentId);
        //This line add the HTML option to the HTML list
        select.add(newOption,undefined);
    }
}


//Handle result to push in the HTML table
//offset is to limit result. Offset could be change by the user disploy next results
//That why the data and offset are global, to allow to keep data and display only result from offset to limit
async function displayResult() {

    //Destroy the table
    resultTable.innerHTML = "";

    if (dataSearch.total > 0){
        document.querySelector("#result").hidden = false;

        itemViewed = offset;

        for (var searchItemId of dataSearch.objectIDs){
            var objectUrl = apiUrl + "/objects/"+searchItemId;

            if (itemViewed >= limit){
                alert("Only 100 result disployed");
                return;
            }

            itemViewed++;

            fetch(objectUrl)
            .then(response => response.json())
            .then(async function(response){

                var objectName = response.title;
                var objectLink = '<a href="'+objectUrl+'">'+objectName+'</a>';

                var row = resultTable.insertRow(-1);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                cell1.innerHTML = objectLink;
                cell2.innerHTML = response.country;
                cell3.innerHTML = response.department;
            });

        }
    }

}

function initDetail(element, objectID){
    var objectUrl = apiUrl + "/objects/"+objectID;
    getJsonData(objectUrl, displayDetail);
}


//Form action
async function performSearch() {

    var searchUrl = apiUrl;

    searchUrl += "/search";

    //get keyword
    const keyword = document.querySelector("#q").value;
    
    if (keyword.length == 0){
        alert("Type a keyword");
        return;
    }

    searchUrl += "?q="+keyword;

    //get departement id
    const depId = document.querySelector("#departmentId").selectedOptions[0].value;

    if (depId != "All") {
        searchUrl += "&departmentId="+depId;
    }

    //get checkbox
    const isOnViewEl =  document.querySelector("#isOnView");

    if (isOnViewEl.checked){
        searchUrl += "&isOnView=true";
    }

    console.log("API URL is: "+searchUrl);

    if (window.fetch) {
        // exécuter ma requête fetch ici
        console.log("Fetch is available");
    
        fetch(searchUrl)
        .then(response => response.json())
        .then(async function(response){
            dataSearch = response;
            console.log("response is:"+dataSearch);
            
            document.querySelector("#nbResult").innerHTML = dataSearch.total;

            await displayResult();
        })
        .catch(error => alert("Erreur : " + error));
    
    } else {
        // Faire quelque chose avec XMLHttpRequest?
        console.log("Fetch is disabled")
    }
}

const formButton = document.querySelector("#search_action");
formButton.addEventListener("click", performSearch);