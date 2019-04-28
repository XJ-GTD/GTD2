function shouldclean(datasource) 
{
  var result = {};
  // filter source code here start
  var input = JSON.parse(datasource);

  if (input.data && input.data[0] !== undefined) {
  for (var di in input.data) {
	var data = input.data[di];
  	if (data['sub'] === 'nlp' && data['intent']['service'] === 'OS6981162467.BAndLSummary' && data['intent']['intentType'] === 'custom' && data['intent']['semantic']) {
        var semantics = data['intent']['semantic'];
  
        for (var sei in semantics) {
          var semantic = semantics[sei];

          if (semantic['intent'] === 'ClaimsSummary' || semantic['intent'] === 'DebtsSummary') {
          	return true;
          }
        }
    }
  }
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
  var data = input.data[0];
  for (var di in input.data) {
    var dt = input.data[di];
    if (dt['sub'] === 'nlp' && dt['intent']['service'] === 'OS6981162467.BAndLSummary' && dt['intent']['intentType'] === 'custom' && dt['intent']['semantic']) {
      data = dt;
    }
  }

  var formatDateTime = function(date) {
    return date.getFullYear() + '/' + date.getMonth()+1 + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  }
  
  // 取得迅飞语音消息内容
  var userId = input['_context']['userId'];
  var deviceId = input['_context']['deviceId'];
  var clientcontext = input['_context']['client'];
  var servercontext = input['_context']['server'];
  var text = data['intent']['text'];
  var type = 'my_debts_and_claims';
  
  var semantics = data['intent']['semantic'];
  
  for (var sei in semantics) {
    var semantic = semantics[sei];

    type = ((semantic['intent'] === 'ClaimsSummary') ? 'my_claims' : ((semantic['intent'] === 'DebtsSummary') ? 'my_debts' : 'my_debts_and_claims'));
  }
  
  var standardnext = {};
  
  standardnext['accountid'] = userId;
  standardnext['function'] = 'summary';
  standardnext['data'] = {type: type};
  
  print(standardnext);
  
  // filter source code here end
  return JSON.stringify(standardnext);
}