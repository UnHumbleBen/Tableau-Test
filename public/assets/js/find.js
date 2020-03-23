// Uses global variable mapProvinceToCoord from find.ejs

// HTML string containing all the locations as a list of options.
var locationOptionsHTML;
// Counter variable for number of destinations.
var numberOfDestinations;

const EARLIEST_DATE = '2019-12-31';


/**
 * Initializes `locationOptionsHTML`, a HTML string containing all of the location
 * as list of option HTML element to be inserted in each newly created select element
 * (destination 2+). Destination 1 is always on the screen.
 */
function getLocationOptions() {
  return Object.keys(mapProvinceToCoord).map(function (key) {
    console.log('running this...');
    return `
    <option value='${JSON.stringify(mapProvinceToCoord[key])}'>
      ${key}
    </option> 
    `
  }).join('\n');
}

/**
 * Returns a HTML string containing the new select element for destination @destNum.
 * @param {number} destNum The destination number of the new select element
 */
function newDestinationSelect(destNum) {
  return `
      <div class="destination-form-group" id="dest${destNum}">
        <h4>Destination ${destNum}:</h4>

        <select name="dest[${destNum}][position]" id="dest${destNum}-select">
            <option value="">--Please choose an option--</option>
            ${locationOptionsHTML}
        </select>

        <label for="start">Date arriving:</label>
        <input type="date" id="dest${destNum}-date" name="dest[${destNum}][date]" min="${EARLIEST_DATE}" value="">
      </div>
  `
}

/**
 * Event handler for add destination button. 
 */
function addDestination() {
  const destinationDiv = document.getElementById(`dest${numberOfDestinations}`);

  // For saving value when elements are redrawn.
  const selectedIndex = document.getElementById(`dest${numberOfDestinations}-select`).selectedIndex;
  const selectedDate = document.getElementById(`dest${numberOfDestinations}-date`).value;

  numberOfDestinations += 1;
  destinationDiv.outerHTML += newDestinationSelect(numberOfDestinations);

  document.getElementById(`dest${numberOfDestinations - 1}-select`).selectedIndex = selectedIndex;
  document.getElementById(`dest${numberOfDestinations - 1}-date`).value = selectedDate;
}

/**
 * Event handler for remove destination button. 
 */
function removeDestination() {
  if (numberOfDestinations == 1) {
    alert('Must have at least one destinations.');
  } else {
    document.getElementById(`dest${numberOfDestinations}`).remove();
    numberOfDestinations -= 1;
  }
}

function main() {
  locationOptionsHTML = getLocationOptions();
  numberOfDestinations = 1;
  // destinationSelect = document.getElementById('destination-select');

  // Subscribe listeners
  const addDestinationButton = document.getElementById('add-destination-button');
  const removeDestinationButton = document.getElementById('remove-destination-button');
  addDestinationButton.onclick = (_) => addDestination();
  removeDestinationButton.onclick = (_) => removeDestination();
}

main();
