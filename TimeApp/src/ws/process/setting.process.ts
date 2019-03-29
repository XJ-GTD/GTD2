import {MQProcess} from "../interface.process";
import {WsContent} from "../model/content.model";
import {Injectable} from "@angular/core";
import {ProcesRs} from "../model/proces.rs";
import {SY} from "../model/ws.enum";
import {PageY, SsService} from "../../pages/ss/ss.service";
import {Setting, UserConfig} from "../../service/config/user.config";
import {SettingPara} from "../model/settingpara";
import {FdData, FdService} from "../../pages/fd/fd.service";
import {fsData} from "../../pages/tdl/tdl.service";

/**
 * 设置
 *
 * create by wzy on 2018/11/30.
 */
@Injectable()
export class SettingProcess implements MQProcess {
  constructor(private ssService: SsService, private fdService: FdService) {
  }


  go(content: WsContent, processRs: ProcesRs): Promise<ProcesRs> {
    return new Promise<ProcesRs>(resolve => {
      //处理区分
      //系统的用户偏好设置
      if (content.option == SY.S) {
        //处理所需要参数
        let setPara: SettingPara = content.parameters;
        let set: PageY = new PageY();
        let setting: Setting = new Setting();
        setting = UserConfig.settins.get(setPara.k);

        set.yi = setting.yi;//偏好主键ID
        set.ytn = setting.bname; //偏好设置类型名称
        set.yt = setting.typeB; //偏好设置类型
        set.yn = setting.name;//偏好设置名称
        set.yk = setting.type;//偏好设置key
        set.yv = setPara.v ? "1" : "0";//偏好设置value

        this.ssService.save(set);

      }
      //用户黑名单
      else if (content.option = SY.B) {
        let fdData: FdData = new FdData();
        for (let btbl of processRs.fs) {
          fdData.ui = btbl.ui;
          fdData.rc = btbl.rc;
          fdData.rn = btbl.rn;
          fdData.hiu = btbl.hiu;
          this.fdService.putBlack(fdData);
        }
      }
      //处理结果
      processRs.sucess = true;
      return processRs;
    })
  }

}
