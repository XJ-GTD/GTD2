function shouldclean(datasource) 
{
  var result = {};
  // filter source code here start
  var input = JSON.parse(datasource);

  if (input['_context'] && input['_context'].productId === 'cn.sh.com.xj.timeApp' && input['_context'].productVersion !== 'v1') return false;
  
  if (input.data && input.data[0] !== undefined) {
  for (var di in input.data) {
	var data = input.data[di];
  	if (data['sub'] === 'nlp' && data['intent']['service'] === 'OS6981162467.BorrowMoney' && data['intent']['intentType'] === 'custom' && data['intent']['semantic']) {
        var semantics = data['intent']['semantic'];
  
        for (var sei in semantics) {
          var semantic = semantics[sei];

          if (semantic['intent'] === 'SingleStroke') {
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
    if (dt['sub'] === 'nlp' && dt['intent']['service'] === 'OS6981162467.BorrowMoney' && dt['intent']['intentType'] === 'custom' && dt['intent']['semantic']) {
      data = dt;
    }
  }

  var formatDateTime = function(date) {
    return date.getFullYear() + '/' + (date.getMonth()+1) + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  }
  
  // 取得迅飞语音消息内容
  var userId = input['_context']['userId'];
  var deviceId = input['_context']['deviceId'];
  var clientcontext = input['_context']['client'];
  var servercontext = input['_context']['server'];
  var text = data['intent']['text'];
  var hasNotAsk = data['intent']['shouldEndSession'];
  var answer = data['intent']['answer']? data['intent']['answer']['text'] : '';
  var date = '';
  var sdate = '';
  var edate = '';
  var time = '';
  var stime = '';
  var etime = '';
  var who = '';
  var money = '0';
  
  var semantics = data['intent']['semantic'];
  
  for (var sei in semantics) {
    var semantic = semantics[sei];

    var slots = semantic['slots'];
    
    for (var si in slots) {
      var slot = slots[si];
      
      // 取出涉及时间结果
      if (slot['name'] === 'when') {
        var value = slot['normValue'];
        
        if (value && value !== undefined && value !== '') {
          var normValue = JSON.parse(value);
          var suggestDatetime = normValue['suggestDatetime'];
          
          print('suggestDatetime: ' + suggestDatetime);
          
          if (suggestDatetime.indexOf('/') < 0) {
            // 包含时间
            var reg = /^(\d+)-(\d{1,2})-(\d{1,2})T(\d{1,2}):(\d{1,2}):(\d{1,2})$/;
            var r = suggestDatetime.match(reg);
            
            if (r) {
              date = r[1] + '/' + r[2] + '/' + r[3];
              time = r[4] + ':' + r[5] + ':' + r[6];
            }
            
            // 没有时间
            var regd = /^(\d+)-(\d{1,2})-(\d{1,2})$/;
            var rd = suggestDatetime.match(regd);
            
            if (rd) {
              date = rd[1] + '/' + rd[2] + '/' + rd[3];
            }
          } else {
            // 包含期间
            var suggestDatetimerange = suggestDatetime.split('/');
            
            // 包含时间 开始
            var reg = /^(\d+)-(\d{1,2})-(\d{1,2})T(\d{1,2}):(\d{1,2}):(\d{1,2})$/;
            var r = suggestDatetimerange[0].match(reg);
            
            if (r) {
              sdate = r[1] + '/' + r[2] + '/' + r[3];
              stime = r[4] + ':' + r[5] + ':' + r[6];
            }
            
            // 没有时间 开始
            var regd = /^(\d+)-(\d{1,2})-(\d{1,2})$/;
            var rd = suggestDatetimerange[0].match(regd);
            
            if (rd) {
              sdate = rd[1] + '/' + rd[2] + '/' + rd[3];
            }
            
            // 包含时间 结束
            var re = suggestDatetimerange[1].match(reg);
            
            if (re) {
              edate = re[1] + '/' + re[2] + '/' + re[3];
              etime = re[4] + ':' + re[5] + ':' + re[6];
            }
            
            // 没有时间 结束
            var rde = suggestDatetimerange[1].match(regd);
            
            if (rde) {
              edate = rde[1] + '/' + rde[2] + '/' + rde[3];
            }
          }
        }
      }
      
      // 取出涉及人员
      if (slot['name'] === 'who') {
        who = slot['normValue'];
      }

      // 取出涉及金额
      if (slot['name'] === 'money') {
        money = slot['normValue'];
      }
    }
  }
  
  if (hasNotAsk === undefined) {
  	hasNotAsk = true;
  }
  
  var landb = servercontext? (servercontext['landb']? servercontext['landb'] : {}) : {};
  var targetdata = {};
  
  if (landb && landb['when'] && landb['when'] !== '') {
    targetdata['when'] = landb['when'];
  }
  if (landb && landb['who'] && landb['who'] !== '') {
    targetdata['who'] = landb['who'];
  }
  if (landb && landb['money'] && landb['money'] !== '') {
    targetdata['money'] = landb['money'];
  }
  
  if (date && date !== '') {
    targetdata['when'] = date;
  }
  if (who && who !== '') {
    targetdata['who'] = who;
  }
  if (money && money !== '') {
    targetdata['money'] = money;
  }
  
  var standardnext = {};
  
  standardnext['accountid'] = userId;
  standardnext['function'] = 'borrow';
  standardnext['hasnotask'] = hasNotAsk;
  standardnext['ask'] = answer;
  standardnext['data'] = targetdata;
  standardnext['data']['_context'] = input['_context'];
  standardnext['data']['_context']['text'] = text;
  standardnext['_context'] = input['_context'];
  standardnext['_context']['text'] = text;
  standardnext['_context']['server']['landb'] = targetdata;
  standardnext['_context']['server']['landb']['function'] = 'borrow';
  
  print(standardnext);
  
  // filter source code here end
  return JSON.stringify(standardnext);
}