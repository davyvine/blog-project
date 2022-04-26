// create excerpts - trim out body content, str=entire blog body, length=how many char to trim, delim=use empty space at the end, appendix=...
exports.smartTrim = (str, length, delim, appendix) => {
   if(str.length <= length) return str;

   var trimmedStr = str.substr(0, length + delim.length);

   var lastDelimIndex = trimmedStr.lastIndexOf(delim);
   if(lastDelimIndex >= 0) trimmedStr = trimmedStr.substr(0, lastDelimIndex);

   if(trimmedStr) trimmedStr += appendix;
   return trimmedStr;
}