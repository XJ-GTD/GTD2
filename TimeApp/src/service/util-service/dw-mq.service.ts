import { Injectable } from "@angular/core";
import { WsModel } from "../../model/ws.model";
import { SkillConfig } from "../../app/skill.config";

/**
 * webSocket公用处理方法
 *
 * create by wzy on 2018/11/30.
 */
@Injectable()
export class DwMqService {

  public dealWithMq(data: WsModel) {

    if (data.vs == "1.0" && data.ss == 0) {

      switch (data.sk) {
        case SkillConfig.XF_NMT:
          break;
        case SkillConfig.XF_NMC:
          break;
        case SkillConfig.XF_SCC:
          break;
        case SkillConfig.XF_SCD:
          break;
        case SkillConfig.XF_SCF:
          break;
        case SkillConfig.XF_PEC:
          break;
        case SkillConfig.XF_PED:
          break;
        case SkillConfig.XF_PEF:
          break;
        case SkillConfig.XF_PEA:
          break;
        case SkillConfig.XF_SYSH:
          break;
        case SkillConfig.XF_OTS:
          break;
        case SkillConfig.BC_SCC:
          break;
        case SkillConfig.BC_SCD:
          break;
        case SkillConfig.BC_SCU:
          break;
        case SkillConfig.BC_PEC:
          break;
      }
    } else {

    }

  }
}
