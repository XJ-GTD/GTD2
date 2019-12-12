//MWXING_JOIN_AGENDA_V1_5
function shouldclean(datasource) {
  var result = {};
  // filter source code here start
  var input = JSON.parse(datasource);

  if (input !== undefined && input['userinfo'] && input['from'] && input['from']['phoneno'] && input['from']['name'] && input['deviceId'] && input['deviceId'].startsWith('web_') && input['datas']) {

    return true;
  }

  // filter source code here end
  return false;
}

/**
 * 获取原有数据，添加参与人后生成新的push数据
 **/
function clean(datasource) {
  var result = {};
  print('Start Nashorn Javascript processing...');
  print(datasource);
  // filter source code here start
  var input = JSON.parse(datasource);

  var userinfo = input['userinfo'];
  var deviceId = input['deviceId'];
  var from = input['from'];
  var datas = input['datas'];

  // 转换成mwxing_data_sync_push_start处理流输入参数格式
  var output = {
    mwxing: {
      lt: '',
      pi: '',
      pv: '',
      dt: 'thirdparty',
      ai: from.phoneno,
      di: deviceId
    },
    mpn: from.phoneno,
    name: from.name,
    d: []
  };

  for (var index in datas) {
    var data = datas[index];

    if (!data.to) data.to = [];
    // 参与人不存在本次加入用户，则加入
    if (data.to.indexOf(userinfo.phoneno) < 0) {
      data.to.push(userinfo.phoneno);
      var pn = data.payload['pn'] || 0;
      pn++; // 参与人数+1
      data.payload['pn'] = pn + '';
    } else {
      continue;
    }
    // checksum 等待日程checksum处理逻辑后补充
    output.d.push(data);
  }

  return JSON.stringify(output);
}
