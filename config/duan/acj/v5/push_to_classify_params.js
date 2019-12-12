//MWXING_PUSH_TO_CLASSIFY_V1_5
function shouldclean(datasource) {
  var result = {};
  // filter source code here start
  var input = JSON.parse(datasource);

  if (input !== undefined && input['pushfrom'] && input['_exchangephoneno'] && input['datas']) {
    return true;
  }

  // filter source code here end
  return false;
}

/**
 * 获取原有数据，添加生成分类处理流输入参数
 **/
function clean(datasource) {
  var result = {};
  print('Start Nashorn Javascript processing...');
  print(datasource);
  // filter source code here start
  var input = JSON.parse(datasource);

  var pushfrom = input['pushfrom'];
  var exchangephoneno = input['_exchangephoneno'];
  var datas = input['datas'];

  // 转换成mwxing_data_sync_push_start处理流输入参数格式
  var output = [];

  if (pushfrom == exchangephoneno) {
    for (var index in datas) {
      var data = datas[index];
      var payload = data["payload"];

      if (!payload) continue;

      var classify = {};
      classify["owner"] = pushfrom;
      classify["agenda"] = payload;

      output.push(classify);
    }
  }

  return JSON.stringify({requests: output});
}
