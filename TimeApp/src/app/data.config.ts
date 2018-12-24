import {UEntity} from "../entity/u.entity";

/**
 * 公共配置用
 */
export class DataConfig {

  /*0游客身份，1登录*/
  public static IL:number=0;

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


  /*========== 语音对应文言 start =========*/
  public static XF_SPEECH_SCHEDULE_CREATE: string = "";
  public static XF_SPEECH_SCHEDULE_DELETE: string = "";
  public static XF_SPEECH_SCHEDULE_FIND: string = "";
  public static XF_SPEECH_PLAYER_CREATE: string = "";
  public static XF_SPEECH_PLAYER_FIND: string = "";

  /*========== 语音对应文言  end  =========*/
}
