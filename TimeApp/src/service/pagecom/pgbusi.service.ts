//获取日程
import {BTbl} from "../sqlite/tbl/b.tbl";
import {CTbl} from "../sqlite/tbl/c.tbl";
import {ETbl} from "../sqlite/tbl/e.tbl";
import {BsModel} from "../restful/out/bs.model";
import {JhTbl} from "../sqlite/tbl/jh.tbl";
import {AgdPro, AgdRestful} from "../restful/agdsev";
import {Injectable} from "@angular/core";
import {SqliteExec} from "../util-service/sqlite.exec";
import {UtilService} from "../util-service/util.service";
import {SpTbl} from "../sqlite/tbl/sp.tbl";
import {DTbl} from "../sqlite/tbl/d.tbl";
import * as moment from "moment";

@Injectable()
export class PgBusiService {
  constructor(private sqlExce: SqliteExec, private util: UtilService, private agdRest: AgdRestful) {
  }

  //获取日程详情
  async get(si: string){
    let bs = new BsModel<ScdData>();
    //获取本地日程

    let scdData = new ScdData();

    let ctbl = new CTbl();
    ctbl.si = si;
    ctbl = await this.sqlExce.getOne<CTbl>(ctbl);
    Object.assign(scdData, ctbl);

    //获取计划对应色标
    let jh = new JhTbl();
    jh.ji = scdData.ji;
    jh = await this.sqlExce.getOne<JhTbl>(jh);
    Object.assign(scdData.p, jh);

    //获取日程参与人表

    let ssql = "select b.* from gtd_d d ,gtd_b b where a.ai = b.pwi and d.si ='"+ si +"' " ;
    let bList = await this.sqlExce.getExtList<BTbl>(ssql);
    for (let j = 0, len = bList.length; j < len; j++) {
      let fsd = new FsData();
      Object.assign(fsd, bList[j]);
      scdData.fss.push(fsd);
    }

    //获取提醒时间
    let e = new ETbl();
    e.si = si;
    e = await this.sqlExce.getOne<ETbl>(e);
    Object.assign(scdData.r, e);

    bs.code = 0;
    bs.data = scdData;
    return bs;
  }

//删除日程 type：1 删除当前以后所有 ，2 删除所有
  async delete(rcId:string,type :string,d:string){
    let agdPro:AgdPro = new AgdPro();
    let ctbl:CTbl =new CTbl();

    //日程Id
    ctbl.si = rcId;


    if (type =="2"){
      let etbl:ETbl =new ETbl();
      etbl.si = ctbl.si;
      await this.sqlExce.delete(etbl);//本地删除提醒
      let dtbl:DTbl =new DTbl();
      dtbl.si = ctbl.si;
      await this.sqlExce.delete(dtbl);//本地删除日程参与人

      await this.sqlExce.delete(ctbl); //本地删除日程表

      let sptbl = new SpTbl();
      sptbl.si = rcId;
      await this.sqlExce.delete(sptbl);//本地删除日程子表

      //restFul 删除日程
      let a:AgdPro = new AgdPro();
      a.ai = ctbl.si;//日程ID
      await this.agdRest.remove(a);

    }else{
      let sql ="delete from gtd_sp where si = '"+ rcId +"' and sd>= '"+ d +"'";
      await this.sqlExce.execSql(sql);

      ctbl.sd = d;
      await this.sqlExce.update(ctbl);

      let a = new AgdPro();
      a.ai = ctbl.si;//日程ID
      a.adt = d;
      await this.agdRest.save(a);
    }

  }

