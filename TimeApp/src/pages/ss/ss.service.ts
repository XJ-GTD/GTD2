import {Injectable} from "@angular/core";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {UserConfig} from "../../service/config/user.config";

@Injectable()
export class SsService {
  constructor(
    private sqlExce: SqliteExec,
    private userConfig:UserConfig) {
  }

  //保存设置
  save():Promise<any>{
    return new Promise((resolve, reject) => {

      //保存设置到本地用户偏好表

      //刷新本地用户偏好设置
      this.userConfig.RefreshYTbl();
    });
  }
}
