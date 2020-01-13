// MWXING_TRAVISCI_TRIGGER_V1_5
function shouldclean(datasource)
{
  var result = {};
  // filter source code here start
  var input = JSON.parse(datasource);

  if (input !== undefined && input['travisci']) {

    return true;
  }

  // filter source code here end
  return false;
}

/**
 * 生成Travis-CI触发自动打包指令
 * https://docs.travis-ci.com/user/triggering-builds/
 **/
function clean(datasource)
{
  var result = {};
  print('Start Nashorn Javascript processing...');
  print(datasource);
  // filter source code here start
  var input = JSON.parse(datasource);

  var outputs = {
    header: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Travis-API-Version": 3,
      "Authorization": "token 4C-t2JWbPl5yRMJij95-oA"
    },
    body: {
      request: {
        message: "冥王星 智能助手 发起重新打包",
        branch: "cassiscornuta"
      }
    }
  };

  print(outputs);

  // filter source code here end
  return JSON.stringify(outputs);
}
