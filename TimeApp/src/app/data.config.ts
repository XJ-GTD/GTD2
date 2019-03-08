/**
 * 公共配置用
 */
export class DataConfig {

  /*----===== 网络状态值 =====----- */
  public static IS_NETWORK_CONNECT: boolean = true;

  /**
   * 0正常进入1首次进入2无数据3更新后进入
   * @type {string}
   */
  public static isFirst:number = 1;

  public static defaultHeadImg:string = "./assets/imgs/headImg.jpg";

  public static NOT_PLAYER:string = "./assets/imgs/headImg.jpg";

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
  //随机语音播报字典类型
  public static TEXT_TYPE:string = '401';
  //提醒方式
  public static ALARM_TYPE:string = '13';
  //随机语音播报字典内容
  public static TEXT_CONTENT:Map<string,any> = new Map<string,any>();
  //随机语音播报字典类型
  public static MESSAGE_TYPE:string = '400';
  /* =============== 同步表名 ==================*/
  public static GTD_A:string='GTD_A'; //用户表
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

  public static TABLE_NAMES:Array<string>=['GTD_B','GTD_B_X','GTD_C','GTD_D',
    'GTD_C_RC','GTD_C_C','GTD_C_BO','GTD_C_JN','GTD_C_MO','GTD_J_H'];//计划表

  /* =============== 语音页面type =============*/
  public static U1: string = "U1"; //用户语音文本 或 需要播报的业务信息
  public static S1: string = "S1"; //回答文本
  public static S2: string = "S2"; //回答链接
  public static S3: string = "S3"; //回答图片
  public static S4: string = "S4"; //日程单条数据
  public static S5: string = "S5"; //日程列表数据
  public static S6: string = "S6";//联系人单条数据
  public static S7: string = "S7";//联系人列表数据
  public static T1: string = "T1";//确认
  public static F1: string = "F1";//取消

  /* ============ mq返回类型 ===============*/
  public static MQTQ : string = '0'; // 处理逻辑前用户问答
  public static MQTM : string = '1'; // 处理逻辑前讯飞回答
  public static MQTL : string = '2'; // 处理逻辑后

  /* ============ Sql执行类型 ===============*/
  public static AC_O : string = '0'; // 添加
  public static AC_T : string = '1'; // 更新
  public static AC_D : string = '2'; // 删除


}