  /**
   * 日程添加
   * @param {PageRcData} rc 日程信息
   * @returns {Promise<BsModel<any>>}
   */
  save(rc : ScdData):Promise<BsModel<CTbl>>{
    return new Promise((resolve, reject) => {
      let bs = new BsModel<any>();
      let str =this.checkRc(rc);
      if(str != ''){
        bs.code = 1;
        bs.message = str;
        resolve(bs);
      }else{
        let ct = new CTbl();
        Object.assign(ct,rc);
        ct.si = this.util.getUuid();
        //保存本地日程
        this.sqlExce.save(ct).then(data=>{
          //添加特殊事件表
          return this.saveSp(ct);
        }).then(data=>{
          //保存本地提醒表
          return this.saveOrUpdTx(ct);
        }).then(data=>{
          let adgPro:AgdPro = new AgdPro();
          adgPro.ai=ct.si; //日程ID
          adgPro.rai=rc.sr;//日程发送人用户ID
          adgPro.fc=rc.ui; //创建人
          adgPro.at=rc.sn;//主题
          adgPro.adt=rc.sd + " " + rc.st; //时间(YYYY/MM/DD HH:mm)
          adgPro.ap=rc.ji;//计划
          adgPro.ar=rc.rt;//重复
          adgPro.aa=rc.tx;//提醒
          adgPro.am=rc.bz;//备注
          //restFul保存日程
          return this.agdRest.save(adgPro)
        }).then(data=>{
          bs.data=ct;
          resolve(bs);
        }).catch(e=>{
          bs.code = -99;
          bs.message = e.message;
          resolve(bs);
        })
      }
    });
  }

  /**
   * 保存日程特殊表
   * @param {CTbl} rc 日程详情
   * @returns {Promise<Promise<any> | number>}
   */
  private saveSp(rc:CTbl):Promise<any>{
    let len = 1;
    let add:any = 'd';
    if(rc.rt=='1'){
      len = 365;
    }else if(rc.rt=='2'){
      len = 96;
      add = 'w';
    }else if(rc.rt=='3'){
      len = 24;
      add = 'M';
    }else if(rc.rt=='4'){
      len = 20;
      add = 'y';
    }
    let sql=new Array<string>();
    for(let i=0;i<len;i++){
      let sp = new SpTbl();
      sp.spi = this.util.getUuid();
      sp.si = rc.si;
      // sp.sd = moment(rc.sd).add(i,'d').format("YYYY/MM/DD");
      sp.sd = moment(rc.sd).add(i,add).format("YYYY/MM/DD");
      sp.st = rc.st;
      sql.push(sp.inT());
    }

    console.log('-------- 插入重复表 --------');
    //保存特殊表
    return this.sqlExce.batExecSql(sql);

  }

  /**
   * 保存提醒方式
   * @param {CTbl} rc 日程详情
   * @returns {Promise<Promise<any> | number>}
   */
  private async saveOrUpdTx(rc:CTbl):Promise<any>{
    let et = new ETbl();//提醒表
    et.si = rc.si;
    let result = await this.sqlExce.delete(et);
    if(rc.tx != '0'){
      et.wi = this.util.getUuid();
      et.wt = '0';
      let time = 10; //分钟
      if(rc.tx == "2"){
        time = 30;
      }else if(rc.tx == "3"){
        time = 60;
      }else if(rc.tx == "4"){
        time = 240;
      }else if(rc.tx == "5"){
        time = 360;
      }
      let date = moment(rc.sd+ " " + rc.st).add(time,'m').format("YYYY/MM/DD HH:mm");
      et.wd=date.substr(0,10);
      et.st = date.substr(11,5);
      console.log('-------- 插入提醒表 --------');
      result = await this.sqlExce.save(et);
    }
    return result;
  }
  /**
   * 日程校验
   * @param {PageRcData} rc
   * @returns {string}
   */
  private checkRc(rc:ScdData):string{
    let str = '';
    //check 日程必输项
    if(rc.sn == ''){
      str += '标题不能为空;/n';
    }
    if(rc.sn.length>20){
      str += '标题文本长度必须下于20;/n';
    }
    if(rc.sd == ''){
      str += '日期不能为空;/n';
    }
    return str;
  }


//修改本地日程详情
  /**
   *
   * @param {ScdData} scd
   * @param {string} type 0：他人创建，1：本人创建
   * @returns {Promise<void>}
   */
  async updateDetail(scd:ScdData,type :string){

    //特殊表操作
    let bs :BsModel<ScdData> = await this.get(scd.si);

    //更新日程
    let c = new CTbl();
    Object.assign(c,scd);
    //消息设为已读
    c.du = "1";
    await  this.sqlExce.update(c);

    //更新提醒时间
    await this.saveOrUpdTx(c);

    if (type == "1") {
      if (bs.data.sd != c.sd || bs.data.rt != c.rt){
        //日期与重复标识变化了，则删除重复子表所有数据，重新插入新数据
        let sptbl = new SpTbl();
        sptbl.si = c.si;
        await this.sqlExce.delete(sptbl);

        await this.saveSp(c);
      }else{
        //如果只是修改重复时间，则更新重复子表所有时间
        if (bs.data.st != scd.st){
          let sq = "update gtd_sp set st = '"+ c.st +"' where si = '"+ c.si +"'";
          await this.sqlExce.execSql(sq);
        }
      }
      //restful用参数
      let agd = new AgdPro();
      this.setAdgPro(agd,c);

      await this.agdRest.save(agd);
    }
  }

