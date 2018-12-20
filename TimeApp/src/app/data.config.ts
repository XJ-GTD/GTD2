import {UEntity} from "../entity/u.entity";

/**
 * 公共配置用
 */
export class DataConfig {

  public static SUCCESS_CODE : number = 0;
  public static SUCCESS_MESSAGE : string ='成功！';
  public static ERR_CODE : number = 1;
  public static ERR_MESSAGE : string='系统出错！';
  public static NULL_CODE : number= 2;
  public static NULL_MESSAGE : string='查询结果不存在！';

  //用户信息
  public static uInfo:UEntity = null;
  /**
   * 0正常进入1首次进入2无数据3更新后进入
   * @type {string}
   */
  public static isFirst:number = 1;

  public static defaultHeadImg:string = "./assets/imgs/headImg.jpg"

}
