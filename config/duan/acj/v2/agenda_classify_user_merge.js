function shouldclean(datasource)
{
  var result = {};
  // filter source code here start
  var input = JSON.parse(datasource);

  if (input !== undefined && input['nlp_markup_end'] && input['acj_agendainfo_end']) {
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
  var message = input['acj_agendainfo_end']['cleaned'];
  var markup = input['nlp_markup_end']['parsed'];

  print(JSON.stringify(message));
  print(JSON.stringify(markup));

  if (markup && markup['markup'] && markup['markup'].length > 0) {
    var mkl = markup['markup'].join(',');

    if (mkl
      && message
      && message['announceContent']
      && message['announceContent']['mwxing']
      && message['announceContent']['mwxing']['content']
      && message['announceContent']['mwxing']['content']['0']
      && message['announceContent']['mwxing']['content']['0']['parameters']
      && message['announceContent']['mwxing']['content']['0']['parameters']['mks']
      && message['announceContent']['mwxing']['content']['0']['parameters']['mks'][0])
      message['announceContent']['mwxing']['content']['0']['parameters']['mks'][0]['mkl'] = mkl;
  }

  print(JSON.stringify(message));

  // filter source code here end
  return JSON.stringify(message);
}
