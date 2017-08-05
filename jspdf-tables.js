/**
 * @file Allows placement and formatting of tables.
 * @author Joshua Torrance <studybuffalo@gmail.com>
 * @copyright Joshua Torrance 2017
 * @license LGPL-3.0
*/

jsPDF.API.addTable = function (body, options) {
	/* KNOWN ISSUES
	 *
	 * There is an issue with line splitting in the presence of line breaks
	 *
	 */
	function Cell() {
		this.content = null;
		this.type = null;
		this.height = null;
		this.width = null;
		this.index = null;
		this.rowSpan = null;
		this.colSpan = null;
		this.borderWidth = null;
		this.borderStyle = null;
		this.borderColor = null;
		this.background = null;
		this.hAlign = null;
		this.vAlign = null;
		this.padding = null;
	}
	
	
	function Paragraph() {
		this.lines = [new Line()];
		this.height = null;
		this.width = null;
	}
	
	
	function Line() {
		this.groups = [];
		this.height = null;
		this.width = null;
	}

	
	function Group() {
		this.color = null;
		this.font = null;
		this.height = null;
		this.size = null;
		this.style = null;
		this.text = null;
		this.width = null;
	}
	
	// Validates a variable as appropriate and formats it for 
	// future use or returns null if not formatted properly
	function ValidateInput() {
		this.borderWidth = function(input) {
			var returnWidth;
			
			if (is_string(input)) {
				input = input.split(" ");
				
				if (input.length === 1) {
					if (!(isNaN(input[0]))) {
						returnWidth = {t: Number(input[0]), r: Number(input[0]), 
									   b: Number(input[0]), l: Number(input[0])};
					}
				} else if (input.length === 2) {
					if (!(isNaN(input[0])) && !(isNaN(input[1]))) {
						returnWidth = {t: Number(input[0]), r: Number(input[1]), 
									   b: Number(input[0]), l: Number(input[1])};
					}
				} else if (input.length === 3) {
					if (!(isNaN(input[0])) && !(isNaN(input[1])) && !(isNaN(input[2]))) {
						returnWidth = {t: Number(input[0]), r: Number(input[1]), 
									   b: Number(input[2]), l: Number(input[1])};
					}
				} else if (input.length === 4) {
					if (!(isNaN(input[0])) && !(isNaN(input[1])) && !(isNaN(input[2])) && !(isNaN(input[3]))) {
						returnWidth = {t: Number(input[0]), r: Number(input[1]), 
									   b: Number(input[2]), l: Number(input[3])};
					}
				}
			} else if (!(isNaN(input))) {
				returnWidth = {t: Number(input), r: Number(input), 
							   b: Number(input), l: Number(input)};
			}
			
			return returnWidth;
		}
		
		
		this.borderStyle = function(input) {
			var returnStyle;
			
			if (is_string(input)) {
				input = input.split(" ");
				
				if (input.length === 1) {
					if (input[0].toUpperCase() === "SOLID" ||
						input[0].toUpperCase() === "DOUBLE" || 
						input[0].toUpperCase() === "NONE") {
							
						returnStyle = {t: input[0].toLowerCase(), 
									   r: input[0].toLowerCase(), 
									   b: input[0].toLowerCase(), 
									   l: input[0].toLowerCase()};
					}
				} else if (input.length === 2) {
					if (input[0].toUpperCase() === "SOLID" ||
						input[0].toUpperCase() === "DOUBLE" || 
						input[0].toUpperCase() === "NONE" ||
						input[1].toUpperCase() === "SOLID" ||
						input[1].toUpperCase() === "DOUBLE" || 
						input[1].toUpperCase() === "NONE") {
							
						returnStyle = {t: input[0].toLowerCase(), 
									   r: input[1].toLowerCase(), 
									   b: input[0].toLowerCase(), 
									   l: input[1].toLowerCase()};
					}
				} else if (input.length === 3) {
					if (input[0].toUpperCase() === "SOLID" ||
						input[0].toUpperCase() === "DOUBLE" || 
						input[0].toUpperCase() === "NONE" ||
						input[1].toUpperCase() === "SOLID" ||
						input[1].toUpperCase() === "DOUBLE" ||
						input[1].toUpperCase() === "NONE" ||
						input[2].toUpperCase() === "SOLID" ||
						input[2].toUpperCase() === "DOUBLE" || 
						input[2].toUpperCase() === "NONE") {
							
						returnStyle = {t: input[0].toLowerCase(), 
									   r: input[1].toLowerCase(), 
									   b: input[2].toLowerCase(), 
									   l: input[1].toLowerCase()};
					}
				} else if (input.length === 4) {
					if (input[0].toUpperCase() === "SOLID" ||
						input[0].toUpperCase() === "DOUBLE" || 
						input[0].toUpperCase() === "NONE" ||
						input[1].toUpperCase() === "SOLID" ||
						input[1].toUpperCase() === "DOUBLE" || 
						input[1].toUpperCase() === "NONE" ||
						input[2].toUpperCase() === "SOLID" ||
						input[2].toUpperCase() === "DOUBLE" || 
						input[2].toUpperCase() === "NONE" ||
						input[3].toUpperCase() === "SOLID" ||
						input[3].toUpperCase() === "DOUBLE" || 
						input[3].toUpperCase() === "NONE") {
							
						returnStyle = {t: input[0].toLowerCase(), 
									   r: input[1].toLowerCase(), 
									   b: input[2].toLowerCase(), 
									   l: input[3].toLowerCase()};
					}
				}
			}
			
			return returnStyle;
		}
		
		
		this.borderColor = function(input) {
			var returnColor;
			
			if (is_array(input)) {
				if (is_array(input[0])) {
					if (input.length === 1) {
						returnColor = {t: {r: input[0][0], g: input[0][1], b: input[0][2]}, 
									   r: {r: input[0][0], g: input[0][1], b: input[0][2]}, 
									   b: {r: input[0][0], g: input[0][1], b: input[0][2]}, 
									   l: {r: input[0][0], g: input[0][1], b: input[0][2]}};
					} else if (input.length === 2) {
						returnColor = {t: {r: input[0][0], g: input[0][1], b: input[0][2]}, 
									   r: {r: input[1][0], g: input[1][1], b: input[1][2]}, 
									   b: {r: input[0][0], g: input[0][1], b: input[0][2]}, 
									   l: {r: input[1][0], g: input[1][1], b: input[1][2]}};
					} else if (input.length === 3) {
						returnColor = {t: {r: input[0][0], g: input[0][1], b: input[0][2]}, 
									   r: {r: input[1][0], g: input[1][1], b: input[1][2]}, 
									   b: {r: input[2][0], g: input[2][1], b: input[2][2]}, 
									   l: {r: input[1][0], g: input[1][1], b: input[1][2]}};
					} else if (input.length === 4) {
						returnColor = {t: {r: input[0][0], g: input[0][1], b: input[0][2]}, 
									   r: {r: input[1][0], g: input[1][1], b: input[1][2]}, 
									   b: {r: input[2][0], g: input[2][1], b: input[2][2]}, 
									   l: {r: input[3][0], g: input[3][1], b: input[3][2]}};
					}
				} else {
					returnColon = [input, input, input, input];
				}
			}
			
			return returnColor;
		}
		
		
		this.span = function(input) {
			var returnSpan;
			
			if (!(isNaN(input))) {
				returnSpan = Number(input);
			}
			
			return returnSpan;
		}
		
		
		this.background = function(input) {
			var returnBackground;
		
			if (is_array(input)) {
				returnBackground = {r: input[0], g: input[1], b: input[2]};
			}
			
			return returnBackground;
		}
		
		
		this.padding = function(input) {
			var returnPadding;
			
			if (is_string(input)) {
				input = input.split(" ");
				
				if (input.length === 1) {
					if (!(isNaN(input[0]))) {
						returnPadding = {t: input[0], r: input[0], b: input[0], l: input[0]};
					}
				} else if (input.length === 2) {
					if (!(isNaN(input[0])) && !(isNaN(input[1]))) {
						returnPadding = {t: input[0], r: input[1], b: input[0], l: input[1]};
					}
				} else if (input.length === 3) {
					if (!(isNaN(input[0])) && !(isNaN(input[1])) && !(isNaN(input[2]))) {
						 
						returnPadding = {t: input[0], r: input[1], b: input[2], l: input[1]};
					}
				} else if (input.length === 4) {
					if (!(isNaN(input[0])) && !(isNaN(input[1])) && !(isNaN(input[2])) && !(isNaN(input[3]))) {
						returnPadding = {t: input[0], r: input[1], b: input[2], l: input[3]};
					}
				}
			}
			
			return returnPadding;
		}
		
		
		this.vAlign = function(input) {
			var returnVAlign;
			
			if (is_string(input)) {
				if (input.toUpperCase() === "TOP" || 
					input.toUpperCase() === "MIDDLE" ||
					input.toUpperCase() === "BOTTOM") {
					
					returnVAlign = input.toLowerCase();
				}
			}
			
			return returnVAlign;
		}
		
		
		this.hAlign = function(input) {
			var returnHAlign;
			
			if (is_string(input)) {
				if (input.toUpperCase() === "LEFT" || 
					input.toUpperCase() === "CENTER" ||
					input.toUpperCase() === "RIGHT") {
					
					returnHAlign = input.toLowerCase();
				}
			}
			
			return returnHAlign;
		}
		
		
		this.font = function(input) {
			var returnFont;
			
			if (is_string(input)) {
				if (input.toUpperCase() === "HELVETICA" ||
					input.toUpperCase() === "TIMES" ||
					input.toUpperCase() === "COURIER") {
					
					returnFont = input.toLowerCase();
				}
			}
			
			return returnFont;
		}
		
		
		this.fontSize = function(input) {
			var returnSize;
			
			if (!(isNaN(input))) {
				returnSize = Number(input);
			}
			
			return returnSize;
		}
		
		
		this.fontStyle = function(input) {
			var returnStyle;
			
			if (is_string(input)) {
				if (input.toUpperCase() === "NORMAL" ||
					input.toUpperCase() === "BOLD" ||
					input.toUpperCase() === "ITALIC" ||
					input.toUpperCase() === "BOLDITALIC") {
					
					returnStyle = input.toLowerCase();
				}
			}
			
			return returnStyle;
		}
		
		
		this.fontColor = function(input) {
			var returnColor;
			
			if (is_array(input)) {
				returnColor = {r: input[0], g: input[1], b: input[2]};
			}
			
			return returnColor;
		}
	}
	
	
	function is_array(arr) {
		if (Object.prototype.toString.call(arr) === '[object Array]' ) {
			return true;
		} else {
			return false;
		}
	}
	
	
	function is_string(arr) {
		if (Object.prototype.toString.call(arr) === '[object String]' ) {
			return true;
		} else {
			return false;
		}
	}
	
	
	function is_object(arr) {
		if (Object.prototype.toString.call(arr) === '[object Object]' ) {
			return true;
		} else {
			return false;
		}
	}
	
	
	// Converts a pt measurement to a mm (based on 72 DPI)
	function ptToMm(number) {
		return number * 25.4 / 72;
	}

	
	// Takes cell data and parent properties and returns cell object
	function generate_cell(cell, prop) {
		// Takes data and returns content object for image insertion
		function generate_image_content(cell) {
			if ("image" in cell && cell.image) {
				var image = cell.image;
			} else {
				var image = "";
			}
			
			if ("width" in cell && cell.width && !(isNaN(cell.width))) {
				var width = Number(cell.width);
			} else {
				var width = 1;
			}
			
			if ("height" in cell && cell.height && !(isNaN(cell.height))) {
				var height = Number(cell.height);
			} else {
				var height = 1;
			}
			
			if ("fileType" in cell && cell.fileType) {
				var fileType = cell.fileType;
			} else {
				var fileType = "JPEG";
			}
			
			return {image: image,
					width: width,
					height: height,
					fileType: fileType}
		}
		
		
		// Takes data and returns content object for text insertion
		function generate_text_content(cell, cellProp) {
			function merge_text_properties(mainProp, subProp) {
				if (subProp.font && !(mainProp.font)) {
					mainProp.font = subProp.font;
				}
				
				if (subProp.fontSize && !(mainProp.fontSize)) {
					mainProp.fontSize = subProp.fontSize;
				}
				
				if (subProp.fontStyle && !(mainProp.fontStyle)) {
					mainProp.fontStyle = subProp.fontStyle;
				}
				
				if (subProp.fontColor && !(mainProp.fontColor)) {
					mainProp.fontColor = subProp.fontColor;
				}
				
				return mainProp;
			}
			
			
			function extract_text_properties(opts) {
				var returnProp = {font: null, fontSize: null, 
								  fontStyle: null, fontColor: null};
				var validator = new ValidateInput();
				
				if ("font" in opts) {
					returnProp.font = validator.font(opts.font);
				}
				
				if ("fontSize" in opts) {
					returnProp.fontSize = validator.fontSize(opts.fontSize);
				}
				
				if ("fontStyle" in opts) {
					returnProp.fontStyle = validator.fontStyle(opts.fontStyle);
				}
				
				if ("fontColor" in opts) {
					returnProp.fontColor = validator.fontColor(opts.fontColor);
				}
				
				return returnProp;
			}
			
			
			var content = {paragraphs: []};
			var groups = [];
			
			var groupProp;
			
			// Extracts any properties from the containing cell
			if (is_object(cell)) {
				if ("options" in cell) {
					prop1 = extract_text_properties(cell);
					prop2 = extract_text_properties(cell.options);
					groupProp = merge_text_properties(prop1, prop2);
				} else {
					groupProp = extract_text_properties(cell);
				}
				
				groupProp = merge_text_properties(groupProp, cellProp);
				
				group = new Group();
				
				group.text = cell.text;
				group.font = groupProp.font;
				group.size = groupProp.fontSize;
				group.style = groupProp.fontStyle;
				group.color = groupProp.fontColor;
				
				groups.push(group);
			} else if (is_array(cell)) {
				for (var i = 0; i < cell.length; i++) {
					if ("options" in cell[i]) {
						prop1 = extract_text_properties(cell[i]);
						prop2 = extract_text_properties(cell[i].options);
						groupProp = merge_text_properties(prop1, prop2);
					} else {
						groupProp = extract_text_properties(cell[i]);
					}
					
					groupProp = merge_text_properties(groupProp, cellProp);
					
					group = new Group();
					
					group.text = cell[i].text;
					group.font = groupProp.font;
					group.size = groupProp.fontSize;
					group.style = groupProp.fontStyle;
					group.color = groupProp.fontColor;
					
					groups.push(group);
				}
			} else {
				groupProp = merge_text_properties(cellProp, cellProp);
				
				group = new Group();
				
				group.text = cell;
				group.font = groupProp.font;
				group.size = groupProp.fontSize;
				group.style = groupProp.fontStyle;
				group.color = groupProp.fontColor;
				
				groups.push(group);
			}
			
			var paragraph = new Paragraph();
			var regexBr = /<br>/i;
			var regexN = /\\n/i;
			var match;
			
			for (var i = 0; i < groups.length; i++) {
				// If there are no line breaks, can add group to single paragraph
				if (groups[i].text.search(regexBr) === -1 && groups[i].text.search(regexN) === -1) {
					paragraph.lines[0].groups.push(groups[i]);
				// If there is a <br> present, split groups into multiple paragraphs
				} else if (groups[i].text.search(regexBr) > -1) {
					// Find start of the match
					match = groups[i].text.search(regexBr);
					
					// Create new group from start of string to match index
					group = new Group();
					group.text = groups[i].text.slice(0, match);
					group.font = groups[i].font;
					group.size = groups[i].size;
					group.style = groups[i].style;
					group.color = groups[i].color;
					paragraph.lines[0].groups.push(group);
					content.paragraphs.push(paragraph);
					
					// Removes grouped text from string
					groups[i].text = groups[i].text.slice(match + 4);
					
					// Create a new paragraph to work with
					paragraph = new Paragraph();
					
					// Push i back one place to continue on with sliced string
					i--;
				} else if (groups[i].text.search(regexN) > -1) {
					match = groups[i].text.search(regexN);
					
					// Create new group from start of string to match index
					group = new Group();
					group.text = groups[i].text.slice(0, match);
					group.font = groups[i].font;
					group.size = groups[i].size;
					group.style = groups[i].style;
					group.color = groups[i].color;
					paragraph.lines[0].groups.push(group);
					content.paragraphs.push(paragraph);
					
					// Removes grouped text from string
					groups[i].text = groups[i].text.slice(match + 2);
					
					// Create a new paragraph to work with
					paragraph = new Paragraph();
					
					// Push i back one place to continue on with sliced string
					i--;
				}
			}
			
			// Add remaining paragraph to content
			content.paragraphs.push(paragraph);
			
			return content;
		}
		
		
		returnCell = new Cell();
		
		returnCell.rowSpan = prop.rowSpan;
		returnCell.colSpan = prop.colSpan;
		returnCell.borderWidth = prop.borderWidth;
		returnCell.borderStyle = prop.borderStyle;
		returnCell.borderColor = prop.borderColor;
		returnCell.background = prop.background;
		returnCell.hAlign = prop.hAlign;
		returnCell.vAlign = prop.vAlign;
		returnCell.padding = prop.padding;
		
		if (is_object(cell)) {
			if ("text" in cell) {
				returnCell.content = generate_text_content(cell.text, prop);
				returnCell.type = "text";
			} else if ("image" in cell) {
				returnCell.content = generate_image_content(cell);
				returnCell.type = "image";
			}
		} else if (is_array(cell)) {
			returnCell.content = generate_text_content(cell, prop);
			returnCell.type = "text";
		} else if (is_string(cell)) {
			returnCell.content = generate_text_content(cell, prop);
			returnCell.type = "text";
		}
		
		return returnCell;
	}
	
	
	// Takes table data and options and returns table for insertion
	function assemble_user_table(table) {
		function merge_properties(mainProp, subProp) {
			if (subProp.borderWidth && !(mainProp.borderWidth)) {
				mainProp.borderWidth = subProp.borderWidth;
			}
			
			if (subProp.borderStyle && !(mainProp.borderStyle)) {
				mainProp.borderStyle = subProp.borderStyle;
			}
			
			if (subProp.borderColor && !(mainProp.borderColor)) {
				mainProp.borderColor = subProp.borderColor;
			}
			
			if (subProp.background && !(mainProp.background)) {
				mainProp.background = subProp.background;
			}
			
			if (subProp.colSpan && !(mainProp.colSpan)) {
				mainProp.colSpan = subProp.colSpan;
			}
			
			if (subProp.rowSpan && !(mainProp.rowSpan)) {
				mainProp.rowSpan = subProp.rowSpan;
			}
			
			if (subProp.padding && !(mainProp.padding)) {
				mainProp.padding = subProp.padding;
			}
			
			if (subProp.vAlign && !(mainProp.vAlign)) {
				mainProp.vAlign = subProp.vAlign;
			}
			
			if (subProp.hAlign && !(mainProp.hAlign)) {
				mainProp.hAlign = subProp.hAlign;
			}
			
			if (subProp.font && !(mainProp.font)) {
				mainProp.font = subProp.font;
			}
			
			if (subProp.fontSize && !(mainProp.fontSize)) {
				mainProp.fontSize = subProp.fontSize;
			}
			
			if (subProp.fontStyle && !(mainProp.fontStyle)) {
				mainProp.fontStyle = subProp.fontStyle;
			}
			
			if (subProp.fontColor && !(mainProp.fontColor)) {
				mainProp.fontColor = subProp.fontColor;
			}
			
			return mainProp;
		}
		
		
		function generate_cell_properties(data) {
			function CellProperty () {
				this.borderWidth = null;
				this.borderStyle = null;
				this.borderColor = null;
				this.background = null;
				this.padding = null;
				this.colSpan = null;
				this.rowSpan = null;
				this.vAlign = null;
				this.hAlign = null;
				this.font = null;
				this.fontSize = null;
				this.fontStyle = null;
				this.fontColor = null;
			}

			
			
			function extract_properties(opts) {
				var returnProp = new CellProperty();
				var validator = new ValidateInput();
				
				if (opts) {
					// Validate that option is formatted properly
					// If formatted properly, add it to returnProp
					if ("borderWidth" in opts) {
						returnProp.borderWidth = validator.borderWidth(opts.borderWidth);
					}
					
					if ("borderStyle" in opts) {
						returnProp.borderStyle = validator.borderStyle(opts.borderStyle);
					}
					
					if ("borderColor" in opts) {
						returnProp.borderColor = validator.borderColor(opts.borderColor);
					}
					
					if ("background" in opts) {
						
						returnProp.background = validator.background(opts.background);
					}
					
					if ("colSpan" in opts) {
						returnProp.colSpan = validator.span(opts.colSpan);
					}
					
					if ("rowSpan" in opts) {
						returnProp.rowSpan = validator.span(opts.rowSpan);
					}
					
					if ("padding" in opts) {
						returnProp.padding = validator.padding(opts.padding);
					}
					
					if ("vAlign" in opts) {
						returnProp.vAlign = validator.vAlign(opts.vAlign);
					}
					
					if ("hAlign" in opts) {
						returnProp.hAlign = validator.hAlign(opts.hAlign);
					}
					
					if ("font" in opts) {
						returnProp.font = validator.font(opts.font);
					}
					
					if ("fontSize" in opts) {
						returnProp.fontSize = validator.fontSize(opts.fontSize);
					}
					
					if ("fontStyle" in opts) {
						returnProp.fontStyle = validator.fontStyle(opts.fontStyle);
					}
					
					if ("fontColor" in opts) {
						returnProp.fontColor = validator.fontColor(opts.fontColor);
					}
				}
				
				return returnProp;
			}
			
			
			var prop;
			
			// If properties are possibly present, extract them
			if (is_object(data)) {
				if ("options" in data) {
					var prop1 = extract_properties(data);
					var prop2 = extract_properties(data.options);
					prop = merge_properties(prop1, prop2);
				} else {
					prop = extract_properties(data);
				}
			} else if (data === "default") {
				prop = new CellProperty();
				
				prop.borderWidth = {t: 0.25, r: 0.25, b: 0.25, l: 0.25};
				prop.borderStyle = {t: "solid", r: "solid", b: "solid", l: "solid"};
				prop.borderColor = {t: {r: 0, g: 0, b: 0}, r: {r: 0, g: 0, b: 0}, b: {r: 0, g: 0, b: 0}, l: {r: 0, g: 0, b: 0}};
				prop.background = {r: 255, g: 255, b: 255};
				prop.padding = {t: 1, r:1, b: 1, l: 1};
				prop.colSpan = 1;
				prop.rowSpan = 1;
				prop.vAlign = "top";
				prop.hAlign = "left";
				prop.font = "helvetica";
				prop.fontSize = 12;
				prop.fontStyle = "normal";
				prop.fontColor = {r: 0, g: 0, b: 0};
			} else {
				prop = new CellProperty();
			}
			
			return prop;
		}
		
		
		var returnTable = {rows: []};
		
		// Set up default properties
		var defaultProp = generate_cell_properties("default");
		
		// Extract the data for the table rows and any additional options
		var rows;
		var tableProp;
		
		if (is_object(table)) {
			rows = table.rows;
			
			// Extract table properties
			tableProp = generate_cell_properties(table);
			
		} else if (is_array(table)) {
			rows = table;
			
			tableProp = generate_cell_properties();
		} else {
			console.warn("Provided table data is not formatted properly and table will not be generated");
			
			return null;
		}
		
		// Merge with default properties
		tableProp = merge_properties(tableProp, defaultProp);
		
		// Cycles through each row and extracts cells
		var returnRow;
		var returnCell;
		var cells;
		var cell;
		var rowProp;
		var cellProp;
		var cellContent;
		
		for (var i = 0; i < rows.length; i++) {
			returnRows = {cells: []};
			cells = null;
			
			if (is_object(rows[i])) {
				cells = rows[i].cells;
				
				// Extract row properties (if present)
				rowProp = generate_cell_properties(rows[i]);
			} else if (is_array(rows[i])) {
				cells = rows[i];
				
				// Generate blank row properties
				rowProp = generate_cell_properties();
			} else {
				console.warn("Provided table data is not formatted properly and table will not be generated");
				
				return null;
			}
			
			// Merge with table properties
			rowProp = merge_properties(rowProp, tableProp);
		
			// Cycles through each cell
			for (var j = 0; j < cells.length; j++) {
				cell = cells[j];
				
				if (is_object(cell)) {
					// Determine cell properties
					cellProp = generate_cell_properties(cell);
				} else if (is_array(cell)) {
					cellProp = generate_cell_properties();
				} else if (is_string(cell)) {
					cellProp = generate_cell_properties();
				} else {
					console.warn("Provided table data is not formatted properly and table will not be generated");
					
					return null;
				}
				
				// Merge with row properties
				cellProp = merge_properties(cellProp, rowProp);
				
				returnRows.cells.push(generate_cell(cell, cellProp));
			}
			
			returnTable.rows.push(returnRows);
		}
		
		return returnTable;
		
		// Take the body and options to generate the required table objects for 
		// generating the table document
	}
	
	

	// Functions that process table content for insertion into a jsPDF doc
	function process_table(table) {
		// Assigns an index value to each cell (the index value) identifies 
		// which column a cell falls under for sizing/placement purposes
		function assign_cell_index(t) {
			// Assigns default index (accounting for colSpan)
			function assign_default_index(t) {
				var cell;
				var index;
				
				for (var i = 0; i < t.rows.length; i++) {
					index = 0;
					
					for (var j = 0; j < t.rows[i].cells.length; j++) {
						cell = t.rows[i].cells[j];
						cell.index = index
						
						// Adjust index based on presence of colSpan
						index += cell.colSpan
					}
				}
				
				return t;
			}
			
			
			function update_index(t) {
				var cell;
				
				// Assign an updated index based on presence of rowSpan
				for (var i = 0; i < t.rows.length; i++) {
					for (var j = 0; j < t.rows[i].cells.length; j++) {
						cell = t.rows[i].cells[j];
						
						// If rowSpan > 1, will cycle through subsequent rows to update
						// indices in affected cells
						for (var k = 1; k < cell.rowSpan; k++) {
							// Cycle through cells in impacted row
							for (var l = 0; l < t.rows[i + k].cells.length; l++) {
								// Adjust index by the colSpan of the rowSpan cell
								t.rows[i + k].cells[l].index += cell.colSpan;
							}
						}
					}
				}
				
				return t;
			}
			
			
			// Assign default index
			t = assign_default_index(t);
			
			// Update index if rowSpan present
			t = update_index(t);
			
			return t;
		}
		
		
		// Assigns a width to each table cell
		function assign_cell_width(t) {
			var colNum, cell, index, width;
			
			// Assign width to each cell based on colSpan and cell index
			for (var i = 0; i < t.rows.length; i++) {
				colNum = 0;
				
				for (var j = 0; j < t.rows[i].cells.length; j++) {
					cell = t.rows[i].cells[j];
					index = cell.index;
					
					if (cell.colSpan === 1) {
						width = colSize[index];
					} else {
						// Cycle through each column in the colSpan and add widths
						width = 0;
						
						for (var k = 0; k < cell.colSpan; k++) {
							width += colSize[index + k];
						}
					}
					
					cell.width = width;
				}
			}
			
			return t;
		}
		
		
		// Resizes cell content to fit within cell width
		function resize_cells(t) {
			// Compiles an array of groups to combine adjacent similar entries
			function assemble_groups(chars) {
				var returnGroups = new Line();
				
				
				// Add first character to first group
				var group = new Group();
				
				group.color = chars[0].color;
				group.font = chars[0].font;
				group.height = ptToMm(chars[0].size);
				group.size = chars[0].size;
				group.style = chars[0].style;
				group.text = chars[0].text;
				group.width = chars[0].width;
				
				returnGroups.groups.push(group);
				
				var lastGroup;
				
				for (var i = 1; i < chars.length; i++) {
					lastGroup = returnGroups.groups.length - 1;
					
					// If this character matches all properties of previous, add it to group
					if (chars[i].color === returnGroups.groups[lastGroup].color &&
						chars[i].font === returnGroups.groups[lastGroup].font && 
						chars[i].size === returnGroups.groups[lastGroup].size &&
						chars[i].style === returnGroups.groups[lastGroup].style) {
						returnGroups.groups[lastGroup].text += chars[i].text;
						returnGroups.groups[lastGroup].width += chars[i].width;
						
					// Otherwise, create a new group with the new properties
					} else {
						group = new Group();
				
						group.color = chars[i].color;
						group.font = chars[i].font;
						group.height = ptToMm(chars[i].size);
						group.size = chars[i].size;
						group.style = chars[i].style;
						group.text = chars[i].text;
						group.width = chars[i].width;
						
						returnGroups.groups.push(group);
					}
				}
				
				// Adds height and width to the line
				var width = 0;
				var height = 0;
				
				for (var i = 0; i < returnGroups.groups.length; i++) {
					height = returnGroups.groups[i].height > height ?
							 returnGroups.groups[i].height : height;
					width += returnGroups.groups[i].width;
				}
				
				returnGroups.height = height;
				returnGroups.width = width;
				
				return returnGroups;
			}
			
			
			// Splits individual characters (organized as groups) into multiple 
			// lines to fit within the specified width
			function split_line(line, maxWidth) {
				var breakChars = /\s|-/;	// Breaks may occurs on spaces & hyphens
				var start = 0;
				var lastSplit;
				var width = 0;
				var lines = [];
				var lastColor;
				var lastFont;
				var lastStyle;
				var lastSize;
				
				// Cycle through each character
				for (var j = 0; j < line.groups.length; j++) {
					// Adds character width to measurement
					width += line.groups[j].width;
					
					// Checks if this is a split character
					if (line.groups[j].text.search(breakChars) !== -1) {
						lastSplit = j;
					}
					
					// Checks if a split needs to occur	or if end of string was reached	
					if (width > maxWidth) {
						if (lastSplit) {
							// Split character was marked previously, so can use this
							// to create new line
							groups = line.groups.slice(start, lastSplit);
						} else {
							// No split character was found, so this is a whole word
							// If word is 2 characters or less, just processes it;
							// otherwise will split in middle of word and hyphenate
							
							if (j - start <= 1) {
								// Mark the split location
								lastSplit = j + 1;
								
								groups = line.groups.slice(start, lastSplit);
							} else {
								// Remove last 2 characters from group
								groups = line.groups.slice(start, j - 1);
								
								// Add hyphen to end
								lastColor = groups[groups.length - 1].color;
								lastFont = groups[groups.length - 1].font;
								lastStyle = groups[groups.length - 1].style;
								lastSize = groups[groups.length - 1].size;
								
								// HACKY FIX TO ACCOUNT FOR HYPHEN WIDTH
								lastWidth = lastFont.toUpperCase() === "COURIER" ? 0.600 : 0.333;
								lastWidth = lastWidth * lastSize;
								
								groups.push({text: "-", color: lastColor, font: lastFont, 
											 style: lastStyle, size: lastSize});
								
								// Mark the split location
								lastSplit = j - 2;
							}
						}
						
						// Assemble group and add to the lines array
						lines.push(assemble_groups(groups));
						
						// Update the start character
						start = lastSplit + 1;
						
						// Return j back to the start to restart process
						j = start;
						
						// Reset width to start remeasuring content
						width = line.groups[j].width;
						
						// Reset last split
						lastSplit = null;
					} else if (j === line.groups.length - 1) {
						// Make final group from start index and end of array
						groups = line.groups.slice(start, j + 1);
						
						// Assemble group and add to the lines array
						lines.push(assemble_groups(groups));
					}
				}
				
				return lines;
			}
			
			
			// Compiles a paragraph into a single line with each character as a group
			function compile_lines(lines) {
				var CharRef = function(character, cN, cB, cI, cBI, hN, hB, hI, 
									   hBI, tN, tB, tI, tBI) {
					this.character = character;
					this.courier = {normal: cN, bold: cB, italic: cI, bolditalic: cBI};
					this.helvetica = {normal: hN, bold: hB, italic: hI, bolditalic: hBI};
					this.times = {normal: tN, bold: tB, italic: tI, bolditalic: tBI};
				}
					
				// Creates array containing all the character data (Helvetica);
				// First 32 entries are blank so that array index = character code
				var charList = [
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					new CharRef(" ", 0.600, 0.600, 0.600, 0.600, 0.278, 0.278, 0.278, 0.278, 0.250, 0.250, 0.250, 0.250),
					new CharRef("!", 0.600, 0.600, 0.600, 0.600, 0.278, 0.333, 0.278, 0.333, 0.333, 0.333, 0.333, 0.389),
					new CharRef("\"", 0.600, 0.600, 0.600, 0.600, 0.355, 0.474, 0.355, 0.474, 0.408, 0.555, 0.420, 0.555),
					new CharRef("#", 0.600, 0.600, 0.600, 0.600, 0.556, 0.556, 0.556, 0.556, 0.500, 0.500, 0.500, 0.500),
					new CharRef("$", 0.600, 0.600, 0.600, 0.600, 0.556, 0.556, 0.556, 0.556, 0.500, 0.500, 0.500, 0.500),
					new CharRef("%", 0.600, 0.600, 0.600, 0.600, 0.889, 0.889, 0.889, 0.889, 0.833, 1.000, 0.833, 0.833),
					new CharRef("&", 0.600, 0.600, 0.600, 0.600, 0.667, 0.722, 0.667, 0.722, 0.778, 0.833, 0.778, 0.778),
					new CharRef("'", 0.600, 0.600, 0.600, 0.600, 0.191, 0.238, 0.191, 0.238, 0.180, 0.278, 0.214, 0.278),
					new CharRef("(", 0.600, 0.600, 0.600, 0.600, 0.333, 0.333, 0.333, 0.333, 0.333, 0.333, 0.333, 0.333),
					new CharRef(")", 0.600, 0.600, 0.600, 0.600, 0.333, 0.333, 0.333, 0.333, 0.333, 0.333, 0.333, 0.333),
					new CharRef("*", 0.600, 0.600, 0.600, 0.600, 0.389, 0.389, 0.389, 0.389, 0.500, 0.500, 0.500, 0.500),
					new CharRef("+", 0.600, 0.600, 0.600, 0.600, 0.584, 0.584, 0.584, 0.584, 0.564, 0.570, 0.675, 0.570),
					new CharRef(",", 0.600, 0.600, 0.600, 0.600, 0.278, 0.278, 0.278, 0.278, 0.250, 0.250, 0.250, 0.250),
					new CharRef("-", 0.600, 0.600, 0.600, 0.600, 0.333, 0.333, 0.333, 0.333, 0.333, 0.333, 0.333, 0.333),
					new CharRef(".", 0.600, 0.600, 0.600, 0.600, 0.278, 0.278, 0.278, 0.278, 0.250, 0.250, 0.250, 0.250),
					new CharRef("/", 0.600, 0.600, 0.600, 0.600, 0.278, 0.278, 0.278, 0.278, 0.278, 0.278, 0.278, 0.278),
					new CharRef("0", 0.600, 0.600, 0.600, 0.600, 0.556, 0.556, 0.556, 0.556, 0.500, 0.500, 0.500, 0.500),
					new CharRef("1", 0.600, 0.600, 0.600, 0.600, 0.556, 0.556, 0.556, 0.556, 0.500, 0.500, 0.500, 0.500),
					new CharRef("2", 0.600, 0.600, 0.600, 0.600, 0.556, 0.556, 0.556, 0.556, 0.500, 0.500, 0.500, 0.500),
					new CharRef("3", 0.600, 0.600, 0.600, 0.600, 0.556, 0.556, 0.556, 0.556, 0.500, 0.500, 0.500, 0.500),
					new CharRef("4", 0.600, 0.600, 0.600, 0.600, 0.556, 0.556, 0.556, 0.556, 0.500, 0.500, 0.500, 0.500),
					new CharRef("5", 0.600, 0.600, 0.600, 0.600, 0.556, 0.556, 0.556, 0.556, 0.500, 0.500, 0.500, 0.500),
					new CharRef("6", 0.600, 0.600, 0.600, 0.600, 0.556, 0.556, 0.556, 0.556, 0.500, 0.500, 0.500, 0.500),
					new CharRef("7", 0.600, 0.600, 0.600, 0.600, 0.556, 0.556, 0.556, 0.556, 0.500, 0.500, 0.500, 0.500),
					new CharRef("8", 0.600, 0.600, 0.600, 0.600, 0.556, 0.556, 0.556, 0.556, 0.500, 0.500, 0.500, 0.500),
					new CharRef("9", 0.600, 0.600, 0.600, 0.600, 0.556, 0.556, 0.556, 0.556, 0.500, 0.500, 0.500, 0.500),
					new CharRef(":", 0.600, 0.600, 0.600, 0.600, 0.278, 0.333, 0.278, 0.333, 0.278, 0.333, 0.333, 0.333),
					new CharRef(";", 0.600, 0.600, 0.600, 0.600, 0.278, 0.333, 0.278, 0.333, 0.278, 0.333, 0.333, 0.333),
					new CharRef("<", 0.600, 0.600, 0.600, 0.600, 0.584, 0.584, 0.584, 0.584, 0.564, 0.570, 0.675, 0.570),
					new CharRef("=", 0.600, 0.600, 0.600, 0.600, 0.584, 0.584, 0.584, 0.584, 0.564, 0.570, 0.675, 0.570),
					new CharRef(">", 0.600, 0.600, 0.600, 0.600, 0.584, 0.584, 0.584, 0.584, 0.564, 0.570, 0.675, 0.570),
					new CharRef("?", 0.600, 0.600, 0.600, 0.600, 0.556, 0.611, 0.556, 0.611, 0.444, 0.500, 0.500, 0.500),
					new CharRef("@", 0.600, 0.600, 0.600, 0.600, 1.015, 0.975, 1.015, 0.975, 0.921, 0.930, 0.920, 0.832),
					new CharRef("A", 0.600, 0.600, 0.600, 0.600, 0.667, 0.722, 0.667, 0.722, 0.722, 0.722, 0.611, 0.667),
					new CharRef("B", 0.600, 0.600, 0.600, 0.600, 0.667, 0.722, 0.667, 0.722, 0.667, 0.667, 0.611, 0.667),
					new CharRef("C", 0.600, 0.600, 0.600, 0.600, 0.722, 0.722, 0.722, 0.722, 0.667, 0.722, 0.667, 0.667),
					new CharRef("D", 0.600, 0.600, 0.600, 0.600, 0.722, 0.722, 0.722, 0.722, 0.722, 0.722, 0.722, 0.722),
					new CharRef("E", 0.600, 0.600, 0.600, 0.600, 0.667, 0.667, 0.667, 0.667, 0.611, 0.667, 0.611, 0.667),
					new CharRef("F", 0.600, 0.600, 0.600, 0.600, 0.611, 0.611, 0.611, 0.611, 0.556, 0.611, 0.611, 0.667),
					new CharRef("G", 0.600, 0.600, 0.600, 0.600, 0.778, 0.778, 0.778, 0.778, 0.722, 0.778, 0.722, 0.722),
					new CharRef("H", 0.600, 0.600, 0.600, 0.600, 0.722, 0.722, 0.722, 0.722, 0.722, 0.778, 0.722, 0.778),
					new CharRef("I", 0.600, 0.600, 0.600, 0.600, 0.278, 0.278, 0.278, 0.278, 0.333, 0.389, 0.333, 0.389),
					new CharRef("J", 0.600, 0.600, 0.600, 0.600, 0.500, 0.556, 0.500, 0.556, 0.389, 0.500, 0.444, 0.500),
					new CharRef("K", 0.600, 0.600, 0.600, 0.600, 0.667, 0.722, 0.667, 0.722, 0.722, 0.778, 0.667, 0.667),
					new CharRef("L", 0.600, 0.600, 0.600, 0.600, 0.556, 0.611, 0.556, 0.611, 0.611, 0.667, 0.556, 0.611),
					new CharRef("M", 0.600, 0.600, 0.600, 0.600, 0.833, 0.833, 0.833, 0.833, 0.889, 0.944, 0.833, 0.889),
					new CharRef("N", 0.600, 0.600, 0.600, 0.600, 0.722, 0.722, 0.722, 0.722, 0.722, 0.722, 0.667, 0.722),
					new CharRef("O", 0.600, 0.600, 0.600, 0.600, 0.778, 0.778, 0.778, 0.778, 0.722, 0.778, 0.722, 0.722),
					new CharRef("P", 0.600, 0.600, 0.600, 0.600, 0.667, 0.667, 0.667, 0.667, 0.556, 0.611, 0.611, 0.611),
					new CharRef("Q", 0.600, 0.600, 0.600, 0.600, 0.778, 0.778, 0.778, 0.778, 0.722, 0.778, 0.722, 0.722),
					new CharRef("R", 0.600, 0.600, 0.600, 0.600, 0.722, 0.722, 0.722, 0.722, 0.667, 0.722, 0.611, 0.667),
					new CharRef("S", 0.600, 0.600, 0.600, 0.600, 0.667, 0.667, 0.667, 0.667, 0.556, 0.556, 0.500, 0.556),
					new CharRef("T", 0.600, 0.600, 0.600, 0.600, 0.611, 0.611, 0.611, 0.611, 0.611, 0.667, 0.556, 0.611),
					new CharRef("U", 0.600, 0.600, 0.600, 0.600, 0.722, 0.722, 0.722, 0.722, 0.722, 0.722, 0.722, 0.722),
					new CharRef("V", 0.600, 0.600, 0.600, 0.600, 0.667, 0.667, 0.667, 0.667, 0.722, 0.722, 0.611, 0.667),
					new CharRef("W", 0.600, 0.600, 0.600, 0.600, 0.944, 0.944, 0.944, 0.944, 0.944, 1.000, 0.833, 0.889),
					new CharRef("X", 0.600, 0.600, 0.600, 0.600, 0.667, 0.667, 0.667, 0.667, 0.722, 0.722, 0.611, 0.667),
					new CharRef("Y", 0.600, 0.600, 0.600, 0.600, 0.667, 0.667, 0.667, 0.667, 0.722, 0.722, 0.556, 0.611),
					new CharRef("Z", 0.600, 0.600, 0.600, 0.600, 0.611, 0.611, 0.611, 0.611, 0.611, 0.667, 0.556, 0.611),
					new CharRef("[", 0.600, 0.600, 0.600, 0.600, 0.278, 0.333, 0.278, 0.333, 0.333, 0.333, 0.389, 0.333),
					new CharRef("\\", 0.600, 0.600, 0.600, 0.600, 0.278, 0.278, 0.278, 0.278, 0.278, 0.278, 0.278, 0.278),
					new CharRef("]", 0.600, 0.600, 0.600, 0.600, 0.278, 0.333, 0.278, 0.333, 0.333, 0.333, 0.389, 0.333),
					new CharRef("^", 0.600, 0.600, 0.600, 0.600, 0.469, 0.584, 0.469, 0.584, 0.469, 0.581, 0.422, 0.570),
					new CharRef("_", 0.600, 0.600, 0.600, 0.600, 0.556, 0.556, 0.556, 0.556, 0.500, 0.500, 0.500, 0.500),
					new CharRef("`", 0.600, 0.600, 0.600, 0.600, 0.333, 0.333, 0.333, 0.333, 0.333, 0.333, 0.333, 0.333),
					new CharRef("a", 0.600, 0.600, 0.600, 0.600, 0.556, 0.556, 0.556, 0.556, 0.444, 0.500, 0.500, 0.500),
					new CharRef("b", 0.600, 0.600, 0.600, 0.600, 0.556, 0.611, 0.556, 0.611, 0.500, 0.556, 0.500, 0.500),
					new CharRef("c", 0.600, 0.600, 0.600, 0.600, 0.500, 0.556, 0.500, 0.556, 0.444, 0.444, 0.444, 0.444),
					new CharRef("d", 0.600, 0.600, 0.600, 0.600, 0.556, 0.611, 0.556, 0.611, 0.500, 0.556, 0.500, 0.500),
					new CharRef("e", 0.600, 0.600, 0.600, 0.600, 0.556, 0.556, 0.556, 0.556, 0.444, 0.444, 0.444, 0.444),
					new CharRef("f", 0.600, 0.600, 0.600, 0.600, 0.278, 0.333, 0.278, 0.333, 0.333, 0.333, 0.278, 0.333),
					new CharRef("g", 0.600, 0.600, 0.600, 0.600, 0.556, 0.611, 0.556, 0.611, 0.500, 0.500, 0.500, 0.500),
					new CharRef("h", 0.600, 0.600, 0.600, 0.600, 0.556, 0.611, 0.556, 0.611, 0.500, 0.556, 0.500, 0.556),
					new CharRef("i", 0.600, 0.600, 0.600, 0.600, 0.222, 0.278, 0.222, 0.278, 0.278, 0.278, 0.278, 0.278),
					new CharRef("j", 0.600, 0.600, 0.600, 0.600, 0.222, 0.278, 0.222, 0.278, 0.278, 0.333, 0.278, 0.278),
					new CharRef("k", 0.600, 0.600, 0.600, 0.600, 0.500, 0.556, 0.500, 0.556, 0.500, 0.556, 0.444, 0.500),
					new CharRef("l", 0.600, 0.600, 0.600, 0.600, 0.222, 0.278, 0.222, 0.278, 0.278, 0.278, 0.278, 0.278),
					new CharRef("m", 0.600, 0.600, 0.600, 0.600, 0.833, 0.889, 0.833, 0.889, 0.778, 0.833, 0.722, 0.778),
					new CharRef("n", 0.600, 0.600, 0.600, 0.600, 0.556, 0.611, 0.556, 0.611, 0.500, 0.556, 0.500, 0.556),
					new CharRef("o", 0.600, 0.600, 0.600, 0.600, 0.556, 0.611, 0.556, 0.611, 0.500, 0.500, 0.500, 0.500),
					new CharRef("p", 0.600, 0.600, 0.600, 0.600, 0.556, 0.611, 0.556, 0.611, 0.500, 0.556, 0.500, 0.500),
					new CharRef("q", 0.600, 0.600, 0.600, 0.600, 0.556, 0.611, 0.556, 0.611, 0.500, 0.556, 0.500, 0.500),
					new CharRef("r", 0.600, 0.600, 0.600, 0.600, 0.333, 0.389, 0.333, 0.389, 0.333, 0.444, 0.389, 0.389),
					new CharRef("s", 0.600, 0.600, 0.600, 0.600, 0.500, 0.556, 0.500, 0.556, 0.389, 0.389, 0.389, 0.389),
					new CharRef("t", 0.600, 0.600, 0.600, 0.600, 0.278, 0.333, 0.278, 0.333, 0.278, 0.333, 0.278, 0.278),
					new CharRef("u", 0.600, 0.600, 0.600, 0.600, 0.556, 0.611, 0.556, 0.611, 0.500, 0.556, 0.500, 0.556),
					new CharRef("v", 0.600, 0.600, 0.600, 0.600, 0.500, 0.556, 0.500, 0.556, 0.500, 0.500, 0.444, 0.444),
					new CharRef("w", 0.600, 0.600, 0.600, 0.600, 0.722, 0.778, 0.722, 0.778, 0.722, 0.722, 0.667, 0.667),
					new CharRef("x", 0.600, 0.600, 0.600, 0.600, 0.500, 0.556, 0.500, 0.556, 0.500, 0.500, 0.444, 0.500),
					new CharRef("y", 0.600, 0.600, 0.600, 0.600, 0.500, 0.556, 0.500, 0.556, 0.500, 0.500, 0.444, 0.444),
					new CharRef("z", 0.600, 0.600, 0.600, 0.600, 0.500, 0.500, 0.500, 0.500, 0.444, 0.444, 0.389, 0.389),
					new CharRef("{", 0.600, 0.600, 0.600, 0.600, 0.334, 0.389, 0.334, 0.389, 0.480, 0.394, 0.400, 0.348),
					new CharRef("|", 0.600, 0.600, 0.600, 0.600, 0.260, 0.280, 0.260, 0.280, 0.200, 0.220, 0.275, 0.220),
					new CharRef("}", 0.600, 0.600, 0.600, 0.600, 0.334, 0.389, 0.334, 0.389, 0.480, 0.394, 0.400, 0.348),
					new CharRef("~", 0.600, 0.600, 0.600, 0.600, 0.584, 0.584, 0.584, 0.584, 0.541, 0.520, 0.541, 0.570),
					null,
					new CharRef("€", 0.600, 0.600, 0.600, 0.600, 0.556, 0.556, 0.556, 0.556, 0.500, 0.500, 0.500, 0.500),
					null,
					new CharRef("‚", 0.600, 0.600, 0.600, 0.600, 0.222, 0.278, 0.222, 0.278, 0.333, 0.333, 0.333, 0.333),
					new CharRef("ƒ", 0.600, 0.600, 0.600, 0.600, 0.556, 0.556, 0.556, 0.556, 0.500, 0.500, 0.500, 0.500),
					new CharRef("„", 0.600, 0.600, 0.600, 0.600, 0.333, 0.500, 0.333, 0.500, 0.444, 0.500, 0.556, 0.500),
					new CharRef("…", 0.600, 0.600, 0.600, 0.600, 1.000, 1.000, 1.000, 1.000, 1.000, 1.000, 0.889, 1.000),
					new CharRef("†", 0.600, 0.600, 0.600, 0.600, 0.556, 0.556, 0.556, 0.556, 0.500, 0.500, 0.500, 0.500),
					new CharRef("‡", 0.600, 0.600, 0.600, 0.600, 0.556, 0.556, 0.556, 0.556, 0.500, 0.500, 0.500, 0.500),
					new CharRef("ˆ", 0.600, 0.600, 0.600, 0.600, 0.333, 0.333, 0.333, 0.333, 0.333, 0.333, 0.333, 0.333),
					new CharRef("‰", 0.600, 0.600, 0.600, 0.600, 1.000, 1.000, 1.000, 1.000, 1.000, 1.000, 1.000, 1.000),
					new CharRef("Š", 0.600, 0.600, 0.600, 0.600, 0.667, 0.667, 0.667, 0.667, 0.556, 0.556, 0.500, 0.556),
					new CharRef("‹", 0.600, 0.600, 0.600, 0.600, 0.333, 0.333, 0.333, 0.333, 0.333, 0.333, 0.333, 0.333),
					new CharRef("Œ", 0.600, 0.600, 0.600, 0.600, 1.000, 1.000, 1.000, 1.000, 0.889, 1.000, 0.944, 0.944),
					null,
					new CharRef("Ž", 0.600, 0.600, 0.600, 0.600, 0.611, 0.611, 0.611, 0.611, 0.611, 0.667, 0.556, 0.611),
					null,
					null,
					new CharRef("‘", 0.600, 0.600, 0.600, 0.600, 0.222, 0.278, 0.222, 0.278, 0.333, 0.333, 0.333, 0.333),
					new CharRef("’", 0.600, 0.600, 0.600, 0.600, 0.222, 0.278, 0.222, 0.278, 0.333, 0.333, 0.333, 0.333),
					new CharRef("“", 0.600, 0.600, 0.600, 0.600, 0.333, 0.500, 0.333, 0.500, 0.444, 0.500, 0.556, 0.500),
					new CharRef("”", 0.600, 0.600, 0.600, 0.600, 0.333, 0.500, 0.333, 0.500, 0.444, 0.500, 0.556, 0.500),
					new CharRef("•", 0.600, 0.600, 0.600, 0.600, 0.350, 0.350, 0.350, 0.350, 0.350, 0.350, 0.350, 0.350),
					new CharRef("–", 0.600, 0.600, 0.600, 0.600, 0.556, 0.556, 0.556, 0.556, 0.500, 0.500, 0.500, 0.500),
					new CharRef("—", 0.600, 0.600, 0.600, 0.600, 1.000, 1.000, 1.000, 1.000, 1.000, 1.000, 0.889, 1.000),
					new CharRef("˜", 0.600, 0.600, 0.600, 0.600, 0.333, 0.333, 0.333, 0.333, 0.333, 0.333, 0.333, 0.333),
					new CharRef("™", 0.600, 0.600, 0.600, 0.600, 1.000, 1.000, 1.000, 1.000, 0.980, 1.000, 0.980, 1.000),
					new CharRef("š", 0.600, 0.600, 0.600, 0.600, 0.500, 0.556, 0.500, 0.556, 0.389, 0.389, 0.389, 0.389),
					new CharRef("›", 0.600, 0.600, 0.600, 0.600, 0.333, 0.333, 0.333, 0.333, 0.333, 0.333, 0.333, 0.333),
					new CharRef("œ", 0.600, 0.600, 0.600, 0.600, 0.944, 0.944, 0.944, 0.944, 0.722, 0.722, 0.667, 0.722),
					null,
					new CharRef("ž", 0.600, 0.600, 0.600, 0.600, 0.500, 0.500, 0.500, 0.500, 0.444, 0.444, 0.389, 0.389),
					new CharRef("Ÿ", 0.600, 0.600, 0.600, 0.600, 0.667, 0.667, 0.667, 0.667, 0.722, 0.722, 0.556, 0.611),
					new CharRef(" ", 0.600, 0.600, 0.600, 0.600, 0.278, 0.278, 0.278, 0.278, 0.250, 0.250, 0.250, 0.250),
					new CharRef("¡", 0.600, 0.600, 0.600, 0.600, 0.333, 0.333, 0.333, 0.333, 0.333, 0.333, 0.389, 0.389),
					new CharRef("¢", 0.600, 0.600, 0.600, 0.600, 0.556, 0.556, 0.556, 0.556, 0.500, 0.500, 0.500, 0.500),
					new CharRef("£", 0.600, 0.600, 0.600, 0.600, 0.556, 0.556, 0.556, 0.556, 0.500, 0.500, 0.500, 0.500),
					new CharRef("¤", 0.600, 0.600, 0.600, 0.600, 0.556, 0.556, 0.556, 0.556, 0.500, 0.500, 0.500, 0.500),
					new CharRef("¥", 0.600, 0.600, 0.600, 0.600, 0.556, 0.556, 0.556, 0.556, 0.500, 0.500, 0.500, 0.500),
					new CharRef("¦", 0.600, 0.600, 0.600, 0.600, 0.260, 0.280, 0.260, 0.280, 0.200, 0.220, 0.275, 0.220),
					new CharRef("§", 0.600, 0.600, 0.600, 0.600, 0.556, 0.556, 0.556, 0.556, 0.500, 0.500, 0.500, 0.500),
					new CharRef("¨", 0.600, 0.600, 0.600, 0.600, 0.333, 0.333, 0.333, 0.333, 0.333, 0.333, 0.333, 0.333),
					new CharRef("©", 0.600, 0.600, 0.600, 0.600, 0.737, 0.737, 0.737, 0.737, 0.760, 0.747, 0.760, 0.747),
					new CharRef("ª", 0.600, 0.600, 0.600, 0.600, 0.370, 0.370, 0.370, 0.370, 0.276, 0.300, 0.276, 0.266),
					new CharRef("«", 0.600, 0.600, 0.600, 0.600, 0.556, 0.556, 0.556, 0.556, 0.500, 0.500, 0.500, 0.500),
					new CharRef("¬", 0.600, 0.600, 0.600, 0.600, 0.584, 0.584, 0.584, 0.584, 0.564, 0.570, 0.675, 0.606),
					new CharRef("-", 0.600, 0.600, 0.600, 0.600, 0.333, 0.333, 0.333, 0.333, 0.333, 0.333, 0.333, 0.333),
					new CharRef("®", 0.600, 0.600, 0.600, 0.600, 0.737, 0.737, 0.737, 0.737, 0.760, 0.747, 0.760, 0.747),
					new CharRef("¯", 0.600, 0.600, 0.600, 0.600, 0.552, 0.552, 0.552, 0.552, 0.500, 0.500, 0.500, 0.500),
					new CharRef("°", 0.600, 0.600, 0.600, 0.600, 0.400, 0.400, 0.400, 0.400, 0.400, 0.400, 0.400, 0.400),
					new CharRef("±", 0.600, 0.600, 0.600, 0.600, 0.549, 0.549, 0.549, 0.549, 0.549, 0.549, 0.549, 0.549),
					new CharRef("²", 0.600, 0.600, 0.600, 0.600, 0.333, 0.333, 0.333, 0.333, 0.300, 0.300, 0.300, 0.300),
					new CharRef("³", 0.600, 0.600, 0.600, 0.600, 0.333, 0.333, 0.333, 0.333, 0.300, 0.300, 0.300, 0.300),
					new CharRef("´", 0.600, 0.600, 0.600, 0.600, 0.333, 0.333, 0.333, 0.333, 0.333, 0.333, 0.333, 0.333),
					new CharRef("µ", 0.600, 0.600, 0.600, 0.600, 0.576, 0.576, 0.576, 0.576, 0.576, 0.576, 0.576, 0.576),
					new CharRef("¶", 0.600, 0.600, 0.600, 0.600, 0.537, 0.556, 0.537, 0.556, 0.453, 0.540, 0.523, 0.500),
					new CharRef("·", 0.600, 0.600, 0.600, 0.600, 0.333, 0.333, 0.333, 0.333, 0.333, 0.333, 0.250, 0.250),
					new CharRef("¸", 0.600, 0.600, 0.600, 0.600, 0.333, 0.333, 0.333, 0.333, 0.333, 0.333, 0.333, 0.333),
					new CharRef("¹", 0.600, 0.600, 0.600, 0.600, 0.333, 0.333, 0.333, 0.333, 0.300, 0.300, 0.300, 0.300),
					new CharRef("º", 0.600, 0.600, 0.600, 0.600, 0.365, 0.365, 0.365, 0.365, 0.310, 0.330, 0.310, 0.300),
					new CharRef("»", 0.600, 0.600, 0.600, 0.600, 0.556, 0.556, 0.556, 0.556, 0.500, 0.500, 0.500, 0.500),
					new CharRef("¼", 0.600, 0.600, 0.600, 0.600, 0.834, 0.834, 0.834, 0.834, 0.750, 0.750, 0.750, 0.750),
					new CharRef("½", 0.600, 0.600, 0.600, 0.600, 0.834, 0.834, 0.834, 0.834, 0.750, 0.750, 0.750, 0.750),
					new CharRef("¾", 0.600, 0.600, 0.600, 0.600, 0.834, 0.834, 0.834, 0.834, 0.750, 0.750, 0.750, 0.750),
					new CharRef("¿", 0.600, 0.600, 0.600, 0.600, 0.611, 0.611, 0.611, 0.611, 0.444, 0.500, 0.500, 0.500),
					new CharRef("À", 0.600, 0.600, 0.600, 0.600, 0.667, 0.722, 0.667, 0.722, 0.722, 0.722, 0.611, 0.667),
					new CharRef("Á", 0.600, 0.600, 0.600, 0.600, 0.667, 0.722, 0.667, 0.722, 0.722, 0.722, 0.611, 0.667),
					new CharRef("Â", 0.600, 0.600, 0.600, 0.600, 0.667, 0.722, 0.667, 0.722, 0.722, 0.722, 0.611, 0.667),
					new CharRef("Ã", 0.600, 0.600, 0.600, 0.600, 0.667, 0.722, 0.667, 0.722, 0.722, 0.722, 0.611, 0.667),
					new CharRef("Ä", 0.600, 0.600, 0.600, 0.600, 0.667, 0.722, 0.667, 0.722, 0.722, 0.722, 0.611, 0.667),
					new CharRef("Å", 0.600, 0.600, 0.600, 0.600, 0.667, 0.722, 0.667, 0.722, 0.722, 0.722, 0.611, 0.667),
					new CharRef("Æ", 0.600, 0.600, 0.600, 0.600, 1.000, 1.000, 1.000, 1.000, 0.889, 1.000, 0.889, 0.944),
					new CharRef("Ç", 0.600, 0.600, 0.600, 0.600, 0.722, 0.722, 0.722, 0.722, 0.667, 0.722, 0.667, 0.667),
					new CharRef("È", 0.600, 0.600, 0.600, 0.600, 0.667, 0.667, 0.667, 0.667, 0.611, 0.667, 0.611, 0.667),
					new CharRef("É", 0.600, 0.600, 0.600, 0.600, 0.667, 0.667, 0.667, 0.667, 0.611, 0.667, 0.611, 0.667),
					new CharRef("Ê", 0.600, 0.600, 0.600, 0.600, 0.667, 0.667, 0.667, 0.667, 0.611, 0.667, 0.611, 0.667),
					new CharRef("Ë", 0.600, 0.600, 0.600, 0.600, 0.667, 0.667, 0.667, 0.667, 0.611, 0.667, 0.611, 0.667),
					new CharRef("Ì", 0.600, 0.600, 0.600, 0.600, 0.278, 0.278, 0.278, 0.278, 0.333, 0.389, 0.333, 0.389),
					new CharRef("Í", 0.600, 0.600, 0.600, 0.600, 0.278, 0.278, 0.278, 0.278, 0.333, 0.389, 0.333, 0.389),
					new CharRef("Î", 0.600, 0.600, 0.600, 0.600, 0.278, 0.278, 0.278, 0.278, 0.333, 0.389, 0.333, 0.389),
					new CharRef("Ï", 0.600, 0.600, 0.600, 0.600, 0.278, 0.278, 0.278, 0.278, 0.333, 0.389, 0.333, 0.389),
					new CharRef("Ð", 0.600, 0.600, 0.600, 0.600, 0.722, 0.722, 0.722, 0.722, 0.722, 0.722, 0.722, 0.722),
					new CharRef("Ñ", 0.600, 0.600, 0.600, 0.600, 0.722, 0.722, 0.722, 0.722, 0.722, 0.722, 0.667, 0.722),
					new CharRef("Ò", 0.600, 0.600, 0.600, 0.600, 0.778, 0.778, 0.778, 0.778, 0.722, 0.778, 0.722, 0.722),
					new CharRef("Ó", 0.600, 0.600, 0.600, 0.600, 0.778, 0.778, 0.778, 0.778, 0.722, 0.778, 0.722, 0.722),
					new CharRef("Ô", 0.600, 0.600, 0.600, 0.600, 0.778, 0.778, 0.778, 0.778, 0.722, 0.778, 0.722, 0.722),
					new CharRef("Õ", 0.600, 0.600, 0.600, 0.600, 0.778, 0.778, 0.778, 0.778, 0.722, 0.778, 0.722, 0.722),
					new CharRef("Ö", 0.600, 0.600, 0.600, 0.600, 0.778, 0.778, 0.778, 0.778, 0.722, 0.778, 0.722, 0.722),
					new CharRef("×", 0.600, 0.600, 0.600, 0.600, 0.584, 0.584, 0.584, 0.584, 0.564, 0.570, 0.675, 0.570),
					new CharRef("Ø", 0.600, 0.600, 0.600, 0.600, 0.778, 0.778, 0.778, 0.778, 0.722, 0.778, 0.722, 0.722),
					new CharRef("Ù", 0.600, 0.600, 0.600, 0.600, 0.722, 0.722, 0.722, 0.722, 0.722, 0.722, 0.722, 0.722),
					new CharRef("Ú", 0.600, 0.600, 0.600, 0.600, 0.722, 0.722, 0.722, 0.722, 0.722, 0.722, 0.722, 0.722),
					new CharRef("Û", 0.600, 0.600, 0.600, 0.600, 0.722, 0.722, 0.722, 0.722, 0.722, 0.722, 0.722, 0.722),
					new CharRef("Ü", 0.600, 0.600, 0.600, 0.600, 0.722, 0.722, 0.722, 0.722, 0.722, 0.722, 0.722, 0.722),
					new CharRef("Ý", 0.600, 0.600, 0.600, 0.600, 0.667, 0.667, 0.667, 0.667, 0.722, 0.722, 0.556, 0.611),
					new CharRef("Þ", 0.600, 0.600, 0.600, 0.600, 0.667, 0.667, 0.667, 0.667, 0.556, 0.611, 0.611, 0.611),
					new CharRef("ß", 0.600, 0.600, 0.600, 0.600, 0.611, 0.611, 0.611, 0.611, 0.500, 0.556, 0.500, 0.500),
					new CharRef("à", 0.600, 0.600, 0.600, 0.600, 0.556, 0.556, 0.556, 0.556, 0.444, 0.500, 0.500, 0.500),
					new CharRef("á", 0.600, 0.600, 0.600, 0.600, 0.556, 0.556, 0.556, 0.556, 0.444, 0.500, 0.500, 0.500),
					new CharRef("â", 0.600, 0.600, 0.600, 0.600, 0.556, 0.556, 0.556, 0.556, 0.444, 0.500, 0.500, 0.500),
					new CharRef("ã", 0.600, 0.600, 0.600, 0.600, 0.556, 0.556, 0.556, 0.556, 0.444, 0.500, 0.500, 0.500),
					new CharRef("ä", 0.600, 0.600, 0.600, 0.600, 0.556, 0.556, 0.556, 0.556, 0.444, 0.500, 0.500, 0.500),
					new CharRef("å", 0.600, 0.600, 0.600, 0.600, 0.556, 0.556, 0.556, 0.556, 0.444, 0.500, 0.500, 0.500),
					new CharRef("æ", 0.600, 0.600, 0.600, 0.600, 0.889, 0.889, 0.889, 0.889, 0.667, 0.722, 0.667, 0.722),
					new CharRef("ç", 0.600, 0.600, 0.600, 0.600, 0.500, 0.556, 0.500, 0.556, 0.444, 0.444, 0.444, 0.444),
					new CharRef("è", 0.600, 0.600, 0.600, 0.600, 0.556, 0.556, 0.556, 0.556, 0.444, 0.444, 0.444, 0.444),
					new CharRef("é", 0.600, 0.600, 0.600, 0.600, 0.556, 0.556, 0.556, 0.556, 0.444, 0.444, 0.444, 0.444),
					new CharRef("ê", 0.600, 0.600, 0.600, 0.600, 0.556, 0.556, 0.556, 0.556, 0.444, 0.444, 0.444, 0.444),
					new CharRef("ë", 0.600, 0.600, 0.600, 0.600, 0.556, 0.556, 0.556, 0.556, 0.444, 0.444, 0.444, 0.444),
					new CharRef("ì", 0.600, 0.600, 0.600, 0.600, 0.278, 0.278, 0.278, 0.278, 0.278, 0.278, 0.278, 0.278),
					new CharRef("í", 0.600, 0.600, 0.600, 0.600, 0.278, 0.278, 0.278, 0.278, 0.278, 0.278, 0.278, 0.278),
					new CharRef("î", 0.600, 0.600, 0.600, 0.600, 0.278, 0.278, 0.278, 0.278, 0.278, 0.278, 0.278, 0.278),
					new CharRef("ï", 0.600, 0.600, 0.600, 0.600, 0.278, 0.278, 0.278, 0.278, 0.278, 0.278, 0.278, 0.278),
					new CharRef("ð", 0.600, 0.600, 0.600, 0.600, 0.556, 0.611, 0.556, 0.611, 0.500, 0.500, 0.500, 0.500),
					new CharRef("ñ", 0.600, 0.600, 0.600, 0.600, 0.556, 0.611, 0.556, 0.611, 0.500, 0.556, 0.500, 0.556),
					new CharRef("ò", 0.600, 0.600, 0.600, 0.600, 0.556, 0.611, 0.556, 0.611, 0.500, 0.500, 0.500, 0.500),
					new CharRef("ó", 0.600, 0.600, 0.600, 0.600, 0.556, 0.611, 0.556, 0.611, 0.500, 0.500, 0.500, 0.500),
					new CharRef("ô", 0.600, 0.600, 0.600, 0.600, 0.556, 0.611, 0.556, 0.611, 0.500, 0.500, 0.500, 0.500),
					new CharRef("õ", 0.600, 0.600, 0.600, 0.600, 0.556, 0.611, 0.556, 0.611, 0.500, 0.500, 0.500, 0.500),
					new CharRef("ö", 0.600, 0.600, 0.600, 0.600, 0.556, 0.611, 0.556, 0.611, 0.500, 0.500, 0.500, 0.500),
					new CharRef("÷", 0.600, 0.600, 0.600, 0.600, 0.549, 0.549, 0.549, 0.549, 0.549, 0.549, 0.549, 0.549),
					new CharRef("ø", 0.600, 0.600, 0.600, 0.600, 0.611, 0.611, 0.611, 0.611, 0.500, 0.500, 0.500, 0.500),
					new CharRef("ù", 0.600, 0.600, 0.600, 0.600, 0.556, 0.611, 0.556, 0.611, 0.500, 0.556, 0.500, 0.556),
					new CharRef("ú", 0.600, 0.600, 0.600, 0.600, 0.556, 0.611, 0.556, 0.611, 0.500, 0.556, 0.500, 0.556),
					new CharRef("û", 0.600, 0.600, 0.600, 0.600, 0.556, 0.611, 0.556, 0.611, 0.500, 0.556, 0.500, 0.556),
					new CharRef("ü", 0.600, 0.600, 0.600, 0.600, 0.556, 0.611, 0.556, 0.611, 0.500, 0.556, 0.500, 0.556),
					new CharRef("ý", 0.600, 0.600, 0.600, 0.600, 0.500, 0.556, 0.500, 0.556, 0.500, 0.500, 0.444, 0.444),
					new CharRef("þ", 0.600, 0.600, 0.600, 0.600, 0.556, 0.611, 0.556, 0.611, 0.500, 0.556, 0.500, 0.500),
					new CharRef("ÿ", 0.600, 0.600, 0.600, 0.600, 0.500, 0.556, 0.500, 0.556, 0.500, 0.500, 0.444, 0.444)
					];
				
				
				// Determines width of an individual character
				function get_char_width(character, font, style, size) {
					var width;
					
					// Get current character width in the noted font size and style
					var charCode = character.charCodeAt(0);
					
					if (charCode >= 32 && charCode <= 255 && charList[charCode]) {
						if (font === "courier") {
							if (style === "normal") {
								width = charList[charCode].courier.normal;
							} else if (style === "bold") {
								width = charList[charCode].courier.bold;
							} else if (style === "italic") {
								width = charList[charCode].courier.italic;
							} else if (style === "bolditalic") {
								width = charList[charCode].courier.bolditalic;
							}
						} else if (font === "helvetica") {
							if (style === "normal") {
								width = charList[charCode].helvetica.normal;
							} else if (style === "bold") {
								width = charList[charCode].helvetica.bold;
							} else if (style === "italic") {
								width = charList[charCode].helvetica.italic;
							} else if (style === "bolditalic") {
								width = charList[charCode].helvetica.bolditalic;
							}
						} else if (font === "times") {
							if (style === "normal") {
								width = charList[charCode].times.normal;
							} else if (style === "bold") {
								width = charList[charCode].times.bold;
							} else if (style === "italic") {
								width = charList[charCode].times.italic;
							} else if (style === "bolditalic") {
								width = charList[charCode].times.bolditalic;
							}
						} else {
							width = 1; // Over-estimate width to ensure proper fit
						}
					} else {
						width = 1; // Over-estimate width to ensure proper fit
					}
					
					// Correct size for font
					width = width * size;
					
					//Adjust width for desired unit
					width = ptToMm(width);
					
					return width;
				}
				
				
				var returnLine = new Line();
				var character, color, font, size, style, width, group;
				
				for (var i = 0; i < lines.length; i++) {
					for (var j = 0; j < lines[i].groups.length; j++) {
						font = lines[i].groups[j].font;
						color = lines[i].groups[j].color;
						size = lines[i].groups[j].size;
						style = lines[i].groups[j].style;
						
						for (var k = 0; k < lines[i].groups[j].text.length; k++) {
							character = lines[i].groups[j].text.charAt(k);
							
							group = new Group();
							
							group.color = color;
							group.font = font;
							group.text = character;
							group.style = style;
							group.size = size;
							group.width = get_char_width(character, font, style, size);
							
							returnLine.groups.push(group);
						}
					}
				}
				
				return returnLine;
			}
			
			
			// Processes text content to split it into multiple lines to fit within
			// a specified cell width
			function resize_content(cell, maxWidth) {
				var height, width;
				var parHeight = 0;
				var parWidth = 0;
				
				// Cycle through paragraphs and split single line into multiple as needed
				for (var i = 0; i < cell.content.paragraphs.length; i++) {
					// Recompile multiple lines into a single one
					var tempLine = compile_lines(cell.content.paragraphs[i].lines);
					var lines = split_line(tempLine, maxWidth);
					
					// Add back resized lines
					cell.content.paragraphs[i].lines = lines;
					
					// Add height and weight to the paragraph
					height = 0;
					width = 0;
					
					for (var j = 0; j < lines.length; j++) {
						// Excludes line height from first line
						height += j === 0 ? lines[j].height : lines[j].height * 1.15;
						width = lines[j].width > width ? lines[j].width : width;
					}
					
					cell.content.paragraphs[i].height = height;
					cell.content.paragraphs[i].width = width;
					
					// Records the maximum width and height from each paragraph
					parHeight += height;
					parWidth = width > parWidth ? width : parWidth;
				}
				
				// Assign maximum width and height to the content
				cell.content.height = parHeight;
				cell.content.width = parWidth;
				
				return cell;
			}
			
			
			// Cycle through each row to each cell
			var row, cell, maxWidth;
				
			for (var i = 0; i < t.rows.length; i++) {
				row = t.rows[i];
				
				for (var j = 0; j < row.cells.length; j++) {
					cell = row.cells[j];
					
					// Maximum width the cell content can have
					maxWidth = cell.width - cell.padding.l - cell.padding.r;
					
					// Resize content to fit width (if contains text)
					if (cell.type === "text") {
						cell = resize_content(cell, maxWidth);
					}
				}
			}
			
			return t;
		}
		
		
		// Determines row heights and assigns heights to each cell
		function assign_row_size(t) {
			// Determines each row size
			function determine_row_size(t) {
				// Cycle through cells and determine row size for each row
				// Ignores cells with rowSpan
				var maxHeight, contHeight, cell;
				
				for (var i = 0; i < t.rows.length; i++) {
					maxHeight = 0;
					
					for (var j = 0; j < t.rows[i].cells.length; j++) {
						cell = t.rows[i].cells[j];
						padding = cell.padding.t + cell.padding.b;
						
						if (cell.rowSpan === 1) {
							contHeight = cell.content.height;
							
							if (contHeight + padding > maxHeight) {
								maxHeight = contHeight + padding;
							}
						}
					}
					
					t.rows[i].height = maxHeight;
				}
				
				// Repeats cycle through rows to see if rowSpan will impact height
				// If height of rowSpan cell exceeds available height, add difference
				// between affected rows evenly
				var padding, difference, splitDiff;
				
				for (var i = 0; i < t.rows.length; i++) {
					var length = t.rows[i].cells.length
					for (var j = 0; j < length; j++) {
						cell = t.rows[i].cells[j];
						padding = cell.padding.t + cell.padding.b
						
						if (cell.rowSpan > 1) {
							// Check if cell contents fits in available space
							contHeight = cell.content.height;
							
							// Cycle through each column in the rowSpan and add heights
							maxHeight = 0;
							
							for (var k = 0; k < cell.rowSpan; k++) {
								maxHeight += t.rows[i + k].height;
							}
							
							if (contHeight + padding > maxHeight) {
								// Determine how much to add to each row height
								difference = contHeight - (maxHeight - padding);
								splitDiff = difference / cell.rowSpan;
								
								// Add the split difference to each impact row
								for (var k = 0; k < cell.rowSpan; k++) {
									t.rows[i + k].height += splitDiff;
								}
							}
						}
					}
				}
				
				return t;
			}
			
			
			// Assigns a cell height to each cell
			function assign_row_height(t) {
				var cell, height;
				
				for (var i = 0; i < t.rows.length; i++) {
					for (var j = 0; j < t.rows[i].cells.length; j++) {
						cell = t.rows[i].cells[j];
						
						if (cell.rowSpan === 1) {
							height = t.rows[i].height;
						} else {
							// Cycle through each column in the rowSpan and add heights
							height = 0;
							
							for (var k = 0; k < cell.rowSpan; k++) {
								height += t.rows[i + k].height;
							}
						}
						
						cell.height = height;
					}
				}
				
				return t;
			}
			
			
			// Determine and assign row heights
			table = determine_row_size(t);
			
			// Assigns height to each cell
			table = assign_row_height(t);
			
			return t;
		}
		
		
		table = assign_cell_index(table);
		
		table = assign_cell_width(table);
		
		table = resize_cells(table);
		
		table = assign_row_size(table);
		
		return table;
	}
	
	
	// Splits table into multiple tables for each page
	function merge_and_split_tables(body, head, foot) {
		function get_table_height(t) {
			var height = 0;
			
			for (var i = 0; i < t.rows.length; i++) {
				height += t.rows[i].height;
			}
			
			return height;
		}
		
		var bodyH = 0;
		
		if (body) {
			bodyH = get_table_height(body);
		} else {
			body: {rows: []};
		}
		
		var headH = 0;
		
		if (head) {
			headH = get_table_height(head);
		} else {
			head = {rows: []};
		}
		
		var footH = 0;
		
		if (foot) {
			footH = get_table_height(foot);
		} else {
			foot = {rows: []};
		}
		
		
		var tables = [];
		var maxHeight = pageH - (margin * 2);
		
		// Checks if header + foot + each body row can fit available height
		// If it does not fit, returns all content as single table
		for (var i = 0; i < body.rows.length; i++) {
			if (headH + footH + body.rows[i].height > maxHeight) {
				var message = "The height of the header, footer, and a " +
							  "table row exceeds page height; full table " +
							  "has been outputted";
				console.warn(message);
				
				tables.push({rows: head.rows.concat(body.rows, foot.rows)});
				
				return tables;
			}
		}
		
		// Creates multiple tables that will each fit on one page
		var tabHeight = headH + footH;
		var lastSplit = 0;
		
		for (var i = 0; i < body.rows.length; i++) {
			tabHeight += body.rows[i].height;
			
			if (tabHeight > maxHeight) {
				// Create new table from the lastSplit to the previous index
				tables.push({rows: head.rows.concat(body.rows.slice(lastSplit, i), foot.rows)});
				
				// Mark the split location
				lastSplit = i;
				
				// Reset height counter (includes this current row);
				tabHeight = headH + footH + body.rows[i].height;
			} else if (i === body.rows.length - 1) {
				tables.push({rows: head.rows.concat(body.rows.slice(lastSplit), foot.rows)});
			}
		}
		
		return tables;
	}
	
	
	// Draws the provided table(s) onto the pdf
	function draw_table(doc, tables) {
		// Draws the cell border
		function draw_cell_border(cell) {
			// Draw the cell background color
			var background = cell.background;
			
			doc.setFillColor(background.r, background.g, background.b);
			doc.rect(xBox, yBox, cell.width, cell.height, 'F');
			
			// Draw the cell lines
			var style = cell.borderStyle;
			var color = cell.borderColor;
			var width = cell.borderWidth;
			
			// Width settings for double borders
			var dWidth = {t: width.t / 3, r: width.r / 3, b: width.b / 3, l: width.l / 3};
			
			var x1 = xBox;
			var x2 = xBox + cell.width;
			var y1 = yBox;
			var y2 = yBox + cell.height;
			
			// Top line
			doc.setDrawColor(color.t.r, color.t.g, color.t.b);
			
			if (style.t === "solid") {
				doc.setLineWidth(width.t);
				
				doc.line(x1 - (width.l / 2), y1, x2 + (width.r / 2), y1);
			} else if (style.t === "double") {
				doc.setLineWidth(dWidth.t);
				
				doc.line(x1 + (dWidth.l / 2), y1 + dWidth.t, x2 - (dWidth.r / 2), y1 + dWidth.t);
				doc.line(x1 - (width.l / 2), y1 - dWidth.t, x2 + (width.r / 2), y1 - dWidth.t);
			} else if (style.t === "none") {
				// Draw nothing
			}
			
			// Right line
			doc.setDrawColor(color.r.r, color.r.g, color.r.b);
			
			if (style.r === "solid") {
				doc.setLineWidth(width.r);
				
				doc.line(x2, y1 - (width.t / 2), x2, y2 + (width.b / 2));
			} else if (style.r === "double") {
				doc.setLineWidth(dWidth.r);
				
				doc.line(x2 + dWidth.r, y1 - (width.t / 2), x2 + dWidth.r, y2 + (width.b / 2));
				doc.line(x2 - dWidth.r, y1 + (dWidth.t / 2), x2 - dWidth.r, y2 - (dWidth.b / 2));
			} else if (style.r === "none") {
				// Draw nothing
			}
			
			// Bottom line
			doc.setDrawColor(color.b.r, color.b.g, color.b.b);
			
			if (style.b === "solid") {
				doc.setLineWidth(width.b);
				
				doc.line(x2 + (width.r / 2), y2, x1 - (width.l / 2), y2);
			} else if (style.b === "double") {
				doc.setLineWidth(dWidth.b);
				
				doc.line(x2 + (width.r / 2), y2 + dWidth.b, x1 - (width.l / 2), y2 + dWidth.b);
				doc.line(x2 - (dWidth.r / 2), y2 - dWidth.b, x1 + (dWidth.l / 2), y2 - dWidth.b);
			} else if (style.b === "none") {
				// Draw nothing
			}
			
			// Left line
			doc.setDrawColor(color.l.r, color.l.g, color.l.b);
			if (style.l === "solid") {
				doc.setLineWidth(width.l);
				
				doc.line(x1, y2 + (width.b / 2), x1, y1 - (width.t / 2));
			} else if (style.l === "double") {
				doc.setLineWidth(dWidth.l);
				
				doc.line(x1 + dWidth.l, y2 - (dWidth.t / 2), x1 + dWidth.l, y1 + (dWidth.t / 2));
				doc.line(x1 - dWidth.l, y2 + (width.b / 2), x1 - dWidth.l, y1 - (width.t / 2));	
			} else if (style.l === "none") {
				// Draw nothing
			}
		}
		
		
		// Draws cell content
		function draw_cell_content(cell) {
			var content = cell.content;
			var paragraph, line, group, lineWidth, maxSize, 
				font, style, size, color;
			
			var contentHeight = content.height;
			var contentWidth = content.width;
			var cellHeight = cell.height;
			var cellWidth = cell.width;
			var vAlign = cell.vAlign;
			var hAlign = cell.hAlign;
			var padding = cell.padding;
			var xCont, yCont, yShift;
			
			// Starting Y position depends on vAlign
			if (vAlign === "top") {
				yCont = yBox + padding.t;
			} else if (vAlign === "middle") {
				yCont = yBox + ((cellHeight - contentHeight) / 2);
			} else if (vAlign === "bottom") {
				yCont = yBox + (cellHeight - contentHeight - padding.b);
			}
			
			// Processing for text content
			if (cell.type === "text") {
				for (var i = 0; i < content.paragraphs.length; i++) {
					paragraph = content.paragraphs[i];
					
					for (var j = 0; j < paragraph.lines.length; j++) {
						line = paragraph.lines[j];
						
						// Starting x position depends on hAlign
						if (hAlign === "left") {
							xCont = xBox + padding.l;
						} else if (hAlign === "center") {
							xCont = xBox + ((cellWidth - line.width) / 2);
						} else if (hAlign === "right") {
							xCont = xBox + (cellWidth - line.width) - padding.r;
						}
						
						// Add current line height to y coord (excludes line height on first line)
						maxSize = line.height;
						
						if (j === 0) {
							yCont += maxSize;
						} else {
							yCont += maxSize * lineHeight;
						}
						
						// Adjusts position to account for glyph baseline =/= em box bottom
						yShift = maxSize * 0.15;
						
						for (var k = 0; k < line.groups.length; k++) {
							group = line.groups[k];
							
							txt = group.text;
							color = group.color;
							font = group.font;
							size = group.size;
							style = group.style;
							
							doc.setTextColor(color.r, color.g, color.b);
							doc.setFont(font);
							doc.setFontSize(size);
							doc.setFontType(style);
							
							doc.text(xCont, yCont - yShift, txt);
							
							// Advance x to next position
							xCont += group.width;
						}
					}
				}
			} else if (cell.type === "image") {
				// Starting x position depends on hAlign
				if (hAlign === "left") {
					xCont = xBox + padding.l;
				} else if (hAlign === "center") {
					xCont = xBox + ((cellWidth - contentWidth) / 2)
				} else if (hAlign === "right") {
					xCont = xBox + (cellWidth - contentWidth) - padding.r;
				}
				
				doc.addImage(content.image, content.fileType, xCont, yCont, contentWidth, contentHeight);
			}
		}
		
		
		var table, row, cell;
		var firstPage = true;
		var xBox = margin;
		var yBox = margin;
		
		for (var i = 0; i < tables.length; i++) {
			table = tables[i];
			
			if (!firstPage) {
				doc.addPage();
			} else {
				firstPage = false;
			}
			
			for (var j = 0; j < table.rows.length; j++) {
				row = table.rows[j];
				
				for (var k = 0; k < row.cells.length; k++) {
					cell = row.cells[k];
					
					// Set the x cursor
					xBox = margin;
					
					for (var l = 0; l < cell.index; l++) {
						xBox += colSize[l];
					}
					
					// Draw cell border
					draw_cell_border(cell);
					
					// Draw cell content
					draw_cell_content(cell);
					
				}
				
				// Advance the y cursor
				yBox += row.height;
				
				// Reset the x cursor
				xBox = margin;
			}
			
			// Reset cursors
			xBox = margin;
			yBox = margin;
		}
	}
	
	
	// Gets PDF instance
	var doc = this;
	
	// Collects relevant document settings for table generation
	var pageH = doc.internal.pageSize.height;
	var pageW = doc.internal.pageSize.width;
	var tableWidth;
	var colSize;
	var margin;
	var lineHeight = 1.15;
	
	if ("tableWidth" in options) {
		tableWidth = options.tableWidth;
	}
	
	if ("colSize" in options) {
		colSize = options.colSize;
	}
	
	if ("margin" in options) {
		margin = options.margin;
	}
	
	// Compiles table body and processes it for PDF insertion
	var body = assemble_user_table(body);
	body = process_table(body);
	
	// Compiles table header and footer, if present
	var head;
	
	if ("head" in options) {
		head = assemble_user_table(options.head);
		head = process_table(head);
	}
	
	var foot;
	
	if ("foot" in options) {
		foot = assemble_user_table(options.foot);
		foot = process_table(foot);
	}
	
	var tables = merge_and_split_tables(body, head, foot);
	
	// Print tables
	draw_table(doc, tables);
}

