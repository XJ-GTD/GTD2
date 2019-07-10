//MWXING_GITHUB_EVENTS_WEBHOOK002_V1_4
function shouldclean(datasource)
{
  var result = {};
  // filter source code here start
  var input = JSON.parse(datasource);

  if (input !== undefined && input['userId'] && input['event'] && (input['webhook'] == 'github') && !input['location'] && !input['deviceId'] && !input['xunfeiyun']) {
    return true;
  }

  // filter source code here end
  return false;
}

function clean(datasource)
{
  var result = {};
  print('Start Nashorn Javascript processing...');
  print(datasource);
  // filter source code here start
  var input = JSON.parse(datasource);

  var userId = input['userId'];
  var event = input['event'];
  var repository = event['output']['payload']['repository'];

  var commits = event['output']['payload']['commits'];
  var compare = event['output']['payload']['compare'];
  var headcommit = event['output']['payload']['head_commit'];

  //Travics-CI events
  var action = event['output']['payload']['action'];
  var actionevent = event['output']['payload']['check_run']
    || event['output']['payload']['check_suite']
    || event['output']['payload']['create']
    || event['output']['payload']['delete']
    || event['output']['payload']['member']
    || event['output']['payload']['pull_request']
    || event['output']['payload']['push'];

  var to = new Array();
  to.push(userId);

  var title = "";
  var content = "";
  var url = "";

  if (repository && headcommit && compare) {
    title = "GitHub - " + repository['full_name'];
    content = headcommit['committer']['username'] + ": " + headcommit['message'];
    url = headcommit['url'];
  }

  if (repository && action && actionevent) {
    title = "Travis-CI - " + repository['full_name'] + "[" + actionevent['head_branch'] + "]";
    content = actionevent['app']['description'];
    url = actionevent['app']['external_url'];
  }

  var push = {
    title: title,
    content: content,
    extras: {
      event: "MWXING_NOTIFICATION_EVENT",
      dependson: "on.homepage.init",
      eventhandler: "on.urlopen.message.click",
      eventdatafrom: "server",
      eventdata: JSON.stringify({url: url})
    }
  };

  var standardnext = {};

  standardnext.announceTo = to;
  standardnext.announceType = 'agenda_from_share';
  standardnext.announceContent = {mwxing:{},sms:{},push:push};

  print(standardnext);

  // filter source code here end
  return JSON.stringify(standardnext);
}
