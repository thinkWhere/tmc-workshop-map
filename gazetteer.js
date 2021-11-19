
let zoomToFn;

// Initilaise the Gazetteer form
function initGazetteer(zoomTo) {
    zoomToFn = zoomTo

    const form = document.getElementById("gazetteer_search");
    form.addEventListener("submit", (evt) => submitGazetteerForm(evt));
    
    const selector = document.getElementById("gazetteer_result");
    selector.addEventListener("change", (evt) => selectGazetteerResult(evt));

    const form2 = document.getElementById("addressbase_search");
    form2.addEventListener("submit", (evt) => submitAddressBaseForm(evt));
    
    const selector2 = document.getElementById("addressbase_result");
    selector2.addEventListener("change", (evt) => selectAddressBaseResult(evt));
}

// Gazetteer Form

function submitGazetteerForm(evt)
{
  evt.preventDefault();
  searchGazetteer(evt.target[0].value);
}

function selectGazetteerResult(evt)
{
    zoomToFn(evt.target.value);
}

// AddressBase Form

function submitAddressBaseForm(evt)
{
  evt.preventDefault();
  searchAddressBase(evt.target[0].value);
}

function selectAddressBaseResult(evt)
{
    zoomToFn(evt.target.value);
}


function searchGazetteer(searchFor)
{
    callGazetteerApi(searchFor).then(data => {
        handleGazetteerResponses(data);
    });
}

const gazetteerAPI = "https://api.themapcloud.com/api/v2/gazetteer/search-all/";
const addressBaseAPI = "https://api.themapcloud.com/address/addressbase/postcode";
const token = import.meta.env.VITE_TMC_TOKEN;

async function callGazetteerApi(searchFor) {
    const url = gazetteerAPI + searchFor + "?token=" + token;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      }
    }).catch((/*error*/) => handleNetworkError());
    return response.json();
  }

function handleGazetteerResponses(data) {
    var dataList = document.getElementById("gazetteer_result");
    while (dataList.firstChild) { dataList.removeChild(dataList.firstChild);}
    var defaultOption = document.createElement('option');
    defaultOption.value = "";
    defaultOption.text = "select to zoom...";
    defaultOption.selected = true;
    dataList.appendChild(defaultOption);
    dataList.disabled = data.matches.length < 1;
    data.matches.forEach(match => {
        var option = document.createElement('option');
        option.value = match.geometry_x + "," + match.geometry_y;
        option.text = match.location;
        option.selected = false;
        dataList.appendChild(option);
    });
}

function handleNetworkError() {
   console.log("Network Error: Please check that you're connected to VPN");
  }

function searchAddressBase(searchFor) {
    callAddressBaseApi(searchFor).then(data => {
        handleAddressBaseResponses(data);
    });
  }

async function callAddressBaseApi(postcode) {
    const url = addressBaseAPI + "?token=" + token + "&pc=" + postcode + "&addrformat=1&format=json&datatype=dpa";
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      }
    }).catch((/*error*/) => handleNetworkError());
    return response.json();    
}

function handleAddressBaseResponses(data) {
    var dataList = document.getElementById("addressbase_result");
    while (dataList.firstChild) { dataList.removeChild(dataList.firstChild);}
    var defaultOption = document.createElement('option');
    defaultOption.value = "";
    defaultOption.text = "select to zoom...";
    defaultOption.selected = true;
    dataList.appendChild(defaultOption);
    dataList.disabled = data.results.length < 1;
    data.results.forEach(result => {
        var option = document.createElement('option');
        option.value = result.x_coord + "," + result.y_coord;
        option.text = result.address;
        option.selected = false;
        dataList.appendChild(option);
    });
}

export default initGazetteer
