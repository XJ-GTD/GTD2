import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import * as moment from "moment";

export class AssistantServiceMock {
  public stopSpeak(emit:boolean, open:boolean = false) {}
  async speakText(speechText: string):Promise<any> {}
}

export class UserConfigMock {
  static user = {
    //用户ID
    id: "13900009004",
    //账户ID
    aid: "",
    //用户名
    name: "测试帐户",
    //用户头像
    avatar: "",
    //出生日期
    bothday: "",
    //真实姓名
    realname: "测试帐户",
    //身份证
    No: "",
    //性别
    sex: "",
    //联系方式
    contact: "13900009004",
  };

  static account = {
    // 账户ID
    id: "13900009004",
    // 账户名
    name: "测试帐户",
    // 手机号
    phone: "13900009004",
    // 设备号
    device: "browser",
    // token
    token: "",
    // 账户消息队列
    mq: "",
  };

  async init() {}
  async RefreshFriend() {}
}

export class RestfulClientMock {
  private backup: Map<number, any> = new Map<number, any>();

  init() {}

  async post(url: any, body: any): Promise<any> {
    let bts: number;
    switch (url.key) {
      case "SPH" : // 数据同步Push
      case "SPL" : // 数据同步Pull
        break;
      case "B" : // 备份
        bts = body.d.bts || moment().valueOf();

        let backuped = this.backup.get(bts);
        let valueOf = function(val1, val2) {
          if (val1 instanceof Array && val2 instanceof Array) {
            if (val1.length > 0) {
              return val1;
            }

            if (val2.length > 0) {
              return val2;
            }
          }

          return val1 || val2;
        };

        if (backuped) {
          backuped.jha = valueOf(body.d.jha, backuped.jha);
          backuped.jta = valueOf(body.d.jta, backuped.jta);
          backuped.mom = valueOf(body.d.mom, backuped.mom);
          backuped.ev = valueOf(body.d.ev, backuped.ev);
          backuped.ca = valueOf(body.d.ca, backuped.ca);
          backuped.tt = valueOf(body.d.tt, backuped.tt);
          backuped.par = valueOf(body.d.par, backuped.par);
          backuped.fj = valueOf(body.d.fj, backuped.fj);
          backuped.y = valueOf(body.d.y, backuped.y);
          backuped.jh = valueOf(body.d.jh, backuped.jh);
          backuped.bx = valueOf(body.d.bx, backuped.bx);
          backuped.g = valueOf(body.d.g, backuped.g);
          backuped.b = valueOf(body.d.b, backuped.b);
          backuped.d = valueOf(body.d.d, backuped.d);
          backuped.mo = valueOf(body.d.mo, backuped.mo);
          backuped.e = valueOf(body.d.e, backuped.e);
          backuped.sp = valueOf(body.d.sp, backuped.sp);
          backuped.c = valueOf(body.d.c, backuped.c);
        } else {
          backuped = body.d;
        }

        this.backup.set(bts, backuped);
        return {d: {bts: bts}};
      case "R" : // 恢复
        bts = body.d.bts;
        let data = this.backup.get(bts);
        return {d: data};
      case "PU" : // 分享日历
        return {d: {
          psurl: "https://mock.data/shareplan"
        }};
      case "BIPD" : // 下载公共日历
        if (body && body.d && body.d.pi == "chinese_famous_2019") {
          return {d: {
            pn: {pi:"chinese_famous_2019",pt:"农历节气",pd:"2019农历节气",pm:"#143137",pc:"0",px:"2"},
            pa: [
            {pi:"chinese_famous_2019",at:"立春",adt:"2019/02/04 11:14",st:"11:14",ed:"",et:"",rt:"",ap:"chinese_famous_2019",am:"立春：立是开始的意思，立春就是春季的开始。"},
            {pi:"chinese_famous_2019",at:"雨水",adt:"2019/02/19 07:03",st:"07:03",ed:"",et:"",rt:"",ap:"chinese_famous_2019",am:"雨水：降雨开始，雨量渐增。"},
            {pi:"chinese_famous_2019",at:"惊蛰",adt:"2019/03/06 05:09",st:"05:09",ed:"",et:"",rt:"",ap:"chinese_famous_2019",am:"惊蛰：蛰是藏的意思。惊蛰是指春雷乍动，惊醒了蛰伏在土中冬眠的动物。"},
            {pi:"chinese_famous_2019",at:"春分",adt:"2019/03/21 05:58",st:"05:58",ed:"",et:"",rt:"",ap:"chinese_famous_2019",am:"春分：分是平分的意思。春分表示昼夜平分。"},
            {pi:"chinese_famous_2019",at:"清明",adt:"2019/04/05 09:51",st:"09:51",ed:"",et:"",rt:"",ap:"chinese_famous_2019",am:"清明：天气晴朗，草木繁茂。"},
            {pi:"chinese_famous_2019",at:"谷雨",adt:"2019/04/20 16:55",st:"16:55",ed:"",et:"",rt:"",ap:"chinese_famous_2019",am:"谷雨：雨生百谷。雨量充足而及时，谷类作物能茁壮成长。"},
            {pi:"chinese_famous_2019",at:"立夏",adt:"2019/05/06 03:02",st:"03:02",ed:"",et:"",rt:"",ap:"chinese_famous_2019",am:"立夏：夏季的开始。"},
            {pi:"chinese_famous_2019",at:"小满",adt:"2019/05/21 15:59",st:"15:59",ed:"",et:"",rt:"",ap:"chinese_famous_2019",am:"小满：麦类等夏熟作物籽粒开始饱满。"},
            {pi:"chinese_famous_2019",at:"芒种",adt:"2019/06/06 07:06",st:"07:06",ed:"",et:"",rt:"",ap:"chinese_famous_2019",am:"芒种：麦类等有芒作物成熟。"},
            {pi:"chinese_famous_2019",at:"夏至",adt:"2019/06/21 23:54",st:"23:54",ed:"",et:"",rt:"",ap:"chinese_famous_2019",am:"夏至：炎热的夏天来临。"},
            {pi:"chinese_famous_2019",at:"小暑",adt:"2019/07/07 17:20",st:"17:20",ed:"",et:"",rt:"",ap:"chinese_famous_2019",am:"小暑：暑是炎热的意思。小暑就是气候开始炎热。"},
            {pi:"chinese_famous_2019",at:"大暑",adt:"2019/07/23 10:50",st:"10:50",ed:"",et:"",rt:"",ap:"chinese_famous_2019",am:"大暑：一年中最热的时候。"},
            {pi:"chinese_famous_2019",at:"立秋",adt:"2019/08/08 03:12",st:"03:12",ed:"",et:"",rt:"",ap:"chinese_famous_2019",am:"立秋：秋季的开始。"},
            {pi:"chinese_famous_2019",at:"处暑",adt:"2019/08/23 18:01",st:"18:01",ed:"",et:"",rt:"",ap:"chinese_famous_2019",am:"处暑：处是终止、躲藏的意思。处暑是表示炎热的暑天结束。"},
            {pi:"chinese_famous_2019",at:"白露",adt:"2019/09/08 06:16",st:"06:16",ed:"",et:"",rt:"",ap:"chinese_famous_2019",am:"白露：天气转凉，露凝而白。"},
            {pi:"chinese_famous_2019",at:"秋分",adt:"2019/09/23 15:50",st:"15:50",ed:"",et:"",rt:"",ap:"chinese_famous_2019",am:"秋分：昼夜平分。"},
            {pi:"chinese_famous_2019",at:"寒露",adt:"2019/10/08 22:05",st:"22:05",ed:"",et:"",rt:"",ap:"chinese_famous_2019",am:"寒露：露水以寒，将要结冰。"},
            {pi:"chinese_famous_2019",at:"霜降",adt:"2019/10/24 01:19",st:"01:19",ed:"",et:"",rt:"",ap:"chinese_famous_2019",am:"霜降：天气渐冷，开始有霜。"},
            {pi:"chinese_famous_2019",at:"立冬",adt:"2019/11/08 01:24",st:"01:24",ed:"",et:"",rt:"",ap:"chinese_famous_2019",am:"立冬：冬季的开始。"},
            {pi:"chinese_famous_2019",at:"小雪",adt:"2019/11/22 22:58",st:"22:58",ed:"",et:"",rt:"",ap:"chinese_famous_2019",am:"小雪：开始下雪。"},
            {pi:"chinese_famous_2019",at:"大雪",adt:"2019/12/07 18:18",st:"18:18",ed:"",et:"",rt:"",ap:"chinese_famous_2019",am:"大雪：降雪量增多，地面可能积雪。"},
            {pi:"chinese_famous_2019",at:"冬至",adt:"2019/12/22 12:19",st:"12:19",ed:"",et:"",rt:"",ap:"chinese_famous_2019",am:"冬至：寒冷的冬天来临。"},
            {pi:"chinese_famous_2019",at:"小寒",adt:"2020/01/05 23:38",st:"23:38",ed:"",et:"",rt:"",ap:"chinese_famous_2019",am:"小寒：气候开始寒冷。"},
            {pi:"chinese_famous_2019",at:"大寒",adt:"2020/01/20 16:59",st:"16:59",ed:"",et:"",rt:"",ap:"chinese_famous_2019",am:"大寒：一年中最冷的时候。"}
            ]
          }};
        } else if (body && body.d && body.d.pi == "shanghai_animation_exhibition_2019") {
          return {d: {
            pn: {pi:"shanghai_animation_exhibition_2019",pt:"2019上海漫展时间表",pd:"2019上海漫展时间表",pm:"#881b2d",pc:"1",px:""},
            pa: [
            {pi:"shanghai_animation_exhibition_2019",at:"理想乡动漫展",adt:"2019/02/16",st:"99:99",ed:"",et:"",rt:"",ap:"shanghai_animation_exhibition_2019",am:"门 票 58/138"},
            {pi:"shanghai_animation_exhibition_2019",at:"理想乡动漫展",adt:"2019/02/17",st:"99:99",ed:"",et:"",rt:"",ap:"shanghai_animation_exhibition_2019",am:"门 票 58/138"},
            {pi:"shanghai_animation_exhibition_2019",at:"上海C3漫展",adt:"2019/04/05",st:"99:99",ed:"",et:"",rt:"",ap:"shanghai_animation_exhibition_2019",am:"门 票 80/100"},
            {pi:"shanghai_animation_exhibition_2019",at:"上海C3漫展",adt:"2019/04/06",st:"99:99",ed:"",et:"",rt:"",ap:"shanghai_animation_exhibition_2019",am:"门 票 80/100"},
            {pi:"shanghai_animation_exhibition_2019",at:"上海C3漫展",adt:"2019/04/07",st:"99:99",ed:"",et:"",rt:"",ap:"shanghai_animation_exhibition_2019",am:"门 票 80/100"},
            {pi:"shanghai_animation_exhibition_2019",at:"欢乐谷动漫嘉年华",adt:"2019/04/05",st:"99:99",ed:"",et:"",rt:"",ap:"shanghai_animation_exhibition_2019",am:"门 票 60/260"},
            {pi:"shanghai_animation_exhibition_2019",at:"欢乐谷动漫嘉年华",adt:"2019/04/06",st:"99:99",ed:"",et:"",rt:"",ap:"shanghai_animation_exhibition_2019",am:"门 票 60/260"},
            {pi:"shanghai_animation_exhibition_2019",at:"欢乐谷动漫嘉年华",adt:"2019/04/07",st:"99:99",ed:"",et:"",rt:"",ap:"shanghai_animation_exhibition_2019",am:"门 票 60/260"},
            {pi:"shanghai_animation_exhibition_2019",at:"次元喵动漫节",adt:"2019/05/01",st:"99:99",ed:"",et:"",rt:"",ap:"shanghai_animation_exhibition_2019",am:"门 票 55-99"},
            {pi:"shanghai_animation_exhibition_2019",at:"次元喵动漫节",adt:"2019/05/02",st:"99:99",ed:"",et:"",rt:"",ap:"shanghai_animation_exhibition_2019",am:"门 票 55-99"},
            {pi:"shanghai_animation_exhibition_2019",at:"WF手办展",adt:"2019/06/08",st:"99:99",ed:"",et:"",rt:"",ap:"shanghai_animation_exhibition_2019",am:"门 票 100-580"},
            {pi:"shanghai_animation_exhibition_2019",at:"WF手办展",adt:"2019/06/09",st:"99:99",ed:"",et:"",rt:"",ap:"shanghai_animation_exhibition_2019",am:"门 票 100-580"},
            {pi:"shanghai_animation_exhibition_2019",at:"待定:ACG漫展",adt:"2019/08/11",st:"99:99",ed:"",et:"",rt:"",ap:"shanghai_animation_exhibition_2019",am:"往年参考门 票 50"},
            {pi:"shanghai_animation_exhibition_2019",at:"待定:CCG漫展",adt:"2019/07/05",st:"99:99",ed:"",et:"",rt:"",ap:"shanghai_animation_exhibition_2019",am:"往年参考门 票 70-110"},
            {pi:"shanghai_animation_exhibition_2019",at:"待定:CCG漫展",adt:"2019/07/06",st:"99:99",ed:"",et:"",rt:"",ap:"shanghai_animation_exhibition_2019",am:"往年参考门 票 70-110"},
            {pi:"shanghai_animation_exhibition_2019",at:"待定:CCG漫展",adt:"2019/07/07",st:"99:99",ed:"",et:"",rt:"",ap:"shanghai_animation_exhibition_2019",am:"往年参考门 票 70-110"},
            {pi:"shanghai_animation_exhibition_2019",at:"待定:CCG漫展",adt:"2019/07/08",st:"99:99",ed:"",et:"",rt:"",ap:"shanghai_animation_exhibition_2019",am:"往年参考门 票 70-110"},
            {pi:"shanghai_animation_exhibition_2019",at:"待定:CCG漫展",adt:"2019/07/09",st:"99:99",ed:"",et:"",rt:"",ap:"shanghai_animation_exhibition_2019",am:"往年参考门 票 70-110"},
            {pi:"shanghai_animation_exhibition_2019",at:"待定:ChinaJoy",adt:"2019/08/03",st:"99:99",ed:"",et:"",rt:"",ap:"shanghai_animation_exhibition_2019",am:"往年参考门 票 72-850"},
            {pi:"shanghai_animation_exhibition_2019",at:"待定:ChinaJoy",adt:"2019/08/04",st:"99:99",ed:"",et:"",rt:"",ap:"shanghai_animation_exhibition_2019",am:"往年参考门 票 72-850"},
            {pi:"shanghai_animation_exhibition_2019",at:"待定:ChinaJoy",adt:"2019/08/05",st:"99:99",ed:"",et:"",rt:"",ap:"shanghai_animation_exhibition_2019",am:"往年参考门 票 72-850"},
            {pi:"shanghai_animation_exhibition_2019",at:"待定:ChinaJoy",adt:"2019/08/06",st:"99:99",ed:"",et:"",rt:"",ap:"shanghai_animation_exhibition_2019",am:"往年参考门 票 72-850"},
            {pi:"shanghai_animation_exhibition_2019",at:"待定:萤火虫动漫嘉年华",adt:"2019/10/02",st:"99:99",ed:"",et:"",rt:"",ap:"shanghai_animation_exhibition_2019",am:"往年参考门 票 70"},
            {pi:"shanghai_animation_exhibition_2019",at:"待定:萤火虫动漫嘉年华",adt:"2019/10/03",st:"99:99",ed:"",et:"",rt:"",ap:"shanghai_animation_exhibition_2019",am:"往年参考门 票 70"},
            {pi:"shanghai_animation_exhibition_2019",at:"待定:萤火虫动漫嘉年华",adt:"2019/10/04",st:"99:99",ed:"",et:"",rt:"",ap:"shanghai_animation_exhibition_2019",am:"往年参考门 票 70"},
            {pi:"shanghai_animation_exhibition_2019",at:"待定:SHCC漫展",adt:"2019/10/26",st:"99:99",ed:"",et:"",rt:"",ap:"shanghai_animation_exhibition_2019",am:"往年参考门 票 138-338"},
            {pi:"shanghai_animation_exhibition_2019",at:"待定:SHCC漫展",adt:"2019/10/27",st:"99:99",ed:"",et:"",rt:"",ap:"shanghai_animation_exhibition_2019",am:"往年参考门 票 138-338"},
            {pi:"shanghai_animation_exhibition_2019",at:"待定:SHCC漫展",adt:"2019/10/28",st:"99:99",ed:"",et:"",rt:"",ap:"shanghai_animation_exhibition_2019",am:"往年参考门 票 138-338"}
            ]
          }};
        }
        break;
      default:
    }
    return {d: {}};
  }

  async get(url: any): Promise<any> {
    console.log(JSON.stringify(url));
    return {d: {}};
  }

  async put(url: any, body: any): Promise<any> {
    console.log(JSON.stringify(url));
    return {d: {}};
  }

  async specPost(url: string, header: any, body: any): Promise<any> {
    console.log(JSON.stringify(url));
    return {d: {}};
  }

  async get4Text(url: string, header: any, body: any): Promise<any> {
    console.log(JSON.stringify(url));
    return {d: {}};
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
    {name:"WHK", value:"https://pluto.guobaa.com/cdc/mwxing_webhook_notification_start/json/trigger", desc:"WebHooks事件触发"},
    {name:"SPH", value:"https://pluto.guobaa.com/cdc/mwxing_data_sync_push_start/json/trigger", desc:"数据同步push"},
    {name:"SPL", value:"https://pluto.guobaa.com/cdc/mwxing_data_sync_pull_start/json/trigger", desc:"数据同步pull"}
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
