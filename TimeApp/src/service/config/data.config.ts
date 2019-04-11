/**
 * 公共配置用
 */
import {ContextModel, WsModel} from "../../ws/model/ws.model";
import {ProcesRs} from "../../ws/model/proces.rs";
import {UserConfig} from "./user.config";
import {Fs4cPage} from "../../pages/fs/fs4c";
import {HPage} from "../../pages/h/h";
import {TdlPage} from "../../pages/tdl/tdl";
import {TdcPage} from "../../pages/tdc/tdc";
import {TddiPage} from "../../pages/tdc/tddi";
import {TddjPage} from "../../pages/tdc/tddj";
import {LpPage} from "../../pages/lp/lp";
import {LsPage} from "../../pages/ls/ls";
import {PfPage} from "../../pages/pf/pf";
import {PPage} from "../../pages/p/p";
import {MPage} from "../../pages/m/m";
import {RPage} from "../../pages/r/r";
import {PlPage} from "../../pages/pl/pl";
import {PcPage} from "../../pages/pc/pc";
import {PdPage} from "../../pages/pd/pd";
import {SsPage} from "../../pages/ss/ss";
import {HlPage} from "../../pages/hl/hl";
import {GlPage} from "../../pages/gl/gl";
import {GcPage} from "../../pages/gc/gc";
import {GaPage} from "../../pages/ga/ga";
import {Fs4gPage} from "../../pages/fs/fs4g";
import {FdPage} from "../../pages/fd/fd";
import {BlPage} from "../../pages/bl/bl";
import {PsPage} from "../../pages/ps/ps";
import {BrPage} from "../../pages/br/br";
import {AlPage} from "../../pages/al/al";
import {TddsPage} from "../../pages/tdc/tdds";

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

    _H_PAGE: HPage,        // 首页 - 首页
    _TDL_PAGE: TdlPage,        // 日程 - 日程列表
    _TDC_PAGE: TdcPage,        // 日程 - 日程详情新建
    _TDDI_PAGE: TddiPage,      // 日程 - 日程详情（受邀）
    _TDDJ_PAGE: TddjPage,      // 日程 - 日程详情(发布人)
    _TDDS_PAGE: TddsPage,      // 日程 - 日程详情（系统）
    _LP_PAGE: LpPage,       // 登陆注册 - 登陆（密码）
    _LS_PAGE: LsPage,       // 登陆注册 - 登录（验证码）
    _PF_PAGE: PfPage,       // 登陆注册 - 忘记密码
    _R_PAGE: RPage,         // 登陆注册 - 注册
    _PP_PAGE: PPage,        // 登陆注册 - 条款
    _M_PAGE: MPage,         // 辅助功能 - 菜单
    _PL_PAGE: PlPage,       // 辅助功能 - 计划
    _PC_PAGE: PcPage,       // 辅助功能 - 计划新建
    _PD_PAGE: PdPage,       // 辅助功能 - 计划展
    _SS_PAGE: SsPage,       // 辅助功能 - 系统设置
    _HL_PAGE: HlPage,       // 辅助功能 - 帮助及反馈
    _GL_PAGE: GlPage,       // 辅助功能 - 群组列表
    _GC_PAGE: GcPage,       // 辅助功能 - 群组编辑
    _GA_PAGE: GaPage,       // 辅助功能 - 群组添加
    _FS4C_PAGE: Fs4cPage,       // 辅助功能 - 选择参与人日程
    _FS4G_PAGE: Fs4gPage,       // 辅助功能 - 选择参与人群组
    _FD_PAGE: FdPage,       // 辅助功能 - 参与人详情
    _PS_PAGE: PsPage,       // 辅助功能 - 个人设置
    _BL_PAGE: BlPage,       // 辅助功能 - 黑名单
    _BR_PAGE: BrPage,       // 辅助功能 - 备份
    _AL_PAGE: AlPage        //启动页
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
  public static HUIBASE64:string = "data:image/png;base64,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";
//群组系统默认头像
  public static QZ_HUIBASE64:string ="data:image/png;base64,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"
}
