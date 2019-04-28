function shouldclean(datasource) 
{
  var result = {};
  // filter source code here start
  var input = JSON.parse(datasource);

  if (input !== undefined && input['acj_formatchange_end'] && input['exc_userinfo_end']) {
    return true;
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
  var message = input['acj_formatchange_end']['cleaned'];
  var userinfo = input['exc_userinfo_end']['executed'];
  print(JSON.stringify(message));
  print(JSON.stringify(userinfo));

  if (userinfo && userinfo['type'] === 'JsonObject' && userinfo['response'] && userinfo['response']['data'] && userinfo['response']['data']['name']) {
    message['announceContent']['mwxing']['sms']['template']['name'] = userinfo['response']['data']['name'];
  } else {
    message['announceContent']['mwxing']['sms']['template']['name'] = '冥王星用户';
  }
  
  print(JSON.stringify(message));
  
  // filter source code here end
  return JSON.stringify(message);
}