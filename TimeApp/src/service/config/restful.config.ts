import {STbl} from "../sqlite/tbl/s.tbl";
import {ATbl} from "../sqlite/tbl/a.tbl";
import {SqliteExec} from "../util-service/sqlite.exec";
import {Injectable} from "@angular/core";
import {UserConfig} from "./user.config";
import {UtilService} from "../util-service/util.service";

@Injectable()
export class RestFulConfig {


  private urlLs: Map<string, UrlEntity>;

  constructor(private sqlitexec: SqliteExec,private util:UtilService) {
    //this.init();
  }


  createHeader() {
    let header = new RestFulHeader();
    // // apro = await this.sqlitexec.getOne(apro);
    // //帐户ID
    header.ai = UserConfig.account.phone;
    //设备ID
    header.di = this.util.deviceId();
    // //设别类型
    header.dt = this.util.deviceType();
    // //登录码
    header.lt = UserConfig.account.token;

    return header;
  }

  //初始化全局 restful Url 信息
  init():Promise<any> {
    this.urlLs = new Map<string, UrlEntity>();
    let sPro = new STbl();
    sPro.st = "URL";
    return this.sqlitexec.getList<STbl>(sPro).then(sPros => {
      for (let i = 0;i<sPros.length;i++) {
        let data = sPros[i];
        let urlentity: UrlEntity = new UrlEntity();
        urlentity.key = data.yk;
        urlentity.url = data.yv;
        urlentity.desc = data.sn;
        this.urlLs.set(data.yk, urlentity);
      }
    })
  }

  //获取url
  getRestFulUrl(key: string): UrlEntity {
    return this.urlLs.get(key);
  }


  /* 环境URL 头部 */
  // private static REQUEST_URL: string = "https://www.guobaa.com/gtd";
  // private static REQUEST_URL: string = "http://192.168.0.176:8080/gtd";//连接本地数据库
  // private static REQUEST_URL: string = "http://192.168.99.31:8080/gtd";//连接本地数据库
  // private static REQUEST_URL: UrlEntity = new UrlEntity("http://192.168.0.176:8080/gtd",false);//连接本地数据库
  // private static REQUEST_URL: UrlEntity = new UrlEntity("http://192.168.99.21:8080/gtd",false);//连接本地数据库
  // private static REQUEST_URL: UrlEntity = new UrlEntity("https://www.guobaa.com/gtd",false);

  /* RabbitMq WebSocket */
  public static RABBITMQ_WS_URL: string = "wss://www.guobaa.com/ws";
  //public static RABBITMQ_WS_URL: string = "ws://192.168.0.146:15674/ws";

  /* RabbitMq SockJs */
  //public static RABBITMQ_SJ_URL: string = "http://192.168.0.219:15674/stomp";


