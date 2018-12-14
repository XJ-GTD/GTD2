import { Injectable } from "@angular/core";
import { WsModel } from "../../model/ws.model";
import { SkillConfig } from "../../app/skill.config";
import { DwEmitService } from "./dw-emit.service";
import { WorkService } from "../work.service";
import { RelmemService } from "../relmem.service";
import {WsResModel} from "../../model/ws.res.model";

/**
 * webSocket公用处理方法
 *
 * create by wzy on 2018/11/30.
 */
@Injectable()
export class DwMqService {

  constructor(private work:WorkService,
              private relmem :RelmemService,
              private dwEmit: DwEmitService){

  }

  public dealWithMq(mqDate: WsModel) {

    if (mqDate.vs == "1.0" && mqDate.ss == 0) {
      let resd = mqDate.res.data;
      let ct=resd.sn;
      let sd=resd.st;
      let ed = resd.et;
      let lbI = resd.lb;
      let jhi = resd.pn;
      let ruL=[];
      switch (mqDate.sk) {
        case SkillConfig.XF_NMT: //确认
          break;
        case SkillConfig.XF_NMC: //取消
          break;
        case SkillConfig.XF_SCC: //讯飞：日程添加

          this.work.arc(ct,sd,ed,lbI,jhi,ruL).then(data=>{
            this.dwEmit.setHaData(data);
          }).catch(e=>{
            this.dwEmit.setHaData(e);
          });
          break;
        case SkillConfig.XF_SCD: //讯飞：日程删除
          let sI = "";
          this.work.delrc(sI).then(data=>{
            this.dwEmit.setHbData(data);
          }).catch(e=>{
            this.dwEmit.setHbData(e);
          });
          break;
        case SkillConfig.XF_SCF: //讯飞：日程查询
          let jh = '';
          let lbN='';
          this.work.getwL(ct,sd,ed,lbI,lbN,jh).then(data=>{
            let str = "";
            if(data && data.sjl && data.sjl.length>0){
              str = '您有'+data.sjl.length+"个日程等待您去处理！"
            }else{
              str="您今天有大把的时间可以利用"
            }
            let url = "http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&text=" + encodeURI(str);
            var n = new Audio(url);
            n.src = url;
            n.play();
            this.dwEmit.setHbData(data);
          }).catch(e=>{
            this.dwEmit.setHbData(e);
          });
          break;
        case SkillConfig.XF_PEC: //讯飞：参与人添加
          let ran='';
          let rN='';
          let rC = '';
          let rel = '';
          let rF = '';
          let qrL=[];
          this.relmem.aru('',ran,rN,rC,rel,rF,qrL).then(data=>{

          }).catch(e=>{

          });
          break;
        case SkillConfig.XF_PED: //讯飞：参与人删除
          let id='';
          this.relmem.delRu(id).then(data=>{

          }).catch(e=>{

          });
          break;
        case SkillConfig.XF_PEF: //讯飞：参与人查询
          this.relmem.getrus(id,ran,rN,rC,rel).then(data=>{

          }).catch(e=>{

          });
          break;
        case SkillConfig.XF_PEA: //讯飞：参与人授权
          this.relmem.upr(id,ran,rN,rC,rel,rF,qrL).then(data=>{

          }).catch(e=>{

          });
          break;
        case SkillConfig.XF_SYSH: //讯飞：私密模式
          break;
        case SkillConfig.XF_OTS:
          break;
        case SkillConfig.BC_SCC: //添加日程
          this.work.arc(ct,sd,ed,lbI,jhi,ruL).then(data=>{

          }).catch(e=>{

          });
          break;
        case SkillConfig.BC_SCD: //删除日程
          this.work.delrc(sI).then(data=>{

          }).catch(e=>{

          })
          break;
        case SkillConfig.BC_SCU: //更新日程
          break;
        case SkillConfig.BC_PEC: //添加参与人
          break;
      }
    } else {

    }

  }
}
