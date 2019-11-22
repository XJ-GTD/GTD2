import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { SqliteExec } from "../util-service/sqlite.exec";
import { UtilService } from "../util-service/util.service";
import {UserConfig} from "../config/user.config";
import * as moment from "moment";
import {EmitService} from "../util-service/emit.service";
import { BackupPro, BacRestful, OutRecoverPro, RecoverPro } from "../restful/bacsev";
import {DataRestful, PullInData, PushInData, SyncData, SyncDataFields, UploadInData, DownloadInData} from "../restful/datasev";
import {CompleteState, DelType, InviteState, SyncDataSecurity, SyncDataStatus, SyncType} from "../../data.enum";
import {
  assertNotNumber,
  assertEmpty,
  assertFail
} from "../../util/util";
import {AtTbl} from "../sqlite/tbl/at.tbl";
import {Member} from "./event.service";
import * as anyenum from "../../data.enum";
import {MemoData} from "./memo.service";
import {GTbl} from "../sqlite/tbl/g.tbl";
import {BxTbl} from "../sqlite/tbl/bx.tbl";

@Injectable()
export class GrouperService extends BaseService {
  constructor(private sqlExce: SqliteExec, private util: UtilService,
              private emitService:EmitService,
              private bacRestful: BacRestful,private userConfig: UserConfig,
              private dataRestful: DataRestful) {
    super();
  }

  /**
   * 接收群组信息
   * @param {Array<Grouper>} pullGroupers
   * @param {SyncDataStatus} status
   * @returns {Promise<Array<Grouper>>}
   */
  async receivedGrouperData(pullGroupers: Array<Grouper>, status: SyncDataStatus): Promise<Array<Grouper>> {
    this.assertEmpty(pullGroupers);     // 入参不能为空
    this.assertEmpty(status);   // 入参不能为空

    let sqlparam = new Array<any>();

    let saved: Array<Grouper> = new Array<Grouper>();

    if (pullGroupers && pullGroupers !=null ){
      for (let j = 0 , len = pullGroupers.length; j < len ; j++){
        let grouper = new  Grouper();
        Object.assign(grouper, pullGroupers[j]);

        for (let grouprel of grouper.grouperRelations ){
          let bx = new BxTbl();
          Object.assign(bx, grouprel);
          sqlparam.push([bx.rpT(),[]]);
        }

        let g = new GTbl();
        Object.assign(g,grouper);
        sqlparam.push([g.rpT(),[]]);
      }

      await this.sqlExce.batExecSqlByParam(sqlparam);
    }

    return saved;

  }

  /**
   * 接收群组数据同步
   *
   * @author leon_xi@163.com
   **/
  async receivedGrouper(id: any) {

    this.assertEmpty(id);   // 入参不能为空

    let pull: PullInData = new PullInData();

    if (id instanceof Array) {
      pull.type = "Grouper";
      pull.d.splice(0, 0, ...id);
    } else {
      pull.type = "Grouper";
      pull.d.push(id);
    }

    // 发送下载日程请求
    await this.dataRestful.pull(pull);

    return;
  }


  /**
	 * 发送群组信息
   *
	 * @author leon_xi@163.com
	 */
  async sendGrouper(grouper: Grouper) {
    this.assertEmpty(grouper);  // 入参不能为空
    await this.syncGrouper([grouper]);
    return ;
  }

  /**
   * 同步全部的未同步的群组信息/指定群组信息到服务器
   *
   * @author leon_xi@163.com
   */
  async syncGrouper(groupers: Array<Grouper>= new Array<Grouper>()) {


    if (groupers.length <= 0 ){
      let gtbl: GTbl = new GTbl();
      groupers = await this.sqlExce.getList<Grouper>(gtbl);

      let bx = new BxTbl();
      let grouperRelations :Array<GrouperRelation> = await await this.sqlExce.getList<GrouperRelation>(bx);

      if (grouperRelations && grouperRelations.length > 0){


        for (let grouper of  groupers){

          let ret2: Array<GrouperRelation> = grouperRelations.filter((value, index, arr) => {
            return grouper.gi == value.bi ;
          });
          grouper.grouperRelations = ret2;

        }
      }

    }
    if (groupers && groupers.length > 0){
      let push: PushInData = new PushInData();
      for (let group of groupers){
        let sync: SyncData = new SyncData();
        sync.src = UserConfig.account.id;
        sync.id = group.gi;
        sync.type = "Grouper";
        sync.title = "";
        sync.datetime = moment.unix(group.wtt).format("YYYY/MM/DD HH:mm");
        sync.main = false;
        sync.security = SyncDataSecurity.None;
        sync.todostate = CompleteState.None;
        if (group.del == DelType.del) {
          sync.status = SyncDataStatus.Deleted;
        } else {
          sync.status = SyncDataStatus.UnDeleted;
        }
        sync.invitestate = InviteState.None;
        sync.to =  [];

        sync.payload = group;
        push.d.push(sync);
      }
      await this.dataRestful.push(push);
    }

  }

}

export class Grouper extends GTbl{
  grouperRelations : Array<GrouperRelation> = new Array<GrouperRelation>();
}

export class GrouperRelation extends BxTbl{

}