  private setAdgPro(agd:AgdPro,c :CTbl){
    //关联日程ID
    agd.rai = c.sr;
    //日程发送人用户ID
    agd.fc = c.ui;
    //日程ID
    agd.ai = c.si;
    //主题
    agd.at = c.sn;
    //时间(YYYY/MM/DD)
    agd.adt = c.sd;
    agd.st = c.st;
    agd.ed = c.ed;
    agd.et = c.et;
    //计划
    agd.ap = c.ji;
    //重复
    agd.ar = c.rt;
    //提醒
    agd.aa = c.tx;
    //备注
    agd.am = c.bz;
  }

  //响应MQ消息，从服务器获取最新日程
  async pullAgd(si : string){
    let agd = new AgdPro();
    agd.ai = si;
    let bs = new BsModel<AgdPro>();
    bs = await this.agdRest.get(agd);

    let c = new CTbl();
    c.si = si;
    c = await this.sqlExce.getOne<CTbl>(c);
    let newc = new CTbl();
    if (c == null){
      //插入日程表
      this.setCtbl(newc,bs.data);
      await this.sqlExce.save(newc);
    }else{
      //更新日程表
      this.setCtbl(newc,bs.data);
      //本地日程的备注和提醒不被更新
      newc.bz = c.bz;
      newc.tx = c.tx;
      await this.sqlExce.replaceT(newc);
    }

  }

  private setCtbl(c :CTbl,agd:AgdPro){
    //关联日程ID
    c.sr = agd.rai ;
    //日程发送人用户ID
    c.ui = agd.fc  ;
    //日程ID
    c.si = agd.ai  ;
    //主题
    c.sn = agd.at  ;
    //时间(YYYY/MM/DD)
    c.sd = agd.adt ;
    c.st = agd.st  ;
    c.ed = agd.ed  ;
    c.et = agd.et  ;
    //计划
    c.ji = agd.ap  ;
    //重复
    c.rt = agd.ar  ;
    //提醒
    c.tx = agd.aa  ;
    //备注
    c.bz = agd.am  ;
    //他人创建
    c.gs = "0";
    //新消息未读
    c.du = "0";
  }
}

export class ScdData {
  si: string = "";//日程事件ID
  sn: string = "";//日程事件主题
  ui: string = "";//创建者
  sd: string = "";//开始日期
  st: string = "";//开始时间
  ed: string = "";//结束日期
  et: string = "";//结束时间
  rt: string = "";//重复类型
  ji: string = "";//计划ID
  sr: string = "";//日程关联ID
  bz: string = "";//备注
  tx: string = "";//提醒方式
  pni:string = "";//日程原始ID
  wtt: number;//时间戳
  du:string ="";//消息读取状态
  gs:string ="";//归属
  ib:string ="0"; //0：非本地日历;1：本地日历
  fssshow:string ="";//参与人画面显示用
  cbkcolor:string ="";//每个日程颜色画面显示用
  morecolor:string ="#FFFFFF";//more颜色画面显示


  //特殊日期日程
  specScds: Map<string, SpecScdData> = new Map<string, SpecScdData>();

  //当天关联的特殊日程
  specScd(): SpecScdData {
    return this.specScds.get(this.sd);
  }

  //参与人
  fss: Array<FsData> =new Array<FsData>();

  //发起人
  fs: FsData =new FsData();


  //提醒设置
  r: RemindData = new RemindData();

  //所属计划
  p:PlData = new PlData();


}


//特殊事件
export class SpecScdData {
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
  wtt: Number;//创建时间戳
}
