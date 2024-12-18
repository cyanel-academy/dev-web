const apiUrl = "https://collectionapi.metmuseum.org/public/collection/v1"

//------INIT

//global result
var dataSearch = [];

//begin of th limit of result
var offset = 0;

//end of the limit of result
var limit = offset + 100;

//load department in 
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

//hit visit each time it's load
getJsonData("https://api.countapi.xyz/hit/cpo/visits", hitVisit);

//------



//prepare event on the button "search"
const formButton = document.querySelector("#search_action");
formButton.addEventListener("click", performSearch);

//Action when click on button search
async function performSearch() {

    //Step 1: get user choice and create the search URL with it
    var searchUrl = apiUrl;

    // += complete a variable 
    searchUrl += "/search";

    //get keyword field
    const keyword = document.querySelector("#q").value;
    
    //if keyword is empty, we stop
    if (keyword.length == 0){
        alert("Type a keyword");
        return;
    }

    searchUrl += "?q="+keyword+"&hasImages=true";

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

        //load result
        getJsonData(searchUrl, displayResult);
    
        //search was done, count it
        getJsonData("https://api.countapi.xyz/hit/cpo/search", hitSearch);

    } else {
        // Faire quelque chose avec XMLHttpRequest?
        console.log("Fetch is disabled")
    }
}


//Handle result to push in the HTML table
//offset is to limit result. Offset could be change by the user disploy next results
//That why the data and offset are global, to allow to keep data and display only result from offset to limit
function displayResult(data) {
    
    //disploy the total
    document.querySelector("#nbResult").innerHTML = data.total;

    //make available outside the function
    dataSearch = data;

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
            
            getJsonData(objectUrl, insertRow);
        }
    }

}

function insertRow(data){

    var objectName = data.title;
    var objectLink = '<a href="#" onClick="initDetail(this, '+data.objectID+')">'+objectName+'</a>';

    var row = resultTable.insertRow(-1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    cell1.innerHTML = objectLink;
    cell2.innerHTML = data.country;
    cell3.innerHTML = data.department;
}

function initDetail(element, objectID){
    var objectUrl = apiUrl + "/objects/"+objectID;
    getJsonData(objectUrl, displayDetail);
}


function displayDetail(data){
//    alert(data.title);
    object_title.innerHTML = data.title
    object_link.innerHTML = data.objectURL;
    object_link.href = data.objectURL;
    object_description.innerHTML = data.objectName + " " + data.dimensions + " " + data.creditLine;
    object_img.src = data.primaryImage;

    document.querySelector("#details").hidden = false;

    getJsonData("https://api.countapi.xyz/hit/cpo/detail", hitDetail);
}

//hit functions
function hitSearch(data){
    console.log("Search count: " + data.value);
}

function hitDetail(data){
    console.log("Search count: " + data.value);
}

function hitVisit(data){
    var nbVisitEl = document.querySelector("#nb_visit");
    nbVisitEl.innerHTML = data.value;
}