// Main entry point of the application
function main() { 
  var data = Jira.getData();
  Appender.append(data.items);
}
