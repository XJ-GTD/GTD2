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

  var output = {};
  var formatDateTime = function(date) {
    return date.getFullYear() + '/' + (date.getMonth()+1) + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  }

  var userId = input['userId'];
  var event = input['event'];
  var repository = event['output']['payload']['repository'];

  var commits = event['output']['payload']['commits'];
  var compare = event['output']['payload']['compare'];
  var headcommit = event['output']['payload']['head_commit'];

  //Travics-CI events
  var action = event['output']['payload']['action'];
  var actioncheckrun = event['output']['payload']['check_run'];
  var actionchecksuite = event['output']['payload']['check_suite'];
  var actioncreate = event['output']['payload']['create'];
  var actiondelete = event['output']['payload']['delete'];
  var actionmember = event['output']['payload']['member'];
  var actionpullrequest = event['output']['payload']['pull_request'];
  var actionpush = event['output']['payload']['push'];
  var actionrepository = event['output']['payload']['repository'];
  var actionevent = actioncheckrun
      || actionchecksuite
      || actioncreate
      || actiondelete
      || actionmember
      || actionpullrequest
      || actionpush
      || actionrepository;

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
    if (actioncheckrun) {
      title = actioncheckrun['check_suite']['app']['name'] + " - " + actioncheckrun['output']['title'];
      content = repository['full_name'] + ": " + actioncheckrun['check_suite']['head_branch'];
      url = actionevent['details_url'];
    } else {
      //skip
    }
  }

  var push = {};

  if (title && content && url) {
    push = {
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
  }

  if (repository && headcommit && compare) {
    // 返回消息头部
    output.header = {
      version: 'V1.1',
      sender: 'xunfei',
      datetime: formatDateTime(new Date()),
      describe: ['SY']
    };

    output.content = {};

    // 保存项目跟进实例数据指示
    output.content['0'] = {
      processor: 'SY',
      option: 'SY.FO',
      parameters: {
        t: 'FOGH_INS',
        tn: 'GitHub Repository',
        k: repository['full_name'],
        kn: repository['full_name'],
        vs: JSON.stringify(repository)
      }
    };
  }

  var standardnext = {};

  standardnext.announceTo = to;
  standardnext.announceType = 'agenda_from_share';
  standardnext.announceContent = {mwxing:output,sms:{},push:push};

  print(standardnext);

  // filter source code here end
  return JSON.stringify(standardnext);
}
