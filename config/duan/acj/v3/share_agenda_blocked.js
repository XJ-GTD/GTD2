function shouldclean(datasource)
{
  var result = {};
  // filter source code here start
  var input = JSON.parse(datasource);

  if (input['_context'] && input['_context'].productId === 'cn.sh.com.xj.timeApp' && input['_context'].productVersion === 'v1' && input['_context'].productVersion === 'v2') return false;

  if (input !== undefined && input['from'] && input['to'] && input['agenda'] && input['blockType']) {
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

  var from = input['from'];
  var to = new Array();
  var agenda = input['agenda'];
  var blockType = input['blockType'];

  var output = {};

  var formatDateTime = function(date) {
    return date.getFullYear() + '/' + (date.getMonth()+1) + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  }

  var fs = [];

  if (input['to'] && input['to'].length > 0) {
    to = input['to'];

    for (var id in input['to']) {
      var contacts = input['to'][id];
      fs.push({ai:contacts['ai'], mpn:contacts['mpn']});
    }
  }

  // 返回消息头部
  output.header = {
  	version: 'V1.1',
    sender: 'xunfei',
    datetime: formatDateTime(new Date()),
    describe: ['F', 'PN']
  };

  output.content = {};

  // 查询联系人指示
  output.content['0'] = {
    processor: 'F',
    option: 'F.C',
    parameters: {
      scd: {},
      fs: fs
    }
  };

  // 日程共享中断原因设置
  output.content['1'] = {
    processor: 'PN',
    option: 'PN.FB',
    parameters: {
      timestamp: Date.parse(new Date())
    },
    input: {
      textvariables: []
    }
  };

  var tousername = "";

  if (blockType === 'inblacklist') {

    //只有一人的时候
    if (to && to.length == 1) {
      tousername = to[0]['n'];

      output.content['1']['parameters']['title'] = '{touser}拒收日程[' + agenda['at'] + ']';
      output.content['1']['parameters']['text'] = '{touser}：发送广告、推销等骚扰信息，帐户将被冻结。';
      output.content['1']['parameters']['reason'] = 'IN_BLACKLIST';
      output.content['1']['parameters']['scd'] = {
        si: agenda['ai'],
        sd: agenda['adt'].substring(0, 10),
        gs: (agenda['fc'] === from? '0' : '1')
      };
      output.content['1']['input']['textvariables'].push({
        name: 'touser', expression: 'contacts[0].ran', default: tousername
      });
    }

    //超过一人的时候
    if (to && to.length > 1) {
      tousername = to[0]['n'];

      output.content['1']['parameters']['title'] = '{touser}等' + to.length + '人拒收日程[' + agenda['at'] + ']';
      output.content['1']['parameters']['text'] = '{touser}：发送广告、推销等骚扰信息，帐户将被冻结。';
      output.content['1']['parameters']['reason'] = 'IN_BLACKLIST';
      output.content['1']['parameters']['scd'] = {
        si: agenda['ai'],
        sd: agenda['adt'].substring(0, 10),
        gs: (agenda['fc'] === from? '0' : '1')
      };
      output.content['1']['input']['textvariables'].push({
        name: 'touser', expression: 'contacts[0].ran', default: tousername
      });
    }
  }

  var push = {
    title: output.content['1']['parameters']['title'].replace(/{touser}/g, tousername),
    content: output.content['1']['parameters']['text'].replace(/{touser}/g, tousername),
    extras: {
      event: "MWXING_AGENDA_SHAREBLOCKED_EVENT",
      dependson: "on.homepage.init",
      eventhandler: "on.agenda.shareevents.message.click",
      eventdatafrom: "local",
      eventdata: {
        si: agenda['ai'],
        sd: agenda['adt'].substring(0, 10)
      }
    }
  };

  var standardnext = {};

  standardnext.announceTo = [from];
  standardnext.announceType = 'agenda_from_share';
  standardnext.announceContent = {mwxing:output,sms:{},push:push};

  print(standardnext);

  // filter source code here end
  return JSON.stringify(standardnext);
}
