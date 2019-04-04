import {Injectable} from "@angular/core";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {UserConfig} from "../../service/config/user.config";
import {YTbl} from "../../service/sqlite/tbl/y.tbl";

@Injectable()
export class SsService {

  constructor(
    private sqlExce: SqliteExec,
    private userConfig:UserConfig) {
  }

  //保存设置
  save(py: PageY):Promise<any>{
    return new Promise((resolve, reject) => {

      //保存设置到本地用户偏好表
      let y = new YTbl();
      Object.assign(y,py);
      this.sqlExce.update(y);

      //刷新本地用户偏好设置
      this.userConfig.RefreshYTbl();

      resolve();
    });
  }
}

export class PageY{
  //偏好主键ID
  yi : string ="";
  //偏好设置类型
  yt : string ="";
  //偏好设置类型名称
  ytn : string ="";
  //偏好设置名称
  yn : string ="";
  //偏好设置key
  yk : string ="";
  //偏好设置value
  yv : string ="";

}
