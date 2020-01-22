import {Injectable} from "@angular/core";
import * as moment from "moment";
import {ScdPageParamter} from "../../../data.mapping";
import {DataConfig} from "../../../service/config/data.config";
import {ModalController} from "ionic-angular";
import {AssistantService} from "../../../service/cordova/assistant.service";
import {FsService} from "../../../pages/fs/fs.service";
import {ModalTranType} from "../../../data.enum";
import {UtilService} from "../../../service/util-service/util.service";
import {MemoData, MemoService} from "../../../service/business/memo.service";

@Injectable()
export class AiService {

  constructor(private modalController: ModalController,
              private assistantService: AssistantService,
              private fsService: FsService,
              private util: UtilService,
              private memoSevice: MemoService) {
  }

  speakScdList(scds: ScdLsAiData) {
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
      speak = speak + "第" + (i + 1) + "个活动。 " + (broadcast ? currdate : '') + (scd.t == '99:99' ? ' ' : scd.t) + scd.ti + "。";
    }

    this.assistantService.speakText(speak);

  }

  speakScd(scd: ScdAiData) {
    let speak: string = "";

    let prevdate = '';
    let currdate = moment(scd.d).format("YYYY年MM月DD日");
    let broadcast = false;

    if (prevdate == '' || currdate != prevdate) {
      prevdate = currdate;
      broadcast = true;
    }
    speak = speak + (broadcast ? currdate : '') + (scd.t == '99:99' ? ' ' : scd.t) + scd.ti;

    this.assistantService.speakText(speak);

  }

  private toMemo(day) {
    this.util.createModal(DataConfig.PAGE._DAILYMEMOS_PAGE, day, ModalTranType.scale).present();
  }

  showScd(scd: ScdAiData) {
    if (scd.type == "event") {
      let p: ScdPageParamter = new ScdPageParamter();
      p.si = scd.id;
      this.util.createModal(DataConfig.PAGE._AGENDA_PAGE, p, ModalTranType.scale).present();
    } else if (scd.type == "calendar") {
      let p: ScdPageParamter = new ScdPageParamter();
      p.si = scd.id;
      this.util.createModal(DataConfig.PAGE._COMMEMORATIONDAY_PAGE, p, ModalTranType.scale).present();
    } else if (scd.type == "memo") {
      this.memoSevice.getMemo(scd.id).then((memo) => {
        let day: string = moment(scd.d, "YYYY/MM/DD hh:ss").format("YYYY/MM/DD");
        let mo: MemoData = memo;
        if (memo) {
          this.util.createModal(DataConfig.PAGE._MEMO_PAGE, {day: day, memo: mo}, ModalTranType.scale).present();
        }
      })
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
    } else {
      str = date.format("YYYY年MM月DD日");
    }
    str = str + " " + date.format("ddd");
    return str;
  }

}


export class AiData {
  speechAi: SpeechAiData;
  scdList: ScdLsAiData;
  scd: ScdAiData;
  showHelp:boolean =false;
  showTip:boolean =false;

  public clear() {
    this.speechAi = null;
    this.scdList = null;
    this.scd = null;
  }

  public copyto(target: AiData) {
    target.clear();

    if (this.scd) {
      target.scd = new ScdAiData();
      Object.assign(target.scd, this.scd);
    }

    if (this.scdList) {
      target.scdList = new ScdLsAiData();
      Object.assign(target.scdList, this.scdList);
    }

    if (this.speechAi) {
      target.speechAi = new SpeechAiData();
      Object.assign(target.speechAi, this.speechAi);
    }
    target.showHelp = false;
    target.showTip = false;
  }

  public isEmpty() {
    return !this.speechAi && !this.scdList && !this.scd;
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
  type: string = "";  // 增加数据类型
  gs: string = "";
  saved: boolean = false;
  an: string = "";
  adr: string;
  friends: Array<FriendAiData> = new Array<FriendAiData>();
  showfriends: Array<FriendAiData> = new Array<FriendAiData>();
}

export class FriendAiData {
  id: string = "";
  n: string = "";
  m: string = "";
  p: string = "";
  a: string = "";
  uid: string = "";
}

export class SpeechAiData {
  an: string = "";
  org: string = "";
  arraytips: Array<string> = new Array<string>();
  iswaitting: boolean = false;
}
