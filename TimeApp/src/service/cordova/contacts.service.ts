import {Contacts, Contact} from "@ionic-native/contacts";
import {Injectable} from "@angular/core";
import {UtilService} from "../util-service/util.service";
import {BTbl} from "../sqlite/tbl/b.tbl";
import {SqliteExec} from "../util-service/sqlite.exec";
import {DataConfig} from "../config/data.config";
import {PersonRestful} from "../restful/personsev";
import {UserConfig} from "../../service/config/user.config";
import {FsData} from "../pagecom/pgbusi.service";
import {BhTbl} from "../sqlite/tbl/bh.tbl";

/**
 * 本地联系人读取
 * 2019/1/16
 */
@Injectable()
export class ContactsService {

  static contactTel: Array<string> = new Array<string>();

  constructor(private contacts: Contacts, private utilService: UtilService,
              private sqlExce: SqliteExec, private personRestful: PersonRestful) {

  }


  /**
   * 所有联系人 未使用
   * @returns {Promise<any>}
   */
  getContacts(): Promise<Array<Contact>> {
    return new Promise<Array<Contact>>(async (resolve, reject) => {
      let contacts: Array<Contact> = new Array<Contact>();
      await this.contacts.find(['*'], {
        filter: '',
        multiple: true,
        desiredFields: ["displayName", "phoneNumbers", 'name']
      }).then(data => {
        for (let contact of data) {
          for (let i = 0; contact.phoneNumbers != null && i < contact.phoneNumbers.length; i++) {
            //去除手机号中的空格
            contact.phoneNumbers[i].value = contact.phoneNumbers[i].value.replace(/\s/g, '')
              .replace('-', '').replace('+86', '').replace('0086', '');
            if (!this.utilService.checkPhone(contact.phoneNumbers[i].value)) {
              break;
            }
          }
        }
        return data;
      })
    })

  }

  /**
   * 所有联系人 联系人导入使用
   * @returns {Promise<any>}
   */
  getContacts4Btbl(): Promise<Array<BTbl>> {
    return new Promise<Array<BTbl>>(async (resolve, reject) => {

      let btbls: Array<BTbl> = new Array<BTbl>();
      if (!this.utilService.isMobile()){
        resolve(btbls);
        return;
      }
      await this.contacts.find(['*'], {
        filter: '',
        multiple: true,
        desiredFields: ["displayName", "phoneNumbers", 'name']
      }).then(data => {
        let contact:any;
        for (contact of data) {
          if (contact._objectInstance) contact = contact._objectInstance;
          for (let i = 0; contact.phoneNumbers != null && i < contact.phoneNumbers.length; i++) {
            //去除手机号中的空格
            contact.phoneNumbers[i].value = contact.phoneNumbers[i].value.replace(/\s/g, '')
              .replace('-', '').replace('+86', '').replace('0086', '');
            if (!this.utilService.checkPhone(contact.phoneNumbers[i].value)) {
              break;
            } else {

              let btbl: BTbl = new BTbl();

              //联系人别称
              btbl.ran = contact.displayName;
              //名称
              btbl.rn = contact.displayName;
              btbl.rc = contact.phoneNumbers[i].value;
              btbls.push(btbl);
            }
          }
        }

        resolve(btbls);
        return;
      })
    })
  }

