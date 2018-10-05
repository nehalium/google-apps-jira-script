// Main entry point of the application
function main() { 
  var data = Jira.getData(getReportDate());
  Appender.append(data.items);
}

// Returns
function getReportDate() {
  return DateUtil.formatDateLocal(DateUtil.addMonths(new Date(), -6, 1));
}
