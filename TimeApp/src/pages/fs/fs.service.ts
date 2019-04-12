import {Injectable} from "@angular/core";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {BTbl} from "../../service/sqlite/tbl/b.tbl";
import {AgdPro, AgdRestful, ContactPerPro} from "../../service/restful/agdsev";
import {BsModel} from "../../service/restful/out/bs.model";
import {DTbl} from "../../service/sqlite/tbl/d.tbl";
import {UtilService} from "../../service/util-service/util.service";
import {PersonRestful} from "../../service/restful/personsev";
import {DataConfig} from "../../service/config/data.config";
import {ContactsService} from "../../service/cordova/contacts.service";
import {FsData} from "../../service/pagecom/pgbusi.service";
import {BhTbl} from "../../service/sqlite/tbl/bh.tbl";
import {UserConfig} from "../../service/config/user.config";

@Injectable()
export class FsService {
  constructor(private sqlite: SqliteExec,
              private agdRest: AgdRestful,
              private perRest: PersonRestful,
              private contacts: ContactsService,
              private util: UtilService) {
  }

  //根据条件查询参与人
  getfriend(key: string) {
    if (key)
    return UserConfig.friends.filter((value) => {
      return value.ran.indexOf(key) > -1
        || value.rc.indexOf(key) > -1
        || value.rn.indexOf(key) > -1
        || value.rc.indexOf(key) > -1
        || value.rnpy.indexOf(key) > -1
        || value.ranpy.indexOf(key) > -1
    });
    else
      return UserConfig.friends;
  }


  //查询群组中的参与人
  getfriendgroup(groupId: string): Array<FsData> {
    return UserConfig.groups.find((value) => value.gi == groupId).fsl;
  }

  /**
   * 获取分享日程的参与人
   * @param {string} calId 日程ID
   * @returns {Promise<Array<FsData>>}
   */
  getCalfriend(calId: string): Promise<Array<FsData>> {
    return new Promise<Array<FsData>>((resolve, reject) => {
      let sql = 'select gd.pi,gd.si,gb.*,bh.hiu bhiu from gtd_d gd inner join gtd_b gb on gb.pwi = gd.ai left join gtd_bh bh on gb.pwi = bh.pwi where si="' + calId + '"';
      let fsList = new Array<FsData>();
      console.log('---------- getCalfriend 获取分享日程的参与人 sql:' + sql);
      this.sqlite.execSql(sql).then(data => {
        if (data && data.rows && data.rows.length > 0) {
          for (let i = 0, len = data.rows.length; i < len; i++) {
            let fs = new FsData();
            Object.assign(fs, data.rows.item(i));
            if (!fs.bhiu || fs.bhiu == null || fs.bhiu == '') {
              fs.bhiu = DataConfig.HUIBASE64;
            }
            fsList.push(fs);
          }
        }
        console.log('---------- getCalfriend 获取分享日程的参与人结果:' + fsList.length/*JSON.stringify(fsList)*/);
        resolve(fsList);
      }).catch(e => {
        console.error('---------- getCalfriend 获取分享日程的参与人出错:' + e.message);
        resolve(fsList);
      })
    })
  }

  /**
   * 分享给参与人操作
   * @param {string} si 日程ID
   * @param {Array<FsData>} fsList 日程参与人列表
   * @returns {Promise<Array<FsData>>}
   */
  sharefriend(si: string, fsList: Array<FsData>): Promise<BsModel<any>> {
    return new Promise<BsModel<any>>((resolve, reject) => {
      let bs = new BsModel<any>();
      //restFul 通知参与人
      let adgPro: AgdPro = new AgdPro();
      adgPro.ai = si;
      let ac: Array<ContactPerPro> = new Array<ContactPerPro>();
      for (let fs of fsList) {
        if(fs.rc != UserConfig.user.contact){
          let con = new ContactPerPro();
          con.ai = fs.ui;
          con.mpn =fs.rc;
          //con.a = fs.hiu;
          con.n = fs.rn;
          ac.push(con);
        }
      }
      adgPro.ac = ac;
      console.log('---------- sharefriend 分享给参与人操作 参数:' + JSON.stringify(adgPro));
      this.agdRest.contactssave(adgPro).then(data => {
        bs = data;
        console.log('---------- sharefriend 分享给参与人操作 结果:' + JSON.stringify(data));
        if (bs.code == 0) {
          // let sq = 'delete from gtd_d where si = "' +si +'";';
          // console.log('---------- sharefriend 分享给参与人操作 删除原参与人 ---------');

        }
        return this.getCalfriend(si);
      }).then(data => {
        let dtList = new Array<string>();
        for (let fs of fsList) {
          //去除重复的参与人
          let is: boolean = false;
          for (let ofs of data) {
            if (ofs.pwi == fs.pwi) {
              is = true;
              break;
            }
          }
          if (!is && fs.rc != UserConfig.user.contact) {
            let dt = new DTbl();
            dt.pi = this.util.getUuid();
            dt.ai = fs.pwi;
            dt.si = si;
            dtList.push(dt.inT());
          }
        }
        console.log('---------- sharefriend 分享给参与人操作 保存参与人 ---------' + JSON.stringify(data));
        return this.sqlite.batExecSql(dtList);
      }).then(data => {
        console.log('---------- sharefriend 分享给参与人操作 保存参与人结束 ---------' + JSON.stringify(data));
        resolve(bs);
      }).catch(e => {
        console.error('---------- sharefriend 分享给参与人操作 保存参与人错误 ---------' + e.message);
        resolve(bs);
      })
    })
  }

