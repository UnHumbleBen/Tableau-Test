// Uses global variable mapProvinceToCoord from find.ejs

// HTML string containing all the locations as a list of options.
var locationOptionsHTML;
// Counter variable for number of destinations.
var numberOfDestinations;

// HTML Elements.
var destinationSelect;  // used to update final destination's location in array
var destinationLabel;  // used to append the newly added destination
var addDestinationButton;
var removeDestinationButton;

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
    <label id="dest${destNum}-label" for="dest${destNum}">Destination ${destNum}:</label>
    <select name="dest[${destNum}]" id="dest${destNum}">
      <option value="">--Please choose an option--</option>
      ${locationOptionsHTML}
    </select>
  `
}

/**
 * Event handler for add destination button. 
 */
function addDestination() {
  destinationLabel.outerHTML = `${newDestinationSelect(numberOfDestinations)}\n${destinationLabel.outerHTML}`;
  destinationLabel = document.getElementById('destination-label');

  numberOfDestinations += 1;
  destinationSelect.name = `dest[${numberOfDestinations}]`;
}

/**
 * Event handler for remove destination button. 
 */
function removeDestination() {
  if (numberOfDestinations == 2) {
    alert('Must have at least two destinations.');
  } else {
    const deleteNode = document.getElementById(`dest${numberOfDestinations - 1}`).remove();
    numberOfDestinations -= 1;
    document.getElementById(`dest${numberOfDestinations}-label`).remove();
  }
}

function main() {
  locationOptionsHTML = getLocationOptions();
  numberOfDestinations = 2;
  destinationSelect = document.getElementById('destination-select');
  destinationLabel = document.getElementById('destination-label');
  addDestinationButton = document.getElementById('add-destination-button');
  removeDestinationButton = document.getElementById('remove-destination-button');
  addDestinationButton.onclick = (_) => addDestination();
  removeDestinationButton.onclick = (_) => removeDestination();
}

main();
