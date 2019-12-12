//MWXING_CLASSIFY_F0001_V1_5
function shouldclean(datasource)
{
  var result = {};
  // filter source code here start
  var input = JSON.parse(datasource);

  if (input !== undefined && input['owner'] && input['agenda']) {
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

  var from = input['owner'];
  var agenda = input['agenda'];
  var to = new Array();

  var output = {};

  var formatDateTime = function(date) {
    return date.getFullYear() + '/' + (date.getMonth()+1) + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  }

  // 返回消息头部
  output.header = {
  	version: 'V1.1',
    sender: 'xunfei',
    datetime: formatDateTime(new Date()),
    describe: ['MK']
  };

  output.content = {};

  var mks = new Array();

  mks.push({id: agenda.evi, mkl: '', mkt: 'default'});

  // 日程分类操作类型设置
  output.content['0'] = {
    processor: 'MK',
    option: 'MK.U',
    parameters: {
      mks: mks
    }
  };

  to.push(from);

  var standardnext = {};

  standardnext.announceTo = to;
  standardnext.announceType = 'agenda_from_share';
  standardnext.announceContent = {mwxing:output};

  print(standardnext);

  // filter source code here end
  return JSON.stringify(standardnext);
}
