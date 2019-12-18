import {CalendarDay} from "./components/ion2-calendar";
import * as moment from "moment";
import {Member} from "./service/business/event.service";

/**
 * 继承类
 */
export class BaseData{

}

// export class ScdData {
//   si: string = "";//日程事件ID
//   sn: string = "";//日程事件主题
//   ui: string = "";//创建者
//   sd: string = "";//开始日期
//   st: string = "";//开始时间
//   ed: string = "";//结束日期
//   et: string = "";//结束时间
//   rt: string = "";//重复类型
//   ji: string = "";//计划ID
//   sr: string = "";//日程关联ID
//   bz: string = "";//备注
//   tx: string = "";//提醒方式
//   pni:string = "";//日程原始ID
//   wtt: number;//时间戳
//   du:string ="";//消息读取状态
//   gs:string ="";//归属 0：本人创建，1：他人创建，2：系统本地日历,3:系统计划3优先级类型，4：系统计划无优先级
//   ib:string ="0"; //0：非本地日历;1：本地日历
//   fssshow:string ="";//参与人画面显示用
//   cbkcolor:number = 0;//每个日程颜色画面显示用
//   morecolor:string ="#FFFFFF";//more颜色画面显示
//
//
//   showSpSd: string = "";//画面显示特殊表开始日期
//
//
//   //特殊日期日程
//   specScds: Map<string, SpecScdData> = new Map<string, SpecScdData>();
//
//   //当天关联的特殊日程
//   specScd(d:string): SpecScdData {
//     return this.specScds.get(d);
//   }
//
//   //参与人
//   fss: Array<FsData> =new Array<FsData>();
//
//   //发起人
//   fs: FsData =new FsData();
//
//
//   //提醒设置
//   r: RemindData = new RemindData();
//
//   //所属计划
//   p:PlData = new PlData();
//
//
// }

/**
 * 日程出参
 */
export class ScdData {
  si: string = "";//日程事件ID
  sn: string = "";//日程事件主题
  ui: string = "";//创建者
  sd: string = "";//开始日期
  st: string = "";//开始时间
  ed: string = "";//结束日期
  et: string = "";//结束时间
  todolist: string = "";//重要事项 On/Off
  rt: string = "";//重复类型
  ji: string = "";//计划ID
  sr: string = "";//日程关联ID
  bz: string = "";//备注
  tx: string = "";//提醒方式
  pni:string = "";//日程原始ID
  wtt: number;//时间戳
  du:string ="";//消息读取状态
  gs:string ="";//归属 0：本人创建，1：他人创建，2：系统本地日历,3:系统计划3优先级类型，4：系统计划无优先级
  ib:string ="0"; //0：非本地日历;1：本地日历
  fssshow:string ="";//参与人画面显示用
  cbkcolor:number = 0;//每个日程颜色画面显示用
  morecolor:string ="#FFFFFF";//more颜色画面显示


  showSpSd: string = "";//画面显示特殊表开始日期


  //特殊日期日程
  specScds: Map<string, BaseData> = new Map<string, BaseData>();

  //当天关联的特殊日程
  specScd(d:string): BaseData {
    return this.specScds.get(d);
  }
  baseData : BaseData;
  //参与人
  fss: Array<FsData> =new Array<FsData>();

  //发起人
  fs: FsData =new FsData();


  //提醒设置
  r: RemindData = new RemindData();

  //所属计划
  p:PlData = new PlData();

  //特殊数据附件
  fjt: string = '';
  fjn: string = '';
  fj: string = '';
  fjo: any = {};
}

//特殊事件
export class SpecScdData extends BaseData{
  spi: string = "" //日程特殊事件ID
  si: string = ""//日程事件ID
  spn: string = ""//日程特殊事件主题
  sd: string = ""//开始日期
  st: string = ""//开始时间
  ed: string = ""//结束时间
  et: string = ""//结束时间
  ji: string = ""//计划ID
  bz: string = ""//备注
  sta: string = ""//特殊类型
  tx: string = ""//提醒方式
  wtt: number;//时间戳
  gs:string;//归属
  remindData:RemindData = new RemindData();//对应提醒时间
  //所属计划
  p:PlData = new PlData();
}

/**
 * 系统特殊计划表
 */
export class JtData extends BaseData {
  jti: string = "";//主键ID
  si: string = ""//日程事件ID
  ji: string = "";//计划ID
  spn: string = "";//主题
  sd: string = ""//开始日期
  st: string = ""//开始时间
  ed: string = ""//结束时间
  et: string = ""//结束时间
  px: Number = 0; //排序
  bz: string = ""; //备注
}
//参与人
export class FsData {
  pwi: string = ""; //主键
  ran: string = ""; //联系人别称
  ranpy: string = ""; //联系人别称拼音
  hiu: string = "";  // 联系人头像
  rn: string = "";  // 联系人名称
  rnpy: string = "";  //联系人名称拼音
  rc: string = "";  //联系人联系方式
  rel: string = ""; //系类型 1是个人，2是群，0未注册用户
  ui: string = "";  //数据归属人ID
  bhi: string = ""; //头像表ID 用于判断是否有头像记录
  bhiu:string="";//base64图片
  src : string="";//联系人来源
  pi: string=""; //日程参与人表ID
  si: string=""; //日程事件ID
  isbla:boolean=false; //默认非黑名单
  bi :string ="";//组id
}


