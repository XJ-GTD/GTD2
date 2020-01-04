import {MQProcess} from "../interface.process";
import {WsContent} from "../model/content.model";
import {Injectable} from "@angular/core";
import {ProcesRs} from "../model/proces.rs";
import {SY} from "../model/ws.enum";
import {SsService} from "../../pages/ss/ss.service";
import {Setting, UserConfig} from "../../service/config/user.config";
import {SettingPara} from "../model/settingpara";
import {FdService} from "../../pages/fd/fd.service";
import {FsData, PageY} from "../../data.mapping";
import {WsDataConfig} from "../wsdata.config";
import {BaseProcess} from "./base.process";
import {SettingsProvider} from "../../providers/settings/settings";

/**
 * 设置
 *
 * create by wzy on 2018/11/30.
 */
@Injectable()
export class SettingProcess extends BaseProcess implements MQProcess {
  constructor(private ssService: SsService, private settings: SettingsProvider, private fdService: FdService) {
    super();
  }

  async gowhen(content: WsContent, contextRetMap: Map<string,any>) {
    //process处理符合条件则执行
    if (content.when && content.when !=""){
      let rf :boolean = false;
      try {
        let fun = eval("("+content.when+")");
        rf = fun(content);
      }catch (e){
        rf = false;
      };
      if (!rf){
        return contextRetMap;
      }
    }

    //处理区分
    //系统的用户偏好设置
    if (content.option == SY.S) {
      //处理所需要参数
      let setPara: SettingPara = content.parameters;

      if (setPara.k == 'THEME_DAY') {
        let set: PageY = new PageY();
        let setting: Setting = new Setting();
        setting = UserConfig.settins.get("THEME");

        set.yi = setting.yi;//偏好主键ID
        set.ytn = setting.bname; //偏好设置类型名称
        set.yt = setting.typeB; //偏好设置类型
        set.yn = setting.name;//偏好设置名称
        set.yk = setting.type;//偏好设置key

        if (setPara.v && setting.value == 'black-theme') {
          set.yv = "white-theme";//偏好设置value
          await this.ssService.save(set);
          this.settings.setActiveTheme(set.yv);
        }

        if (!setPara.v && setting.value == 'white-theme') {
          set.yv = "black-theme";//偏好设置value
          await this.ssService.save(set);
          this.settings.setActiveTheme(set.yv);
        }

      } else if (setPara.k == 'THEME_NIGHT') {
        let set: PageY = new PageY();
        let setting: Setting = new Setting();
        setting = UserConfig.settins.get("THEME");

        set.yi = setting.yi;//偏好主键ID
        set.ytn = setting.bname; //偏好设置类型名称
        set.yt = setting.typeB; //偏好设置类型
        set.yn = setting.name;//偏好设置名称
        set.yk = setting.type;//偏好设置key

        if (!setPara.v && setting.value == 'black-theme') {
          set.yv = "white-theme";//偏好设置value
          await this.ssService.save(set);
          this.settings.setActiveTheme(set.yv);
        }

        if (setPara.v && setting.value == 'white-theme') {
          set.yv = "black-theme";//偏好设置value
          await this.ssService.save(set);
          this.settings.setActiveTheme(set.yv);
        }

      } else {
        let set: PageY = new PageY();
        let setting: Setting = new Setting();
        setting = UserConfig.settins.get(setPara.k);

        set.yi = setting.yi;//偏好主键ID
        set.ytn = setting.bname; //偏好设置类型名称
        set.yt = setting.typeB; //偏好设置类型
        set.yn = setting.name;//偏好设置名称
        set.yk = setting.type;//偏好设置key
        set.yv = setPara.v ? "1" : "0";//偏好设置value

        await this.ssService.save(set);
      }
    }

    //项目跟进 实例设置
    if (content.option == SY.FO) {
      //处理所需要参数
      let setPara: SettingPara = content.parameters;
      let set: PageY = new PageY();
      let setting: Setting = UserConfig.getSettingWithType(setPara.t, setPara.k) || new Setting();

      set.yi = setting.yi;//偏好主键ID
      set.ytn = setting.bname || setPara.tn; //偏好设置类型名称
      set.yt = setting.typeB || setPara.t; //偏好设置类型
      set.yn = setting.name || setPara.kn;//偏好设置名称
      set.yk = setting.type || setPara.k;//偏好设置key
      set.yv = setPara.vs;//偏好设置value

      await this.ssService.save(set);
    }

    //用户黑名单
    if (content.option == SY.B) {
      //上下文内获取人员信息
      let fs :Array<FsData> = new Array<FsData>();
      fs = this.input(content,contextRetMap,"contacts",WsDataConfig.FS,fs);


      let fdData: FsData = new FsData();
      for (let btbl of fs) {
        fdData.ui = btbl.ui;
        fdData.rc = btbl.rc;
        fdData.rn = btbl.rn;
        fdData.hiu = btbl.hiu;

        this.fdService.putBlack(fdData);
      }
    }

    return contextRetMap
  }

}
