function shouldclean(datasource) 
{
  var result = {};
  // filter source code here start
  var input = JSON.parse(datasource);
  
  if (input['_context'] && input['_context'].productId === 'cn.sh.com.xj.timeApp' && input['_context'].productVersion !== 'v1') return false;
  
  if (input.data && input.data[0] !== undefined) {
    for (var di in input.data) {
      var data = input.data[di];
      if (data['sub'] === 'nlp' && data['intent']['service'] === 'OS6981162467.AgendaModify' && data['intent']['intentType'] === 'custom' && data['intent']['shouldEndSession']) {
        // 存在意图确认, 意图确认结果返回
        return true;
      } else if (data['sub'] === 'nlp' && data['intent']['service'] === 'OS6981162467.AgendaModify' && data['intent']['intentType'] === 'custom' && data['intent']['semantic']) {
          var semantics = data['intent']['semantic'];
    
          for (var sei in semantics) {
            var semantic = semantics[sei];

            if (semantic['intent'] === 'ChangeTime' || semantic['intent'] === 'ChangeMultiTime' || semantic['intent'] === 'AddContacts' || semantic['intent'] === 'MoveContacts') {
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
    if (dt['sub'] === 'nlp' && dt['intent']['service'] === 'OS6981162467.AgendaModify' && dt['intent']['intentType'] === 'custom' && dt['intent']['shouldEndSession']) {
      data = dt;
    } else if (dt['sub'] === 'nlp' && dt['intent']['service'] === 'OS6981162467.AgendaModify' && dt['intent']['intentType'] === 'custom' && dt['intent']['semantic']) {
      data = dt;
    }
  }
  var output = {};

  var formatDateTime = function(date) {
    return date.getFullYear() + '/' + (date.getMonth()+1) + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  }
  
  // 取得迅飞语音消息内容
  var userId = input['_context']['userId'];
  var deviceId = input['_context']['deviceId'];
  var clientcontext = input['_context']['client'];
  var servercontext = input['_context']['server'];
  var shouldEndSession = data['intent']['shouldEndSession'];
  var answer = (data['intent']['answer'] ? data['intent']['answer']['text'] : '');
  var text = data['intent']['text'];
  var contacts = new Array();
  var date = '';
  var sdate = '';
  var edate = '';
  var time = '';
  var stime = '';
  var etime = '';
  var datechangeto = '';
  var sdatechangeto = '';
  var edatechangeto = '';
  var timechangeto = '';
  var stimechangeto = '';
  var etimechangeto = '';
  var title = '';
  var titlechangeto = '';
  
  var semantics = data['intent']['semantic'];
  
  for (var sei in semantics) {
    var semantic = semantics[sei];

    var slots = semantic['slots'];
    
    for (var si in slots) {
      var slot = slots[si];
      
      // 取出关联联系人结果
      if (slot['name'] === 'whotodo') {
        contacts.push({n:slot['normValue']});
      }
      
      // 取出涉及时间结果
      if (slot['name'] === 'whentodo') {
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
      
      // 取出涉及时间结果
      if (slot['name'] === 'whenchangeto') {
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
              datechangeto = r[1] + '/' + r[2] + '/' + r[3];
              timechangeto = r[4] + ':' + r[5] + ':' + r[6];
            }
            
            // 没有时间
            var regd = /^(\d+)-(\d{1,2})-(\d{1,2})$/;
            var rd = suggestDatetime.match(regd);
            
            if (rd) {
              datechangeto = rd[1] + '/' + rd[2] + '/' + rd[3];
            }
          } else {
            // 包含期间
            var suggestDatetimerange = suggestDatetime.split('/');
            
            // 包含时间 开始
            var reg = /^(\d+)-(\d{1,2})-(\d{1,2})T(\d{1,2}):(\d{1,2}):(\d{1,2})$/;
            var r = suggestDatetimerange[0].match(reg);
            
            if (r) {
              sdatechangeto = r[1] + '/' + r[2] + '/' + r[3];
              stimechangeto = r[4] + ':' + r[5] + ':' + r[6];
            }
            
            // 没有时间 开始
            var regd = /^(\d+)-(\d{1,2})-(\d{1,2})$/;
            var rd = suggestDatetimerange[0].match(regd);
            
            if (rd) {
              sdatechangeto = rd[1] + '/' + rd[2] + '/' + rd[3];
            }
            
            // 包含时间 结束
            var re = suggestDatetimerange[1].match(reg);
            
            if (re) {
              edatechangeto = re[1] + '/' + re[2] + '/' + re[3];
              etimechangeto = re[4] + ':' + re[5] + ':' + re[6];
            }
            
            // 没有时间 结束
            var rde = suggestDatetimerange[1].match(regd);
            
            if (rde) {
              edatechangeto = rde[1] + '/' + rde[2] + '/' + rde[3];
            }
          }
        }
      }
      
      // 取出涉及日程标题
      if (slot['name'] === 'whattodo') {
        title = slot['normValue'];
      }

      // 取出涉及日程标题
      if (slot['name'] === 'whatchangeto') {
        titlechangeto = slot['normValue'];
      }
    }
  }
  
  // 返回消息头部
  if (!shouldEndSession) {
    // 确认前
    output.header = {
      version: 'V1.0',
      sender: 'xunfei',
      datetime: formatDateTime(new Date()),
      describe: ['F','SS','S']
    };
  } else {
    // 确认后
    output.header = {
      version: 'V1.0',
      sender: 'xunfei',
      datetime: formatDateTime(new Date()),
      describe: ['SC','O','S']
    };
  }
  
  output.original = text;
  
  output.content = {};
  
  if (!shouldEndSession) {
    // 确认前
    // 查询联系人指示
    output.content['F'] = {
      option: 'F.C',
      parameters: {
        scd: {},
        fs: contacts
      }
    };
    
    // 查询修改日程指示
    output.content['SS'] = {
      option: 'SS.U',
      parameters: {
        scd: {}
      }
    };
    
    if (datechangeto && datechangeto !== '') {
      
      output['content']['SS']['parameters']['d'] = datechangeto;
      output['content']['SS']['parameters']['scd']['ds'] = datechangeto;
      output['content']['SS']['parameters']['scd']['de'] = datechangeto;
    }
    
    if (date && date !== '') {

      output['content']['F']['parameters']['scd']['ds'] = date;
      output['content']['F']['parameters']['scd']['de'] = date;
    }
    
    if (sdatechangeto && sdatechangeto !== '') {
      
      output['content']['SS']['parameters']['d'] = sdatechangeto;
      output['content']['SS']['parameters']['scd']['ds'] = sdatechangeto;
    }
    
    if (sdate && sdate !== '') {

      output['content']['F']['parameters']['scd']['ds'] = sdate;
    }

    if (edatechangeto && edatechangeto !== '') {
      
      output['content']['SS']['parameters']['scd']['de'] = edatechangeto;
    }
    
    if (edate && edate !== '') {

      output['content']['F']['parameters']['scd']['de'] = edate;
    }

    if (timechangeto && timechangeto !== '') {
      
      output['content']['SS']['parameters']['t'] = timechangeto;
      output['content']['SS']['parameters']['scd']['ts'] = timechangeto;
      output['content']['SS']['parameters']['scd']['te'] = timechangeto;
    } else {
      
      output['content']['SS']['parameters']['t'] = '99:99';
      output['content']['SS']['parameters']['scd']['ts'] = '00:00';
      output['content']['SS']['parameters']['scd']['te'] = '23:59';
    }
    
    if (time && time !== '') {

      output['content']['F']['parameters']['scd']['ts'] = time;
      output['content']['F']['parameters']['scd']['te'] = time;
    } else {

      output['content']['F']['parameters']['scd']['ts'] = '00:00';
      output['content']['F']['parameters']['scd']['te'] = '23:59';
    }
   
    if (stimechangeto && stimechangeto !== '') {
      
      output['content']['SS']['parameters']['t'] = stimechangeto;
      output['content']['SS']['parameters']['scd']['ts'] = stimechangeto;
    } else {
      
      output['content']['SS']['parameters']['t'] = '00:00';
      output['content']['SS']['parameters']['scd']['ts'] = '00:00';
    }
    
    if (stime && stime !== '') {

      output['content']['F']['parameters']['scd']['ts'] = stime;
    } else {

      output['content']['F']['parameters']['scd']['ts'] = '00:00';
    }

    if (etimechangeto && etimechangeto !== '') {
      
      output['content']['SS']['parameters']['scd']['te'] = etimechangeto;
    } else {
      
      output['content']['SS']['parameters']['scd']['te'] = '23:59';
    }
    
    if (etime && etime !== '') {

      output['content']['F']['parameters']['scd']['te'] = etime;
    } else {

      output['content']['F']['parameters']['scd']['te'] = '23:59';
    }

    if (titlechangeto && titlechangeto !== '') {
      
      output['content']['SS']['parameters']['ti'] = titlechangeto;
      output['content']['SS']['parameters']['scd']['ti'] = titlechangeto;
    } else {
      
      output['content']['SS']['parameters']['scd']['ti'] = '';
    }
    
    if (title && title !== '') {

      output['content']['F']['parameters']['scd']['ti'] = title;
    } else {

      output['content']['F']['parameters']['scd']['ti'] = '';
    }
    
    // 播报
    output.content['S'] = {
      option: 'S.P',
      parameters: {
        t: 'EU'
      }
    };
  } else {
    // 确认后
    // 删除日程指示
    // 读取上下文指示
    output.content['SC'] = {
      option: 'SC.T',
      parameters: {}
    };

    var confirm = '好的，已取消';
    
    if (data['intent'] && data['intent']['answer'] && data['intent']['answer']['text']) {
      confirm = data['intent']['answer']['text'];
    }
    
    if (confirm === '好的，已确认') {
      // 确认    
      output.content['O'] = {
        option: 'O.O',
        parameters: {}
      };
  
      output.content['S'] = {
        option: 'S.P',
        parameters: {
          t: 'UAA'
        }
      };
    }
    
    if (confirm === '好的，已取消') {
      // 取消
      output.content['O'] = {
        option: 'O.C',
        parameters: {}
      };
  
      output.content['S'] = {
        option: 'S.P',
        parameters: {
          t: 'UBB'
        }
      };
    }
  }
  
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