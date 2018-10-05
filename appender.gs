// Global constants
var SHEET_DATA = "Data";

var Appender = (function() {
  // Public members  
  var appender = {};
  appender.append = append;
  return appender;
  
  // Private members
  function append(items) {
    var values = buildTable(items);
    var sheet = getSheetReference(SHEET_DATA);
    for (var i=0; i<values.length; i++) {
      sheet.appendRow(values[i]);
    }
  }
  
  // Returns a table based on the items in the payload
  function buildTable(items) {
    var values = [];
    var row = [];
    var reportDate = getReportDate();
    var timeStamp = getTimestamp();
    for (var i=0; i<items.length; i++) {
      row = [];
      row.push(items[i].id);
      row.push(items[i].key);
      row.push(items[i].projectKey);
      row.push(items[i].projectName);
      row.push(items[i].summary);
      row.push(items[i].issueType);
      row.push(items[i].created);
      row.push(items[i].updated);
      row.push(reportDate);
      row.push(timeStamp);
      values.push(row);
    }
    return values;
  }
  
  // Returns report date
  function getReportDate() {
    return DateUtil.getCurrentDateLocal();
  }
  
  // Returns a timestamp
  function getTimestamp() {
    return DateUtil.getCurrentDateTimeLocal();
  }
  
  // Returns a reference to the specified sheet
  function getSheetReference(sheetName) {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    return spreadsheet.getSheetByName(sheetName);
  }
})()