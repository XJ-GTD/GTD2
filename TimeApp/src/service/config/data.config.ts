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
  public static HUIBASE64:string = "data:image/png;base64,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bnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAxOS0wNC0xMVQxNTo0NjozNCswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxOS0wNC0xMVQxNTo0ODoxMSswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMTktMDQtMTFUMTU6NDg6MTErMDg6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmVkNjM5MjgxLWI2ZjItNDczZi1hYWU4LWM2NGU0MjQ1ZWFiNyIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjI2MGEwOTlkLWU4ZjMtN2I0ZC04Yzg5LTU1N2I4OTcxN2ZjYyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOmM5ZjhlMDc2LWE5MjItNDA5MS1iZTVjLTlhNTdmNjNmYWUxMiIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9IkRpc3BsYXkiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmM5ZjhlMDc2LWE5MjItNDA5MS1iZTVjLTlhNTdmNjNmYWUxMiIgc3RFdnQ6d2hlbj0iMjAxOS0wNC0xMVQxNTo0NjozNCswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDphMjA5YTkxMi01YzNlLTRjMTMtYWI0MC01MDQ1NzE2MzRhZWYiIHN0RXZ0OndoZW49IjIwMTktMDQtMTFUMTU6NDg6MTErMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY29udmVydGVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJkZXJpdmVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJjb252ZXJ0ZWQgZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZWQ2MzkyODEtYjZmMi00NzNmLWFhZTgtYzY0ZTQyNDVlYWI3IiBzdEV2dDp3aGVuPSIyMDE5LTA0LTExVDE1OjQ4OjExKzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmEyMDlhOTEyLTVjM2UtNGMxMy1hYjQwLTUwNDU3MTYzNGFlZiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpjOWY4ZTA3Ni1hOTIyLTQwOTEtYmU1Yy05YTU3ZjYzZmFlMTIiIHN0UmVmOm9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpjOWY4ZTA3Ni1hOTIyLTQwOTEtYmU1Yy05YTU3ZjYzZmFlMTIiLz4gPC9yZGY6RGVzY3JpcHRpb24+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";
//群组系统默认头像
  public static QZ_HUIBASE64:string ="data:image/png;base64,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bnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIiB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKE1hY2ludG9zaCkiIHhtcDpDcmVhdGVEYXRlPSIyMDE5LTA0LTExVDE1OjQ2OjM0KzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE5LTA0LTExVDE2OjI2OjQwKzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOS0wNC0xMVQxNjoyNjo0MCswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6YzU3N2MzZTYtOWFhZC00NDEyLTk1MTAtZjdiOWIyNTEzZTNmIiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6MmU0N2VhMWYtMDI5NS00NDQwLWEwMjAtYTViMDcyZDYwZDI5IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6YzlmOGUwNzYtYTkyMi00MDkxLWJlNWMtOWE1N2Y2M2ZhZTEyIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0iRGlzcGxheSIgdGlmZjpPcmllbnRhdGlvbj0iMSIgdGlmZjpYUmVzb2x1dGlvbj0iNzIwMDAwLzEwMDAwIiB0aWZmOllSZXNvbHV0aW9uPSI3MjAwMDAvMTAwMDAiIHRpZmY6UmVzb2x1dGlvblVuaXQ9IjIiIGV4aWY6Q29sb3JTcGFjZT0iNjU1MzUiIGV4aWY6UGl4ZWxYRGltZW5zaW9uPSIxMjgiIGV4aWY6UGl4ZWxZRGltZW5zaW9uPSIxMjgiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmM5ZjhlMDc2LWE5MjItNDA5MS1iZTVjLTlhNTdmNjNmYWUxMiIgc3RFdnQ6d2hlbj0iMjAxOS0wNC0xMVQxNTo0NjozNCswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo5MmQ4YTM1OS1hOWFhLTRhMTMtODkwYS1kMWRhZGJmZDNkY2QiIHN0RXZ0OndoZW49IjIwMTktMDQtMTFUMTU6NTQ6NDArMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MjJiOWViZmQtNGY4MS00NTFmLThlNzAtNDQyMGZjZjllMWJjIiBzdEV2dDp3aGVuPSIyMDE5LTA0LTExVDE2OjI2OjQwKzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNvbnZlcnRlZCIgc3RFdnQ6cGFyYW1ldGVycz0iZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iZGVyaXZlZCIgc3RFdnQ6cGFyYW1ldGVycz0iY29udmVydGVkIGZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9w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"
}
