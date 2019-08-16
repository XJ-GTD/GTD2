/**
 * create by on 2019/3/5
 */

//接口
export interface ITbl {

  cT():string ;

  upT():string ;

  dT():string ;

  sloT():string ;

  slT():string ;

  drT():string ;

  inT():string ;

  rpT():string ;

  preT():string ;//使用预编译接口，解决数据中存在引号等影响sql处理的字符
}

export function convertQuotes(src: string): string {
  return src.replace(/"/g, "\"\"");
}
