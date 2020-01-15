import {Injectable} from "@angular/core";
import * as moment from "moment";
import {FsData, RcInParam, ScdData, ScdPageParamter} from "../../../data.mapping";
import {DataConfig} from "../../../service/config/data.config";
import {ModalController} from "ionic-angular";
import {AssistantService} from "../../../service/cordova/assistant.service";
import {PgBusiService} from "../../../service/pagecom/pgbusi.service";
import {FsService} from "../../../pages/fs/fs.service";

@Injectable()
export class AiService {

  constructor(private modalController: ModalController,
              private assistantService: AssistantService,
              private pgBusiService:PgBusiService,
              private fsService:FsService) {
  }

  speakScd(scds: ScdLsAiData) {
    let speak: string = "";
    let i = 0;

    let prevdate = '';
    for (i = 0; i < scds.datas.length; i++) {
      let scd: ScdAiData = scds.datas[i];
      let currdate = moment(scd.d).format("YYYY年MM月DD日");
      let broadcast = false;

      if (prevdate == '' || currdate != prevdate) {
        prevdate = currdate;
        broadcast = true;
      }
      speak = speak + "第" + (i + 1) + "个活动 " + (broadcast? currdate : '') + (scd.t == '99:99'? ' ' : scd.t) + scd.ti;
    }

    this.assistantService.speakText(speak);

  }

  go2tdc(scd: ScdAiData) {
    let paramter: ScdPageParamter = new ScdPageParamter();
    paramter.t = scd.t;
    paramter.d = moment(scd.d, "YYYY/MM/DD");
    paramter.sn = scd.ti;
    // this.modalController.create(DataConfig.PAGE._TDC_PAGE, paramter).present();
  }

  async createScd(scd: ScdAiData) {
    //tx rt
    let rcIn:RcInParam = new RcInParam();
    rcIn.sn = scd.ti;
    rcIn.st = scd.t;
    rcIn.sd = scd.d;
    for (let f of scd.friends){
      let fs:FsData = new FsData();
      fs.ui = f.uid;
      fs.ran = f.n;
      fs.pwi = f.id;
      fs.rc = f.m;
      fs.ranpy = f.p;
      rcIn.fss.push(fs);
    }
    return await this.pgBusiService.saveOrUpdate(rcIn);
  }

  showScd(scd: ScdAiData) {

    let p: ScdPageParamter = new ScdPageParamter();
    p.si = scd.id;
    p.d = moment(scd.d);
    p.gs = scd.gs;
    let gs = scd.gs
    if (!scd.id) {
      this.go2tdc(scd);
      return;
    }

    if (gs == "0") {
      //本人画面
      // this.modalController.create(DataConfig.PAGE._TDDJ_PAGE, p).present();
    } else if (gs == "1") {
      //受邀人画面
      // this.modalController.create(DataConfig.PAGE._TDDI_PAGE, p).present();
    } else {
      //系统画面
      // this.modalController.create(DataConfig.PAGE._TDDS_PAGE, p).present();
    }
  }

  countDay(day: string): string {
    let date = moment(day, "YYYY/MM/DD");
    let str = '今天';
    let nowDate = moment(moment(new Date()).format("YYYY/MM/DD"), "YYYY/MM/DD");
    let days = date.diff(nowDate, 'days');
    if (days == 0) {
      str = '今天';
    } else if (days == 1) {
      str = '明天';
    } else if (days == 2) {
      str = '后天';
    } else if (days == -1) {
      str = '昨天';
    } else if (days == -2) {
      str = '前天';
    } else{
      str = date.format("YYYY-M-D");
    }
    return str;
  }

}


export class AiData {
  speechAi: SpeechAiData;
  scdList: ScdLsAiData;
  scd: ScdAiData;
  public clear(){
    this.speechAi = null;
    this.scdList = null;
    this.scd = null;
  }
  public copyto(target:AiData){
    target.clear();
    target.scd = this.scd;
    target.scdList = this.scdList;
    target.speechAi = this.speechAi;
  }
  public isEmpty() {
    return !this.speechAi && !this.scdList && !this.scd;
  }
}

export class ScdLsAiData {
  desc: string = "";
  scdTip:string = "";
  datas: Array<ScdAiData> = new Array<ScdAiData>();
}

export class ScdAiData {
  id: string = "";
  d: string = "";
  t: string = "";
  ti: string = "";
  type: string = "";  // 增加数据类型
  gs: string = "";
  saved:boolean = false;
  scdTip:string = "";
  an: string = "";
  friends: Array<FriendAiData> = new Array<FriendAiData>();
}

export class FriendAiData {
  id: string = "";
  n: string = "";
  m: string = "";
  p: string = "";
  a: string = "";
  uid:string = "";
}

export class SpeechAiData {
  an: string = "";
  org: string = "";
  tips: string = "";
  iswaitting:boolean = false;
}
