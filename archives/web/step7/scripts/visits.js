
displayStats();

function displayStats(){
    getJsonData("https://api.countapi.xyz/info/cpo/visits", showVisits);
    getJsonData("https://api.countapi.xyz/info/cpo/search", showSearch);
    getJsonData("https://api.countapi.xyz/info/cpo/detail", showDetail);   
}

function showVisits(data){
    disployStat("hit_visit", data.value);
}

function showSearch(data){
    disployStat("hit_search", data.value);
}

function showDetail(data){
    disployStat("hit_detail", data.value);
}

function disployStat(elId, value){
    var id = "#"+elId;
    document.querySelector(id).innerHTML = value;
}