import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { SqliteExec } from "../util-service/sqlite.exec";
import { UtilService } from "../util-service/util.service";
import {UserConfig} from "../config/user.config";
import {DataConfig} from "../config/data.config";
import * as moment from "moment";
import {EmitService} from "../util-service/emit.service";
import { BackupPro, BacRestful, OutRecoverPro, RecoverPro } from "../restful/bacsev";
import {DataRestful, PullInData, PushInData, SyncData, SyncDataFields, UploadInData, DayCountCodec, DownloadInData} from "../restful/datasev";
import {CompleteState, DelType, InviteState, SyncDataSecurity, SyncDataStatus, SyncType} from "../../data.enum";
import {
  assertNotNumber,
  assertEmpty,
  assertFail
} from "../../util/util";
import {AtTbl} from "../sqlite/tbl/at.tbl";
import {Member} from "./event.service";
import {ContactsService} from "../cordova/contacts.service";
import * as anyenum from "../../data.enum";
import {MemoData} from "./memo.service";
import {GTbl} from "../sqlite/tbl/g.tbl";
import {BxTbl} from "../sqlite/tbl/bx.tbl";
import {FsData, PageDcData} from "../../data.mapping";
import {BTbl} from "../sqlite/tbl/b.tbl";

@Injectable()
export class GrouperService extends BaseService {
  constructor(private sqlExce: SqliteExec, private util: UtilService,
              private emitService: EmitService, private contactsService: ContactsService,
              private bacRestful: BacRestful,private userConfig: UserConfig,
              private dataRestful: DataRestful) {
    super();
    moment.locale('zh-cn');
  }

  checksumGrouper(grouper: Grouper): string {
    return "";
  }

