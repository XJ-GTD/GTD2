import { Injectable } from "@angular/core";
import { WsModel } from "../../model/ws/ws.model";
import { SkillConfig } from "../../app/skill.config";
import { WorkService } from "../work.service";
import { RelmemService } from "../relmem.service";
import { WsResDataModel } from "../../model/ws/ws.res.model";
import { ErrorCodeService } from "./error-code.service";
import { EmitSpeechService } from "./emit-speech.service";
import { DataConfig } from "../../app/data.config";
import { MsEntity } from "../../entity/ms.entity";
import { MsSqlite } from "../sqlite/ms-sqlite";
import { AiuiModel } from "../../model/aiui.model";
import { XiaojiAssistantService } from "./xiaoji-assistant.service";
import { WsEnumModel } from "../../model/ws/ws.enum.model";
import { RcModel } from "../../model/rc.model";

/**
 * webSocket公用处理方法
 *
 * create by wzy on 2018/11/30.
 */
@Injectable()
export class DwMqService {

  constructor(private work: WorkService,
              private relmem: RelmemService,
              private errorCode: ErrorCodeService,
              private msSqlite: MsSqlite,
              private xiaojiSpeech: XiaojiAssistantService,
              private emitSend: EmitSpeechService,) {

  }

  //消息类型判断
  public dealWithMq(mqDate: WsModel) {

    console.log("=======Mq消息返回，开始消息处理=====");
    //mq返回则立即回馈语音界面
    this.sendUserToHbPage(mqDate.ut, mqDate.sk);

    //成功消息处理
    if (mqDate.vs == "1.0" && mqDate.ss == 0) {

      switch (mqDate.sk) {
        case SkillConfig.XF_NMT: //确认
          this.trueDeal(mqDate);
          break;
        case SkillConfig.XF_NMC: //取消
          this.falseDeal(mqDate);
          break;
        case SkillConfig.XF_SCC: //讯飞：日程添加
          this.xfScheduleCreate(mqDate);
          break;
        case SkillConfig.XF_SCD: //讯飞：日程删除
          this.xfScheduleDelete(mqDate);
          break;
        case SkillConfig.XF_SCF: //讯飞：日程查询
          this.xfScheduleFind(mqDate);
          break;
        case SkillConfig.XF_PEC: //讯飞：参与人添加
          this.xfPlayerCreate();
          break;
        case SkillConfig.XF_PED: //讯飞：参与人删除
          this.xfPlayerDelete();
          break;
        case SkillConfig.XF_PEF: //讯飞：参与人查询
          this.xfPlayerFind();
          break;
        case SkillConfig.XF_PEA: //讯飞：参与人授权
          this.xfPlayerAuth();
          break;
        case SkillConfig.XF_SYSH: //讯飞：私密模式
          break;
        case SkillConfig.XF_OTS:    //讯飞：第三方技能
          this.otherSpeech(mqDate);
          break;
        case SkillConfig.BC_SCC: //添加日程
          this.scheduleCreate(mqDate.res.data);
          break;
        case SkillConfig.BC_SCD: //删除日程
          this.scheduleDelete(mqDate.res.data);
          break;
        case SkillConfig.BC_SCU: //更新日程
          this.scheduleUpdate(mqDate.res.data);
          break;
        case SkillConfig.BC_PEC: //添加参与人
          this.relationAdd(mqDate.res.data);
          break;
      }
    } else {
      //失败消息处理
      this.errorCode.errorHanding(mqDate);

    }

  }

  /*============  处理方法 start =================*/

  private trueDeal(mqDate: WsModel) {
    let aiui = new AiuiModel();
    aiui.tt = DataConfig.T1;
    // aiui.at = WsEnumModel[mqDate.sk] + UtilService.randInt(0,10);
    aiui.at = DataConfig.TEXT_CONTENT.get(WsEnumModel[mqDate.sk] + "1");
    this.dwResultSendToPage(aiui, mqDate.sk);
  }

  private falseDeal(mqDate: WsModel) {
    let aiui = new AiuiModel();
    aiui.tt = DataConfig.F1;
    // aiui.at = WsEnumModel[mqDate.sk] + UtilService.randInt(0,10);
    aiui.at = DataConfig.TEXT_CONTENT.get(WsEnumModel[mqDate.sk] + "1");
    this.dwResultSendToPage(aiui, mqDate.sk);
  }

