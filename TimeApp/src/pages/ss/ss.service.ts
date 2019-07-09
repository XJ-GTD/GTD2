import {Injectable} from "@angular/core";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {UserConfig} from "../../service/config/user.config";
import {DataConfig} from "../../service/config/data.config";
import {YTbl} from "../../service/sqlite/tbl/y.tbl";
import {ContactsService} from "../../service/cordova/contacts.service";
import {PageY} from "../../data.mapping";
import {SyncRestful} from "../../service/restful/syncsev";
import {PlService} from "../pl/pl.service";

@Injectable()
export class SsService {

  constructor(
    private sqlExce: SqliteExec,
    private syncRestful:SyncRestful,
    private userConfig:UserConfig,
    private plService: PlService,
    private contactsService: ContactsService) {
  }

  //设置每日简报时间/事件
  putDailySummary(userId: string, timestamp: number, active: boolean) {
    this.syncRestful.putDailySummary(userId, timestamp, active);
    this.syncRestful.putHourlyWeather(userId);
  }

  //设置 Fir.IM WebHook事件
  putFollowFirIM(userId: string, timestamp: number, active: boolean) {
    this.syncRestful.putFollowFirIM(userId, timestamp, active);
  }

  //设置 Travis CI WebHook事件
  putFollowTravisCI(userId: string, timestamp: number, active: boolean) {
    this.syncRestful.putFollowTravisCI(userId, timestamp, active);
  }

  //设置 GitHub WebHook事件
  putFollowGitHub(userId: string, timestamp: number, active: boolean) {
    this.syncRestful.putFollowGitHub(userId, timestamp, active);
  }

  //保存设置
  save(py: PageY):Promise<any>{
    return new Promise(async (resolve, reject) => {

      //保存设置到本地用户偏好表
      let y = new YTbl();
      Object.assign(y,py);
      this.sqlExce.update(y);

      //刷新本地用户偏好设置
      this.userConfig.RefreshYTbl();

      resolve();
    });
  }

  async getDefaultJh() {
    let djh = UserConfig.settins.get(DataConfig.SYS_DJH);

    return await this.plService.getJh(djh.value);
  }

  //TODO 刷新联系人功能
  async resfriend(){
    await this.contactsService.asyncPhoneContacts();
    return this.contactsService.updateFs()
  }
}
