var Jira = (function() {
  // Public members  
  var jira = {};
  jira.getData = getData;
  return jira;
  
  // Private members
  function getData(beforeDate) {
    var jql = getJQL(beforeDate);
    var startAt = 0;
    var maxResults = 100;
    var count = 0;
    var items = [];
    
    while(true) {
      var result = executeQuery(getQuery(jql, startAt, maxResults));
      
      if (result.issues.length === 0) {
        break;
      }
      
      for (var i=0; i<result.issues.length; i++) {
        items.push(buildTuple(result.issues[i]));
        count++;
      }
      
      startAt += maxResults;
    }
    
    return {
      count: count,
      items: items
    };
  }
  
  // Returns a tuple based on the specified issue
  function buildTuple(issue) {
    return {
      id: issue.id,
      key: issue.key,
      projectKey: issue.fields.project.key,
      projectName: issue.fields.project.name,
      summary: issue.fields.summary,
      issueType: issue.fields.issuetype.name,
      created: issue.fields.created,
      updated: issue.fields.updated
    };
  }
  
  // Calls the API and returns a JSON result
  function executeQuery(query) {
    var options = {
      method: 'GET',
      muteHttpExceptions: true,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Config.jira.token
      }
    };
    var response = UrlFetchApp.fetch(Config.jira.url + Config.jira.paths.search + query, options);
    var json = response.getContentText();
    return JSON.parse(json);
  }
  
  // Returns JQL for the API call
  function getJQL(beforeDate) {
    var filterDate = beforeDate || getReportDate();
    var jql = "";
    jql += "project+in+(" + Config.jira.query.projects + ")";
    jql += "+AND+status+in+(" + Config.jira.query.status + ")";
    jql += "+AND+created+%3C+" + filterDate;
    jql += "+ORDER+BY+project+ASC,+created+ASC";
    return jql;
  }

  // Returns the date until which the report should gather data
  function getReportDate() {
    return DateUtil.formatDateLocal(DateUtil.addMonths(new Date(), -Config.jira.monthsToLookBack, 1));
  }
  
  // Returns the URI query for the APP call
  function getQuery(jql, startAt, maxResults) {
    var query = "";
    query += "?jql=" + jql;
    query += "&fields=" + Config.jira.query.fields;
    query += "&startAt=" + startAt;
    query += "&maxResults=" + maxResults;
    return query;
  }
})()