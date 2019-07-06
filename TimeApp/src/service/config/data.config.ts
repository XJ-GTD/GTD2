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
import {TdmPage} from "../../pages/tdm/tdm";
import {TdmePage} from "../../pages/tdm/tdme";
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
import {LogPage} from "../../pages/log/log";
import {AtPage} from "../../pages/at/at";
import {DaPage} from "../../pages/da/da";
import {DrPage} from "../../pages/dr/dr";
import {TxPage} from "../../pages/tx/tx";
import {BzPage} from "../../pages/bz/bz";
import {JhPage} from "../../pages/jh/jh";
import {DzPage} from "../../pages/dz/dz";
import {CfPage} from "../../pages/cf/cf";

export class DataConfig {
  public static isdebug: boolean  = true;
  public static islog: boolean = false;
  //2019/04/29 增加日志表操作
  //public static version:number = 1;
  //2019/05/09 增加语音回答表
  //public static version:number = 2;
  //2019/05/10 修改设备ID缓存到数据库,防止应用升级时获取设备ID被改变
  //public static version:number = 3;
  //2019/05/28 增加日程语义标签标注表
  //public static version:number = 4;
  //2019/06/03 增加每日简报个性化参数
  //public static version:number = 5;
  //2019/06/17 增加JT表特殊数据保存字段
  public static version:number = 6;

  public static RABBITMQ_STATUS: string = "";

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

//操作process
  public static clearWsProcessor(){
    this._wsProcessors.splice(0,this._wsProcessors.length);
  }

  public static putWsProcessor(_processor:string){
    this._wsProcessors.push(_processor);
  }

  public static getWsProcessor():string{
    return this._wsProcessors.shift();
  }

  public static get wsWsProcessor(): Array<string> {
    return this._wsProcessors;
  }

  public static set wsWsProcessor(value: Array<string>) {
    this._wsProcessors = value;
  }

  private static _wsProcessors:Array<string> = new Array<string>();


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
  //震动和音效
  public static SYS_Z: string = "Z";
  //每日简报
  public static SYS_DR: string = "DR";
  public static SYS_DRP1: string = "DRP1";
  //日历
  public static SYS_DJH: string = "DJH";
  /*========== 系统设置区分 =========*/



  /*----===== 网络状态值 =====----- */
  // 2019/6/18 删除网络状态变量，通过网络服务接口调用查询
  //public static IS_NETWORK_CONNECT: boolean = true;

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
    _TDM_PAGE: TdmPage,        // 日程 - TimePage风格日程详情新建
    _TDME_PAGE: TdmePage,      // 日程 - TimePage风格日程详情修改
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
    _AL_PAGE: AlPage,       //启动页
    _LOG_PAGE: LogPage,       // 辅助功能 - 备份
    _AT_PAGE: AtPage,       // 关于
    _DA_PAGE: DaPage,       // 日程 - 每日日程
    _DR_PAGE: DrPage,       // 每日简报设置 - 智能提醒
    _TX_PAGE: TxPage,       // 设置提醒
    _BZ_PAGE: BzPage,       // 设置备注
    _JH_PAGE: JhPage,       // 设置计划/日历
    _DZ_PAGE: DzPage,       // 设置地址
    _CF_PAGE: CfPage,       // 设置重复
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


  //系统默认头像 128 * 128
  public static HUIBASE64:string = "data:image/png;base64,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";
  //群组系统默认头像 128 * 128
  public static QZ_HUIBASE64:string ="data:image/png;base64,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";

  //系统默认头像 256 * 256
  public static HUIBASE64_LARGE:string = "data:image/png;base64,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";
  //群组系统默认头像 256 * 256
  public static QZ_HUIBASE64_LARGE:string ="data:image/png;base64,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";

  public static REPEATIMG:string = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAFCAYAAAAkG+5xAAAAfUlEQVQokcXSsQoCQQxF0TPLFmolypSC1v7/z9hY2IjgNqJoY2wshlHBAcE0ySUkeQlJEeEHNsbq6c/Y4vZNYYqIBeaNA4/YFbzGqOATNgUvMX3Xp0dGahSQCwFdNRwmRdz5vGDuscesQURgKPiOayXiUuUPXi8QGNK/f+ABMIYfLaWIwo0AAAAASUVORK5CYII=";



  //帮助
  public static helps = [
    "在主界面左划是列表模式，右划可以弹出菜单。",
    "可以语音创建活动，比如说：安排小飞明天上午来公司开会。",
    "说：小吉，你好。 可以唤出语音。",
    "说：我今天有什么安排。可以看到今天安排的内容。",
    "长按月模式下的日期可以快速创建活动。",
    "你可以在活动日历中给你的活动创建一个归类。",
    "月模式上的颜色越深表示你越忙。",
    "你的朋友给的活动，你只可以修改备注和提醒的时间，当然不喜欢的话可以删除掉活动。",
    "如果有人不断给你发你不喜欢的活动，可以点击头像把他（她）放黑名单试试。",
    "我还能帮你查询天气。",
    "你可以发送活动给你的朋友，这些朋友都是你手机通讯录里的人。",
    "文字输入和语音其实是一样的，只不过语音输入更加便捷。",
    "如果你每次分享活动的时候选择朋友太多，创建一个群组可以快速选择一群朋友。",
  ]
}
