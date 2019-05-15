function shouldclean(datasource) 
{
  var result = {};
  // filter source code here start
  var input = JSON.parse(datasource);

  if (input['_context'] && input['_context'].productId === 'cn.sh.com.xj.timeApp' && input['_context'].productVersion !== 'v1') return false;
  
  if (input['function'] && (input['function'] === 'summary' || input['function'] === 'lend' || input['function'] === 'borrow')) {
      print('冥王星 迅飞借贷功能处理结果转换 V1.1 [MWXING_XUNFEI_L0005_V1_1] Go...');
      return true;
  }

  // filter source code here end
  return false;
}

function clean(datasource) 
{
  var result = {};
  // filter source code here start
  var input = JSON.parse(datasource);
  var output = {};

  var userId = input['_context']['userId'];
  var deviceId = input['_context']['deviceId'];
  var clientcontext = input['_context']['client'];
  var servercontext = input['_context']['server'];
  var func = input['function'];
  var answer = 'UNKNOWN';
  
  if (func === 'summary') {
    var debts = input['_context']['debts'];
    var claims = input['_context']['claims'];
    
    answer = '您目前';
    if (debts) {
      answer += '总共借出了' + debts.strokes + '笔,';
      answer += '合计' + debts.amounts + '元';
    }

    if (claims) {
      answer += '总共向别人了' + claims.strokes + '笔,';
      answer += '合计' + claims.amounts + '元';
    }

    if (!debts && !claims) {
      answer = '您目前没有借贷记录哦~~';
    }
  }
  
  if (func === 'lend') {
    answer = '已帮您记录下来啦';
  }

  if (func === 'borrow') {
    answer = '已帮您记录下来啦';
  }

  // 返回消息头部
  output.header = {
  	version: 'V1.0',
    sender: 'xunfei',
    datetime: formatDateTime(new Date()),
    describe: ['S']
  };
  
  output.original = text;
  
  output.content = {};
  
  // 直接播报
  output.content['S'] = {
    option: 'S.AN',
    parameters: {
      an: answer
    }
  };
  
  output.context = {};
  
  if (clientcontext && clientcontext !== undefined) {
  	output.context['client'] = clientcontext;
  }
  
  var standardnext = {};
  
  standardnext.announceTo = [userId + ';' + deviceId];
  standardnext.announceType = 'inteligence_mix';
  standardnext.announceContent = {mwxing:output};
  
  print(standardnext);
  
  // filter source code here end
  return JSON.stringify(standardnext);
}