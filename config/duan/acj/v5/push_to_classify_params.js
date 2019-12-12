//MWXING_PUSH_TO_CLASSIFY_V1_5
function shouldclean(datasource) {
  var result = {};
  // filter source code here start
  var input = JSON.parse(datasource);

  if (input !== undefined && input['pushfrom'] && input['_exchangephoneno'] && input['_datatitle']) {
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
  var title = input['_datatitle'];
  var payload = input['payload'];

  // 转换成mwxing_data_sync_push_start处理流输入参数格式
  var output = {
  };

  if (pushfrom == exchangephoneno && payload) {
    output["owner"] = pushfrom;
    output["agenda"] = payload;
  }

  return JSON.stringify(output);
}
