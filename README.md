# Google Apps Script to pull data from Jira

## Installation

1. Create Google Sheet
1. Name one tab "Data"
1. Go to Tools > Script editor
1. Pull code from repo
1. Add file config.gs with the contents below:
1. Go to Edit > Current project's triggers
1. Add a trigger that runs `main` on `Time-driven` events with `Day timer` and select a time period to run

```
var Config = {
  jira: {
    url: 'http://jira.internal.babbel.com/rest/api/2',
    token: 'INSERT API TOKEN HERE',
    paths: {
      issue: '/issue',
      search: '/search',
      filter: '/filter'
    }
  }
};
```