  /**
   * 语音：日程创建
   * @param data
   */
  private xfScheduleCreate(mqDate: WsModel) {
    let md: WsResDataModel = mqDate.res.data;
    let ca = md.common_A;  //人名原参数value
    let cb = md.common_B; //人名原参数normValue
    let pln = md.pln; //拼音
    let sn = md.sn; //标题
    let sd = md.st;
    if (sd == null || sd == '') {
      sd = md.et;
    }
    let ed = md.et;
    if (ed == null || ed == '') {
      ed = md.st;
    }

    let aiui = new AiuiModel();
    aiui.tg = "0";
    console.log("========== 讯飞日程添加业务查询参与人处理开始 ========== ");
    this.work.xfAddrc(sn, sd, pln, ca, cb).then(data => {
      console.log("========== 讯飞日程添加业务查询参与人处理结果： " + JSON.stringify(data));
      if (data != null) {
        aiui.sc = data;
        aiui.tt = DataConfig.S4;
        // aiui.ut = DataConfig.TEXT_CONTENT.get(WsEnumModel[mqDate.sk] + UtilService.randInt(0,9));
        aiui.at = DataConfig.TEXT_CONTENT.get(WsEnumModel[mqDate.sk] + "1");
      } else {
        aiui.tt = DataConfig.S1;
        // aiui.at = WsEnumModel[mqDate.sk] + UtilService.randInt(0,10);
        aiui.at = DataConfig.TEXT_CONTENT.get(WsEnumModel[mqDate.sk] + "10");
      }

      this.dwResultSendToPage(aiui, mqDate.sk);
    })
    .catch(e=>{
      console.error("========== 讯飞日程添加 ERROR ============： " + JSON.stringify(e));
      console.log("xfScheduleCreate:" + e.toString());
    });
  }

  /**
   * 语音：日程删除
   */
  private xfScheduleDelete(mqDate: WsModel) {
    let md: WsResDataModel = mqDate.res.data;
    let sd = '';
    if(md.st && md.st != ''){
      sd = md.st;
    }else{
      sd = md.et;
    }
    let ed='';
    if(md.et && md.et != ''){
      ed = md.et;
    }else{
      ed = sd;
    }
    let sN = md.sn;
    let aiui = new AiuiModel();
    aiui.tg = "1";
    this.work.getwL(sN, sd, ed, '', '', '','0').then(data => {
      aiui.scL = data.rcL;
      if (data && data.rcL && data.rcL.length > 0) {
        //aiui.scL = data.rcL;
        aiui.tt = DataConfig.S5;
        if (mqDate.ses) {
          aiui.at = DataConfig.TEXT_CONTENT.get(WsEnumModel[mqDate.sk] + "1");
        } else {
          aiui.at = mqDate.at;
        }
      } else {
        aiui.tt = DataConfig.S1;
        aiui.at = DataConfig.TEXT_CONTENT.get(WsEnumModel[mqDate.sk] + "10");
      }

      this.dwResultSendToPage(aiui, mqDate.sk);
    })
      .catch(e=>{
      console.log("xfScheduleDelete:" + e.toString());
    });

  }

  /**
   * 语音：日程查询
   */
  private xfScheduleFind(mqDate: WsModel) {
    let para: WsResDataModel = mqDate.res.data;
    let ct = para.sn;
    let lbN = para.lb;
    let jh = para.pn;
    let sd = para.st;
    if (sd == null || sd == '') {
      sd = para.et;
    }
    let ed = para.et;
    if (ed == null || ed == '') {
      ed = para.st;
    }
    let aiui = new AiuiModel();
    this.work.getwL(ct, sd, ed, '', lbN, jh,'1').then(data => {
      let str = "";
      if (data && data.rcL && data.rcL.length > 0) {
        aiui.scL = data.rcL;
        aiui.tt = DataConfig.S5;
        aiui.at = DataConfig.TEXT_CONTENT.get(WsEnumModel[mqDate.sk] + "1");
      } else {
        aiui.tt = DataConfig.S1;
        aiui.at = DataConfig.TEXT_CONTENT.get(WsEnumModel[mqDate.sk] + "10");
      }
      this.dwResultSendToPage(aiui, mqDate.sk);
    }).catch(e=>{
      console.log("xfScheduleFind:" + e.toString());
    });
  }

  /**
   * 语音：参与人添加
   */
  private xfPlayerCreate() {
    let ran = '';
    let rN = '';
    let rC = '';
    let rel = '';
    let rF = '';
    let qrL = [];
    this.relmem.aru('', '', ran, rN, rC, rel, '', rF, qrL).then(data => {

    }).catch(e => {

    });
  }

  /**
   * 语音：参与人删除
   */
  private xfPlayerDelete() {
    let id = '';
    this.relmem.delRu(id).then(data => {

    }).catch(e => {

    });
  }

  /**
   * 语音参与人查询
   */
  private xfPlayerFind() {
    let ran = '';
    let rN = '';
    let rC = '';
    let rel = '';
    let rF = '';
    let qrL = [];
    let id = '';
    this.relmem.getrus(id, ran, rN, rC, rel).then(data => {

    }).catch(e => {

    });
  }

  /**
   * 语音：参与人授权
   */
  private xfPlayerAuth() {
    let ran = '';
    let rN = '';
    let rC = '';
    let rel = '';
    let rF = '';
    let qrL = [];
    let id = '';
    this.relmem.upr(id, ran, rN, rC, rel, rF, qrL, '','').then(data => {

    }).catch(e => {

    });
  }

  /**
   * 语音：系统私密模式
   */
  private xfSystemHide() {

  }

