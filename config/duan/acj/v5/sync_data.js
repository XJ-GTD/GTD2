function shouldclean(datasource)
{
  var result = {};
  // filter source code here start
  var input = JSON.parse(datasource);

  if (input !== undefined && input['from'] && input['to'] && input['agenda'] && input['notifyType']) {

    if (input['_context'] && input['_context'].productId === 'cn.sh.com.xj.timeApp' && input['_context'].productVersion === 'v1') return false;

    return true;
  }

  // filter source code here end
  return false;
}
