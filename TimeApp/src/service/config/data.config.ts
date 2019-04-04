/**
 * 公共配置用
 */
import {ContextModel, WsModel} from "../../ws/model/ws.model";
import {ProcesRs} from "../../ws/model/proces.rs";
import {UserConfig} from "./user.config";

export class DataConfig {


  /*----===== WS上下文环境使用 =====----- */
  public static clearWsContext(){
    this.wsContext.splice(0,this.wsContext.length);
  }

  public static putWsContext(_wsContext:ProcesRs){
    this.wsContext.push(_wsContext);
  }

  public static getWsContext():ProcesRs{
    return this.wsContext.shift();
  }

  public static get wsContext(): Array<ProcesRs> {
    return this._wsContext;
  }

  public static set wsContext(value: Array<ProcesRs>) {
    this._wsContext = value;
  }

  private static _wsContext:Array<ProcesRs> = new Array<ProcesRs>();

  //操作区分
  public static clearWsOpts(){
    this._wsOpts.splice(0,this._wsOpts.length);
  }

  public static putWsOpt(_opt:string){
    this._wsOpts.push(_opt);
  }

  public static getWsOpt():string{
    return this._wsOpts.shift();
  }

  public static get wsWsOpt(): Array<string> {
    return this._wsOpts;
  }

  public static set wsWsOpt(value: Array<string>) {
    this._wsOpts = value;
  }

  private static _wsOpts:Array<string> = new Array<string>();




  public static get wsServerContext():any {
    return this._wsServerContext?this._wsServerContext:{};
  }

  public static set wsServerContext(value:any) {
    this._wsServerContext = value;
  }

  private static _wsServerContext:any = {};

  /*----===== WS上下文环境使用 =====----- */

  /*========== 设置提醒区分 =========*/
  //1：日程事件，
  public static RMSCD: string = "1";
  //2：无关联日程提醒
  public static RMNONESCD: string = "2";

  public static REINTERVAL:number = 60;
  /*========== 设置提醒区分 =========*/


  /*========== 系统设置区分 =========*/
  //唤醒
  public static SYS_H: string = "H";
  //新消息提醒
  public static SYS_T: string = "T";
  //语音播报
  public static SYS_B: string = "B";
  //震动
  public static SYS_Z: string = "Z";
  /*========== 系统设置区分 =========*/



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
    _PC_PAGE: "PcPage",       // 辅助功能 - 计划新建
    _PD_PAGE: "PdPage",       // 辅助功能 - 计划展
    _SS_PAGE: "SsPage",       // 辅助功能 - 系统设置
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
  /* ============ 页面名字配置 ===============*/

  /*----===== 语音区分 =====----- */
  public static SPEECH: string = "SPEECH";    //系统表语音key
  public static HL: string	= "HL";                  //问候语
  public static LH: string	= "LH";	                  //	进入教程
  public static AA: string	= "AA";	                  //	确认操作后回答
  public static BB: string	= "BB";	                  //	取消操作后回答
  public static CC: string	= "CC";	                  //	查询后回答（数量）
  public static DD: string	= "DD";	                  //	设置后回答
  public static EE: string	= "EE";	                 //	确认取消回答
  public static FF: string	= "FF";	                  //	异常回答
  public static UNKNOWN: string	= "UNKNOWN";	                 //	确认取消回答
  public static GG: string	= "GG";	                  //	提醒设置完毕
  /*----===== 语音区分 =====----- */




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


//系统默认头像
  public static HUIBASE64:string = "data:image/png;base64,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"

}
