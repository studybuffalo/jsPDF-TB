﻿/**
 * @file Allows use to place text in PDF with advanced options, such as
 * resizing, word wrapping, styling.
 * @author Joshua Torrance <studybuffalo@gmail.com>
 * @copyright Joshua Torrance 2017
 * @license LGPL-3.0
 */

/**
 * PLANNING FOR LIBRARY
 * aText will place either strings or objects
 *   - Strings will be placed as dictated by options
 *   - Objects will be a new class to add customizability to text styles
 *     (e.g. multiple styles, sizes, fonts) and provide a basic paragraphs,
 *     lines, text chunk model
 */

/**
 * The paragraph object
 */

/**
 * The line object
 */

/**
 * The text chunk object
 */


/**
 * Places text of various formats into the PDF
 */
jsPDF.API.aText = function advancedText(txt, options = {}) {
	/**
	 *	txt = object or string
	 *	options
	 *		width
	 *		height
	 *		text options
	 *	Paragraph Object
	 *
	 *	Lines Object
	 */

	// set up reference to the PDF document
	const doc = this;
	const pdfWidth = doc.internal.pageSize.width;
	const pdfHeight = doc.internal.pageSize.height;
}

/*
COLORS (as per jsPDF)

* Depending on the number of arguments given, Gray, RGB, or CMYK
* color space is implied.
*
* When only ch1 is given, "Gray" color space is implied and it
* must be a value in the range from 0.00 (solid black) to to 1.00 (white)
* if values are communicated as String types, or in range from 0 (black)
* to 255 (white) if communicated as Number type.
* The RGB-like 0-255 range is provided for backward compatibility.
*
* When only ch1,ch2,ch3 are given, "RGB" color space is implied and each
* value must be in the range from 0.00 (minimum intensity) to to 1.00
* (max intensity) if values are communicated as String types, or
* from 0 (min intensity) to to 255 (max intensity) if values are communicated
* as Number types.
* The RGB-like 0-255 range is provided for backward compatibility.
*
* When ch1,ch2,ch3,ch4 are given, "CMYK" color space is implied and each
* value must be a in the range from 0.00 (0% concentration) to to
* 1.00 (100% concentration)
*
* Because JavaScript treats fixed point numbers badly (rounds to
* floating point nearest to binary representation) it is highly advised to
* communicate the fractional numbers as String types, not JavaScript Number type.

*/