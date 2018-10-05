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
    var jql = "";
    jql += "project+in+(INFR,ENGSTRAT,MAF,DTH,DATAENG,INTINFRA,LRN,MOB,MI,ARTOO,SALT,TNT)";
    jql += "+AND+status+in+(Requested,+%22Ready+for+development%22,+%22In+Development%22,+%22To+Do%22,";
    jql += "+Open,+In_Progress,+%22Ready+for+QA%22,+New,+%22QA+Ready%22,+%22In+Review%22,+%22Ready+for+Acceptance%22,";
    jql += "+%22Ready+For+Review%22,+%22Not+Yet+Started%22,+Started,+%22Waiting+for+deployment%22,+%22Not+ready%22,";
    jql += "+%22READY+FOR+DEPLOYMENT%22,+%22In+QA%22,+%22Waiting+for+Info%22,+%22In+Progress%22)";
    jql += "+AND+created+%3C+" + beforeDate;
    jql += "+ORDER+BY+project+ASC,+created+ASC";
    return jql;
  }
  
  // Returns the URI query for the APP call
  function getQuery(jql, startAt, maxResults) {
    var query = "";
    query += "?jql=" + jql;
    query += "&fields=id,key,project,summary,issuetype,created,updated";
    query += "&startAt=" + startAt;
    query += "&maxResults=" + maxResults;
    return query;
  }
})()