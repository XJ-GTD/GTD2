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
  public static isFirst: number = 1;

  public static defaultHeadImg: string = "./assets/imgs/headImg.jpg";

  public static NOT_PLAYER: string = "./assets/imgs/headImg.jpg";

  /*========== 语音对应文言 start =========*/
  public static XF_SPEECH_SCHEDULE_CREATE: string = "";
  public static XF_SPEECH_SCHEDULE_DELETE: string = "";
  public static XF_SPEECH_SCHEDULE_FIND: string = "";
  public static XF_SPEECH_PLAYER_CREATE: string = "";
  public static XF_SPEECH_PLAYER_FIND: string = "";

  /*========== 语音对应文言  end  =========*/

  /* ------- 字典数据 ---------*/
  public static ZTD_MAP: Map<string, any> = new Map<string, any>();
  public static REPEAT_TYPE: string = '12';
  //随机语音播报字典类型
  public static TEXT_TYPE: string = '401';
  //提醒方式
  public static ALARM_TYPE: string = '13';
  //随机语音播报字典内容
  public static TEXT_CONTENT: Map<string, any> = new Map<string, any>();
  //随机语音播报字典类型
  public static MESSAGE_TYPE: string = '400';


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
  public static MQTQ: string = '0'; // 处理逻辑前用户问答
  public static MQTM: string = '1'; // 处理逻辑前讯飞回答
  public static MQTL: string = '2'; // 处理逻辑后

  /* ============ Sql执行类型 ===============*/
  public static AC_O: string = '0'; // 添加
  public static AC_T: string = '1'; // 更新
  public static AC_D: string = '2'; // 删除

  /* ============ 页面名字配置 ===============*/
  static PAGE = {

    _H_PAGE: "HPage",        // 首页 - 首页
    _TDL_PAGE: "TdlPage",        // 日程 - 日程列表
    _TDC_PAGE: "TdcPage",        // 日程 - 日程详情新建
    _TDDI_PAGE: "TddiPage",      // 日程 - 日程详情（受邀）
    _TDDJ_PAGE: "TddjPage",      // 日程 - 日程详情
    _LP_PAGE: "LpPage",       // 登陆注册 - 登陆（密码）
    _LS_PAGE: "LsPage",       // 登陆注册 - 登录（验证码）
    _R_PAGE: "RPage",         // 登陆注册 - 注册
    _PP_PAGE: "PPage",        // 登陆注册 - 条款
    _M_PAGE: "MPage",         // 辅助功能 - 菜单
    _PL_PAGE: "PlPage",       // 辅助功能 - 计划
    _PLA_PAGE: "PlaPage",       //  日程 - 计划
    _PC_PAGE: "PcPage",       // 辅助功能 - 计划新建
    _PD_PAGE: "PdPage",       // 辅助功能 - 计划展
    _SS_PAGE: "SsPage",       // 辅助功能 - 系统设置
    _SST_PAGE: "SstPage",    // 辅助功能 - 系统设置 - 提醒设置
    _HL_PAGE: "HlPage",       // 辅助功能 - 帮助及反馈
    _GL_PAGE: "GlPage",       // 辅助功能 - 群组列表
    _GC_PAGE: "GcPage",       // 辅助功能 - 群组编辑
    _GA_PAGE: "GaPage",       // 辅助功能 - 群组添加
    _FS_PAGE: "FsPage",       // 辅助功能 - 选择参与人
    _FD_PAGE: "FdPage",       // 辅助功能 - 参与人详情
    _PS_PAGE: "PsPage",       // 辅助功能 - 个人设置
    _BL_PAGE: "BlPage",       // 辅助功能 - 黑名单
    _BR_PAGE: "BrPage",       // 辅助功能 - 备份
    _AL_PAGE: "AlPage"        //启动页
  }

  /* ============ 返回值配置 ===============*/
  public static SUCCESS_CODE: number = 0;
  public static SUCCESS_MESSAGE: string = '成功！';
  public static ERR_CODE: number = 1;
  public static ERR_MESSAGE: string = '系统出错！';
  public static NULL_CODE: number = 2;
  public static NULL_MESSAGE: string = '查询结果不存在！';
  public static EXSIT_CODE: number = 3;
  public static EXSIT_MSG: string = '该数据已存在！';
  public static NOT_NETWORK_CODE: number = 4;
  public static NOT_NETWORK_MSG: string = '当前没有网络！';
  public static QX_NOT_CODE: number = 5;
  public static QX_NOT_MESSAGE: string = '您没有权限！';
  public static NOT_PARA_CODE: number = 6;
  public static NOT_PARA_MESSAGE: string = '参数不能为空！';

  public static RETURN_MSG: Map<string, any> = new Map<string, any>();


  /* ============ webscoct  需要用配置 ===============*/
  //通用操作
  public static XF_NMT: string = "A0001";    //确认
  public static XF_NMC: string = "A0002";    //取消

  //讯飞指令
  public static XF_SCC: string = "A1101";    //讯飞：日程添加
  public static XF_SCD: string = "A1102";    //讯飞：日程删除
  public static XF_SCF: string = "A1103";    //讯飞：日程查询
  public static XF_PEC: string = "A1201";    //讯飞：参与人添加
  public static XF_PED: string = "A1202";    //讯飞：参与人删除
  public static XF_PEF: string = "A1203";    //讯飞：参与人查询
  public static XF_PEA: string = "A1204";    //讯飞：参与人授权
  public static XF_SYSH: string = "A1301";    //讯飞：私密模式

  //其他技能
  public static XF_OTS: string = "B1000";    //全部其他技能
  public static XF_OTWT: string = "B1001";    //天气
  public static XF_OTCN: string = "B1002";    //万年历
  public static XF_OTDT: string = "B1003";    //日期

  //业务指令
  public static BC_SCC: string = "D1101";    //添加日程
  public static BC_SCD: string = "D1102";    //删除日程
  public static BC_SCU: string = "D1103";    //更新日程
  public static BC_PEC: string = "D1201";    //添加参与人


}
