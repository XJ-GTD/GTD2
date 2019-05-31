function shouldclean(datasource)
{
  var result = {};
  // filter source code here start
  var input = JSON.parse(datasource);

  if (input !== undefined && input['xfy_iat_end'] && input['xfy_nlp_end']) {
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
  var markup = input['markup_nlp_end']? (input['markup_nlp_end']['parsed']? input['markup_nlp_end']['parsed'] : undefined) : undefined;
  print(JSON.stringify(iat));
  print(JSON.stringify(nlp));
  print(JSON.stringify(markup));

  var names = new Array();

  if (iat && iat['names'] && iat['names'].length > 1) {
    for (var id in iat['names']) {
      var name = iat['names'][id];

      names.push({n: name});
    }

    if (nlp && nlp['announceContent'] && nlp['announceContent']['mwxing'] && nlp['announceContent']['mwxing']['header'] && nlp['announceContent']['mwxing']['header']['describe']) {
      if (nlp['announceContent']['mwxing']['header']['describe'].contains('F')) {
        for (var pid in nlp['announceContent']['mwxing']['header']['describe']) {
          if (nlp['announceContent']['mwxing']['header']['describe'][pid] === 'F') {
            nlp['announceContent']['mwxing']['content'][(pid + '')]['parameters']['fs'] = names;
          }
        }
      }
    }
  }

  if (markup && markup['markup']) {
    if (nlp && nlp['announceContent'] && nlp['announceContent']['mwxing'] && nlp['announceContent']['mwxing']['header'] && nlp['announceContent']['mwxing']['header']['describe']) {
      if (nlp['announceContent']['mwxing']['header']['describe'].contains('F')) {
        for (var pid in nlp['announceContent']['mwxing']['header']['describe']) {
          if (nlp['announceContent']['mwxing']['header']['describe'][pid] === 'F') {
            nlp['announceContent']['mwxing']['content'][(pid + '')]['parameters']['marks'] = markup['markup'];
          }
        }
      }
    }
  }

  var standardnext = nlp;

  print(JSON.stringify(standardnext));

  // filter source code here end
  return JSON.stringify(standardnext);
}
