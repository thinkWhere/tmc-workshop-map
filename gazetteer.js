// Gazetteer/AddressBase Form Code

let zoomToFn;

// Initilaise the Gazetteer form
function initGazetteer(zoomTo) {
  // Store the zoom function pointer here for use when a result is clicked
  zoomToFn = zoomTo

  // Add a listener to the Gazetteer search form
  const form = document.getElementById("gazetteer_search");
  form.addEventListener("submit", (evt) => submitGazetteerForm(evt));
    
  // Add a listener to the Gazetteer results list
  const selector = document.getElementById("gazetteer_result");
  selector.addEventListener("change", (evt) => selectGazetteerResult(evt));

  // Add a listener to the AddressBase search form
  const form2 = document.getElementById("addressbase_search");
  form2.addEventListener("submit", (evt) => submitAddressBaseForm(evt));
    
  // Add a listener to the AddressBase results list
  const selector2 = document.getElementById("addressbase_result");
  selector2.addEventListener("change", (evt) => selectAddressBaseResult(evt));
}

// Call the Gazetteer API when a search is requested
function submitGazetteerForm(evt)
{
  // Stop the form refreshing the page
  evt.preventDefault();

  // Call the Gazetteer API
  callGazetteerApi(evt.target[0].value).then(data => {
    // Handle the response
    handleGazetteerResponses(data);
  });
}

// Called when a Gazetteer result is selected
function selectGazetteerResult(evt)
{
  // Zoom the map to the selected result
  zoomToFn(evt.target.value);
}

// Call the AddressBase API when a search is requested
function submitAddressBaseForm(evt)
{
  // Stop the form refreshing the page
  evt.preventDefault();
  // Call the AddressBase API
  callAddressBaseApi(evt.target[0].value).then(data => {
    // Handle the response
    handleAddressBaseResponses(data);
  });
}

// Called when an AddressBase result is selected
function selectAddressBaseResult(evt)
{
  // Zoom the map to the selected result
  zoomToFn(evt.target.value);
}

// API Code

// Gazetteer API URL
// Sample request: https://api.themapcloud.com/api/v2/gazetteer/search-all/<search-term>?token=<token>
const gazetteerAPI = "https://api.themapcloud.com/api/v2/gazetteer/search-all/";

// AddressBase Postcode API URL
/* Sample request:
  https://api.themapcloud.com/address/addressbase/postcode?
  token=<token>&
  pc=<postcode>&
  addrformat=1& (1,2,3 = one line address, multi-line address, individual fields)
  format=json& (json or xml)
  datatype=dpa (dpa or lpi = post office vs local govt gazetteer)
*/
const addressBaseAPI = "https://api.themapcloud.com/address/addressbase/postcode";

// Read the token from the .env parameters
const token = import.meta.env.VITE_TMC_TOKEN;

// Asyncronous call to the Gazetteer API
async function callGazetteerApi(searchFor) {
  // construct the url
  const url = gazetteerAPI + searchFor + "?token=" + token;
  // make the call and await the response
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Accept": "application/json",
    }
  });
  // On success, convert the result to json
  return response.json();
}

// Handle the Gazetteer responses
function handleGazetteerResponses(data) {
  // Get the select options list
  var dataList = document.getElementById("gazetteer_result");
  // Empty previous results
  while (dataList.firstChild) { dataList.removeChild(dataList.firstChild);}
  // Create and add a default option 
  var defaultOption = document.createElement('option');
  defaultOption.value = "";
  defaultOption.text = "select to zoom...";
  defaultOption.selected = true;
  dataList.appendChild(defaultOption);

  // Disable the select if there were no results
  dataList.disabled = data.matches.length < 1;

  // Add the results to the select options
  data.matches.forEach(match => {
    // Create an option
    var option = document.createElement('option');
    // Set the value to the x,y coordinate string
    option.value = match.geometry_x + "," + match.geometry_y;
    // Set the text to the location text
    option.text = match.location;
    // Don't select this option yet
    option.selected = false;
    // Add to the list
    dataList.appendChild(option);
  });
}

// Asyncronous call to the AddressBase API
async function callAddressBaseApi(postcode) {
  // construct the url
  const url = addressBaseAPI + "?token=" + token + "&pc=" + postcode + "&addrformat=1&format=json&datatype=dpa";
  // make the call and await the response
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Accept": "application/json",
    }
  });
  // On success, convert the result to json
  return response.json();    
}

// Handle the AddressBase responses
function handleAddressBaseResponses(data) {
  // Get the select options list
  var dataList = document.getElementById("addressbase_result");

  // Empty previous results
  while (dataList.firstChild) { dataList.removeChild(dataList.firstChild);}

  // Create and add a default option 
  var defaultOption = document.createElement('option');
  defaultOption.value = "";
  defaultOption.text = "select to zoom...";
  defaultOption.selected = true;
  dataList.appendChild(defaultOption);

  // Disable the select if there were no results
  dataList.disabled = data.results.length < 1;

  // Add the results to the select options
  data.results.forEach(result => {
    // Create an option
    var option = document.createElement('option');
    // Set the value to the x,y coordinate string
    option.value = result.x_coord + "," + result.y_coord;
    // Set the text to the address text
    option.text = result.address;
    // Don't select this option yet
    option.selected = false;
    // Add to the list
    dataList.appendChild(option);
  });
}

// Export the init function for the main script to pick up
export default initGazetteer
