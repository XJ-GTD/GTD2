import { Injectable } from "@angular/core";
import { WsModel } from "../../model/ws.model";
import { SkillConfig } from "../../app/skill.config";
import { DwEmitService } from "./dw-emit.service";
import { WorkService } from "../work.service";
import { RelmemService } from "../relmem.service";
import { WsResDataModel } from "../../model/ws.res.model";
import {ErrorCodeService} from "./error-code.service";
import {HdSpeechService} from "./hd-speech.service";

/**
 * webSocket公用处理方法
 *
 * create by wzy on 2018/11/30.
 */
@Injectable()
export class DwMqService {

  constructor(private work:WorkService,
              private relmem :RelmemService,
              private errorCode: ErrorCodeService,
              private hdSpeech: HdSpeechService,
              private dwEmit: DwEmitService){

  }

  //消息类型判断
  public dealWithMq(mqDate: WsModel) {

    //成功消息处理
    if (mqDate.vs == "1.0" && mqDate.ss == 0) {
      switch (mqDate.sk) {
        case SkillConfig.XF_NMT: //确认
          break;
        case SkillConfig.XF_NMC: //取消
          break;
        case SkillConfig.XF_SCC: //讯飞：日程添加
          this.xfScheduleCreate(mqDate.res.data);
          break;
        case SkillConfig.XF_SCD: //讯飞：日程删除
          this.xfScheduleDelete();
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
        case SkillConfig.XF_OTS:
          break;
        case SkillConfig.BC_SCC: //添加日程
          this.scheduleCreate(mqDate.res.data);
          break;
        case SkillConfig.BC_SCD: //删除日程
          this.scheduleDelete();
          break;
        case SkillConfig.BC_SCU: //更新日程
          this.scheduleUpdate(mqDate.res.data);
          break;
        case SkillConfig.BC_PEC: //添加参与人
          this.relationAdd(mqDate.res.data)
          break;
      }
    } else {
      //失败消息处理
      this.errorCode.errorHanding(mqDate.ss);

    }

  }

  /*============  处理方法 start =================*/

  /**
   * 语音：日程创建
   * @param data
   */
  private xfScheduleCreate(mqDate:WsResDataModel) {
    this.dwEmit.setHbData(mqDate);//测试用
    let ca=mqDate.common_A;  //人名原参数value
    let cb=mqDate.common_B; //人名原参数normValue
    let pln = mqDate.pln //拼音
    let sn = mqDate.sn //标题
    let sd = mqDate.st;
    if(sd == null || sd==''){
      sd=mqDate.et;
    }
    let ed=mqDate.et;
    if(ed == null || ed==''){
      ed=mqDate.st;
    }
    let ruL=[];

    // this.work.arc(ct,sd,ed,lbI,jhi,ruL).then(data=>{
    //   this.dwEmit.setHaData(data);
    // }).catch(e=>{
    //   this.dwEmit.setHaData(e);
    // });
  }

  /**
   * 语音：日程删除
   */
  private xfScheduleDelete() {
    let sI = "";
    this.work.delrc(sI).then(data=>{
      this.dwEmit.setHbData(data);
    }).catch(e=>{
      this.dwEmit.setHbData(e);
    });

  }

  /**
   * 语音：日程查询
   */
  private xfScheduleFind(mqDate) {
    this.hdSpeech.scheduleFind();
    let para :WsResDataModel  = mqDate.res.data
    let ct = para.sn;
    let lbN = para.lb;
    let jh = para.pn;
    let sd = para.st;
    if(sd == null || sd==''){
      sd=para.et;
    }
    let ed=para.et;
    if(ed == null || ed==''){
      ed=para.st;
    }
    this.work.getwL('',sd,ed,'',lbN,jh).then(data=>{
      let str = "";
      if(data && data.rcL && data.rcL.length>0){
        str = '您有'+data.rcL.length+"个日程等待您去处理！"
      }else{
        str="您今天有大把的时间可以利用"
      }
      let url = "http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&text=" + encodeURI(str);
      var n = new Audio(url);
      n.src = url;
      n.play();
      mqDate.qData = data;
      this.dwEmit.setHbData(mqDate);//测试用
    }).catch(e=>{
      this.dwEmit.setHbData(mqDate);//测试用
    });
  }

  /**
   * 语音：参与人添加
   */
  private xfPlayerCreate() {
    let ran='';
    let rN='';
    let rC = '';
    let rel = '';
    let rF = '';
    let qrL=[];
    this.relmem.aru('','',ran,rN,rC,rel,'',rF,qrL).then(data=>{

    }).catch(e=>{

    });
  }

  /**
   * 语音：参与人删除
   */
  private xfPlayerDelete() {
    let id='';
    this.relmem.delRu(id).then(data=>{

    }).catch(e=>{

    });
  }

  /**
   * 语音参与人查询
   */
  private xfPlayerFind() {
    let ran='';
    let rN='';
    let rC = '';
    let rel = '';
    let rF = '';
    let qrL=[];
    let id='';
    this.relmem.getrus(id,ran,rN,rC,rel).then(data=>{

    }).catch(e=>{

    });
  }

  /**
   * 语音：参与人授权
   */
  private xfPlayerAuth() {
    let ran='';
    let rN='';
    let rC = '';
    let rel = '';
    let rF = '';
    let qrL=[];
    let id='';
    this.relmem.upr(id,ran,rN,rC,rel,rF,qrL).then(data=>{

    }).catch(e=>{

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
    let ct=data.sn;
    let sd=data.st;
    let ed = data.et;
    let lbI = data.lb;
    let rui = data.us;
    let sI=data.si;
    console.log("----- DwMqService scheduleCreate(业务：日程添加) start---- ")
    this.work.arcMq(sI,rui,ct,sd,ed,lbI).then(data=>{
      console.log("----- DwMqService scheduleCreate(业务：日程添加) end ---- ")
    }).catch(e=>{
      console.log("----- DwMqService scheduleCreate(业务：日程添加) Error : "+JSON.stringify(e))
    });
  }

  /**
   * 业务：日程更新
   */
  private scheduleUpdate(data: WsResDataModel) {
    let ct=data.sn;
    let sd=data.st;
    let ed = data.et;
    let lbI = data.lb;
    let rui = data.us;
    let sI=data.si;
    console.log("----- DwMqService scheduleCreate(业务：日程更新) start---- ")
    this.work.urcMq(sI,rui,ct,sd,ed,lbI).then(data=>{
      console.log("----- DwMqService scheduleCreate(业务：日程更新) end ---- ")
    }).catch(e=>{
      console.log("----- DwMqService scheduleCreate(业务：日程更新) Error : "+JSON.stringify(e))
    });
  }

  /**
   * 业务：日程删除
   */
  private scheduleDelete() {
    let sI = "";
    this.work.delrc(sI).then(data=>{

    }).catch(e=>{

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
    if(data.ia){
      rF='1'
    }
    console.log("----- DwMqService relationAdd(业务：联系人添加) start---- ")
    this.relmem.aruMq(aui,ran,rN,rc,hiu,rF).then(data=>{
      console.log("----- DwMqService relationAdd(业务：联系人添加) end : " + JSON.stringify(data))
    }).catch(e=>{
      console.log("----- DwMqService relationAdd(业务：联系人添加) Error : " + JSON.stringify(e))
    })
  }
}
