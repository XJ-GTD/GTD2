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
import {Member} from "./event.service";
import {ContactsService} from "../cordova/contacts.service";
import * as anyenum from "../../data.enum";
import {GTbl} from "../sqlite/tbl/g.tbl";
import {BxTbl} from "../sqlite/tbl/bx.tbl";
import {BTbl} from "../sqlite/tbl/b.tbl";
import {BhTbl} from "../sqlite/tbl/bh.tbl";
import {PersonRestful} from "../restful/personsev";

@Injectable()
export class GrouperService extends BaseService {
  constructor(private sqlExce: SqliteExec,
              private emitService: EmitService,
              private contactsService: ContactsService,
              private bacRestful: BacRestful,
              private dataRestful: DataRestful,
              private utilService: UtilService,
              private personRestful: PersonRestful
              ) {
    super();
    moment.locale('zh-cn');
  }

  checksumGrouper(grouper: Grouper): string {
    return "";
  }

  /**
   * 获取联系人
   *
   * @author leon_xi@163.com
   **/
  async fetchFriends1(): Promise<Array<Friend>> {
    let friendsql: string = `select * from gtd_b`;

    let friends: Array<Friend> = await this.sqlExce.getExtLstByParam<Friend>(friendsql, []) || new Array<Friend>();

    return friends;
  }

  /**
   * 匹配本客户端联系人
   *
   * @author leon_xi@163.com
   **/
  async matchFriends(friends: Array<Friend>, members: Array<Member>): Promise<Array<Member>> {
    assertEmpty(friends);   // 入参不能为空
    assertEmpty(members);   // 入参不能为空

    let phoneIndexes: Array<string> = friends.reduce((target, ele) => {
      target.push(ele.rc);

      return target;
    }, new Array<string>());

    let matched: Array<Member> = new Array<Member>();
    let newbtbls: Array<BTbl> = new Array<BTbl>();

    for (let member of members) {
      let existIndex: number = phoneIndexes.findIndex((ele) => {
        return ele == member.rc;
      });

      if (existIndex >= 0) {
        let friend: Friend = friends[existIndex];

        let localMember: Member = {} as Member;
        Object.assign(localMember, member);

        localMember.pwi = friend.pwi;

        localMember.ui = friend.ui || member.ui;
        localMember.ran = friend.ran || member.ran;
        localMember.ranpy = this.utilService.chineseToPinYin(localMember.ran);
        localMember.rn = friend.rn || member.rn;
        localMember.rnpy = this.utilService.chineseToPinYin(localMember.rn);

        matched.push(localMember);
      } else {
        let localMember: Member = {} as Member;
        Object.assign(localMember, member);

        localMember.pwi = this.utilService.getUuid();

        matched.push(localMember);

        let friend: Friend = {} as Friend;
        Object.assign(friend, localMember);

        friends.push(friend);           // 增加到本地缓存
        phoneIndexes.push(friend.rc);   // 增加到本缓存手机索引

        // 新联系人保存到本地数据库
        let btbl: BTbl = new BTbl();
        Object.assign(btbl, localMember);

        newbtbls.push(btbl);
      }
    }

    // let sqls = this.sqlExce.getFastSaveSqlByParam(newbtbls);
    // await this.sqlExce.batExecSqlByParam(sqls);

    return matched;
  }

