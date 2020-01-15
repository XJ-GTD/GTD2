import {Injectable} from "@angular/core";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {AgdPro, AgdRestful, ContactPerPro} from "../../service/restful/agdsev";
import {DTbl} from "../../service/sqlite/tbl/d.tbl";
import {UtilService} from "../../service/util-service/util.service";
import {PersonRestful} from "../../service/restful/personsev";
import {DataConfig} from "../../service/config/data.config";
import {ContactsService} from "../../service/cordova/contacts.service";
import {UserConfig} from "../../service/config/user.config";
import {FsData} from "../../data.mapping";
import {Friend} from "../../service/business/grouper.service";

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
  getfriendgroup(groupId: string): Array<Friend> {
    return UserConfig.groups.find((value) => value.gi == groupId).fss;
  }

  /**
   * 获取分享日程的参与人
   * @param {string} calId 日程ID
   * @returns {Promise<Array<Friend>>}
   */
  getCalfriend(calId: string): Promise<Array<Friend>> {
    return new Promise<Array<Friend>>((resolve, reject) => {
      let sql = 'select gd.pi,gd.si,gb.*,bh.hiu bhiu from gtd_d gd inner join gtd_b gb on gb.pwi = gd.ai left join gtd_bh bh on gb.pwi = bh.pwi where si="' + calId + '"';
      let fsList = new Array<Friend>();
      this.sqlite.execSql(sql).then(data => {
        if (data && data.rows && data.rows.length > 0) {
          for (let i = 0, len = data.rows.length; i < len; i++) {
            let fs = {} as Friend;
            Object.assign(fs, data.rows.item(i));
            if (!fs.bhiu || fs.bhiu == null || fs.bhiu == '') {
              fs.bhiu = DataConfig.HUIBASE64;
            }
            fsList.push(fs);
          }
        }
        resolve(fsList);
      }).catch(e => {
         resolve(fsList);
      })
    })
  }

  /**
   * 分享给参与人操作
   * @param {string} si 日程ID
   * @param {Array<Friend>} fsList 日程参与人列表
   * @returns {Promise<Array<Friend>>}
   */
  sharefriend(si: string, fsList: Array<Friend>): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      //restFul 通知参与人
      let adgPro: AgdPro = new AgdPro();
      adgPro.ai = si;
      let ac: Array<ContactPerPro> = new Array<ContactPerPro>();
      for (let fs of fsList) {
        if(fs.rc != UserConfig.account.phone){
          let con = new ContactPerPro();
          con.ai = fs.ui;
          con.mpn =fs.rc;
          //con.a = fs.hiu;
          con.n = fs.rn;
          ac.push(con);
        }
      }
      adgPro.ac = ac;
      if (ac.length ==0) {
        resolve(true);
        return ;
      }
         this.agdRest.contactssave(adgPro).then(data => {
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
          if (!is && fs.rc != UserConfig.account.phone) {
            let dt = new DTbl();
            dt.pi = this.util.getUuid();
            dt.ai = fs.pwi;
            dt.si = si;
            dtList.push(dt.inT());
          }
        }
             return this.sqlite.batExecSql(dtList);
      }).then(data => {
          resolve(true);
      }).catch(e => {
          resolve(false);
      })
    })
  }

}

