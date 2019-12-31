/**
 * 公共配置用
 */
import {ProcesRs} from "../../ws/model/proces.rs";
import {HPage} from "../../pages/h/h";
import {TdlPage} from "../../pages/tdl/tdl";
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
import {Fs4foPage} from "../../pages/fs/fs4fo";
import {FdPage} from "../../pages/fd/fd";
import {BlPage} from "../../pages/bl/bl";
import {PsPage} from "../../pages/ps/ps";
import {BrPage} from "../../pages/br/br";
import {AlPage} from "../../pages/al/al";
import {LogPage} from "../../pages/log/log";
import {AtPage} from "../../pages/at/at";
import {DoPage} from "../../pages/do/do";
import {AgendaPage} from "../../pages/agenda/agenda";
import {MemoPage} from "../../pages/memo/memo";
import {JhPage} from "../../pages/jh/jh";
import {AipPage} from "../../pages/aip/aip";
import {CommentPage} from "../../pages/comment/comment";
import {RepeatPage} from "../../pages/repeat/repeat";
import {RemindPage} from "../../pages/remind/remind";
import {PlanPage} from "../../pages/plan/plan";
import {InvitesPage} from "../../pages/invites/invites";
import {LocationPage} from "../../pages/location/location";
import {AttachPage} from "../../pages/attach/attach";
import {DailyMemosPage} from "../../pages/dailymemos/dailymemos";
import {CommemorationDayPage} from "../../pages/commemorationday/commemorationday";
import {DtSelectPage} from "../../pages/dtselect/dtselect";
import {MemberPage} from "../../pages/member/member";
import {GloryPage} from "../../pages/glory/glory";
import {AtmePage} from "../../pages/atme/atme";
import {PlusModal} from "../../pages/h/plusModal";
import {AtMemberPage} from "../../pages/atmember/atmember";

export class DataConfig {
  public static isdebug: boolean = true;
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
  //public static version: number = 6;
  //2019/11/18 增加at表
  //public static version: number = 7;
  //2019/11/20 群组表增加字段
  //public static version: number = 8;
  //2019/11/21 事件表加关联，事件变更类型字段
  //public static version: number = 9;
  //2019/11/23 增加读写表
  //public static version: number = 10;
  //2019/12/13 增加checksum字段
  //public static version: number = 11;
  //设置对提醒类的开关
  //public static version: number = 12;
  //设置对提醒类的开关
  //public static version: number = 13;
  //设置对AI语音的开关
  //public static version: number = 14;
  //对他人提醒铃声
  //public static version: number = 15;
  //补丁服务测试
  public static version: number = 21;

  public static RABBITMQ_STATUS: string = "";

  // 清楚讯飞上下文
  public static clearAIContext: boolean = false;

  /*----===== WS上下文环境使用 =====----- */
  public static clearWsContext() {
    this.wsContext.splice(0, this.wsContext.length);
  }

  public static putWsContext(_wsContext: ProcesRs) {
    this.wsContext.push(_wsContext);
    if (this.wsContext.length > 5) {
      this.wsContext.shift();
    }
  }

  public static getWsContext(): ProcesRs {
    return this.wsContext.shift();
  }

  public static get wsContext(): Array<ProcesRs> {
    return this._wsContext;
  }

  public static set wsContext(value: Array<ProcesRs>) {
    this._wsContext = value;
  }

  private static _wsContext: Array<ProcesRs> = new Array<ProcesRs>();

  //操作区分
  public static clearWsOpts() {
    this._wsOpts.splice(0, this._wsOpts.length);
  }

  public static putWsOpt(_opt: string) {
    this._wsOpts.push(_opt);
  }

  public static getWsOpt(): string {
    return this._wsOpts.shift();
  }

  public static get wsWsOpt(): Array<string> {
    return this._wsOpts;
  }

  public static set wsWsOpt(value: Array<string>) {
    this._wsOpts = value;
  }

  private static _wsOpts: Array<string> = new Array<string>();

//操作process
  public static clearWsProcessor() {
    this._wsProcessors.splice(0, this._wsProcessors.length);
  }

  public static putWsProcessor(_processor: string) {
    this._wsProcessors.push(_processor);
  }

  public static getWsProcessor(): string {
    return this._wsProcessors.shift();
  }

  public static get wsWsProcessor(): Array<string> {
    return this._wsProcessors;
  }

  public static set wsWsProcessor(value: Array<string>) {
    this._wsProcessors = value;
  }

  private static _wsProcessors: Array<string> = new Array<string>();


  public static get wsServerContext(): any {
    return this._wsServerContext ? this._wsServerContext : {};
  }

  public static set wsServerContext(value: any) {
    this._wsServerContext = value;
  }

  private static _wsServerContext: any = {};

  /*----===== WS上下文环境使用 =====----- */

  /*========== 设置提醒区分 =========*/
  //1：日程事件，
  public static RMSCD: string = "1";
  //2：无关联日程提醒
  public static RMNONESCD: string = "2";

  public static REINTERVAL: number = 60;
  /*========== 设置提醒区分 =========*/


  /*========== 系统设置区分 =========*/
  //关闭消息
  public static SYS_CLV: string = "CLV";
  //简单播报
  public static SYS_SIV: string = "SIV";
  //合并播报
  public static SYS_CBV: string = "CBV";
  //自动听筒
  public static SYS_ALIS: string = "ALIS";
  //向导简要提示
  public static SYS_SIP: string = "SIP";
  //交互方式
  public static SYS_JF: string = "JF";
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