  /**
   * 获取缓存中的联系人信息(未完成)
   *
   * @author leon_xi@163.com
   **/
   getMemberFromCache(ui:string, friends: Array<Friend>): Friend{

    let matched: Friend;

    matched = friends.find((member)=>{
      return member.ui == ui;
    });

    if (!matched){
      if (UserConfig.account.id == ui){

      }
    }
    return matched;

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
       let friend: Friend = {} as Friend;

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
         friend.pwi = this.utilService.getUuid();
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
                let pwi = this.utilService.getUuid();
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

                //更新缓存
                UserConfig.mergeFriends([fs]);
                this.emitService.emit("mwxing.config.user.btbl.refreshed");
              }
            }else{
              console.log("======receivedGrouperData:UserConfig.friends=false=>rpt");
              let pwi = this.utilService.getUuid();
              let bx = new BxTbl();
              bx.bi = grouper.gi;
              bx.bmi = pwi;
              sqlparam.push([bx.rpT(),[]]);

              let bfs = new BTbl();
              fs.pwi = pwi;
              Object.assign(bfs,fs);
              sqlparam.push([bfs.rpT(),[]]);
              //更新缓存
              UserConfig.mergeFriends([fs]);
              this.emitService.emit("mwxing.config.user.btbl.refreshed");
            }

          }
        }


        let g = new GTbl();
        Object.assign(g,grouper);
        sqlparam.push([g.rpT(),[]]);
        saved.push(grouper);
        //更新组缓存
        UserConfig.mergeGroupers(saved);
        this.emitService.emit("mwxing.config.user.gtbl.refreshed");
      }

      await this.sqlExce.batExecSqlByParam(sqlparam);
      //await this.userConfig.RefreshFriend();
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
      let gsql = `select * from gtd_g where del <>'del'; `;
      groupers = await this.sqlExce.getExtList<Grouper>(gsql);

      let sql = `select gb.*,bx.bi from gtd_b gb inner join gtd_b_x bx on bx.bmi = gb.pwi where bx.del <>'del'; `;
      let fss: Array<Friend> = await this.sqlExce.getExtList<Friend>(sql);

      if (fss && fss.length > 0){


        for (let grouper of  groupers){

          let ret2: Array<Friend> = fss.filter((value, index, arr) => {
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
  async saveGrouper(dc: Grouper) {
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
      for (let fs of dc.fss) {
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
      gc.gi = this.utilService.getUuid();
      gc.gnpy = this.utilService.chineseToPinYin(gc.gn);
      //gc.gm = DataConfig.QZ_HUIBASE64;
      gi = gc.gi;
      let data = await this.sqlExce.save(gc);
      ret = true;
    }

    let gp : Grouper = await this.setGrouperFss(gi);
    UserConfig.mergeGroupers([gp]);
    this.emitService.emit("mwxing.config.user.gtbl.refreshed");
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

    let gp : Grouper = await this.setGrouperFss(gi);

    //刷新群组表
    UserConfig.mergeGroupers([gp]);
    this.emitService.emit("mwxing.config.user.gtbl.refreshed");
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

    let gp : Grouper = await this.setGrouperFss(gId);

    //刷新群组缓存
    UserConfig.mergeGroupers([gp]);
    this.emitService.emit("mwxing.config.user.gtbl.refreshed");
  }

  private async setGrouperFss(gi : string):Promise<Grouper>{
    let groupers = new Array<Grouper>();
    let gtbl: GTbl = new GTbl();
    gtbl.gi = gi;
    let gp : Grouper = await this.sqlExce.getOne<Grouper>(gtbl);
    let grouper : Grouper = new  Grouper();

    let sql = `select gb.* from gtd_b gb inner join gtd_b_x bx on bx.bmi = gb.pwi where bx.bi = '${gi}' and bx.del<>'del'; `;
    let fss: Array<Friend> = await this.sqlExce.getExtList<Friend>(sql);

    if (gp != null){
      gp.fss = fss;
      if (fss){
        gp.gc = fss.length;
      }else{
        gp.gc = 0;
      }

      groupers.push(gp);
      await this.syncGrouper(groupers);
    }

    return gp;
  }

  //获取本地群列表
  filterGroups(groups: Array<Grouper>, name: string): Array<Grouper> {
    if (name)
      return groups.filter((value)=>{
        return (value.gn.indexOf(name) > -1 || value.gnpy.indexOf(name) > -1);
      });
    else
      return groups;
  }

  //刷新组信息
  async fetchGroups(): Promise<Array<Grouper>> {
    let groups: Array<Grouper> = new Array<Grouper>();

    //获取本地群列表
    let sql = `select * from gtd_g where del <> 'del';`;

    let dcl: Array<Grouper> = await this.sqlExce.getExtList<Grouper>(sql)

    if (dcl.length > 0) {
      //和单群人数
      for (let dc of dcl) {
        dc.fss = new Array<Friend>();
        let sqlbx = `select gb.* from gtd_b_x gbx inner join gtd_b gb on gb.pwi = gbx.bmi
        where gbx.bi='${dc.gi}' and gbx.del <> 'del';`;
        let fsl: Array<Friend> = await this.sqlExce.getExtList<Friend>(sqlbx);
        for (let fs of fsl) {
          let fsd: Friend = UserConfig.GetOneBTbl(fs.pwi);
          if (!dc.fss) {
            dc.fss = new Array<Friend>(); //群组成员
          }
          if (fsd) {
            dc.fss.push(fsd);
          }
        }
        dc.gc = dc.fss.length;
        dc.gm = DataConfig.QZ_HUIBASE64;

        groups.push(dc);
      }
    }

    return groups;
  }

  //刷新联系人信息
  async fetchFriends(friends: Array<Friend> = new Array<Friend>()): Promise<Array<Friend>> {
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

    let fss: Array<Friend> = await this.sqlExce.getExtList<Friend>(sql);

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

  //获取群组到缓存
  async refreshGroupConfig() {

    //获取本地群列表
    UserConfig.groups.splice(0, UserConfig.groups.length);
    UserConfig.groups = await this.fetchGroups();
    //增加内部事件通知
    this.emitService.emit("mwxing.config.user.gtbl.refreshed");
    return;
  }

  //获取参与人到缓存
  async refreshFriendCconfig() {

    UserConfig.friends = await this.fetchFriends(UserConfig.friends);

    //增加内部事件通知
    this.emitService.emit("mwxing.config.user.btbl.refreshed");
    return;
  }

  //同步手机联系人
  asyncPhoneContacts(): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      // console.log('异步获取联系人函数开始...');
      let lastlaunch: number = UserConfig.getTroubleStop('contactsservice.asyncphonecontacts.lastlaunch');
      let thislaunch: number = moment().unix();

      if (lastlaunch && ((thislaunch - lastlaunch) > (60 * 30))) {
        // console.log('异步获取联系人30分钟以内调用, 忽略...');
        // 30分钟以内调用, 忽略
        resolve(true);
      } else {
        // console.log('异步获取联系人非30分钟以内调用, 开始...');
        UserConfig.setTroubleStop('contactsservice.asyncphonecontacts.lastlaunch', thislaunch);

        //异步获取联系人信息入库等操作
        this.contactsService.getContacts4Btbl().then(async data => {
          //let bsqls: Array<string> = new Array<string>();

          let btbls: Array<BTbl> = new Array<BTbl>();

          let bsq = "select * from gtd_b;";
          let bts : Array<BTbl> = await this.sqlExce.getExtList<BTbl>(bsq);

          for (let b of data) {
            // console.log("===== 本地联系人入参：" + JSON.stringify(b));

            if (!b.rn) continue;

            //let bt: BTbl = await this.sqlExce.getOne<BTbl>(b);
            let findm;
            if (bts){
              findm =  bts.find((value, index,arr)=>{
                return value.rc == b.rc;
              });
            }
            if (!findm) {
              let bt = new BTbl();
              bt.pwi = this.utilService.getUuid();
              bt.ran = b.ran ;
              bt.ranpy = this.utilService.chineseToPinYin(bt.ran);
              bt.hiu = "";
              bt.rn = b.rn;
              bt.rnpy = this.utilService.chineseToPinYin(bt.rn);
              bt.rc = b.rc;
              bt.rel = '0';
              bt.ui = '';
              //bsqls.push(bt.inT());
              btbls.push(bt);
              // console.log("===== 本地联系人入库：" + JSON.stringify(bt));

            }
          }

          let bfasts = new Array<any>();
          if (btbls && btbls.length > 0){
            bfasts = this.sqlExce.getFastSaveSqlByAny(btbls);
          }
          await this.sqlExce.batExecSql(bfasts);
        }).then(data => {
          // 在同步服务器联系人之前先全部更新完成后刷新
          // 同步时间较长，会导致用户使用的时候选不到联系人
          //this.userConfig.RefreshFriend;

          resolve(true);

        }).catch(error=>{
          resolve(false);
        });
      }
    })
  }

  /**
   *
   * 更新联系人信息和头像
   *
   * @returns {Promise<void>}
   */
  async updateFs() {

    let bsqls: Array<string> = new Array<string>();

    //获取本地参与人
    let sql = `select gb.*, bh.bhi bhi, bh.hiu bhiu
               from gtd_b gb
                      left join gtd_bh bh on bh.pwi = gb.pwi;`;

    let data: Array<Friend> = await this.sqlExce.getExtList<Friend>(sql);

    // 批量获取用户信息
    let phonenos: Array<string> = new Array<string>();

    for (let fs of data) {
      let condid = fs.rc;

      if (fs.ui && fs.ui != '') {
        condid = fs.ui;
      }

      phonenos.push(condid);
    }

    let usersinfo: Map<string, any> = new Map<string, any>();

    if (phonenos.length > 0) {
      let usersinforet = await this.personRestful.getMultis(phonenos);

      if (usersinforet && usersinforet.registusers) {
        // console.log(JSON.stringify(usersinforet));
        for (let userinfo of usersinforet.registusers) {
          // console.log('Get ' + userinfo.openid + "'s userinfo.");
          usersinfo.set(userinfo.openid, userinfo);
        }
      }
    }

    for (let fs of data) {
      let bt = new BTbl();
      Object.assign(bt, fs);

      let bh = new BhTbl();
      bh.pwi = fs.pwi;
      let hasAvatar : boolean = false;

      let condid = fs.rc;

      if (fs.ui && fs.ui != '') {
        condid = fs.ui;
      }

      // 使用批量下载代替
      // let userinfo = await this.personRestful.get(condid);
      let userinfo = usersinfo.get(condid);

      if (userinfo) {
        // console.log('userinfo ' + userinfo.openid);
        // console.log('userinfo ' + userinfo.nickname);
        // console.log('userinfo ' + userinfo.phoneno);

        bt.ui = userinfo.openid;

        if (userinfo.avatarbase64 && userinfo.avatarbase64 != '') {
          bh.hiu = userinfo.avatarbase64;
          hasAvatar = true;
          bt.rel = '1'; // 注册用户
        } else {
          bh.hiu = DataConfig.HUIBASE64;
        }

        if (userinfo.nickname && userinfo.nickname != '') {
          bt.rn = userinfo.nickname;
          bt.rnpy = this.utilService.chineseToPinYin(userinfo.nickname);
        }

        if (userinfo.phoneno && userinfo.phoneno != '') {
          bt.rc = userinfo.phoneno;
        }

        bsqls.push(bt.upT());
      }

      if (!fs.bhi || fs.bhi == null || fs.bhi == '') {
        // 注册用户需要加入头像表, 默认头像不入库
        if (hasAvatar) {
          bh.bhi = this.utilService.getUuid();
          // 新增BH数据
          bsqls.push(bh.inT());
        }
      } else {
        bh.bhi = fs.bhi;
        // 更新BH数据
        bsqls.push(bh.upT());
      }
    }

    await this.sqlExce.batExecSql(bsqls);

    // 全部更新完成后刷新
    //this.userConfig.RefreshFriend();

    // 重新打开同步本地联系人
    UserConfig.setTroubleStop('contactsservice.asyncphonecontacts.lastlaunch', 0);

  }

  /**
   *
   * 更新单个联系人信息和头像
   * id: OpenId或者手机号
   *
   * @returns {Promise<Friend>}
   */
  async updateOneFs(id : string) {
    let bsqls: Array<string> = new Array<string>();
    let bt = new BTbl();
    let bh = new BhTbl();

    let userinfo = await this.personRestful.get(id);
    let hasAvatar : boolean = false;

    let exists : Friend = null;

    //获取本地参与人
    let sql = 'select gb.*, bh.bhi bhi, bh.hiu bhiu '
      + ' from gtd_b gb '
      + '       left join gtd_bh bh on bh.pwi = gb.pwi '
      + ' where gb.ui = "' + id + '"'
      + ' or gb.rc = "' + id + '";';
    // 能够适应使用ui和rc查询是否存在BTbl记录
    let data: Array<Friend> = await this.sqlExce.getExtList<Friend>(sql);

    if (data && data.length > 0) {
      exists = data[0];
    }

    if (exists) {
      Object.assign(bt, exists);
    } else {
      // 不存在联系人，本地联系人中不存在共享日程的发送人
      bt.pwi = this.utilService.getUuid();
      bt.hiu = "";
      bt.rel = '0';
    }

    if (userinfo) {
      if (exists)
        bh.pwi = exists.pwi;
      else
        bh.pwi = bt.pwi;

      // 用户OpenId
      if (userinfo.openid && userinfo.openid != '') {
        bt.ui = userinfo.openid;
        bt.rel = '1'; // 注册用户
      }

      // 用户头像
      if (userinfo.avatarbase64 && userinfo.avatarbase64 != '') {
        bh.hiu = userinfo.avatarbase64;
        hasAvatar = true;
      } else {
        bh.hiu = DataConfig.HUIBASE64;
      }

      // 用户姓名
      if (userinfo.nickname && userinfo.nickname != '') {
        // 不存在本地联系人
        if (!exists) {
          bt.ran = userinfo.nickname;
          bt.ranpy = this.utilService.chineseToPinYin(userinfo.nickname);
        }

        bt.rn = userinfo.nickname;
        bt.rnpy = this.utilService.chineseToPinYin(userinfo.nickname);
      }

      // 用户手机号
      if (userinfo.phoneno && userinfo.phoneno != '') {
        bt.rc = userinfo.phoneno;
      }

      //联系人设置的MP3
      if (userinfo.extends ){
        bt.rob = userinfo.extends.useMp3 || "9";
      }else{
        bt.rob = "9";
      }
      //联系人更新时间
      bt.utt = moment().unix();

      if (exists) {
        bsqls.push(bt.upT());
      } else {
        bsqls.push(bt.inT());
      }

      if (!exists || !exists.bhi || exists.bhi == '') {
        // 注册用户需要加入头像表, 默认头像不入库
        if (hasAvatar) {
          bh.bhi = this.utilService.getUuid();
          // 新增BH数据
          bsqls.push(bh.inT());
        }
      } else {
        bh.bhi = exists.bhi;
        // 更新BH数据
        bsqls.push(bh.upT());
      }
    }

    await this.sqlExce.batExecSql(bsqls);

    // 返回更新后参数
    if (!exists) {
      exists = {} as Friend;
    }

    exists.pwi      = bt.pwi;     //主键
    exists.ran      = bt.ran ;     //联系人别称
    exists.ranpy    = bt.ranpy;   //联系人别称拼音
    exists.hiu      = bt.hiu;     // 联系人头像
    exists.rn       = bt.rn;      // 联系人名称
    exists.rnpy     = bt.rnpy;    //联系人名称拼音
    exists.rc       = bt.rc;      //联系人联系方式
    exists.rel      = bt.rel;     //系类型 1是个人，2是群，0未注册用户
    exists.ui       = bt.ui;      //数据归属人ID
    exists.bhi      = bh.bhi;     //头像表ID 用于判断是否有头像记录
    exists.bhiu     = bh.hiu;     //base64图片
    exists.rob     = bt.rob;     //设定的mp3
    exists.utt = bt.utt;
    // 全部更新完成后刷新
    await UserConfig.RefreshOneBTbl(exists);

    return exists;
  }

  async addSharedContact(id: string, shared: BTbl = null): Promise<Friend> {
    let userinfo = await this.personRestful.get(id);

    //获取本地参与人
    let sql = 'select gb.*, bh.bhi bhi, bh.hiu bhiu '
      + ' from gtd_b gb '
      + '       left join gtd_bh bh on bh.pwi = gb.pwi '
      + ' where gb.ui = "' + id + '"'
      + ' or gb.rc = "' + id + '";';
    // 能够适应使用ui和rc查询是否存在BTbl记录
    let exists : Friend = await this.sqlExce.getExtOne<Friend>(sql);

    if (!exists && userinfo && userinfo.openid) {
      exists = {} as Friend;

      exists.pwi = this.utilService.getUuid();
      exists.rel = '0';

      exists.ui = userinfo.openid;
      exists.hiu = "";  //userinfo.avatarbase64;
      exists.ran = userinfo.nickname;
      exists.ranpy = this.utilService.chineseToPinYin(userinfo.nickname);
      exists.rn = userinfo.nickname;
      exists.rnpy = this.utilService.chineseToPinYin(userinfo.nickname);
      exists.rc = userinfo.phoneno;

      exists.bhi = this.utilService.getUuid();

      let sqls: Array<string> = new Array<string>();

      let bt = new BTbl();
      let bh = new BhTbl();

      Object.assign(bt, exists);
      sqls.push(bt.inT());

      Object.assign(bh, exists);
      sqls.push(bh.inT());

      await this.sqlExce.batExecSql(sqls);

    } else if (!exists && shared) {
      exists = {} as  Friend;

      Object.assign(exists, shared);
      exists.pwi = this.utilService.getUuid();
      exists.rel = '0';

      exists.bhi = this.utilService.getUuid();
      exists.hiu = "";  //DataConfig.HUIBASE64;

      let sqls: Array<string> = new Array<string>();

      let bt = new BTbl();
      let bh = new BhTbl();

      Object.assign(bt, exists);
      sqls.push(bt.inT());

      Object.assign(bh, exists);
      sqls.push(bh.inT());

      await this.sqlExce.batExecSql(sqls);
    }else if (exists && userinfo && userinfo.openid){
      if (!exists.ui || exists.ui == ""  ){
        exists.ui = userinfo.openid;
      }
    }

    // 全部更新完成后刷新
    UserConfig.RefreshOneBTbl(exists);

    return exists;
  }
}



export interface Friend extends BTbl,BhTbl {
  bhiu:string;
  isbla:boolean;
  bi:string;//组id
}

export class Grouper extends GTbl{
  gc: number = 0; //群组人数
  grouperRelations : Array<GrouperRelation> = new Array<GrouperRelation>();
  fss : Array<Friend> = new Array<Friend>();
}

export class GrouperRelation extends BxTbl{

}
