function shouldclean(datasource) 
{
  var result = {};
  // filter source code here start
  var input = JSON.parse(datasource);

  if (input !== undefined && input['xfy_iat_end'] && input['xfy_nlp_end']) {
    if (input['xfy_nlp_end']['cleaned']
    && input['xfy_nlp_end']['cleaned']['mwxing']
    && input['xfy_nlp_end']['cleaned']['mwxing']['header']
    && input['xfy_nlp_end']['cleaned']['mwxing']['header']['version'] !== 'V1.0')
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
  var iat = input['xfy_iat_end']['parsed'];
  var nlp = input['xfy_nlp_end']['cleaned'];
  print(JSON.stringify(iat));
  print(JSON.stringify(nlp));

  var names = new Array();
  
  if (iat && iat['names'] && iat['names'].length > 1) {
    for (var id in iat['names']) {
      var name = iat['names'][id];
      
      names.push({n: name});
    }

    if (nlp && nlp['announceContent'] && nlp['announceContent']['mwxing'] && nlp['announceContent']['mwxing']['content']) {
      for (var key in nlp['announceContent']['mwxing']['content']) {
        var content = nlp['announceContent']['mwxing']['content'][key];

        if (content['processor'] && content['processor'] === 'F' && content['parameters']) {
          content['parameters']['fs'] = names;
        }
      }
    }
  }
  
  var standardnext = nlp;
  
  print(JSON.stringify(standardnext));
  
  // filter source code here end
  return JSON.stringify(standardnext);
}