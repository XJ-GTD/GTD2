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

  /* ------- 字典数据 ---------*/
  public static ZTD_MAP:Map<string,any> = new Map<string,any>();
  public static REPEAT_TYPE:string = '12';

  /* =============== 同步表名 ==================*/
  public static GTD_B:string='GTD_B'; //联系人表
  public static GTD_B_X:string='GTD_B_X'; //群组关联表
  public static GTD_C:string='GTD_C'; //日程表
  public static GTD_D:string='GTD_D'; //日程参与人表
  public static GTD_C_RC:string='GTD_C_RC'; //日程子表
  public static GTD_C_C:string='GTD_C_C';//日程子表
  public static GTD_C_BO:string='GTD_C_BO';//日程子表
  public static GTD_C_JN:string='GTD_C_JN';//日程子表
  public static GTD_C_MO:string='GTD_C_MO';//日程子表
  public static GTD_J_H:string='GTD_J_H';//计划表

}
