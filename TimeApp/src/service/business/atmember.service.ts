import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { SqliteExec } from "../util-service/sqlite.exec";
import { UtilService } from "../util-service/util.service";
import {UserConfig} from "../config/user.config";
import {AgdRestful} from "../restful/agdsev";
import * as moment from "moment";
import {EmitService} from "../util-service/emit.service";
import { BackupPro, BacRestful, OutRecoverPro, RecoverPro } from "../restful/bacsev";
import {DataRestful, PullInData, PushInData, SyncData, SyncDataFields, UploadInData, DownloadInData} from "../restful/datasev";
import { SyncDataStatus} from "../../data.enum";
import {
  assertNotNumber,
  assertEmpty,
  assertFail
} from "../../util/util";
import {AtTbl} from "../sqlite/tbl/at.tbl";

@Injectable()
export class AtMemberService extends BaseService {
  constructor(private sqlExce: SqliteExec, private util: UtilService,
              private agdRest: AgdRestful,private emitService:EmitService,
              private bacRestful: BacRestful,private userConfig: UserConfig,
              private dataRestful: DataRestful) {
    super();
  }

  /**
   * 接收@参与人信息
   *
   * @param {Array<AgendaData>} pullAgdatas
   * @param {SyncDataStatus} status
   * @returns {Promise<Array<AgendaData>>}
   */
  async receivedAtMemberData(pullAtMembers: Array<AtMember>, status: SyncDataStatus): Promise<Array<AtMember>> {
      return;

  }

  /**
   * 接收@数据同步
   *
   * @author leon_xi@163.com
   **/
  async receivedAtMember(evi: any) {

    this.assertEmpty(evi);   // 入参不能为空

    let pull: PullInData = new PullInData();

    if (evi instanceof Array) {
      pull.type = "AtMember";
      pull.d.splice(0, 0, ...evi);
    } else {
      pull.type = "AtMember";
      pull.d.push(evi);
    }

    // 发送下载日程请求
    await this.dataRestful.pull(pull);

    return;
  }


  /**
	 * 发送日程进行共享
   *
	 * @author leon_xi@163.com
	 */
  async sendAtMember(atMembers: Array<AtMember>) {

  }

  /**
   * 同步全部的未同步的日程/指定日程到服务器
   *
   * @author leon_xi@163.com
   */
  async syncAtMembers(atMembers: Array<AtMember> = new Array<AtMember>()) {


  }

  saveAtMember(atMembers: Array<AtMember> = new Array<AtMember>()){
    this.syncAtMembers();
  }

  //根据条件查询参与人
  getMembers(members, key: string) {
    if (key)
      return members.filter((value) => {
        return value.ran.indexOf(key) > -1
          || value.rc.indexOf(key) > -1
          || value.rn.indexOf(key) > -1
          || value.rc.indexOf(key) > -1
          || value.rnpy.indexOf(key) > -1
          || value.ranpy.indexOf(key) > -1
      });
    else
      return members;
  }

}

export class AtMember extends AtTbl{

}








