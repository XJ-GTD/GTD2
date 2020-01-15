import {Injectable} from "@angular/core";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {UserConfig} from "../../service/config/user.config";
import {DataConfig} from "../../service/config/data.config";
import {YTbl} from "../../service/sqlite/tbl/y.tbl";
import {PageY} from "../../data.mapping";
import {SyncRestful} from "../../service/restful/syncsev";
import {PlService} from "../pl/pl.service";
import {UtilService} from "../../service/util-service/util.service";
import {EmitService} from "../../service/util-service/emit.service";
import {GrouperService} from "../../service/business/grouper.service";

@Injectable()
export class SsService {

  constructor(
    private sqlExce: SqliteExec,
    private syncRestful:SyncRestful,
    private util:UtilService,
    private userConfig:UserConfig,
    private plService: PlService,
     private emitService: EmitService,
    private grouperService : GrouperService) {
  }

  //设置每日简报时间/事件
  putDailySummary(userId: string, timestamp: number, active: boolean) {
    // this.syncRestful.putDailySummary(userId, timestamp, active);
    // this.syncRestful.putHourlyWeather(userId);
  }

  //设置 Fir.IM WebHook事件
  putFollowFirIM(userId: string, timestamp: number, active: boolean) {
    this.syncRestful.putFollowFirIM(userId, timestamp, active);
  }

  //设置 Fir.IM WebHook事件
  putFollowFirIMShare(shareTo: string, identify: string, userId: string, timestamp: number, active: boolean) {
    this.syncRestful.putFollowFirIMShare(shareTo, identify, userId, timestamp, active);
  }

  //设置 Travis CI WebHook事件
  putFollowTravisCI(userId: string, timestamp: number, active: boolean) {
    this.syncRestful.putFollowTravisCI(userId, timestamp, active);
  }

  //设置 GitHub WebHook事件
  putFollowGitHub(userId: string, secret: string, timestamp: number, active: boolean) {
    this.syncRestful.putFollowGitHub(userId, secret, timestamp, active);
  }

  //设置 GitHub WebHook事件
  putFollowGitHubShare(shareTo: string, identify: string, userId: string, secret: string, timestamp: number, active: boolean) {
    this.syncRestful.putFollowGitHubShare(shareTo, identify, userId, secret, timestamp, active);
  }

  //保存设置
  save(py: PageY):Promise<any>{
    return new Promise(async (resolve, reject) => {

      //保存设置到本地用户偏好表
      let y = new YTbl();
      Object.assign(y,py);

      if (y.yi) {
        await this.sqlExce.update(y);
      } else {
        y.yi = this.util.getUuid();
        await this.sqlExce.prepareSave(y);
      }

      //刷新本地用户偏好设置
      await this.userConfig.RefreshYTbl();

      if (py.yk == DataConfig.SYS_H){
        console.log("=======这里唤醒");
         if (py.yv == "1"){

           console.log("=======这里唤醒");
           this.emitService.emit("ai.wakeup.setting",true);
         }else{
           console.log("=======这里不唤醒唤醒");
           this.emitService.emit("ai.wakeup.setting",false);
         }
      }

      resolve();
    });
  }

  async getDefaultJh() {
    let djh = UserConfig.settins.get(DataConfig.SYS_DJH);

    return await this.plService.getJh(djh.value);
  }

  //TODO 刷新联系人功能
  async resfriend(){
    await this.grouperService.asyncPhoneContacts();
    await this.grouperService.updateFs();
    //刷新缓存
    await this.grouperService.refreshFriendCconfig();
    await this.grouperService.refreshGroupConfig();
    return;

  }
}
