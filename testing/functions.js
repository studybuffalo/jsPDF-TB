/**
 * @file Functions to test out the jspdf-tb files
 * @author Joshua Torrance <studybuffalo@gmail.com>
 * @copyright Joshua Torrance 2017
 * @license LGPL-3.0
 */

/** Takes the provided string and measures it */
const testMeasure = function measureString() {
	// Get required details for string measurement
	const input = document.getElementById("stringWidthInput").innerText;
	const font = document.getElementById("stringWidthFont").value
	const style = document.getElementById("stringWidthStyle").value
	const size = document.getElementById("stringWidthSize").value

	// Measure string
	const pdf = new jsPDF();
	const width = pdf.getStringWidth(input, font, style, size);

	// Return result to HTML span
	document.getElementById("stringWidthResult").innerText = `String Width: ${width} pt`;
}

/** Generates a PDF with the advanced text feature */
const testText = function testAdvancedText() {
	const testText = "This is test text";

	// Place the test text
	var pdf = new jsPDF();
	pdf.aText(testText);
}

// Add the event listeners
document.getElementById("measureString").addEventListener("click", testMeasure);

document.getElementById("testAdvancedText").addEventListener("click", testText);