  /**
   * 更新联系人
   * @returns {Promise<void>}
   */
  async updateFs() {
    // let fsList: Array<FsData> = await this.getfriend(new FsData());
    // let btbls: Array<BTbl> = await this.contacts.getContacts4Btbl();
    // let map: Map<string, BTbl> = new Map<string, BTbl>();
    // for (let bt of btbls) {
    //   //添加/更新头像表
    //   let pred = await this.perRest.getavatar(bt.rc);
    //   let hiu = JSON.stringify(pred.data);
    //   if (hiu != '') {
    //     bt.hiu = pred.data;
    //   }
    //   map.set(bt.rc, bt);
    // }
    // let bsqls: Array<string> = new Array<string>();
    // if (fsList.length > 0) {
    //   for (let fs of fsList) {
    //     let bl = map.get(fs.rc);
    //     let bhiu = '';
    //     if (bl) {
    //       fs.ran = bl.ran;
    //       fs.ranpy = this.util.chineseToPinYin(bl.ran);
    //       if (bl.hiu != null && bl.hiu != '') {
    //         bhiu = bl.hiu;
    //       }
    //       map.delete(fs.rc);
    //     } else {
    //       bl = new BTbl();
    //       let pred = await this.perRest.getavatar("");
    //       let hiu = JSON.stringify(pred.data);
    //       if (hiu != '') {
    //         bhiu = pred.data;
    //       }
    //
    //
    //     Object.assign(bl, fs);
    //     //更新联系人表
    //     bsqls.push(bl.upT());
    //     let bh = new BhTbl();
    //     bh.pwi = fs.pwi;
    //     bh.hiu = bhiu;
    //     //添加/更新头像表
    //     if (fs.bhiu != null) {
    //       bsqls.push(bh.upT());
    //     } else {
    //       bh.bhi = this.util.getUuid();
    //       bsqls.push(bh.inT());
    //     }
    //
    //   }
    // }
    // if (map.size > 0) {
    //   map.forEach((value, key) => {
    //     let bt = value;
    //     bt.pwi = this.util.getUuid();
    //     bt.ranpy = this.util.chineseToPinYin(bt.ran);
    //     bt.hiu = DataConfig.HUIBASE64;
    //     bt.rnpy = this.util.chineseToPinYin(bt.rn);
    //     bt.rel = '0';
    //     bsqls.push(bt.inT());
    //     let bh = new BhTbl();
    //     bh.pwi = bt.pwi;
    //     bh.hiu = bt.hiu;
    //     bh.bhi = this.util.getUuid();
    //     bsqls.push(bh.inT());
    //   })
    // }
    // return await this.sqlite.batExecSql(bsqls);
  }

}

/**
 * 联系人视图
 */
// export class FsData {
//   pi: string=""; //日程参与人表ID
//   si: string=""; //日程事件ID
//   pwi: string=""; //授权表主键
//   ran: string=""; //被授权联系人别称
//   ranpy: string=""; //被授权联系人别称拼音
//   hiu: string="";  // 被授权联系人头像
//   rn: string="";  // 被授权联系人名称
//   rnpy: string="";  //被授权联系人名称拼音
//   rc: string="";  //被授权联系人联系方式
//   rel: string=""; //授权联系类型 1是个人，2是群，0未注册用户
//   ui: string="";  //数据归属人ID
//   bhiu:string="";//base64图片
// }