  asyncPhoneContacts(): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      //异步获取联系人信息入库等操作
      this.getContacts4Btbl().then(async data => {
        let bsqls: Array<string> = new Array<string>();
        for (let b of data) {

          if (!b.rn) continue;
          // TODO 效率低下
          let bt: BTbl = await this.sqlExce.getOne<BTbl>(b);
          if (bt == null) {
            bt = new BTbl();
            bt.pwi = this.utilService.getUuid();
            bt.ran = b.ran;
            bt.ranpy = this.utilService.chineseToPinYin(bt.ran);
            bt.hiu = "";
            bt.rn = b.rn;
            bt.rnpy = this.utilService.chineseToPinYin(bt.rn);
            bt.rc = b.rc;
            bt.rel = '0';
            bt.ui = bt.pwi;
            bsqls.push(bt.inT());
          }
        }
        return await this.sqlExce.batExecSql(bsqls);
      }).then(data => {
        //TODO 异步步服务器联系人信息
       // this.personRestful.get()
        resolve(true);

      }).catch(error=>{
        resolve(false);
      })
    })
  }


  // getByDisplayName(name:string){
  //   return new Promise((resolve, reject)=>{
  //     // let bs = new BsModel();
  //     // this.contacts.find(['displayName'],{
  //     //   filter:name,
  //     //   multiple:true,
  //     //   desiredFields:["displayName","phoneNumbers","name"]
  //     // }).then(data=>{
  //     //   console.log("contacts data :: " + JSON.stringify(data));
  //     //   for(let contact of data){
  //     //     for(let i = 0;contact.phoneNumbers != null && i<contact.phoneNumbers.length;i++){
  //     //       //去除手机号中的空格
  //     //       contact.phoneNumbers[i].value = contact.phoneNumbers[i].value.replace(/\s/g,'');
  //     //
  //     //       // if(this.utilService.checkPhone(contact.phoneNumbers[i].value) != 3){
  //     //       //   break;
  //     //       // }
  //     //       // let ru = new RuModel();
  //     //       // ru.sdt = 3;
  //     //       // ru.ran = contact.displayName;
  //     //       // ru.rC = contact.phoneNumbers[i].value;
  //     //       // ru.rel = '0';
  //     //       // ContactsService.contactList.push(ru);
  //     //       // ContactsService.contactTel.push(contact.phoneNumbers[i].value);
  //     //     }
  //     //   }
  //     //   this.dddd();
  //     //   resolve(bs)
  //     // }).catch(reason => {
  //     //   reject(reason);
  //     // });
  //   })
  //
  // }


  // dddd(){
  //   //手机号排序
  //   for(let i = 0;i<ContactsService.contactTel.length;i++){
  //     for(let j = 0;j<ContactsService.contactTel.length-i;j++){
  //       if(ContactsService.contactTel[j] > ContactsService.contactTel[j+1]){
  //         let tmp = ContactsService.contactTel[j];
  //         ContactsService.contactTel[j] = ContactsService.contactTel[j+1];
  //         ContactsService.contactTel[j+1] = tmp;
  //         // let tmp2 = ContactsService.contactList[j];
  //         // ContactsService.contactList[j] = ContactsService.contactList[j+1];
  //         // ContactsService.contactList[j+1] = tmp2;
  //       }
  //     }
  //   }
  //
  //   let tellist = ContactsService.contactTel;
  //   console.log("手机号集 :: " + JSON.stringify(tellist));
  //   // this.pnRes.sus(tellist).then(data=>{
  //   //   console.log("查询结果 :: " + JSON.stringify(data));
  //   //   let list = data.data.playerList;
  //   //   for(let li of list){
  //   //     let tel = li.userName.substr(5,11);
  //   //     console.log(JSON.stringify(tel));
  //   //     for(let i = 0;i<ContactsService.contactList.length;i++){
  //   //       let tmp = ContactsService.contactList[i];
  //   //       if(li.accountMobile == tmp.rC){
  //   //         ContactsService.contactList[i].hiu = li.headImg;
  //   //         ContactsService.contactList[i].rN = li.userName;
  //   //         ContactsService.contactList[i].id = li.userId;
  //   //         ContactsService.contactList[i].rNpy = li.pyOfUserName;
  //   //         ContactsService.contactList[i].sdt = 0;
  //   //       }
  //   //     }
  //   //   }
  //   //   console.log("处理结果::" + JSON.stringify(ContactsService.contactList));
  //   // }).catch(reason => {
  //   //   console.log("查询结果 :: " + JSON.stringify(reason));
  //   // })
  //
  // }


  /**
   * 更新联系人信息和头像
   * @returns {Promise<void>}
   */
  async updateFs() {

    let bsqls: Array<string> = new Array<string>();

    //获取本地参与人
    let sql = `select gb.*, bh.bhi bhi, bh.hiu bhiu
               from gtd_b gb
                      left join gtd_bh bh on bh.pwi = gb.pwi;`;

    let data: Array<FsData> = await this.sqlliteExec.getExtList<FsData>(sql);
    for (let fs of data) {
      let bt = new BTbl();
      Object.assign(bt, fs);

      let bh = new BhTbl();
      bh.pwi = fs.pwi;
      let hasAvatar : boolean = false;
      
      let userinfo = await this.personRestful.get(fs.ui);

      if (userinfo && userinfo.data) {
        if (userinfo.data.avatarbase64 && userinfo.data.avatarbase64 != '') {
          bh.hiu = userinfo.data.avatarbase64;
          hasAvatar = true;
          bt.rel = 1; // 注册用户
        } else {
          bh.hiu = DataConfig.HUIBASE64;
        }

        if (userinfo.data.nickname && userinfo.data.nickname != '') {
          bt.rn = userinfo.data.nickname;
          bt.rnpy = this.utilService.chineseToPinYin(userinfo.data.nickname);
        }

        if (userinfo.data.phoneno && userinfo.data.phoneno != '') {
          bt.rc = userinfo.data.phoneno;
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
    let freshData: Array<FsData> = await this.sqlliteExec.getExtList<FsData>(sql);
    for (let fs of freshData) {
      UserConfig.friends.push(fs);
    }
  }

}