  /**
   * 导入本地联系人
   *
   * @author leon_xi@163.com
   **/
   async importLocalContacts() {
     let friendsql: string = `select * from gtd_b`;

     let friends: Array<Friend> = await this.sqlExce.getExtLstByParam<Friend>(friendsql, []) || new Array<Friend>();

     let friendIndexes: Array<string> = friends.reduce((target, value) => {
       target.push(value.rc);
       return target;
     }, new Array<string>());

     let localContacts = await this.contactsService.getLocalContacts((name, phone) => {
       let index: number = friendIndexes.findIndex((ele) => {
         return ele == phone;
       });

       if (index >= 0) {
         let friend: Friend = friends[index];

         if (friend.ran == name) {
           return null;
         } else {
           friend.ran = name;

           return friend;
         }
       } else {
         let friend: Friend = new Friend();

         friend.ran = name;   // 本地联系人姓名
         friend.rn = name;    // 注册用户昵称
         friend.rc = phone;   // 手机号码

         return friend;
       }
     });

     // 存在新增本地联系人或者联系人信息更新
     if (localContacts && localContacts.length > 0) {
       let sqls: Array<any> = new Array<any>();

       for (let friend of localContacts) {
         let btbl: BTbl = new BTbl();

         if (!friend.pwi) {
           friend.pwi = this.util.getUuid();
         }

         Object.assign(btbl, friend);
         sqls.push(btbl.rpT());
       }

       await this.sqlExce.batExecSql(sqls);
     }
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
      console.log("==receivedGrouperData:pullGroupers="+ JSON.stringify(pullGroupers));
      for (let j = 0 , len = pullGroupers.length; j < len ; j++){

        let grouper = new  Grouper();
        Object.assign(grouper, pullGroupers[j]);
        console.log("====receivedGrouperData:grouper="+ JSON.stringify(grouper));
        let bxtbl = new BxTbl();
        bxtbl.bi = grouper.gi;
        sqlparam.push([bxtbl.dT(),[]]);
        if (grouper.fss ){
          for (let fs of grouper.fss ){

            console.log("======receivedGrouperData:fs.ui,fs.rc,fs.ran="+fs.ui +","+fs.rc+","+fs.ran);
            if (UserConfig.friends){
              let findm =  UserConfig.friends.find((value, index,arr)=>{

                return value.rc == fs.rc;
              });

              //本地存在就使用本地pwi，否则新建插入人员

              if (findm){
                console.log("======receivedGrouperData:findm=true=>rpt,findm.pwi="+findm.pwi);

                let bx = new BxTbl();
                bx.bi = grouper.gi;
                bx.bmi = findm.pwi;
                sqlparam.push([bx.rpT(),[]]);
              }else{
                console.log("======receivedGrouperData:findm=false=>rpt");
                let pwi = this.util.getUuid();
                let bx = new BxTbl();
                bx.bi = grouper.gi;
                bx.bmi = pwi;
                sqlparam.push([bx.rpT(),[]]);
                console.log("======receivedGrouperData:findm=false=>bxsql:"+bx.rpT());
                let bfs = new BTbl();
                fs.pwi = pwi;
                Object.assign(bfs,fs);
                sqlparam.push([bfs.rpT(),[]]);
                console.log("======receivedGrouperData:findm=false=>bfssql:"+bfs.rpT());
              }
            }else{
              console.log("======receivedGrouperData:UserConfig.friends=false=>rpt");
              let pwi = this.util.getUuid();
              let bx = new BxTbl();
              bx.bi = grouper.gi;
              bx.bmi = pwi;
              sqlparam.push([bx.rpT(),[]]);

              let bfs = new BTbl();
              fs.pwi = pwi;
              Object.assign(bfs,fs);
              sqlparam.push([bfs.rpT(),[]]);
            }

          }
        }


        let g = new GTbl();
        Object.assign(g,grouper);
        sqlparam.push([g.rpT(),[]]);
        saved.push(grouper);
      }

      await this.sqlExce.batExecSqlByParam(sqlparam);
      await this.userConfig.RefreshFriend();
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

  async codecGrouper(): Promise<Array<DayCountCodec>> {
    let sql: string = `select strftime('%Y/%m/%d', wtt, 'unixepoch', 'localtime') day, count(*) count
                      from gtd_g
                      where del <> ?1
                      group by day`;
    let daycounts: Array<DayCountCodec> = await this.sqlExce.getExtLstByParam<DayCountCodec>(sql, [DelType.del]) || new Array<DayCountCodec>();

    return daycounts;
  }

  /**
   * 同步全部的未同步的群组信息/指定群组信息到服务器
   *
   * @author leon_xi@163.com
   */
  async syncGrouper(groupers: Array<Grouper>= new Array<Grouper>()) {

    if (groupers.length <= 0 ){
      let gsql = `select * from gtd_g where del ; `;
      groupers = await this.sqlExce.getExtList<Grouper>(gsql);

      let sql = `select gb.*,bx.bi from gtd_b gb inner join gtd_b_x bx on bx.bmi = gb.pwi where bx.del <>'del'; `;
      let fss: Array<FsData> = await this.sqlExce.getExtList<FsData>(sql);

      if (fss && fss.length > 0){


        for (let grouper of  groupers){

          let ret2: Array<FsData> = fss.filter((value, index, arr) => {
            return grouper.gi == value.bi ;
          });
          grouper.fss = ret2;

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

  //编辑群名称(添加群成员)
  async saveGrouper(dc: PageDcData) {
    assertEmpty(dc);      // 入参不能为空
    assertEmpty(dc.gn);   // 入参群组名称不能为空

    let ret:boolean = false;
    let gi :string;
    if (dc.gi) {
      gi = dc.gi;
      let bxL = new Array<string>();
      let sql = `select gb.* from gtd_b gb inner join gtd_b_x bx on bx.bmi = gb.pwi
              where bx.bi = '${dc.gi}'and bx.del <>'del' `;
      let data: Array<BTbl> = await this.sqlExce.getExtList<BTbl>(sql);
      for (let fs of dc.fsl) {
        let bx = new BxTbl();
        bx.bi = dc.gi;
        bx.bmi = fs.pwi;
        let ie = false;
        for (let bt of data) {
          if (bt.pwi == fs.pwi) {
            ie = true;
            break;
          }
        }
        if (!ie) {
          let bx = new BxTbl();
          bx.bi = dc.gi;
          bx.bmi = fs.pwi;
          bx.del = DelType.undel;
          bxL.push(bx.rpT());
        }
      }
      await this.sqlExce.batExecSql(bxL);
      ret = true;
    } else { // 新建群
      let gc = new GTbl();
      Object.assign(gc, dc);
      gc.gi = this.util.getUuid();
      gc.gnpy = this.util.chineseToPinYin(gc.gn);
      //gc.gm = DataConfig.QZ_HUIBASE64;
      gi = gc.gi;
      let data = await this.sqlExce.save(gc);
      ret = true;
    }

    await this.setGrouperFss(gi);
    await this.userConfig.RefreshFriend();
    return ret;
  }

  /**
   * 删除群成员
   * @param {string} gi 群组ID
   * @param {string} pwi 联系人ID
   * @returns {Promise<BsModel<any>>}
   */
  async removeGrouperMember(gi: string, pwi: string) {
    let bx = new BxTbl();
    if (gi != null && gi != '' && pwi != null && pwi != '') {

      bx.bi = gi;
      bx.bmi = pwi;
      await this.sqlExce.delete(bx);

    }

    await this.setGrouperFss(gi);

    //刷新群组表
    await this.userConfig.RefreshFriend();
    return;
  }

  //删除群
  async removeGrouper(gId: string) {
    //删除本地群成员
    let bx = new BxTbl();
    bx.bi = gId;
    bx.del = anyenum.DelType.del;
    await this.sqlExce.update(bx);
    //删除本地群
    let gtbl: GTbl = new GTbl();
    gtbl.gi = gId;
    gtbl.del = anyenum.DelType.del;
    await this.sqlExce.update(gtbl);

    await this.setGrouperFss(gId);

    //刷新群组表
    await this.userConfig.RefreshFriend();
  }

  private async setGrouperFss(gi : string){
    let groupers = new Array<Grouper>();
    let gtbl: GTbl = new GTbl();
    gtbl.gi = gi;
    let gp : Grouper = await this.sqlExce.getOne<Grouper>(gtbl);

    let sql = `select gb.* from gtd_b gb inner join gtd_b_x bx on bx.bmi = gb.pwi where bx.bi = '${gi}' and bx.del<>'del'; `;
    let fss: Array<FsData> = await this.sqlExce.getExtList<FsData>(sql);

    if (gp != null){
      gp.fss = fss;
      groupers.push(gp);
      await this.syncGrouper(groupers);
    }
  }

  //获取本地群列表
  filterGroups(groups: Array<PageDcData>, name: string): Array<PageDcData> {
    if (name)
      return groups.filter((value)=>{
        return (value.gn.indexOf(name) > -1 || value.gnpy.indexOf(name) > -1);
      });
    else
      return groups;
  }

  async fetchGroups(): Promise<Array<PageDcData>> {
    let groups: Array<PageDcData> = new Array<PageDcData>();

    //获取本地群列表
    let sql = `select * from gtd_g where del <> 'del';`;

    let dcl: Array<PageDcData> = await this.sqlExce.getExtList<PageDcData>(sql)

    if (dcl.length > 0) {
      //和单群人数
      for (let dc of dcl) {
        dc.fsl = new Array<FsData>();
        let sqlbx = `select gb.* from gtd_b_x gbx inner join gtd_b gb on gb.pwi = gbx.bmi
        where gbx.bi='${dc.gi}' and gbx.del <> 'del';`;
        let fsl: Array<FsData> = await this.sqlExce.getExtList<FsData>(sqlbx);
        for (let fs of fsl) {
          let fsd: FsData = this.userConfig.GetOneBTbl(fs.pwi);
          if (!dc.fsl) {
            dc.fsl = new Array<FsData>(); //群组成员
          }
          if (fsd) {
            dc.fsl.push(fsd);
          }
        }
        dc.gc = dc.fsl.length;
        dc.gm = DataConfig.QZ_HUIBASE64;

        groups.push(dc);
      }
    }

    return groups;
  }

  mergeFriends(friends: Array<FsData>, friend: FsData): Array<FsData> {
    assertEmpty(friends);   // 入参不能为空
    assertEmpty(friend);    // 合并对象不能为空
    assertEmpty(friend.rc); // 合并对象手机号不能为空

    let pos = friends.findIndex((element) => {
      return (element.rc == friend.rc);
    });

    if (pos >= 0) {
      friends.splice(pos, 1, friend);
    } else {
      friends.unshift(friend);
    }

    //增加内部事件通知
    // this.emitService.emit("mwxing.config.user.btbl.refreshed");

    return friends;
  }

  async fetchFriends(friends: Array<FsData> = new Array<FsData>()): Promise<Array<FsData>> {
    let exists = friends.reduce((target, val) => {
      if (target.indexOf(val.rc) < 0) {
        target.push(val.rc);
      }
      return target;
    }, new Array<string>());

    //获取本地参与人
    let sql = `select gb.*,bh.hiu bhiu
               from gtd_b gb
                      left join gtd_bh bh on bh.pwi = gb.pwi;`;

    let fss: Array<FsData> = await this.sqlExce.getExtList<FsData>(sql);

    for (let fs of fss) {
      fs.bhiu = '';
      let index = exists.indexOf(fs.rc);

      if (index < 0) {
        friends.push(fs);
      } else {
        let pos = friends.findIndex((element) => {
          return (element.rc == fs.rc);
        });

        friends.splice(pos, 1, fs);
      }
    }

    //增加内部事件通知
    // this.emitService.emit("mwxing.config.user.btbl.refreshed");

    return friends;
  }
}

export class Friend extends BTbl {

}

export class Grouper extends GTbl{
  grouperRelations : Array<GrouperRelation> = new Array<GrouperRelation>();
  fss : Array<FsData> = new Array<FsData>();
}

export class GrouperRelation extends BxTbl{

}
