import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

export class RestfulClientMock {
  init() {}

  async post(url: any, body: any): Promise<any> {
    return {};
  }

  async get(url: any): Promise<any> {
    return {};
  }

  async put(url: any, body: any): Promise<any> {
    return {};
  }

  async specPost(url: string, header: any, body: any): Promise<any> {
    return {};
  }

  async get4Text(url: string, header: any, body: any): Promise<any> {
    return {};
  }
}

export class RestFulConfigMock {
  private _urls: Map<string, any> = new Map<string, any>();
  private _apil: Array<any> = [
    {name:"ID", value:"https://www.guobaa.com/ini/parameters", desc:"初始化数据"},
    {name:"RA", value:"https://pluto.guobaa.com/aup/doregister", desc:"注册帐户"},
    {name:"SSMIC", value:"https://pluto.guobaa.com/aup/verifycode", desc:"发送短信验证码"},
    {name:"SML", value:"https://pluto.guobaa.com/aup/dologin", desc:"短信登录"},
    {name:"PL", value:"https://pluto.guobaa.com/aup/dologin", desc:"密码登录"},
    {name:"AIU", value:"https://pluto.guobaa.com/aup/user/{unionid}", desc:"帐户信息更新"},
    {name:"AIG", value:"https://pluto.guobaa.com/aup/user/{phoneno}/userinfo", desc:"帐户信息获取"},
    {name:"AAG", value:"https://pluto.guobaa.com/aup/user/{phoneno}/avatar/json", desc:"帐户头像获取"},
    {name:"MP", value:"https://pluto.guobaa.com/aup/user/{unionid}", desc:"修改密码"},
    {name:"B", value:"https://pluto.guobaa.com/bac/backup", desc:"备份"},
    {name:"R", value:"https://pluto.guobaa.com/bac/recover", desc:"恢复"},
    {name:"BS", value:"https://pluto.guobaa.com/bac/latest", desc:"备份查询"},
    {name:"AS", value:"https://pluto.guobaa.com/agd/agenda/save", desc:"日程保存"},
    {name:"ACS", value:"https://pluto.guobaa.com/agd/agendacontacts/save", desc:"日程参与人保存"},
    {name:"AG", value:"https://pluto.guobaa.com/agd/agenda/info", desc:"日程获取"},
    {name:"AR", value:"https://pluto.guobaa.com/agd/agenda/remove", desc:"日程删除"},
    {name:"ASU", value:"https://pluto.guobaa.com/sha/agendashare", desc:"日程转发(分享)上传"},
    {name:"AEW", value:"https://pluto.guobaa.com/sha/agenda/share/{shareid}", desc:"日程网页浏览"},
    {name:"BLA", value:"https://pluto.guobaa.com/bla/target/add", desc:"黑名单手机/帐户添加"},
    {name:"BLR", value:"https://pluto.guobaa.com/bla/target/remove", desc:"黑名单手机/帐户删除"},
    {name:"BLG", value:"https://pluto.guobaa.com/bla/list", desc:"黑名单获取"},
    {name:"VU", value:"https://pluto.guobaa.com/mix/starter/audio", desc:"语音上传"},
    {name:"TU", value:"https://pluto.guobaa.com/mix/starter/text", desc:"文本上传"},
    {name:"PU", value:"https://pluto.guobaa.com/sha/planshare", desc:"计划上传"},
    {name:"PEW", value:"https://pluto.guobaa.com/sha/plan/share/{shareid}", desc:"计划网页浏览"},
    {name:"BIPD", value:"https://pluto.guobaa.com/sha/plan/buildin/download", desc:"内建计划下载"},
    {name:"WSA", value:"wss://pluto.guobaa.com/ws", desc:"WebSocket地址"},
    {name:"POW", value:"https://pluto.guobaa.com/cal/index", desc:"产品官网"},
    {name:"PP", value:"https://pluto.guobaa.com/cal/doc/privatepolicy", desc:"隐私政策"},
    {name:"UP", value:"https://pluto.guobaa.com/cal/doc/userproxy", desc:"使用协议"},
    {name:"AAT", value:"https://pluto.guobaa.com/aba/user/mwxing/access", desc:"帐户登录令牌获取"},
    {name:"CC", value:"https://pluto.guobaa.com/cdc/calendar_caculate/starter", desc:"日程计算"},
    {name:"AIGS", value:"https://pluto.guobaa.com/aup/user/multi/usersinfo", desc:"批量帐户信息获取"},
    {name:"EDTTS", value:"https://pluto.guobaa.com/aag/register/tasks", desc:"注册事件分发任务"},
    {name:"DRT", value:"https://pluto.guobaa.com/cdc/mwxing_daily_summary_start/json/trigger", desc:"每日简报触发"},
    {name:"HWT", value:"https://pluto.guobaa.com/cdc/mwxing_hourly_weather_start/json/trigger", desc:"每小时天气预报触发"},
    {name:"WHK", value:"https://pluto.guobaa.com/cdc/mwxing_webhook_notification_start/json/trigger", desc:"WebHooks事件触发"}
  ];

  public createHeader() {
    let header: any = {};

    header.put("Content-Type", "application/json");
    header.put("lt", "");//登录码
    header.put("ai", "");//帐户ID
    header.put("pi", "cn.sh.com.xj.timeApp");//产品ID
    header.put("pv", "v3");//产品版本
    header.put("di", "");//设备ID
    header.put("dt", "");//设别类型
    header.put("latitude", "0");//GPS定位
    header.put("longitude", "0");//GPS定位

    return header;
  }

  public init() {
    for (let url of this._apil) {
      let val: any = {
        key: url.name,
        url: url.value,
        desc: url.desc
      };
      this._urls.set(url.name, val);
    }
  }

  public getRestFulUrl(key: string) {
    return this._urls.get(key);
  }
}

export class PlatformMock {
  public ready(): Promise<string> {
    return new Promise((resolve) => {
      resolve('READY');
    });
  }

  public getQueryParam() {
    return true;
  }

  public registerBackButtonAction(fn: Function, priority?: number): Function {
    return (() => true);
  }

  public hasFocus(ele: HTMLElement): boolean {
    return true;
  }

  public doc(): HTMLDocument {
    return document;
  }

  public is(): boolean {
    return true;
  }

  public getElementComputedStyle(container: any): any {
    return {
      paddingLeft: '10',
      paddingTop: '10',
      paddingRight: '10',
      paddingBottom: '10',
    };
  }

  public onResize(callback: any) {
    return callback;
  }

  public registerListener(ele: any, eventName: string, callback: any): Function {
    return (() => true);
  }

  public win(): Window {
    return window;
  }

  public raf(callback: any): number {
    return 1;
  }

  public timeout(callback: any, timer: number): any {
    return setTimeout(callback, timer);
  }

  public cancelTimeout(id: any) {
    // do nothing
  }

  public getActiveElement(): any {
    return document['activeElement'];
  }
}

export class StatusBarMock extends StatusBar {
  styleDefault() {
    return;
  }
}

export class SplashScreenMock extends SplashScreen {
  hide() {
    return;
  }
}

export class NavMock {

  public pop(): any {
    return new Promise(function(resolve: Function): void {
      resolve();
    });
  }

  public push(): any {
    return new Promise(function(resolve: Function): void {
      resolve();
    });
  }

  public getActive(): any {
    return {
      'instance': {
        'model': 'something',
      },
    };
  }

  public setRoot(): any {
    return true;
  }

  public registerChildNav(nav: any): void {
    return ;
  }

}

export class DeepLinkerMock {

}
