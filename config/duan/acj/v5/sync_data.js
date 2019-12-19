// MWXING_DATASYNC_V1_5
function shouldclean(datasource)
{
  var result = {};
  // filter source code here start
  var input = JSON.parse(datasource);

  if (input !== undefined && input['from'] && input['header'] && input['datas']) {

    return true;
  }

  // filter source code here end
  return false;
}

/**
 * 本帐号本设备/多设备同步
 * 他帐号数据共享
 **/
function clean(datasource)
{
  var result = {};
  print('Start Nashorn Javascript processing...');
  print(datasource);
  // filter source code here start
  var input = JSON.parse(datasource);

  var from = input['from'];
  var name = input['name'];
  var to = input['to'];
  var copyto = input['copyto'];
  var header = input['header'];
  var datas = input['datas'];
  var extension = input['extension'];

  var formatDateTime = function(date) {
      return date.getFullYear() + '/' + (date.getMonth()+1) + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  }

  var formatDateTimeShow = function(date) {
    if (date.indexOf('99:99') < 0) {
      return (date.substring(5,7)) + '月' + (date.substring(8,10)) + '日 ' + date.substring(11,16);
    } else {
      return (date.substring(5,7)) + '月' + (date.substring(8,10)) + '日';
    }
  }

  var convertSMS = function(name, title) {
    var sms;

    // 设置未注册用户短信通知模板
    sms = {template: {
      newuser: '11lnk',
      name: name || '冥王星用户',
      title: title,
      url: 'http://u3v.cn/4sUKl3'
    }};

  }

  var convertPushMessage = function(id, type, name, title, content, datetime) {
    var push = {};

    push['title'] = title;
    push['content'] = content || formatDateTimeShow(datetime);
    push['extras'] = {
      event: "MWXING_SHAREAGENDA_EVENT",
      dependson: "on.homepage.init",
      eventhandler: "on.agendashare.message.click",
      eventdatafrom: "local",
      eventdata: JSON.stringify({type: type, id: id})
    };

    return push;
  }

  // messagetype: SD[SELF_DEVICE], SA[SELF_ACCOUNT], OA[OTHER_ACCOUNT], SP[SELF_PULL]
  var convertMessage = function(id, type, messagetype) {
    var output = {};

    // 返回消息头部
    output.header = {
    	version: 'V1.1',
      sender: 'xunfei',
      datetime: formatDateTime(new Date()),
      describe: ['DS']
    };

    output.content = {};

    // 日程共享操作类型设置
    output.content['0'] = {
      processor: 'DS',
      parameters: {
        type: type,
        id: id
      }
    };

    if (messagetype == 'SELF_DEVICE') output.content['0']['option'] = 'DS.SD';
    if (messagetype == 'SELF_ACCOUNT') output.content['0']['option'] = 'DS.SA';
    if (messagetype == 'OTHER_ACCOUNT') output.content['0']['option'] = 'DS.OA';
    if (messagetype == 'SELF_PULL') output.content['0']['option'] = 'DS.SP';

    return output;
  }

  var convertMessageWithNotify = function(id, type, action, title, content, messagetype) {
    var output = {};

    // 返回消息头部
    output.header = {
    	version: 'V1.1',
      sender: 'xunfei',
      datetime: formatDateTime(new Date()),
      describe: ['DS', 'PN', 'S']
    };

    output.content = {};

    // 日程共享操作类型设置
    output.content['0'] = {
      processor: 'DS',
      parameters: {
        type: type,
        id: id
      }
    };

    output.content['1'] = {
      processor: 'PN',
      option: 'PN.EX',
      parameters: {
        type: type,
        id: id,
        action: action,
        title: title,
        content: content
      }
    };

    output.content['2'] = {
      processor: 'S',
      option: 'S.AN',
      parameters: {
        an: title + ", " + content
      }
    };

    if (messagetype == 'SELF_DEVICE') output.content['0']['option'] = 'DS.SD';
    if (messagetype == 'SELF_ACCOUNT') output.content['0']['option'] = 'DS.SA';
    if (messagetype == 'OTHER_ACCOUNT') output.content['0']['option'] = 'DS.OA';
    if (messagetype == 'SELF_PULL') output.content['0']['option'] = 'DS.SP';

    return output;
  }

  // 使用文件传输数据
  var convertDataFileMessage = function(type, extension, file) {
    var output = {};

    // 返回消息头部
    output.header = {
    	version: 'V1.1',
      sender: 'xunfei',
      datetime: formatDateTime(new Date()),
      describe: ['DS']
    };

    output.content = {};

    // 日程共享操作类型设置
    output.content['0'] = {
      processor: 'FS',
      option: 'DS.FS',
      parameters: {
        type: type,
        file: file
      }
    };

    if (extension) {
      output.content['0']['parameters']['extension'] = extension;

      if (extension.endsWith('#Diff')) {
        output.header['sender'] = "mwxing/datadiff";
      }
    }

    return output;
  }

  var convertDataMessage = function(id, type, extension, status, share, members, payload) {
    var output = {};

    // 返回消息头部
    output.header = {
    	version: 'V1.1',
      sender: 'xunfei',
      datetime: formatDateTime(new Date()),
      describe: ['DS']
    };

    output.content = {};

    // 日程共享操作类型设置
    output.content['0'] = {
      processor: 'DS',
      option: 'DS.DS',
      parameters: {
        type: type,
        id: id,
        status: status,
        share: share,
        to: members,
        data: payload
      }
    };

    if (extension) output.content['0']['parameters']['extension'] = extension;

    return output;
  }

  var outputs = [];
  var requestdevice = header['di'];

  // 逐条处理
  if (to) { // 同步/推送通知
    for (var index in datas) {
      var data = datas[index];

      var src = data['src'];
      var id = data['id'];
      var type = data['type'];
      var todevice = data['todevice'];
      var title = data['title'];
      var datetime = data['datetime'];
      var status = data['status'];
      var main = data['main'];
      var operation = data['operation'];
      var sharestate = data['sharestate'];

      print("DEBUG [" + type + "][" + src + "][" + id + "] " + from + ":" + requestdevice + " => " + to + ":" + todevice);

      // 本帐户同步
      if (from == to) {
        // 请求设备同步
        if (requestdevice == todevice) {
          var standardnext = {};

          standardnext.announceTo = [to];
          standardnext.announceDevice = todevice;
          standardnext.announceType = 'data_sync';
          standardnext.announceContent = {
            mwxing: convertMessage(id, type, 'SELF_DEVICE'),
            sms: {},
            push: {}
          };

          outputs.push(standardnext);
        } else {  // 他设备同步
          var standardnext = {};

          standardnext.announceTo = [to];
          standardnext.announceDevice = todevice;
          standardnext.announceType = 'data_sync';
          standardnext.announceContent = {
            mwxing: convertMessage(id, type, 'SELF_ACCOUNT'),
            sms: {},
            push: {}
          };

          outputs.push(standardnext);
        }
      } else {  // 他账户共享
        var standardnext = {};

        standardnext.announceTo = [to];
        standardnext.announceDevice = todevice;
        standardnext.announceType = 'data_sync';

        // 判断日程数据通知处理逻辑
        if (type == "Agenda" && name) {
          var push = {};
          var mwxing = convertMessage(id, type, 'OTHER_ACCOUNT');;

          if (main) {
            if (from == src) {
              // 发起人新增邀请,通知受邀人
              if (operation == "add") {
                if (status != "del") {
                  push = convertPushMessage(id, type, name, (name + " - 邀请活动"), title, datetime) || {};
                  mwxing = convertMessageWithNotify(id, type, "invite", (name + " - 邀请活动"), title, 'OTHER_ACCOUNT');
                }
              }
              // 发起人删除,通知所有人
              if (status == "del") {
                if (!sharestate || !sharestate[to] || sharestate[to]["datastate"] != "del") {
                  push = convertPushMessage(id, type, name, (name + " - 取消活动"), title, datetime) || {};
                  mwxing = convertMessageWithNotify(id, type, "cancel", (name + " - 取消活动"), title, 'OTHER_ACCOUNT');
                }
              }
              // 移除受邀人,通知受邀人
              if (operation == "remove") {
                if (!sharestate || !sharestate[to] || sharestate[to]["datastate"] != "del") {
                  push = convertPushMessage(id, type, name, (name + " - 取消活动"), title, datetime) || {};
                  mwxing = convertMessageWithNotify(id, type, "cancel", (name + " - 取消活动"), title, 'OTHER_ACCOUNT');
                }
              }
            } else {
              // 任何人新增邀请,通知受邀人
              if (operation == "add") {
                if (status != "del") {
                  push = convertPushMessage(id, type, name, (name + " - 邀请活动"), title, datetime) || {};
                  mwxing = convertMessageWithNotify(id, type, "invite", (name + " - 邀请活动"), title, 'OTHER_ACCOUNT');
                }
              }
              // 移除受邀人,通知受邀人
              if (operation == "remove") {
                if (!sharestate || !sharestate[to] || sharestate[to]["datastate"] != "del") {
                  push = convertPushMessage(id, type, name, (name + " - 取消活动"), title, datetime) || {};
                  mwxing = convertMessageWithNotify(id, type, "cancel", (name + " - 取消活动"), title, 'OTHER_ACCOUNT');
                }
              }
            }
          }

          standardnext.announceContent = {
            mwxing: mwxing,
            sms: main? convertSMS(name, title) : {},
            push: push
          };
        } else if (type == "Attachment") {  // 附件不产生通知消息
          standardnext.announceContent = {
            mwxing: convertMessage(id, type, 'OTHER_ACCOUNT'),
            sms: main? convertSMS(name, title) : {},
            push: {}
          };
        } else if (type == "Annotation") {  // @通知
          standardnext.announceContent = {
            mwxing: convertMessageWithNotify(id, type, "annotation", (name + " - @你"), title, 'OTHER_ACCOUNT'),
            sms: main? convertSMS(name, title) : {},
            push: convertPushMessage(id, type, name, (name + " - @你"), title, datetime) || {}
          };
        } else {
          standardnext.announceContent = {
            mwxing: convertMessage(id, type, 'OTHER_ACCOUNT'),
            sms: main? convertSMS(name, title) : {},
            push: main? convertPushMessage(id, type, name, title, "", datetime) : {}
          };
        }

        outputs.push(standardnext);
      }
    }
  } else {  // 推送数据
    // 拉取数据每10条推送一次
    var cached = {};

    for (var index in datas) {
      var data = datas[index];

      var type = data['type'];

      if (type == 'pullfromfile') {
        var file = data['file'];

        var standardnext = {};

        standardnext.announceTo = [from];
        standardnext.announceDevice = requestdevice;
        standardnext.announceType = 'data_sync';
        standardnext.announceContent = {
          mwxing: convertDataFileMessage(type, extension, file),
          sms: {},
          push: {}
        };

        outputs.push(standardnext);
      } else {
        var id = data['id'];
        var title = data['title'];
        var status = data['status'];
        var share = data['sharestate'] || {};
        var payload = data['payload'];
        var members = data['to'];

        if (payload) {
          var standardnext = {};

          standardnext.announceTo = [from];
          standardnext.announceDevice = requestdevice;
          standardnext.announceType = 'data_sync';
          standardnext.announceContent = {
            mwxing: convertDataMessage(id, type, extension, status, share, members, payload),
            sms: {},
            push: {}
          };

          outputs.push(standardnext);
        } else {
          var typeid = cached[type];

          if (typeid) {
            cached[type].push(id);

            if (cached[type].length == 10) {
              var standardnext = {};

              standardnext.announceTo = [from];
              standardnext.announceDevice = requestdevice;
              standardnext.announceType = 'data_sync';
              standardnext.announceContent = {
                mwxing: convertMessage(cached[type], type, 'SELF_PULL'),
                sms: {},
                push: {}
              };

              outputs.push(standardnext);

              cached[type] = [];
            }
          } else {
            cached[type] = [id];
          }
        }
      }
    }

    for (var type in cached) {
      if (cached[type] && cached[type].length > 0) {
        var standardnext = {};

        standardnext.announceTo = [from];
        standardnext.announceDevice = requestdevice;
        standardnext.announceType = 'data_sync';
        standardnext.announceContent = {
          mwxing: convertMessage(cached[type], type, 'SELF_PULL'),
          sms: {},
          push: {}
        };

        outputs.push(standardnext);
      }
    }
  }

  print({announces: outputs});

  // filter source code here end
  return JSON.stringify({announces: outputs});
}
