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

  public dealWithMq(data0: WsModel) {

    if (data0.vs == "1.0" && data0.ss == 0) {
      let resd = data0.res.data;
      switch (data0.sk) {
        case SkillConfig.XF_NMT:
          break;
        case SkillConfig.XF_NMC:
          break;
        case SkillConfig.XF_SCC: //讯飞：日程添加
          let ct=resd.sn;
          let sd='';
          let ed = '';
          let lbI = '';
          let jhi = '';
          let ruL=[];
          this.work.arc(ct,sd,ed,lbI,jhi,ruL).then(data=>{

          }).catch(e=>{

          })
          break;
        case SkillConfig.XF_SCD: //讯飞：日程删除
          let sI = "";
          this.work.delrc(sI).then(data=>{

          }).catch(e=>{

          })
          break;
        case SkillConfig.XF_SCF: //讯飞：日程查询
          let jh = '';
          let lbN='';
          this.work.getwL(ct,sd,ed,lbI,lbN,jh).then(data=>{
            alert(data.code);
            this.dwEmit.setHaData(data);
            //this.dwEmit.setHbData(data);
            this.dwEmit.setAdPage(data);
          }).catch(e=>{
            this.dwEmit.setHaData(e);
            //this.dwEmit.setHbData(e);
            this.dwEmit.setAdPage(e);
          })
          break;
        case SkillConfig.XF_PEC: //讯飞：参与人添加
          let ran='';
          let rN='';
          let rC = '';
          let rel = '';
          let rF = '';
          let qrL=[];
          this.relmem.aru(ran,rN,rC,rel,rF,qrL).then(data=>{

          }).catch(e=>{

          })
          break;
        case SkillConfig.XF_PED: //讯飞：参与人删除
          let id='';
          this.relmem.delRu(id).then(data=>{

          }).catch(e=>{

          })
          break;
        case SkillConfig.XF_PEF: //讯飞：参与人查询
          this.relmem.getrus(id,ran,rN,rC,rel).then(data=>{

          }).catch(e=>{

          })
          break;
        case SkillConfig.XF_PEA: //讯飞：参与人授权
          this.relmem.upr(id,ran,rN,rC,rel,rF,qrL).then(data=>{

          }).catch(e=>{

          })
          break;
        case SkillConfig.XF_SYSH: //讯飞：私密模式
          break;
        case SkillConfig.XF_OTS:
          break;
        case SkillConfig.BC_SCC: //添加日程
          this.work.arc(ct,sd,ed,lbI,jhi,ruL).then(data=>{

          }).catch(e=>{

          })
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
