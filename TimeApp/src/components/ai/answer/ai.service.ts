import {Injectable} from "@angular/core";
import * as moment from "moment";
import {FsData, ScdData, ScdPageParamter} from "../../../data.mapping";
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

    for (i = 0; i < scds.datas.length; i++) {
      let scd: ScdAiData = scds.datas[i];
      speak = speak + "第" + (i + 1) + "个活动" + moment(scd.d).format("YYYY年MM月DD日") + scd.t + scd.ti;
    }

    this.assistantService.speakText(speak);

  }

  go2tdc(scd: ScdAiData) {
    let paramter: ScdPageParamter = new ScdPageParamter();
    paramter.t = scd.t;
    paramter.d = moment(scd.d);
    paramter.sn = scd.ti;
    this.modalController.create(DataConfig.PAGE._TDC_PAGE, paramter).present();
  }

  createScd(scd: ScdAiData) {
    //tx rt
    let dbscd:ScdData = new ScdData();
    dbscd.sn = scd.ti;
    dbscd.st = scd.t;
    dbscd.sd = scd.d;
    dbscd.gs = "0";
    dbscd.du = "1";
    dbscd.tx = "0";
    dbscd.rt = "0";
    this.pgBusiService.save4ai(dbscd);
  }

  showScd(scd: ScdAiData) {

    let p: ScdPageParamter = new ScdPageParamter();
    p.si = scd.id;
    p.d = moment(scd.d);
    let gs = scd.gs

    if (gs == "0") {
      //本人画面
      this.modalController.create(DataConfig.PAGE._TDDJ_PAGE, p).present();
    } else if (gs == "1") {
      //受邀人画面
      this.modalController.create(DataConfig.PAGE._TDDI_PAGE, p).present();
    } else {
      //系统画面
      this.modalController.create(DataConfig.PAGE._TDDS_PAGE, p).present();
    }
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
}

export class ScdLsAiData {
  desc: string = "";
  datas: Array<ScdAiData> = new Array<ScdAiData>();
}

export class ScdAiData {
  id: string = "";
  d: string = "";
  t: string = "";
  ti: string = "";
  gs: string = "";
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
}

