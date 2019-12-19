// MWXING_SCHEDULED_REMIND_V1_5
function shouldclean(datasource)
{
  var result = {};
  // filter source code here start
  var input = JSON.parse(datasource);

  if (input !== undefined && input['datas']) {

    return true;
  }

  // filter source code here end
  return false;
}

/**
 * 触发计划提醒
 * 转换提醒格式给推送服务
 **/
function clean(datasource)
{
  var result = {};
  print('Start Nashorn Javascript processing...');
  print(datasource);
  // filter source code here start
  var input = JSON.parse(datasource);

  var userId = input['userId'];
  var datas = input['datas'];
  var remind = input['remind'];

  var formatDateTime = function(date) {
      return date.getFullYear() + '/' + (date.getMonth()+1) + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
  }

  var formatDateTimeShow = function(date) {
    if (date.indexOf('99:99') < 0) {
      return (date.substring(5,7)) + '月' + (date.substring(8,10)) + '日 ' + date.substring(11,16);
    } else {
      return (date.substring(5,7)) + '月' + (date.substring(8,10)) + '日';
    }
  }

  var convertPushContinueMessage = function(id, type, title, datetime) {
    var push = {};

    push['title'] = '活动延迟提醒';
    push['content'] = title;
    push['extras'] = {
      event: "MWXING_SHAREAGENDA_EVENT",
      dependson: "on.homepage.init",
      eventhandler: "on.agendashare.message.click",
      eventdatafrom: "local",
      eventdata: JSON.stringify({type: type, id: id})
    };

    return push;
  }

  var convertNotifyMessage = function(id, type, wd, wt, continue, title, content) {
    var output = {};

    // 返回消息头部
    output.header = {
    	version: 'V1.1',
      sender: 'xunfei',
      datetime: formatDateTime(new Date()),
      describe: ['PN', 'S']
    };

    output.content = {};

    output.content['0'] = {
      processor: 'PN',
      option: 'PN.AM',
      parameters: {
        type: type,
        id: id,
        wd: wd,
        wt: wt,
        continue: continue,
        title: title,
        content: content
      }
    };

    output.content['1'] = {
      processor: 'S',
      option: 'S.AN',
      parameters: {
        an: title + ", " + content
      }
    };

    return output;
  }

  var convertPushMessage = function(id, type, title, datetime) {
    var push = {};

    var pushTitle = '活动提醒';

    if (type == 'Task') pushTitle = '任务提醒';
    if (type == 'MiniTask') pushTitle = '小任务提醒';

    push['title'] = pushTitle;
    push['content'] = title;
    push['extras'] = {
      event: "MWXING_SHAREAGENDA_EVENT",
      dependson: "on.homepage.init",
      eventhandler: "on.agendashare.message.click",
      eventdatafrom: "local",
      eventdata: JSON.stringify({type: type, id: id})
    };

    return push;
  }

  var fillzero = function(value, length) {
    var changed = value + "";

    if (changed.length >= length) {
      return changed;
    } else {
      return new Array(length - changed.length).join("0") + changed;
    }
  }

  var generateScheduledRemind = function(userId, id, wd, wt, data) {
    var task = {};

    task["saName"] = "任务调度触发器";
    task["saPrefix"] = "cdc";
    task["taskId"] = "pluto_" + userId + "_remind_" + id;
    task["taskType"] = "QUARTZ";
    task["taskName"] = "计划事件持续提醒";

    var d = new Date(Date.parse(wd + " " + wt));

    var taskRunAt = {};
    taskRunAt["eventId"] = "QUARTZ_CRON_5M",
    taskRunAt["filters"] = [
      {name: "yyyy", value: d.getFullYear() + ""},
      {name: "MM", value: fillzero(d.getMonth() + 1, 2)},
      {name: "dd", value: fillzero(d.getDate(), 2)},
      {name: "HH", value: fillzero(d.getHours(), 2)},
      {name: "mm", value: fillzero(d.getMinutes(), 2)}
    ];

    task["taskRunAt"] = JSON.stringify(taskRunAt);

    var taskRunWith = {};
    taskRunWith["url"] = "https://pluto.guobaa.com/cdc/mwxing_scheduled_remind_start/json/trigger";
    taskRunWith["payload"] = {
      userId: userId,
      remind: data
    };

    task["taskRunWith"] = JSON.stringify(taskRunWith);

    return task;
  }

  var remindprop = {};

  if (remind && remind.datas) {
    for (var index in remind.datas) {
      var one = remind.datas[index];

      remindprop[one.id] = one;
    }
  }

  var outputs = [];
  var continues = [];

  for (var index in datas) {
    var data = datas[index];

    var to = data['exchangeno'];
    var id = data['id'];
    var type = data['type'];
    var title = data['title'];
    var datetime = formatDateTime(new Date());

    var standardnext = {};

    var todostate = (data['sharestate'] && data['sharestate'][to] && data['sharestate'][to]['todostate'])? data['sharestate'][to]['todostate'] : data['todostate'];

    // 如果是持续提醒, 已完成或者已不需要持续提醒, 则不处理
    if (remind && remindprop[id] && remindprop[id]["continue"] && todostate != "uncomplete") {
      continue;
    }

    // 存在持续提醒的数据
    if (remind && remindprop[id] && remindprop[id]["continue"] && todostate == "uncomplete") {
      // 发送本次提醒
      standardnext.announceTo = [to];
      standardnext.announceType = 'data_sync';
      standardnext.announceContent = {
        mwxing: convertNotifyMessage(id, type, remindprop['wd'], remindprop['wt'], remindprop[id]["continue"], "活动延迟提醒", title),
        sms: {},
        push: convertPushContinueMessage(id, type, title, datetime)
      };

      // 设置下次提醒
      var currentremind = remindprop[id];

      var cd = Date.parse(currentremind["wd"] + " " + currentremind["wt"]);
      var next = new Date(cd + 1000 * 60 * 60 * 4);

      var wd = next.getFullYear() + "/" + fillzero(next.getMonth() + 1, 2) + "/" + fillzero(next.getDate(), 2);
      var wt = fillzero(next.getHours(), 2) + ":" + fillzero(next.getMinutes(), 2);

      var nextremind = {
        datatype: type,
        datas: [{
          accountid: currentremind["accountid"],
          phoneno: currentremind["phoneno"],
          id: id,
          continue: true,
          wd: wd,
          wt: wt
        }]
      };
      continues.push(generateScheduledRemind(currentremind["accountid"], id, wd, wt, nextremind));
    } else {
      var pushTitle = '活动提醒';

      if (type == 'Task') pushTitle = '任务提醒';
      if (type == 'MiniTask') pushTitle = '小任务提醒';

      standardnext.announceTo = [to];
      standardnext.announceType = 'data_sync';
      standardnext.announceContent = {
        mwxing: convertNotifyMessage(id, type, remindprop['wd'], remindprop['wt'], false, pushTitle, title),
        sms: {},
        push: convertPushMessage(id, type, title, datetime)
      };
    }

    outputs.push(standardnext);
  }

  print({announces: outputs, continues: continues});

  // filter source code here end
  return JSON.stringify({announces: outputs, continues: continues});
}