  /**
   * 业务：日程添加
   */
  private scheduleCreate(data: WsResDataModel) {
    let ct = data.sn;
    let sd = data.st;
    let ed = data.et;
    let lbI = data.lb;
    let rui = data.us;
    let sI = data.si;
    console.log("----- DwMqService scheduleCreate(业务：日程添加) start---- ");
    if (rui != DataConfig.uInfo.uI) {
      this.work.arcMq(sI, rui, ct, sd, ed, lbI, '', '', '').then(data => {
        console.log("----- DwMqService scheduleCreate(业务：日程添加) end ---- ");
        let ms = new MsEntity();
        ms.mn = ct;
        ms.md = sd;
        ms.rI = sI;
        ms.mt = '0';
        ms.mf = '0';
        return this.msSqlite.addMs(ms);
      }).then(data => {
        console.log("----- DwMqService scheduleCreate(业务：日程添加Message) end ---- ");
      }).catch(e => {
        console.log("----- DwMqService scheduleCreate(业务：日程添加) Error : " + JSON.stringify(e));
      });
    }

  }

  /**
   * 业务：日程更新
   */
  private scheduleUpdate(data: WsResDataModel) {
    let ct = data.sn;
    let sd = data.st;
    let ed = data.et;
    let lbI = data.lb;
    let rui = data.us;
    let sI = data.si;
    console.log("----- DwMqService scheduleCreate(业务：日程更新) start---- ")
    this.work.urcMq(sI, rui, ct, sd, ed, lbI, '', '', '', '').then(data => {
      console.log("----- DwMqService scheduleCreate(业务：日程更新) end ---- ")
      let ms = new MsEntity();
      ms.mn = ct;
      ms.md = sd;
      ms.rI = sI;
      ms.mt = '0';
      ms.mf = '0';
      return this.msSqlite.addMs(ms);
    }).then(data => {
      console.log("----- DwMqService scheduleCreate(业务：日程更新Message) end ---- ");
    }).catch(e => {
      console.log("----- DwMqService scheduleCreate(业务：日程更新) Error : " + JSON.stringify(e))
    });
  }

  /**
   * 业务：日程删除
   */
  private scheduleDelete(data: WsResDataModel) {
    let rc = new RcModel();
    rc.sI = data.si;
    rc.sN = data.sn;
    rc.sd = data.st;
    rc.ed = data.et;
    this.work.mqDrc(rc).then(data => {
      let ms = new MsEntity();
      ms.mn = rc.sN;
      ms.md = rc.sd;
      ms.rI = rc.sI;
      ms.mt = '0';
      ms.mf = '0';
      return this.msSqlite.addMs(ms);
    }).then(data => {
      console.log("----- DwMqService scheduleCreate(业务：日程更新Message) end ---- ");
    }).catch(e => {

    })
  }

  /**
   * 业务：添加联系人
   */
  private relationAdd(data: WsResDataModel) {
    let aui = data.us;
    let ran = data.un;
    let rN = data.un;
    let rc = data.mb;
    let hiu = data.hi;
    let rF = '0';
    if (data.ia) {
      rF = '1'
    }
    console.log("----- DwMqService relationAdd(业务：联系人添加) start---- ");
    this.relmem.aruMq(aui, ran, rN, rc, hiu, rF).then(data => {
      console.log("----- DwMqService relationAdd(业务：联系人添加) end : " + JSON.stringify(data))
    }).catch(e => {
      console.log("----- DwMqService relationAdd(业务：联系人添加) Error : " + JSON.stringify(e))
    })
  }

  /**
   * 讯飞第三方技能统一返回
   * @param mqDate
   */
  private otherSpeech(mqDate: WsModel) {
    let aiui = new AiuiModel();
    aiui.tt = DataConfig.S1;
    aiui.at = mqDate.at;
    aiui.ai = mqDate.ai;
    aiui.au = mqDate.au;
    this.dwResultSendToPage(aiui, mqDate.sk);
  }

  /**
   * 取出用户翻译传回界面
   * @param userText
   * @param sk
   * @param ss
   */
  private sendUserToHbPage(userText: string, sk: string) {
    let aiui = new AiuiModel();
    aiui.tt = DataConfig.U1;
    if (userText != null && userText != "") {
      aiui.ut = userText;
    } else {
      // aiui.ut = DataConfig.TEXT_CONTENT.get(WsEnumModel[sk] + UtilService.randInt(0,10));
      aiui.ut = DataConfig.TEXT_CONTENT.get(WsEnumModel[sk] + "1");
    }
    console.log("===== MQ返回用户语音消息回传界面 ======");
    this.emitSend.send(aiui, sk);
  }

  /**
   * 回传应答语句和结果数据
   * @param aiui
   * @param sk
   */
  private dwResultSendToPage(aiui: AiuiModel, sk: string) {
    console.log("dwResultSendToPage回应广播发送");
    this.emitSend.send(aiui, sk);
  }


}
