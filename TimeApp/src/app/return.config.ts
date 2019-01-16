/**
 * 公共配置用
 */
export class ReturnConfig {

  public static SUCCESS_CODE : number = 0;
  public static SUCCESS_MESSAGE : string ='成功！';
  public static ERR_CODE : number = 1;
  public static ERR_MESSAGE : string='系统出错！';
  public static NULL_CODE : number= 2;
  public static NULL_MESSAGE : string='查询结果不存在！';
  public static EXSIT_CODE : number= 3;
  public static EXSIT_MSG : string= '该数据已存在！';
  public static NOT_NETWORK_CODE : number= 4;
  public static NOT_NETWORK_MSG : string= '当前没有网络！';

  public static RETURN_MSG:Map<string,any>=new Map<string,any>();

}