// BOUNDING BOX for the Helvetica font needs to shift 9-15% from the baseline
/*
	Table level properties
		head - table of the header content
		foot - table of the footer content
		colSize - how to space columns (specified width for now)
		tableWidth - table width
		margin
		x
		y
	
	
	TABLE INPUT EXAMPLES
		NO STYLING
		[["Cell 1", "Cell 2", "Cell 3"],
		 ["Cell 1", "Cell 2", "Cell 3"]]
		
		CELL LEVEL STYLING
		[[{cell: "Cell 1", style: font:}, {cell: "Cell 2", etc.}, {cell: "Cell 3", etc.}]
		 [{cell: "Cell 1", etc.}, {cell: "Cell 2", etc.}, {cell: "Cell 3", etc.}]]
		
		ROW LEVEL STYLING
		[{cells: [{cell: "Cell 1", cell styles, etc.}, {cell: "Cell 2", etc.}, {cell: "Cell 3", etc.}],
		 {cell styles, etc.},
		 {cells: [{cell: "Cell 1", cell styles, etc.}, {cell: "Cell 2", etc.}, {cell: "Cell 3", etc.}],
		 {cell styles, etc.}]
		
		TABLE LEVEL STYLING
		{rows: [[{cell: "Cell 1", cell styles, etc.}, {cell: "Cell 2", etc.}, {cell: "Cell 3", etc.}]
				[{cell: "Cell 1", etc.}, {cell: "Cell 2", etc.}, {cell: "Cell 3", etc.}]],
		 {cell styles, etc.}}
	
	
	CELL DATA EXAMPLES
		PLAIN TEXT
		"Cell 1"
		
		TEXT WITH STYLING
		{text: "Cell 1", styles}
		
		TEXT WITH MULTIPLE STYLES
		[{text: "Cell 1", styles}, {text: "Cell 2", styles}]
		
		MULTILINE TEXT
		As above, but line breaks are marked with "\n" or "<br>"
	
*/
	