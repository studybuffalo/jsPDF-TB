/**
 * @file Functions to test out the jspdf-tb files
 * @author Joshua Torrance <studybuffalo@gmail.com>
 * @copyright Joshua Torrance 2017
 * @license LGPL-3.0
 */

/** Takes the provided string and measures it */
function measureString() {
	// Get required details for string measurement
	var input = document.getElementById("stringWidthInput").innerText;
	var font = document.getElementById("stringWidthFont").value
	var style = document.getElementById("stringWidthStyle").value
	var size = document.getElementById("stringWidthSize").value

	// Measure string
	var pdf = new jsPDF();
	var width = pdf.getStringWidth(input, font, style, size);

	// Return result to HTML span
	document.getElementById("stringWidthResult").innerText = "String Width: " + width + " pt";
}

// Add the event listeners
document.getElementById("measureString")
		.addEventListener("click", measureString);