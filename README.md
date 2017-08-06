# jsPDF Toolbox (jsPDF-TB)
A repository to hold various tools to extend functionality of jsPDF, 
including table design and string measurement.

## Comments/Disclaimer
These tools tend to be functionality I designed for other projects. At 
some point the intention will be to roll it all into a proper jsPDF 
plugin. As a hobby-programmer I cannot promise everything will adhere 
to the *standards*, but I certainly try to and am happy to hear any 
suggestions.

## Dependencies
This library requires jsPDF. Details for usage can be found at 
[their repository](https://github.com/MrRio/jsPDF).

## Usage
1. Include the JavaScript files in your webpage
```html
<script src="jspdf.min.js"></script>
<script src="jspdf-tb.js"></script>
```
2. Any of the functions can be accessed by calling them from a jsPDF 
object
```javascript
var doc = new jsPDF(); // Creates a jsPDF object

// Measure the length of a text string
pdf.getStringWidth("This is a test string", "helvetica", "normal", 12); // 100.032 pt
```

## Style Guide
This library attempts to follow the 
[airbnb style guide](https://github.com/airbnb/javascript), with the 
following exceptions:
- Indents are done with 4 spaces, rather than 2 (personal preference for 
readability)
- Strings are enclosed in double quotes (single quotes are used more 
often in strings and would require excessive escaping)

## License (LGPL-3.0)
This program is free software: you can redistribute it and/or modify 
it under the terms of the GNU General Public License as published by 
the Free Software Foundation, either version 3 of the License, or (at 
your option) any later version.

This program is distributed in the hope that it will be useful, but 
WITHOUT ANY WARRANTY; without even the implied warranty of 
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU 
General Public License for more details.

You should have received a copy of the GNU General Public License 
along with this program.  If not, see <http://www.gnu.org/licenses/>.

If an alternative license is required for your project, please contact 
the owner of this repository.