  //主题
  public static SYS_THEME: string = "THEME";
  //自动加入TODO
  public static SYS_AUTOTODO: string = "AUTOTODO";

  //项目跟进
  public static SYS_FOGH: string = "FOGH";
  public static SYS_FOGHSECRET: string = "FOGHSECRET";
  public static SYS_FOGH_INS: string = "FOGH_INS";
  public static SYS_FOGH_INS_SHARE: string = "FOGH_INS_SHARE";
  public static SYS_FOGHIN_INS: string = "FOGHIN_INS";
  public static SYS_FOGHIN_INS_FROM: string = "FOGHIN_INS_FROM";
  public static SYS_FOFIR: string = "FOFIR";                      //跟进开关
  public static SYS_FOFIR_INS: string = "FOFIR_INS";              //实例
  public static SYS_FOFIR_INS_SHARE: string = "FOFIR_INS_SHARE";  //实例共享成员
  public static SYS_FOFIRIN_INS: string = "FOFIRIN_INS";          //被共享实例
  public static SYS_FOFIRIN_INS_FROM: string = "FOFIRIN_INS_FROM";          //被共享实例发送人
  public static SYS_FOTRACI: string = "FOTRACI";
  /*========== 系统设置区分 =========*/


  /*----===== 网络状态值 =====----- */
  // 2019/6/18 删除网络状态变量，通过网络服务接口调用查询
  //public static IS_NETWORK_CONNECT: boolean = true;

