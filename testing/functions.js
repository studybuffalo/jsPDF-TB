/**
 * @file Functions to test out the jspdf-tb files
 * @author Joshua Torrance <studybuffalo@gmail.com>
 * @copyright Joshua Torrance 2017
 * @license LGPL-3.0
 */

/** Takes the provided string and measures it */
function measureString() {
	// Get string to measure
	var input = document.getElementById("stringWidthInput").innerText;

	// Measure string
	var pdf = new jsPDF();
	var width = pdf.getStringWidth(input);

	// Return result to HTML span
	document.getElementById("stringWidthResult").innerText = "String Width: " + width + " pt";
}

// Add the event listeners
document.getElementById("measureString")
		.addEventListener("click", measureString);