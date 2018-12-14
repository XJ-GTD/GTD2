/**
 * Generated class for the ScheduleDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 *
 * 请求路径类
 * create by wzy on 2018/05/24
 */

import {UserService} from "../service/user.service";
import {UEntity} from "../entity/u.entity";

export class AppConfig {

  constructor(private user:UserService){

  }
  /*0游客身份，1登录*/
  public static IL:number=0;

  /* 环境URL 头部 */
   // private static REQUEST_URL: string = "http://www.guobaa.com/gtd";
  // private static REQUEST_URL: string = "https://192.168.0.176:8888/gtd";//连接本地数据库
  private static REQUEST_URL: string = "https://192.168.99.5:8888/gtd";//连接本地数据库

  /* RabbitMq WebSocket */
  // public static RABBITMQ_WS_URL: string = "ws://www.guobaa.com/ws";
  public static RABBITMQ_WS_URL: string = "ws://192.168.0.146:15674/ws";

  /* RabbitMq SockJs */
  public static RABBITMQ_SJ_URL: string = "http://192.168.0.219:15674/stomp";
  /* token */
  public static Token: string = "";
  /* 请求头 OPTIONS*/
  public static HEADER_OPTIONS_JSON: any = {
    headers: {
      "Content-Type": "application/json",
      "Authorization": AppConfig.Token
    },
  };

  /* Controller */
  private static AUTH_URL: string = AppConfig.REQUEST_URL + "/auth";    //验证类

  private static PERSON_URL: string = AppConfig.REQUEST_URL + "/person";    //用户类

  private static WEB_SOCKET_URL: string = AppConfig.REQUEST_URL + "/push";    //webSocket推送

  private static XF_SPEECH_URL: string = AppConfig.REQUEST_URL + "/parse";    // 讯飞语音

  private static SMS_URL: string = AppConfig.REQUEST_URL + "/sms";            //短信

  private static SCHEDULE_URL: string = AppConfig.REQUEST_URL + "/schedule";            //schedule日历

  /* ------------------------ 验证类 start--------------------------*/
  /* 登录验证 */
  public static AUTH_VISITOR_URL: string = AppConfig.AUTH_URL + "/login_visitors";   //游客登录

  public static AUTH_LOGIN_URL: string = AppConfig.AUTH_URL + "/login_password";   //用户密码登录

  public static AUTH_SMSLOGIN_URL: string = AppConfig.AUTH_URL + "/login_code";   //用户短信登录

  /* ------------------------ 验证类 end--------------------------*/

  /* ------------------------ 用户类 start--------------------------*/
  /*注册*/
  public static PERSON_SU_URL: string = AppConfig.PERSON_URL + "/sign_up";   //注册

  public static PERSON_UPW_URL: string = AppConfig.PERSON_URL + "/update_password";   //修改密码

  public static PERSON_LG: string = AppConfig.PERSON_URL + "/logout";   //用户注销

  public static PERSON_SU: string = AppConfig.PERSON_URL + "/search_user";   //用户搜索


  /* ------------------------ 用户类 end--------------------------*/

  /* ------------------------ 短信类 start--------------------------*/
  /*短信*/
  public static SMS_CODE_URL: string = AppConfig.SMS_URL + "/code";   //获取短信验证码

  /* ------------------------ 短信类 end--------------------------*/

  /* ------------------------ 讯飞语音类 start--------------------------*/
  /*语音*/
  public static XF_AUDIO_URL: string = AppConfig.XF_SPEECH_URL + "/audio";   //语音输入

  public static XF_TEXT_URL: string = AppConfig.XF_SPEECH_URL + "/text";   //文本输入

  /* ------------------------ 讯飞语音类 end--------------------------*/

  /* ------------------------ 日历类 start--------------------------*/
  /*短信*/
  public static SCHEDULE_DEAL_URL: string = AppConfig.SCHEDULE_URL + "/deal";   //获取短信验证码

  /* ------------------------ 日历类 end--------------------------*/

  public static SUCCESS_CODE : number = 0;
  public static SUCCESS_MESSAGE : string ='成功！'
  public static ERR_CODE : number = 1;
  public static ERR_MESSAGE : string='系统出错！'
  public static NULL_CODE : number= 2;
  public static NULL_MESSAGE : string='查询结果不存在！'
  //用户信息
  public static uInfo:UEntity = null;
  /**
   * 0正常进入1首次进入2无数据3更新后进入
   * @type {string}
   */
  public static isFirst:number = 1;

}
