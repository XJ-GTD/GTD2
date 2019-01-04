import {UEntity} from "../entity/u.entity";

/**
 * 公共配置用
 */
export class DataConfig {

  /*0游客身份，1登录*/
  public static IL:number=0;
  /* 判断是手机还是网页true是false不是 */
  public static IS_MOBILE : boolean=true;

  //用户信息
  public static uInfo:UEntity = new UEntity();
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