//提醒时间
export class RemindData {
  wi: string = "";//提醒时间ID
  si: string = "";//日程事件ID
  st: string = ""; //日程事件类型
  wd: string = "";//日程提醒日期
  wt: string = "";//日程提醒时间
  wtt: number;//创建时间戳
}
//计划
export class PlData{
  ji: string="";//计划ID
  jn: string="";//计划名
  jg: string="";//计划描述
  jc: string="";//计划颜色标记
  jt: string="";//计划类型
  jtd: string="";
  wtt: Number;//创建时间戳
}


export class PageUData{
  user = {
    //用户ID
    id: "",
    //账户ID
    aid: "",
    //用户名
    name: "",
    //用户头像
    avatar: "",
    //出生日期
    birthday: "",
    //真实姓名
    realname: "",
    //身份证
    ic: "",
    //性别
    sex: "",
    //联系方式
    contact: "",
  };
  account = {
    // 账户ID
    id: "",
    // 账户名
    name: "",
    // 手机号
    phone: "",
    // 设备号
    device: "",
    // token
    token: "",
    // 账户消息队列
    mq: "",
  }
}


export class PageY{
  //偏好主键ID
  yi : string ="";
  //偏好设置类型
  yt : string ="";
  //偏好设置类型名称
  ytn : string ="";
  //偏好设置名称
  yn : string ="";
  //偏好设置key
  yk : string ="";
  //偏好设置value
  yv : string ="";

}

export class ScdlData {
  d: string;
  id: string;
  bc:number;
  scdl: Array<ScdData> = new Array<ScdData>();
  jtl: Array<JtData> = new Array<JtData>();
}



export class ScdPageParamter{
  //本地日历ID
  si:string = ""
  //特殊表ID
  spid:string="";
  //传入时间
  d:moment.Moment;
  //传入时间
  t:string;
  //主题
  sn:string;
  //原归属ID
  gs:string="";
  //创建到todolist
  todolist:boolean=false;
}

export class PagePlData {

  xtJh:Array<PagePDPro> = new Array<PagePDPro>(); //本地计划

  zdyJh:Array<PagePDPro> = new Array<PagePDPro>(); //自定义计划列表

}

//页面项目
export class PagePDPro{
  ji: string = "";//计划ID
  jn: string = "";//计划名
  jg: string = "";//计划描述
  jc: string = "";//计划颜色标记
  jt: string = "";//计划类型 0,系统特殊计划;1系统计划;2自定义

  js: any = 0; //日程数量
  jtd: string = "0"; //系统计划区别是否下载
  pt: string = "";//计划名  计划分享使用
}


//页面项目
export class PagePcPro{
  //计划名
  jn:string="";
  //计划描述
  jg:string="";
  //计划颜色标记
  jc:string="";
}


export class PageDcData {
  gi: string = ""; //关系群组主键ID
  gn: string = "";//组名
  gnpy: string = "";//组名拼音
  gm: string = ""; //备注
  gc: number = 0; //群组人数
  fsl: Array<FsData> = new Array<FsData>(); //群组成员
}

export class PageDaData {
  currentDay: CalendarDay;
  scdl: Array<ScdData> = new Array<ScdData>();  //当天日程列表
}

export class HData {
  isShow: boolean = false;
  showDay: string = "";
  showDay2: string = "";
  newmessge: number = 0;
  things: number = 0;
  selectDay: CalendarDay;
  jtl:Array<JtData> = new Array<JtData>();
}

export class PageLoginData {
  phoneno : string = "";
  userpassword : string = "";
  verifycode : string = "";
  verifykey : string = "";
  username : string = "";
}



/**
 * 联系人视图
 */
export class FsPageData extends  FsData{
  checked:boolean = false;
}

export class PageGroupData extends  PageDcData{
  checked:boolean = false;
}
export interface MemberPageData extends Member{
  checked:boolean ;
}

export class AlData {
  text: string;
  islogin: boolean;
}


export class PageBlData{
  //帐户ID
  ai: string;
  //手机号码
  mpn: string;
  //姓名
  n: string;
  //头像
  a: string;
  //性别
  s: string;
  //生日
  bd: string;

}

/**
 * 日程添加入参
 */
export class RcInParam{
  si: string = "";//日程事件ID
  sn: string = "";//日程事件主题  必传
  ui: string = "";//创建者
  sd: string = "";//开始日期      必传
  st: string = "";//开始时间
  ed: string = "";//结束日期
  et: string = "";//结束时间
  rt: string = "0";//重复类型
  ji: string = "";//计划ID
  sr: string = "";//日程关联ID
  fjt: string ="";//附件类型 2019/6/17 增加
  fjn: string ="";//附件名称/KEY 2019/6/17 增加
  fj: string ="";//附件 2019/6/17 增加
  bz: string = "";//备注
  tx: string = "0";//提醒方式
  gs:string ="0";//归属 0：本人创建，1：他人创建，2：系统本地日历,3:系统计划3优先级类型（入JtTbl表），4：系统计划无优先级
  px:number = 0; //排序
  specScdUpd: BaseData = new  BaseData();//sp内容
  //参与人
  fss: Array<FsData> =new Array<FsData>();
  /**
   * 设置ed、et等其他参数
   */
  setParam(){
    if(this.ed==''){
      this.ed = this.sd;
    }
    if(this.et==''){
      this.et = this.st;
    }
  }

}

export class MonthData{
  sd:string;
  scds:number;
  news:number;
  minrt:string; //最小重复类型：0:无1:天2:周3:月4:年
  csd : string;//日程开始时间
  jti:string; //特殊系统计划主键ID
  spn:string; //特殊系统计划标题
  si:string; //特殊系统计划标题日程ID
  minpx:number; //特殊系统计划最小排序
}

export class DayData{
  sd:string;
  scds:number;
  news:number;
  jtL : Array<JtData>;
}