  // /* Controller */
  // // private static AUTH_URL: string = AppConfig.REQUEST_URL + "/auth";    //验证类
  // private static AUTH_URL: UrlEntity = new UrlEntity(UrlConfig.REQUEST_URL.url + "/auth",false);  //验证类
  //
  // // private static PERSON_URL: string = AppConfig.REQUEST_URL + "/person";    //用户类
  // private static PERSON_URL: UrlEntity = new UrlEntity(UrlConfig.REQUEST_URL.url + "/person",false);  //用户类
  //
  // // private static WEB_SOCKET_URL: string = AppConfig.REQUEST_URL + "/push";    //webSocket推送
  // private static WEB_SOCKET_URL: UrlEntity = new UrlEntity(AppConfig.REQUEST_URL.url + "/push",false);   //webSocket推送
  //
  // // private static XF_SPEECH_URL: string = AppConfig.REQUEST_URL + "/parse";    // 讯飞语音
  // private static XF_SPEECH_URL: UrlEntity = new UrlEntity(AppConfig.REQUEST_URL.url + "/parse",false);  // 讯飞语音
  //
  // // private static SMS_URL: string = AppConfig.REQUEST_URL + "/sms";            //短信
  // private static SMS_URL: UrlEntity = new UrlEntity(AppConfig.REQUEST_URL.url + "/sms",false);  //短信
  //
  // // private static SCHEDULE_URL: string = AppConfig.REQUEST_URL + "/schedule";            //schedule日历
  // private static SCHEDULE_URL: UrlEntity = new UrlEntity(AppConfig.REQUEST_URL.url + "/schedule",false);  //schedule日历
  //
  // // private static SYNC_URL: string = AppConfig.REQUEST_URL + "/sync";   //初始化
  // private static SYNC_URL: UrlEntity = new UrlEntity(AppConfig.REQUEST_URL.url + "/sync",false); //初始化
  //
  // /* ------------------------ 验证类 start--------------------------*/
  // /* 登录验证 */
  // // public static AUTH_VISITOR_URL: string = AppConfig.AUTH_URL + "/login_visitors";   //游客登录
  // public static AUTH_VISITOR_URL: UrlEntity = new UrlEntity(AppConfig.AUTH_URL.url + "/login_visitors",false);   //游客登录
  //
  // // public static AUTH_LOGIN_URL: string = AppConfig.AUTH_URL + "/login_password";   //用户密码登录
  // public static AUTH_LOGIN_URL: UrlEntity = new UrlEntity(AppConfig.AUTH_URL.url + "/login_password",false);  //用户密码登录
  //
  // // public static AUTH_SMSLOGIN_URL: string = AppConfig.AUTH_URL + "/login_code";   //用户短信登录
  // public static AUTH_SMSLOGIN_URL: UrlEntity = new UrlEntity(AppConfig.AUTH_URL.url + "/login_code",false); //用户短信登录
  //
  // /* ------------------------ 验证类 end--------------------------*/
  //
  // /* ------------------------ 用户类 start--------------------------*/
  // /*注册*/
  // // public static PERSON_SU_URL: string = AppConfig.PERSON_URL + "/sign_up";   //注册
  // public static PERSON_SU_URL: UrlEntity = new UrlEntity(AppConfig.PERSON_URL.url + "/sign_up",false);  //注册
  //
  // // public static PERSON_UPW_URL: string = AppConfig.PERSON_URL + "/update_password";   //修改密码
  // public static PERSON_UPW_URL: UrlEntity = new UrlEntity(AppConfig.PERSON_URL.url + "/update_password",false);  //修改密码
  //
  // // public static PERSON_LG: string = AppConfig.PERSON_URL + "/logout";   //用户注销
  // public static PERSON_LG: UrlEntity = new UrlEntity(AppConfig.PERSON_URL.url + "/logout",false); //用户注销
  //
  // // public static PERSON_SU: string = AppConfig.PERSON_URL + "/search";   //用户搜索
  // public static PERSON_SU: UrlEntity = new UrlEntity(AppConfig.PERSON_URL.url + "/search",false);  //用户搜索
  //
  // // public static PERSON_UP: string = AppConfig.PERSON_URL + "/update_info";   //用户更新
  // public static PERSON_UP: UrlEntity = new UrlEntity(AppConfig.PERSON_URL.url + "/update_info",false);  //用户更新
  //
  // // public static PERSON_ADDU: string = AppConfig.PERSON_URL + "/add_player";   //用户添加
  // public static PERSON_ADDU: UrlEntity = new UrlEntity(AppConfig.PERSON_URL.url + "/add_player",true);  //用户添加
  //
  // /* ------------------------ 用户类 end--------------------------*/
  //
  // /* ------------------------ 短信类 start--------------------------*/
  // /*短信*/
  // // public static SMS_CODE_URL: string = AppConfig.SMS_URL + "/code";   //获取短信验证码
  // public static SMS_CODE_URL: UrlEntity = new UrlEntity(AppConfig.SMS_URL.url + "/code",false);//获取短信验证码
  //
  // /* ------------------------ 短信类 end--------------------------*/
  //
  // /* ------------------------ 讯飞语音类 start--------------------------*/
  // /*语音*/
  // // public static XF_AUDIO_URL: string = AppConfig.XF_SPEECH_URL + "/audio";   //语音输入
  // public static XF_AUDIO_URL: UrlEntity = new UrlEntity(AppConfig.XF_SPEECH_URL.url + "/audio",false);//语音输入
  //
  // // public static XF_TEXT_URL: string = AppConfig.XF_SPEECH_URL + "/text";   //文本输入
  // public static XF_TEXT_URL: UrlEntity = new UrlEntity(AppConfig.XF_SPEECH_URL.url + "/text",false);//文本输入
  //
  // /* ------------------------ 讯飞语音类 end--------------------------*/
  //
  // /* ------------------------ 日历类 start--------------------------*/
  // /*短信*/
  // // public static SCHEDULE_DEAL_URL: string = AppConfig.SCHEDULE_URL + "/deal";   //获取短信验证码
  // public static SCHEDULE_DEAL_URL: UrlEntity = new UrlEntity(AppConfig.SCHEDULE_URL.url + "/deal",false);//获取短信验证码
  //
  // /* ------------------------ 日历类 end--------------------------*/
  //
  // /* ------------------------ 初始化 start--------------------------*/
  // // public static SYNC_INIT_URL: string = AppConfig.SYNC_URL + "/initial_sync";   //初始化
  // // public static SYNC_TEMP_URL: string = AppConfig.SYNC_URL + "/temporary";   //初始化
  // // public static SYNC_LOGIN_URL: string = AppConfig.SYNC_URL + "/login_sync";   //登录同步
  // // public static SYNC_TIME_URL: string = AppConfig.SYNC_URL + "/timing_sync";   //定时同步
  // public static SYNC_INIT_URL: UrlEntity = new UrlEntity(AppConfig.SYNC_URL.url + "/initial_sync",false);   //初始化
  // public static SYNC_TEMP_URL: UrlEntity = new UrlEntity(AppConfig.SYNC_URL.url + "/temporary",false);   //初始化
  // public static SYNC_LOGIN_URL: UrlEntity = new UrlEntity(AppConfig.SYNC_URL.url + "/login_sync",false);   //登录同步
  // public static SYNC_TIME_URL: UrlEntity = new UrlEntity(AppConfig.SYNC_URL.url + "/timing_sync",false);   //定时同步
  // public static UPLOAD_TIME_URL: UrlEntity = new UrlEntity(AppConfig.SYNC_URL.url + "/upload",false);   //同步上传
  // public static DOWNLOAD_TIME_URL: UrlEntity = new UrlEntity(AppConfig.SYNC_URL.url + "/download",false);   //同步下载
  /* ------------------------ 初始化 end--------------------------*/

}

export class RestFulHeader {
  "Content-Type": string = "application/json";
  lt: string = "";//登录码
  ai: string = "";//帐户ID
  pi: string = "cn.sh.com.xj.timeApp";//产品ID
  pv: string = "v1";//产品版本
  di: string = "";//设备ID
  dt: string = "";//设别类型
}


export class UrlEntity {
  get desc(): string {
    return this._desc;
  }

  set desc(value: string) {
    this._desc = value;
  }
  private _url: string;
  private _key: string;
  private _desc: string;


  get url(): string {
    return this._url;
  }

  set url(value: string) {
    this._url = value;
  }

  get key(): string {
    return this._key;
  }

  set key(value: string) {
    this._key = value;
  }
}
