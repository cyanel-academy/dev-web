const apiUrl = "https://collectionapi.metmuseum.org/public/collection/v1"
var dataSearch = [];

//INIT the department list
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
}

//on clic on button and run function above
const formButton = document.querySelector("#search_action");
formButton.addEventListener("click", performSearch);