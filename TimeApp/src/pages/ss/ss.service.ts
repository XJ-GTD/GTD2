import {Injectable} from "@angular/core";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {UserConfig} from "../../service/config/user.config";
import {YTbl} from "../../service/sqlite/tbl/y.tbl";
import {ContactsService} from "../../service/cordova/contacts.service";
import {PageY} from "../../data.mapping";
import {SyncRestful} from "../../service/restful/syncsev";

@Injectable()
export class SsService {

  constructor(
    private sqlExce: SqliteExec,
    private syncRestful:SyncRestful,
    private userConfig:UserConfig,
    private contactsService: ContactsService) {
  }

  //设置每日简报时间/事件
  putDailySummary(userId: string, timestamp: number, active: boolean) {
    this.syncRestful.putDailySummary(userId, timestamp, active);
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

  //TODO 刷新联系人功能
  async resfriend(){
    await this.contactsService.asyncPhoneContacts();
    return this.contactsService.updateFs()
  }
}