  /**
   * 0正常进入1首次进入2无数据3更新后进入
   * @type {string}
   */
  public static isFirst: number = 1;


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
    _Ai_PAGE: AipPage,     // 设置项目跟进实例可选项
    _TDL_PAGE: TdlPage,        // 日程 - 日程列表
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
    _FS4G_PAGE: Fs4gPage,       // 辅助功能 - 选择参与人群组
    _FS4FO_PAGE: Fs4foPage,       // 设置项目跟进通知人选择
    _FD_PAGE: FdPage,       // 辅助功能 - 参与人详情
    _PS_PAGE: PsPage,       // 辅助功能 - 个人设置
    _BL_PAGE: BlPage,       // 辅助功能 - 黑名单
    _BR_PAGE: BrPage,       // 辅助功能 - 备份
    _AL_PAGE: AlPage,       //启动页
    _LOG_PAGE: LogPage,       // 辅助功能 - 备份
    _AT_PAGE: AtPage,       // 关于
    _DO_PAGE: DoPage,       // 任务 - 待处理/已处理任务一览
    _ATME_PAGE: AtmePage,       //  让我关注画面
    _AGENDA_PAGE: AgendaPage,   // 日程 - 创建/修改
    _MEMO_PAGE: MemoPage,       // 备忘 - 创建/修改
    _COMMENT_PAGE: CommentPage, // 日程 - 备注
    _REPEAT_PAGE: RepeatPage, // 日程 - 重复
    _REMIND_PAGE: RemindPage,   // 日程 - 提醒
    _PLAN_PAGE: PlanPage,   // 日程 - 计划
    _INVITES_PAGE: InvitesPage, // 日程 - 邀请人
    _MEMBER_PAGE: MemberPage, // 日程 - 邀请人-选择
    _ATMEMBER_PAGE: AtMemberPage, // 日程 - @参与人
    _GLORY_PAGE: GloryPage, // 每日荣耀
    _LOCATION_PAGE: LocationPage, // 日程 - 地址
    _ATTACH_PAGE: AttachPage,     // 日程 - 附件
    _DAILYMEMOS_PAGE: DailyMemosPage, // 备忘 - 每日备忘
    _COMMEMORATIONDAY_PAGE: CommemorationDayPage, // 纪念日 - 创建/修改
    _DTSELECT_PAGE: DtSelectPage, // 纪念日 - 创建/修改
    _JH_PAGE: JhPage,       // 设置计划/日历
    _PLUS_MODAL: PlusModal,       // 活动 日历项选择

  }
  static PAGES = [
    HPage,        // 首页 - 首页
    AipPage,     // 设置项目跟进实例可选项
    TdlPage,        // 日程 - 日程列表
    LpPage,       // 登陆注册 - 登陆（密码）
    LsPage,       // 登陆注册 - 登录（验证码）
    PfPage,       // 登陆注册 - 忘记密码
    RPage,         // 登陆注册 - 注册
    PPage,        // 登陆注册 - 条款
    MPage,         // 辅助功能 - 菜单
    PlPage,       // 辅助功能 - 计划
    PcPage,       // 辅助功能 - 计划新建
    PdPage,       // 辅助功能 - 计划展
    SsPage,       // 辅助功能 - 系统设置
    HlPage,       // 辅助功能 - 帮助及反馈
    GlPage,       // 辅助功能 - 群组列表
    GcPage,       // 辅助功能 - 群组编辑
    GaPage,       // 辅助功能 - 群组添加
    Fs4gPage,       // 辅助功能 - 选择参与人群组
    Fs4foPage,       // 设置项目跟进通知人选择
    FdPage,       // 辅助功能 - 参与人详情
    PsPage,       // 辅助功能 - 个人设置
    BlPage,       // 辅助功能 - 黑名单
    BrPage,       // 辅助功能 - 备份
    // AlPage,       //启动页
    LogPage,       // 辅助功能 - 备份
    AtPage,       // 关于
    DoPage,       // 任务 - 待处理/已处理任务一览
    AgendaPage,   // 日程 - 创建/修改
    MemoPage,       // 备忘 - 创建/修改
    CommentPage, // 日程 - 备注
    RepeatPage, // 日程 - 重复
    RemindPage,   // 日程 - 提醒
    PlanPage,   // 日程 - 计划
    InvitesPage, // 日程 - 邀请人
    MemberPage, // 日程 - 邀请人-选择
    GloryPage, // 每日荣耀
    LocationPage, // 日程 - 地址
    AttachPage,     // 日程 - 附件
    DailyMemosPage, // 备忘 - 每日备忘
    CommemorationDayPage, // 纪念日 - 创建/修改
    DtSelectPage, // 纪念日 - 创建/修改
    JhPage,       // 设置计划/日历
  ];

  // /* ============ 页面名字配置 ===============*/
  public static isPage(object: any) {
    return DataConfig.PAGES.reduce((init, val) => {
      return init || object instanceof val;
    }, false);
  }

  /*----===== 语音区分 =====----- */
  public static SPEECH: string = "SPEECH";    //系统表语音key
  public static HL: string = "HL";                  //问候语
  public static LH: string = "LH";	                  //	进入教程
  public static AA: string = "AA";	                  //	确认操作后回答
  public static BB: string = "BB";	                  //	取消操作后回答
  public static CC: string = "CC";	                  //	查询后回答（数量）
  public static DD: string = "DD";	                  //	设置后回答
  public static EE: string = "EE";	                 //	确认取消回答
  public static FF: string = "FF";	                  //	异常回答
  public static UNKNOWN: string = "UNKNOWN";	                 //	确认取消回答
  public static GG: string = "GG";	                  //	提醒设置完毕
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

  public static NOTCREATEAGENDABEOORE:string = '时间已经逝去何必再去打扰它(不能创建今天以前的活动，但是你可以接收这个日期的被邀请活动，换个日期创建吧)';

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
  public static HUIBASE64: string = "data:image/png;base64,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";
  //群组系统默认头像 128 * 128
  public static QZ_HUIBASE64: string = "data:image/png;base64,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";

  //系统默认头像 256 * 256
  public static HUIBASE64_LARGE: string = "data:image/png;base64,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";
  //群组系统默认头像 256 * 256
  public static QZ_HUIBASE64_LARGE: string = "data:image/png;base64,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";

  public static REPEATIMG: string = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAFCAYAAAAkG+5xAAAAfUlEQVQokcXSsQoCQQxF0TPLFmolypSC1v7/z9hY2IjgNqJoY2wshlHBAcE0ySUkeQlJEeEHNsbq6c/Y4vZNYYqIBeaNA4/YFbzGqOATNgUvMX3Xp0dGahSQCwFdNRwmRdz5vGDuscesQURgKPiOayXiUuUPXi8QGNK/f+ABMIYfLaWIwo0AAAAASUVORK5CYII=";


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

  public static asyncData = {
    vrs:[
      {"version": "v1", "name":"ED", "type":"SOME", "value":"以下是您要取消的日程,确认取消吗？", "desc":"取消操作确认回答"},
      {"version": "v1", "name":"ED", "type":"NONE", "value":"没有您需要取消的日程", "desc":"取消操作确认回答"},
      {"version": "v1", "name":"CBB", "value":"好的,本次操作已取消。", "desc":"取消放弃回答"},
      {"version": "v1", "name":"CAA", "value":"好的,以上日程已帮您取消。", "desc":"取消确认回答"},
      {"version": "v1", "name":"HL", "value":"安排日程,您可以说:今天下午和老婆去八百伴购物。", "desc":"问候语"},
      {"version": "v1", "name":"LH", "value":"您可以按照以下步骤来做", "desc":"进入教程"},
      {"version": "v1", "name":"AA", "value":"好的,以上日程已帮您创建", "desc":"确认操作后回答"},
      {"version": "v1", "name":"BB", "value":"好的,本次操作已取消", "desc":"取消操作后回答"},
      {"version": "v1", "name":"CC", "value":"稍等,您有以下这些安排", "desc":"查询后回答（数量）"},
      {"version": "v1", "name":"DD", "value":"本次设置已生效", "desc":"设置后回答"},
      {"version": "v1", "name":"EE", "value":"正在创建以下安排,确认创建吗？", "desc":"确认取消回答"},
      {"version": "v1", "name":"FF", "value":"有点小问题,您可以换个方式问我", "desc":"异常回答"},
      {"version": "v1", "name":"UNKNOWN", "value":"目前还无法处理您的要求,请换个方式告诉我", "desc":"异常回答"},
      {"version": "v1", "name":"CC", "value":"有您{count}个安排,点击喇叭可以逐条播报", "desc":"查询后回答（数量）"},
      {"version": "v1", "name":"CC", "value":"以下是您的安排", "desc":"查询后回答（数量）"},
      {"version": "v1", "name":"UNKNOWN", "value":"我不是很明白,您能讲得更清楚一些吗?", "desc":"异常回答"},
      {"version": "v1", "name":"FF", "value":"我有点小麻烦,稍等片刻,马上回来", "desc":"异常回答"},
      {"version": "v1", "name":"CC", "value":"您找的安排有以下{count}个", "desc":"查询后回答（数量）"},
      {"version": "v1", "name":"CC", "value":"请稍等,我拿副眼镜,帮您看一下。", "desc":"查询后回答（数量）"},
      {"version": "v1", "name":"BB", "value":"好的,已取消。", "desc":"取消操作后回答"},
      {"version": "v1", "name":"AA", "value":"好的,已创建,您可以在日历中查看。", "desc":"确认操作后回答"},
      {"version": "v1", "name":"EE", "value":"正在为您创建以下安排,请确认是否创建？", "desc":"确认取消回答"},
      {"version": "v1", "name":"RM", "value":"已帮您设好闹铃", "desc":"闹铃设置回答"},
      {"version": "v1", "name":"RM", "value":"闹铃已设好,届时我将提醒您", "desc":"闹铃设置回答"},
      {"version": "v1", "name":"CAA", "value":"好的,已为你取消。", "desc":"取消确认回答"},
      {"version": "v1", "name":"CAA", "value":"好的,那需要为您安排其它日程吗。", "desc":"取消确认回答"},
      {"version": "v1", "name":"CC", "value":"您的安排有以下这些", "desc":"查询后回答（数量）"},
      {"version": "v1", "name":"UNKNOWN", "value":"这可能超出了我目前的能力范围。", "desc":"异常回答"},
      {"version": "v1", "name":"UNKNOWN", "value":"对不起,我没听懂。", "desc":"异常回答"},
      {"version": "v1", "name":"CC", "value":"好的,这是你的日程：", "desc":"确认操作后回答"},
      {"version": "v1", "name":"AA", "value":"好的。已创建该日程。", "desc":"确认操作后回答"},
      {"version": "v1", "name":"CC", "value":"我正在努力地查询,请稍等。", "desc":"查询后回答（数量）"},
      {"version": "v1", "name":"AA", "value":"你的日程已保存,可以查询查看哟。", "desc":"确认操作后回答"},
      {"version": "v1", "name":"EE", "value":"你正在创建日程,要保存到日历吗？", "desc":"确认取消回答"},
      {"version": "v1", "name":"EU", "value":"您正在修改日程,确定修改吗？", "desc":"确认修改回答"},
      {"version": "v1", "name":"UBB", "value":"好的,修改已放弃。", "desc":"修改放弃回答"},
      {"version": "v1", "name":"UAA", "value":"已经帮您修改,您还有什么吩咐？", "desc":"修改确认回答"},
      {"version": "v1", "name":"ED", "value":"你确定要取消这个日程吗？", "desc":"取消操作确认回答"},
      {"version": "v2", "type": "AG.C", "needAnswer": "false", "tips":"", "name":"AA", "value":"好的,以上日程已帮您创建", "desc":"确认操作后回答"},
      {"version": "v2", "type": "AG.C", "needAnswer": "false", "tips":"", "name":"AA", "value":"好的,已创建,您可以在日历中查看。", "desc":"确认操作后回答"},
      {"version": "v2", "type": "AG.C", "needAnswer": "false", "tips":"", "name":"AA", "value":"你的日程已保存,可以查询查看哟。", "desc":"确认操作后回答"},
      {"version": "v2", "type": "AG.C", "needAnswer": "false", "tips":"", "name":"AA", "value":"好的。已创建该日程。", "desc":"确认操作后回答"},
      {"version": "v2", "type": "ONE", "needAnswer": "false", "tips":"", "name":"AA", "value":"好的,以上日程已帮您创建", "desc":"确认操作后回答"},
      {"version": "v2", "type": "ONE", "needAnswer": "false", "tips":"", "name":"AA", "value":"好的,已创建,您可以在日历中查看。", "desc":"确认操作后回答"},
      {"version": "v2", "type": "ONE", "needAnswer": "false", "tips":"", "name":"AA", "value":"你的日程已保存,可以查询查看哟。", "desc":"确认操作后回答"},
      {"version": "v2", "type": "ONE", "needAnswer": "false", "tips":"", "name":"AA", "value":"好的。已创建该日程。", "desc":"确认操作后回答"},
      {"version": "v2", "type": "NONE", "needAnswer": "false", "tips":"", "name":"AA", "value":"没有需要取消的日程", "desc":"取消确认回答"},
      {"version": "v2", "type": "AG.D", "needAnswer": "false", "tips":"", "name":"AA", "value":"好的,以上日程已帮您取消。", "desc":"取消确认回答"},
      {"version": "v2", "type": "AG.D", "needAnswer": "false", "tips":"", "name":"AA", "value":"好的,已为你取消。", "desc":"取消确认回答"},
      {"version": "v2", "type": "AG.D", "needAnswer": "false", "tips":"", "name":"AA", "value":"好的,那需要为您安排其它日程吗。", "desc":"取消确认回答"},
      {"version": "v2", "type": "AG.D", "needAnswer": "false", "tips":"", "name":"AA", "value":"好的,以上日程已帮您取消。", "desc":"取消确认回答"},
      {"version": "v2", "type": "AG.D", "needAnswer": "false", "tips":"", "name":"AA", "value":"好的,已为你取消。", "desc":"取消确认回答"},
      {"version": "v2", "type": "AG.D", "needAnswer": "false", "tips":"", "name":"AA", "value":"好的,那需要为您安排其它日程吗。", "desc":"取消确认回答"},
      {"version": "v2", "type": "AG.U", "needAnswer": "true", "tips":"", "name":"AA", "value":"已经帮您修改,您还有什么吩咐？", "desc":"修改确认回答"},
      {"version": "v2", "type": "AG.U", "needAnswer": "true", "tips":"", "name":"AA", "value":"已经帮您修改,您还有什么吩咐？", "desc":"修改确认回答"},
      {"version": "v2", "type": "NONE", "needAnswer": "true", "tips":"", "name":"AA", "value":"已经帮您修改,您还有什么吩咐？", "desc":"修改确认回答"},
      {"version": "v2", "type": "NONE", "needAnswer": "false", "tips":"", "name":"BB", "value":"好的,本次操作已取消", "desc":"取消操作后回答"},
      {"version": "v2", "type": "NONE", "needAnswer": "false", "tips":"", "name":"BB", "value":"好的,已取消。", "desc":"取消操作后回答"},
      {"version": "v2", "type": "AG.C", "needAnswer": "false", "tips":"", "name":"BB", "value":"好的,本次操作已取消", "desc":"取消操作后回答"},
      {"version": "v2", "type": "AG.C", "needAnswer": "false", "tips":"", "name":"BB", "value":"好的,已取消。", "desc":"取消操作后回答"},
      {"version": "v2", "type": "NONE", "needAnswer": "false", "tips":"", "name":"BB", "value":"好的,本次操作已取消。", "desc":"取消放弃回答"},
      {"version": "v2", "type": "AG.D", "needAnswer": "false", "tips":"", "name":"BB", "value":"好的,本次操作已取消。", "desc":"取消放弃回答"},
      {"version": "v2", "type": "AG.U", "needAnswer": "false", "tips":"", "name":"BB", "value":"好的,修改已放弃。", "desc":"修改放弃回答"},
      {"version": "v2", "type": "NONE", "needAnswer": "false", "tips":"", "name":"BB", "value":"好的,修改已放弃。", "desc":"修改放弃回答"},
      {"version": "v2", "type": "NONE", "needAnswer": "false", "tips":"", "name":"EE", "value":"正在创建以下安排,确认创建吗？", "desc":"确认取消回答"},
      {"version": "v2", "type": "ONE", "needAnswer": "true", "tips":"说确认/取消", "name":"EE", "value":"正在创建以下安排,确认创建吗？", "desc":"确认取消回答"},
      {"version": "v2", "type": "ONE", "needAnswer": "true", "tips":"说确认/取消", "name":"EE", "value":"正在为您创建以下安排,请确认是否创建？", "desc":"确认取消回答"},
      {"version": "v2", "type": "ONE", "needAnswer": "true", "tips":"说确认/取消", "name":"EE", "value":"你正在创建日程,要保存到日历吗？", "desc":"确认取消回答"},
      {"version": "v2", "type": "MULTI", "needAnswer": "false", "tips":"", "name":"EE", "value":"您有这些安排", "desc":"确认取消回答"},
      {"version": "v2", "type": "E0001", "needAnswer": "false", "tips":"", "name":"EU", "value":"该日程来自{agendaowner}, 无法修改", "desc":"确认修改回答"},
      {"version": "v2", "type": "NONE", "needAnswer": "false", "tips":"", "name":"EU", "value":"没有安排可以修改", "desc":"确认修改回答"},
      {"version": "v2", "type": "ONE", "needAnswer": "true", "tips":"说确认/取消", "name":"EU", "value":"您正在修改日程,确定修改吗？", "desc":"确认修改回答"},
      {"version": "v2", "type": "MULTI", "needAnswer": "true", "tips":"说把第几条改到什么时候", "name":"EU", "value":"您需要修改以下哪个日程?", "desc":"确认修改回答"},
      {"version": "v2", "type": "MULTI", "needAnswer": "true", "tips":"说确认/取消", "name":"ED", "value":"以下是您要取消的日程,确认取消吗？", "desc":"取消操作确认回答"},
      {"version": "v2", "type": "NONE", "needAnswer": "false", "tips":"", "name":"ED", "value":"没有您需要取消的日程", "desc":"取消操作确认回答"},
      {"version": "v2", "type": "ONE", "needAnswer": "true", "tips":"说确认/取消", "name":"ED", "value":"你确定要取消这个日程吗？", "desc":"取消操作确认回答"},
      {"version": "v2", "type": "MULTI", "needAnswer": "false", "tips":"", "name":"CC", "value":"稍等,您有以下这些安排", "desc":"查询后回答（数量）"},
      {"version": "v2", "type": "ONE", "needAnswer": "false", "tips":"", "name":"CC", "value":"有您{count}个安排,点击喇叭可以逐条播报", "desc":"查询后回答（数量）"},
      {"version": "v2", "type": "MULTI", "needAnswer": "false", "tips":"", "name":"CC", "value":"有您{count}个安排,点击喇叭可以逐条播报", "desc":"查询后回答（数量）"},
      {"version": "v2", "type": "NONE", "needAnswer": "false", "tips":"", "name":"CC", "value":"没有您要找的安排", "desc":"查询后回答（数量）"},
      {"version": "v2", "type": "NONE", "needAnswer": "false", "tips":"", "name":"CC", "value":"目前没有安排", "desc":"查询后回答（数量）"},
      {"version": "v2", "type": "ONE", "needAnswer": "false", "tips":"", "name":"CC", "value":"以下是您的安排", "desc":"查询后回答（数量）"},
      {"version": "v2", "type": "ONE", "needAnswer": "false", "tips":"", "name":"CC", "value":"您找的安排有以下{count}个", "desc":"查询后回答（数量）"},
      {"version": "v2", "type": "ONE", "needAnswer": "false", "tips":"", "name":"CC", "value":"请稍等,我拿副眼镜,帮您看一下。", "desc":"查询后回答（数量）"},
      {"version": "v2", "type": "ONE", "needAnswer": "false", "tips":"", "name":"CC", "value":"您的安排有以下这些", "desc":"查询后回答（数量）"},
      {"version": "v2", "type": "ONE", "needAnswer": "false", "tips":"", "name":"CC", "value":"好的,这是你的日程：", "desc":"确认操作后回答"},
      {"version": "v2", "type": "ONE", "needAnswer": "false", "tips":"", "name":"CC", "value":"我正在努力地查询,请稍等。", "desc":"查询后回答（数量）"},
      {"version": "v2", "type": "MULTI", "needAnswer": "false", "tips":"", "name":"CC", "value":"以下是您的安排", "desc":"查询后回答（数量）"},
      {"version": "v2", "type": "MULTI", "needAnswer": "false", "tips":"", "name":"CC", "value":"您找的安排有以下{count}个", "desc":"查询后回答（数量）"},
      {"version": "v2", "type": "MULTI", "needAnswer": "false", "tips":"", "name":"CC", "value":"请稍等,我拿副眼镜,帮您看一下。", "desc":"查询后回答（数量）"},
      {"version": "v2", "type": "MULTI", "needAnswer": "false", "tips":"", "name":"CC", "value":"您的安排有以下这些", "desc":"查询后回答（数量）"},
      {"version": "v2", "type": "MULTI", "needAnswer": "false", "tips":"", "name":"CC", "value":"好的,这是你的日程：", "desc":"确认操作后回答"},
      {"version": "v2", "type": "MULTI", "needAnswer": "false", "tips":"", "name":"CC", "value":"我正在努力地查询,请稍等。", "desc":"查询后回答（数量）"},
      {"version": "v2", "type": "NONE", "needAnswer": "false", "tips":"", "name":"DD", "value":"本次设置已生效", "desc":"设置后回答"},
      {"version": "v2", "type": "NONE", "needAnswer": "false", "tips":"", "name":"BDD", "value":"黑名单设置已生效", "desc":"设置黑名单后回答"},
      {"version": "v2", "type": "NONE", "needAnswer": "false", "tips":"", "name":"BDN", "value":"联系人中没有找到{targetname}", "desc":"设置黑名单后回答"},
      {"version": "v2", "type": "NONE", "needAnswer": "false", "tips":"", "name":"FF", "value":"有点小问题,您可以换个方式问我", "desc":"异常回答"},
      {"version": "v2", "type": "NONE", "needAnswer": "false", "tips":"", "name":"FF", "value":"我有点小麻烦,稍等片刻,马上回来", "desc":"异常回答"},
      {"version": "v2", "type": "NONE", "needAnswer": "false", "tips":"", "name":"TM", "value":"计时开始", "desc":"计时闹铃设置回答"},
      {"version": "v2", "type": "NONE", "needAnswer": "false", "tips":"", "name":"TM", "value":"{hours}{minutes}{seconds}计时开始", "desc":"计时闹铃设置回答"},
      {"version": "v2", "type": "NONE", "needAnswer": "false", "tips":"", "name":"RM", "value":"已帮您设好闹铃", "desc":"闹铃设置回答"},
      {"version": "v2", "type": "NONE", "needAnswer": "false", "tips":"", "name":"RM", "value":"闹铃已设好,届时我将提醒您", "desc":"闹铃设置回答"},
      {"version": "v2", "type": "NONE", "needAnswer": "false", "tips":"", "name":"HL", "value":"安排日程,您可以说:今天下午和老婆去八百伴购物。", "desc":"问候语"},
      {"version": "v2", "type": "NONE", "needAnswer": "false", "tips":"", "name":"LH", "value":"您可以按照以下步骤来做", "desc":"进入教程"},
      {"version": "v2", "type": "ONE", "needAnswer": "false", "tips":"", "name":"UNKNOWN", "value":"这可能超出了我目前的能力范围。", "desc":"异常回答"},
      {"version": "v2", "type": "ONE", "needAnswer": "false", "tips":"", "name":"UNKNOWN", "value":"对不起,我没听懂。", "desc":"异常回答"},
      {"version": "v2", "type": "ONE", "needAnswer": "false", "tips":"", "name":"UNKNOWN", "value":"我不是很明白,您能讲得更清楚一些吗?", "desc":"异常回答"},
      {"version": "v2", "type": "NONE", "needAnswer": "false", "tips":"", "name":"UNKNOWN", "value":"这可能超出了我目前的能力范围。", "desc":"异常回答"},
      {"version": "v2", "type": "MULTI", "needAnswer": "false", "tips":"", "name":"UNKNOWN", "value":"对不起,我没听懂。", "desc":"异常回答"},
      {"version": "v2", "type": "MULTI", "needAnswer": "false", "tips":"", "name":"UNKNOWN", "value":"我不是很明白,您能讲得更清楚一些吗?", "desc":"异常回答"},
      {"version": "v2", "type": "MULTI", "needAnswer": "false", "tips":"", "name":"UNKNOWN", "value":"这可能超出了我目前的能力范围。", "desc":"异常回答"},
      {"version": "v2", "type": "NONE", "needAnswer": "false", "tips":"", "name":"UNKNOWN", "value":"对不起,我没听懂。", "desc":"异常回答"},
      {"version": "v2", "type": "NONE", "needAnswer": "false", "tips":"", "name":"UNKNOWN", "value":"我不是很明白,您能讲得更清楚一些吗?", "desc":"异常回答"},
      {"version": "v2", "type": "NONE", "needAnswer": "false", "tips":"", "name":"UNKNOWN", "value":"目前还无法处理您的要求,请换个方式告诉我", "desc":"异常回答"},
      {"version": "v2", "type": "NONE", "needAnswer": "false", "tips":"", "name":"FTO", "value":"主人，你{questiontime}上午安排满了，下午{startTime}到{endTime}有空", "desc":"异常回答"},
      {"version": "v2", "type": "NONE", "needAnswer": "false", "tips":"", "name":"FTT", "value":"主人，你{questiontime}}只有上午{startTime}到{endTime}有事，其他时间有空", "desc":"异常回答"},
      {"version": "v2", "type": "NONE", "needAnswer": "false", "tips":"", "name":"FTTH", "value":"主人，你{questiontime}没有安排，需要帮你安排什么事情吗？", "desc":"异常回答"},
      {"version": "v2", "type": "ONE", "needAnswer": "false", "tips":"", "name":"FFF", "value":"主人, 你{questiontime}安排满了, {emptytime}有空。", "desc":"正常回答"},
      {"version": "v2", "type": "MULTI", "needAnswer": "false", "tips":"", "name":"FFF", "value":"主人, 你{questiontime}安排满了, {emptytime}有空。", "desc":"正常回答"},
      {"version": "v2", "type": "ONE", "needAnswer": "false", "tips":"", "name":"FFP", "value":"主人, 你{questiontime}只有{fulltime}有事, 其它时间有空。", "desc":"正常回答"},
      {"version": "v2", "type": "MULTI", "needAnswer": "false", "tips":"", "name":"FFP", "value":"主人, 你{questiontime}只有{fulltime}有事, 其它时间有空。", "desc":"正常回答"},
      {"version": "v2", "type": "NONE", "needAnswer": "true", "tips":"", "name":"FFE", "value":"主人, 你{questiontime}全天有空, 需要帮你安排什么事情吗？", "desc":"正常回答"},
      {"version": "v2", "type": "NONE", "needAnswer": "true", "tips":"", "name":"FFN", "value":"主人, {questiontime}已成过去，一切朝前看", "desc":"正常回答"},
      {"version": "v2", "type": "ONE", "needAnswer": "true", "tips":"", "name":"FFN", "value":"主人, {questiontime}已成过去，一切朝前看", "desc":"正常回答"},
      {"version": "v2", "type": "MULTI", "needAnswer": "true", "tips":"", "name":"FFN", "value":"主人, {questiontime}已成过去，一切朝前看", "desc":"正常回答"},
      {"version": "v2", "type": "ONE", "needAnswer": "false", "tips":"", "name":"FFF2", "value":"主人, 你{questiontime}安排满了, {emptytime}有空。", "desc":"正常回答"},
      {"version": "v2", "type": "MULTI", "needAnswer": "false", "tips":"", "name":"FFF2", "value":"主人, 你{questiontime}安排满了, {emptytime}有空。", "desc":"正常回答"},
      {"version": "v2", "type": "ONE", "needAnswer": "false", "tips":"", "name":"FFP2", "value":"主人, 你{questiontime}只有{fulltime}有事, 其它时间有空。", "desc":"正常回答"},
      {"version": "v2", "type": "MULTI", "needAnswer": "false", "tips":"", "name":"FFP2", "value":"主人, 你{questiontime}只有{fulltime}有事, 其它时间有空。", "desc":"正常回答"},
      {"version": "v2", "type": "NONE", "needAnswer": "true", "tips":"", "name":"FFE2", "value":"主人, 你{questiontime}有空, 需要帮你安排什么事情吗？", "desc":"正常回答"},
      {"version": "v2", "type": "MULTI", "needAnswer": "true", "tips":"", "name":"FFE2", "value":"主人, 你{questiontime}有空, 需要帮你安排什么事情吗？", "desc":"正常回答"}
    ],
    dpfu:[
      {"name":"H", "value":"0", "desc":"唤醒"},
      {"name":"T", "value":"1", "desc":"新消息提醒"},
      {"name":"B", "value":"1", "desc":"语音播报"},
      {"name":"Z", "value":"1", "desc":"震动音效"},
      {"name":"DR", "value":"1", "desc":"每日简报"},
      {"name":"DRP1", "value":"08:30", "desc":"每日简报 提醒时间"},
      {"name":"DJH", "value":"personalcalendar", "desc":"日程创建 缺省日历 个人"},
      {"name":"FOGH", "value":"", "desc":"项目跟进 GitHub 关闭"},
      {"name":"FOFIR", "value":"", "desc":"项目跟进 Fir.IM 关闭"},
      {"name":"FOTRACI", "value":"", "desc":"项目跟进 Travis-CI 关闭"},
      {"name":"THEME", "value":"white-theme", "desc":"主题"},
      {"name":"AUTOTODO", "value":"true", "desc":"自动加入重要事项"}
    ],
    bipl:[
      {"planid":"chinese_famous_2019", "planname":"农历节气", "plandesc":"2019中国节气", "planmark":"#143137"},
      {"planid":"chinese_follow_2019", "planname":"中国关注日", "plandesc":"2019中国关注日", "planmark":"#996A29"},
      {"planid":"shanghai_animation_exhibition_2019", "planname":"2019上海漫展时间表", "plandesc":"2019上海漫展时间表 上海动漫展汇总(更新中)", "planmark":"#881b2d"},
      {"planid":"chinese_holiday_2019", "planname":"中国节日", "plandesc":"2019年中国节日或者纪念日", "planmark":"#18884d"},
      {"planid":"west_holiday_2019", "planname":"西方节日", "plandesc":"2019年西方节日或者国际纪念日", "planmark":"#881562"}
    ],
    apil:[
      {"name":"ID", "value":"https://www.guobaa.com/ini/parameters", "desc":"初始化数据"},
      {"name":"RA", "value":"https://pluto.guobaa.com/aup/doregister", "desc":"注册帐户"},
      {"name":"SSMIC", "value":"https://pluto.guobaa.com/aup/verifycode", "desc":"发送短信验证码"},
      {"name":"SML", "value":"https://pluto.guobaa.com/aup/dologin", "desc":"短信登录"},
      {"name":"PL", "value":"https://pluto.guobaa.com/aup/dologin", "desc":"密码登录"},
      {"name":"AIU", "value":"https://pluto.guobaa.com/aup/user/{unionid}", "desc":"帐户信息更新"},
      {"name":"AIG", "value":"https://pluto.guobaa.com/aup/user/{phoneno}/userinfo", "desc":"帐户信息获取"},
      {"name":"AAG", "value":"https://pluto.guobaa.com/aup/user/{phoneno}/avatar/json", "desc":"帐户头像获取"},
      {"name":"MP", "value":"https://pluto.guobaa.com/aup/user/{unionid}", "desc":"修改密码"},
      {"name":"B", "value":"https://pluto.guobaa.com/bac/backup", "desc":"备份"},
      {"name":"R", "value":"https://pluto.guobaa.com/bac/recover", "desc":"恢复"},
      {"name":"BS", "value":"https://pluto.guobaa.com/bac/latest", "desc":"备份查询"},
      {"name":"AS", "value":"https://pluto.guobaa.com/agd/agenda/save", "desc":"日程保存"},
      {"name":"ACS", "value":"https://pluto.guobaa.com/agd/agendacontacts/save", "desc":"日程参与人保存"},
      {"name":"AG", "value":"https://pluto.guobaa.com/agd/agenda/info", "desc":"日程获取"},
      {"name":"AR", "value":"https://pluto.guobaa.com/agd/agenda/remove", "desc":"日程删除"},
      {"name":"ASU", "value":"https://pluto.guobaa.com/shs/agenda/share", "desc":"日程转发(分享)上传"},
      {"name":"AEW", "value":"https://pluto.guobaa.com/shs/agenda/html/{day}/{shareid}", "desc":"日程网页浏览"},
      {"name":"BLA", "value":"https://pluto.guobaa.com/bla/target/add", "desc":"黑名单手机/帐户添加"},
      {"name":"BLR", "value":"https://pluto.guobaa.com/bla/target/remove", "desc":"黑名单手机/帐户删除"},
      {"name":"BLG", "value":"https://pluto.guobaa.com/bla/list", "desc":"黑名单获取"},
      {"name":"VU", "value":"https://pluto.guobaa.com/mix/starter/audio", "desc":"语音上传"},
      {"name":"TU", "value":"https://pluto.guobaa.com/mix/starter/text", "desc":"文本上传"},
      {"name":"SHD", "value":"https://pluto.guobaa.com/shs/{datatype}/share", "desc":"分享数据"},
      {"name":"PU", "value":"https://pluto.guobaa.com/shs/plan/share", "desc":"计划上传"},
      {"name":"PEW", "value":"https://pluto.guobaa.com/shs/plan/html/{day}/{shareid}", "desc":"计划网页浏览"},
      {"name":"BIPD", "value":"https://pluto.guobaa.com/sha/plan/buildin/download", "desc":"内建计划下载"},
      {"name":"WSA", "value":"wss://pluto.guobaa.com/ws", "desc":"WebSocket地址"},
      {"name":"POW", "value":"https://pluto.guobaa.com/cal/index", "desc":"产品官网"},
      {"name":"BUG", "value":"https://pluto.guobaa.com/bug/{bugtype}/{account}/{device}/{datatype}/{program}/upload", "desc":"Findbugs"},
      {"name":"PP", "value":"https://pluto.guobaa.com/cal/doc/privatepolicy", "desc":"隐私政策"},
      {"name":"UP", "value":"https://pluto.guobaa.com/cal/doc/userproxy", "desc":"使用协议"},
      {"name":"AAT", "value":"https://pluto.guobaa.com/aba/user/mwxing/access", "desc":"帐户登录令牌获取"},
      {"name":"CC", "value":"https://pluto.guobaa.com/cdc/calendar_caculate/starter", "desc":"日程计算"},
      {"name":"AIGS", "value":"https://pluto.guobaa.com/aup/user/multi/usersinfo", "desc":"批量帐户信息获取"},
      {"name":"EDTTS", "value":"https://pluto.guobaa.com/cdc/mwxing_register_tasks_start/json/trigger", "desc":"注册事件分发任务"},
      {"name":"DRT", "value":"https://pluto.guobaa.com/cdc/mwxing_daily_summary_start/json/trigger", "desc":"每日简报触发"},
      {"name":"HWT", "value":"https://pluto.guobaa.com/cdc/mwxing_hourly_weather_start/json/trigger", "desc":"每小时天气预报触发"},
      {"name":"WHK", "value":"https://pluto.guobaa.com/cdc/mwxing_webhook_notification_start/json/trigger", "desc":"WebHooks事件触发"},
      {"name":"SPH", "value":"https://pluto.guobaa.com/cdc/mwxing_data_sync_push_start/json/trigger", "desc":"数据同步push"},
      {"name":"SPL", "value":"https://pluto.guobaa.com/cdc/mwxing_data_sync_pull_start/json/trigger", "desc":"数据同步pull"},
      {"name":"SUP", "value":"https://pluto.guobaa.com/abl/store/remote/upload", "desc":"文件数据上传upload"},
      {"name":"SDL", "value":"https://pluto.guobaa.com/abl/store/remote/download", "desc":"文件数据下载download"},
      {"name":"SDJ", "value":"https://pluto.guobaa.com/abl/store/local/getContent/{id}", "desc":"JSON文件数据下载download"},
      {"name":"SRT", "value":"https://pluto.guobaa.com/cdc/mwxing_scheduled_remind_start/json/trigger", "desc":"计划提醒提交"}
    ]

  }
}
