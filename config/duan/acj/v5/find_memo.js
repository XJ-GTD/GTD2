// MWXING_FIND_MEMO_V1_5
function shouldclean(datasource)
{
  var result = {};
  // filter source code here start
  var input = JSON.parse(datasource);

  if (input['_context'] && input['_context'].productId === 'cn.sh.com.xj.timeApp' && input['_context'].productVersion === 'v1') return false;

  if (input.data && input.data[0] !== undefined) {
    for (var di in input.data) {
      var data = input.data[di];
      if (data['sub'] === 'nlp' && data['intent']['service'] === 'OS6981162467.FindMemo' && data['intent']['intentType'] === 'custom' && data['intent']['semantic']) {
          var semantics = data['intent']['semantic'];

          for (var sei in semantics) {
            var semantic = semantics[sei];

            if (semantic['intent'] === 'FindByKeywords' || semantic['intent'] === 'FindByTime') {
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
  var data = input.data;
  for (var di in input.data) {
    var dt = input.data[di];
    if (dt['sub'] === 'nlp' && dt['intent']['service'] === 'OS6981162467.FindMemo' && dt['intent']['intentType'] === 'custom' && dt['intent']['semantic']) {
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
  var text = data['intent']['text'];
  var contacts = new Array();
  var date = '';
  var sdate = '';
  var edate = '';
  var time = '';
  var stime = '';
  var etime = '';
  var title = '';

  var findYearS = false;
  var findMonthS = false;
  var findDayS = false;
  var findAMPMS = false;
  var findTimeS = false;

  var findYearE = false;
  var findMonthE = false;
  var findDayE = false;
  var findAMPME = false;
  var findTimeE = false;

  var ampmS = '';
  var ampmE = '';

  var semantics = data['intent']['semantic'];

  for (var sei in semantics) {
    var semantic = semantics[sei];

    var slots = semantic['slots'];

    for (var si in slots) {
      var slot = slots[si];

      // 取出涉及时间结果
      if (slot['name'] === 'whentodo') {
        var value = slot['normValue'];

        if (value && value !== undefined && value !== '') {
          var normValue = JSON.parse(value);
          // 可能值 2019, 2019-01, 2019-05-10, TEAM/TAM/TMID/TPM/TNI/TLNI, 2019-05-10TAM, T15:00:00, 2019-05-10T15:00:00
          // TEAM 01:00 ~ 05:59 5小时
          // TAM  06:00 ~ 11:59 6小时
          // TMID 12:00 ~ 12:59 1小时
          // TPM  13:00 ~ 19:59 7小时
          // TNI  20:00 ~ 21:59 2小时
          // TLNI 22:00 ~ 23:59 2小时
          var datetime = normValue['datetime'];
          var suggestDatetime = normValue['suggestDatetime'];

          print('datetime: ' + datetime + ' => suggestDatetime: ' + suggestDatetime);

          // 识别原始条件判断查找范围
          if (datetime.indexOf('/') < 0) {
            // 包含时间
            var reg = /^(\d+)-(\d{1,2})-(\d{1,2})T(\d{1,2}):(\d{1,2}):(\d{1,2})$/;
            var r = datetime.match(reg);

            if (r) {
              findDayS = true;
              findTimeS = true;

              findDayE = true;
              findTimeE = true;
            }

            // 只有时间(上午下午范围)
            var regapo = /^T(EAM|AM|MID|PM|NI|LNI)$/;
            var rapo = datetime.match(regapo);

            if (rapo) {
              findAMPMS = true;
              ampmS = rapo[1];
              findAMPME = true;
              ampmE = rapo[1];
            }

            // 没有时间(上午下午范围)
            var regap = /^(\d+)-(\d{1,2})-(\d{1,2})T(EAM|AM|MID|PM|NI|LNI)$/;
            var rap = datetime.match(regap);

            if (rap) {
              findDayS = true;
              findAMPMS = true;
              ampmS = rap[4];
              findDayE = true;
              findAMPME = true;
              ampmE = rap[4];
            }

            // 没有时间
            var regd = /^(\d+)-(\d{1,2})-(\d{1,2})$/;
            var rd = datetime.match(regd);

            if (rd) {
              findDayS = true;
              findDayE = true;
            }

            // 没有天
            var regm = /^(\d+)-(\d{1,2})$/;
            var rm = datetime.match(regm);

            if (rm) {
              findMonthS = true;
              findMonthE = true;
            }

            // 没有月
            var regy = /^(\d+)$/;
            var ry = datetime.match(regy);

            if (ry) {
              findYearS = true;
              findYearE = true;
            }
          } else {
            // 包含期间
            var datetimerange = datetime.split('/');
            // 包含时间
            var reg = /^(\d+)-(\d{1,2})-(\d{1,2})T(\d{1,2}):(\d{1,2}):(\d{1,2})$/;
            var r = datetimerange[0].match(reg);

            if (r) {
              findDayS = true;
              findTimeS = true;
            }

            // 只有时间(上午下午范围)
            var regapo = /^T(EAM|AM|MID|PM|NI|LNI)$/;
            var rapo = datetime.match(regapo);

            if (rapo) {
              findAMPMS = true;
              ampmS = rapo[1];
            }

            // 没有时间(上午下午范围)
            var regap = /^(\d+)-(\d{1,2})-(\d{1,2})T(EAM|AM|MID|PM|NI|LNI)$/;
            var rap = datetimerange[0].match(regap);

            if (rap) {
              findDayS = true;
              findAMPMS = true;
              ampmS = rap[4];
            }

            // 没有时间
            var regd = /^(\d+)-(\d{1,2})-(\d{1,2})$/;
            var rd = datetimerange[0].match(regd);

            if (rd) {
              findDayS = true;
            }

            // 没有天
            var regm = /^(\d+)-(\d{1,2})$/;
            var rm = datetimerange[0].match(regm);

            if (rm) {
              findMonthS = true;
            }

            // 没有月
            var regy = /^(\d+)$/;
            var ry = datetimerange[0].match(regy);

            if (ry) {
              findYearS = true;
            }

            // 期间结束条件
            // 包含时间
            var rege = /^(\d+)-(\d{1,2})-(\d{1,2})T(\d{1,2}):(\d{1,2}):(\d{1,2})$/;
            var re = datetimerange[1].match(rege);

            if (re) {
              findDayE = true;
              findTimeE = true;
            }

            // 只有时间(上午下午范围)
            var regapoe = /^T(EAM|AM|MID|PM|NI|LNI)$/;
            var rapoe = datetimerange[1].match(regapoe);

            if (rapoe) {
              findAMPME = true;
              ampmE = rapoe[1];
            }

            // 没有时间(上午下午范围)
            var regape = /^(\d+)-(\d{1,2})-(\d{1,2})T(EAM|AM|MID|PM|NI|LNI)$/;
            var rape = datetimerange[1].match(regape);

            if (rape) {
              findDayE = true;
              findAMPME = true;
              ampmE = rape[4];
            }

            // 没有时间
            var regde = /^(\d+)-(\d{1,2})-(\d{1,2})$/;
            var rde = datetimerange[1].match(regde);

            if (rde) {
              findDayE = true;
            }

            // 没有天
            var regme = /^(\d+)-(\d{1,2})$/;
            var rme = datetimerange[1].match(regme);

            if (rme) {
              findMonthE = true;
            }

            // 没有月
            var regye = /^(\d+)$/;
            var rye = datetimerange[1].match(regye);

            if (rye) {
              findYearE = true;
            }
          }

          // 取得讯飞预判结果
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

      // 取出关联联系人结果
      if (slot['name'] === 'whotodo') {
        contacts.push({n:slot['normValue']});
      }

      // 取出涉及日程标题
      if (slot['name'] === 'whattodo') {
        title = slot['normValue'];
      }
    }
  }

  // 返回消息头部
  output.header = {
  	version: 'V1.1',
    sender: 'xunfei',
    datetime: formatDateTime(new Date()),
    describe: ['F','SS','S']
  };

  output.original = text;

  output.content = {};

  // 查询联系人指示
  output.content['0'] = {
    processor: 'F',
    option: 'F.C',
    parameters: {
      scd: {
        targets: ["memo"]
      },
      fs: contacts
    }
  };

  if (date && date !== '') {
    if (findYearS) {
      output['content']['0']['parameters']['scd']['ds'] = date.substring(0, 4) + '/01/01';
    }

    if (findYearE) {
      output['content']['0']['parameters']['scd']['de'] = date.substring(0, 4) + '/12/31';
    }

    if (findMonthS) {
      output['content']['0']['parameters']['scd']['ds'] = date.substring(0, 7) + '/01';
    }

    if (findMonthE) {
      output['content']['0']['parameters']['scd']['de'] = date.substring(0, 7) + '/31';
    }

    // 以上情况不匹配的时候
    if (!output['content']['0']['parameters']['scd']['ds']) {
      output['content']['0']['parameters']['scd']['ds'] = date;
    }

    if (!output['content']['0']['parameters']['scd']['de']) {
      output['content']['0']['parameters']['scd']['de'] = date;
    }
  }

  if (sdate && sdate !== '') {
    if (findYearS) {
      output['content']['0']['parameters']['scd']['ds'] = date.substring(0, 4) + '/01/01';
    }

    if (findMonthS) {
      output['content']['0']['parameters']['scd']['ds'] = date.substring(0, 7) + '/01';
    }

    if (!output['content']['0']['parameters']['scd']['ds']) {
      output['content']['0']['parameters']['scd']['ds'] = sdate;
    }
  }

  if (edate && edate !== '') {
    if (findYearE) {
      output['content']['0']['parameters']['scd']['de'] = date.substring(0, 4) + '/12/31';
    }

    if (findMonthE) {
      output['content']['0']['parameters']['scd']['de'] = date.substring(0, 7) + '/31';
    }

    // 以上情况不匹配的时候
    if (!output['content']['0']['parameters']['scd']['de']) {
      output['content']['0']['parameters']['scd']['de'] = edate;
    }
  }

  // TEAM 01:00 ~ 05:59 5小时
  // TAM  06:00 ~ 11:59 6小时
  // TMID 12:00 ~ 12:59 1小时
  // TPM  13:00 ~ 19:59 7小时
  // TNI  20:00 ~ 21:59 2小时
  // TLNI 22:00 ~ 23:59 2小时
  if (time && time !== '') {
    if (findAMPMS) {
      output['content']['0']['parameters']['scd']['ts'] = (ampmS == 'EAM'? '01:00' : (ampmS == 'AM'? '06:00' : (ampmS == 'MID'? '12:00' : (ampmS == 'PM'? '13:00' : (ampmS == 'NI'? '20:00' : (ampmS == 'LNI'? '22:00' : '00:00'))))));
    }

    if (findAMPME) {
      output['content']['0']['parameters']['scd']['te'] = (ampmE == 'EAM'? '05:59' : (ampmE == 'AM'? '11:59' : (ampmE == 'MID'? '12:59' : (ampmE == 'PM'? '19:59' : (ampmE == 'NI'? '21:59' : (ampmE == 'LNI'? '23:59' : '23:59'))))));
    }

    // 以上情况不匹配的时候
    if (!output['content']['0']['parameters']['scd']['ts']) {
      output['content']['0']['parameters']['scd']['ts'] = time;
    }

    if (!output['content']['0']['parameters']['scd']['te']) {
      output['content']['0']['parameters']['scd']['te'] = time;
    }
  }

  if (stime && stime !== '') {
    if (findAMPMS) {
      output['content']['0']['parameters']['scd']['ts'] = (ampmS == 'EAM'? '01:00' : (ampmS == 'AM'? '06:00' : (ampmS == 'MID'? '12:00' : (ampmS == 'PM'? '13:00' : (ampmS == 'NI'? '20:00' : (ampmS == 'LNI'? '22:00' : '00:00'))))));
    }

    if (!output['content']['0']['parameters']['scd']['ts']) {
      output['content']['0']['parameters']['scd']['ts'] = stime;
    }
  }

  if (etime && etime !== '') {
    if (findAMPME) {
      output['content']['0']['parameters']['scd']['te'] = (ampmE == 'EAM'? '05:59' : (ampmE == 'AM'? '11:59' : (ampmE == 'MID'? '12:59' : (ampmE == 'PM'? '19:59' : (ampmE == 'NI'? '21:59' : (ampmE == 'LNI'? '23:59' : '23:59'))))));
    }

    if (!output['content']['0']['parameters']['scd']['te']) {
      output['content']['0']['parameters']['scd']['te'] = etime;
    }
  }

  if (title && title !== '') {
    output['content']['0']['parameters']['scd']['ti'] = title;
  }

  output.context = {};

  if (clientcontext && clientcontext !== undefined) {
  	output.context['client'] = clientcontext;
  }

  // 保存上下文指示
  output.content['1'] = {
    processor: 'SS',
    option: 'SS.F',
    parameters: {}
  };

  output.content['2'] = {
    processor: 'S',
    option: 'S.P',
    parameters: {
      t: 'CC'
    }
  };

  var standardnext = {};

  standardnext.announceTo = [userId + ';' + deviceId];
  standardnext.announceType = 'inteligence_mix';
  standardnext.announceContent = {mwxing:output};

  print(standardnext);

  // filter source code here end
  return JSON.stringify(standardnext);
}
