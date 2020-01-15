import {Contacts, Contact} from "@ionic-native/contacts";
import {Injectable} from "@angular/core";
import {UtilService} from "../util-service/util.service";
import {BTbl} from "../sqlite/tbl/b.tbl";

/**
 * 本地联系人读取
 * 2019/1/16
 */
@Injectable()
export class ContactsService {

  static contactTel: Array<string> = new Array<string>();

  constructor(private contacts: Contacts, private utilService: UtilService,
              ) {

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
      }
      await this.contacts.find(['*'], {
        filter: '',
        multiple: true,
        desiredFields: ["displayName", "phoneNumbers", 'name']
      }).then(data => {
        // console.log("===== 获取本地联系人：" + JSON.stringify(data));
        let contactPhones: Array<string> = new Array<string>();
        let contact:any;

        for (contact of data) {
          // console.log("===== 本地联系人：" + JSON.stringify(contact));
          // XiaoMI 6X补丁
          if (contact._objectInstance) contact = contact._objectInstance;

          if (!contact.phoneNumbers) continue;
          // 可能存在没有姓名的联系人
          if (!contact.name) continue;

          for (let phone of contact.phoneNumbers) {
            //去除手机号中的空格
            let phonenumber = phone.value;
            let number="";

            phonenumber.match(/\d+/g).forEach(v=>{
              number = number + v;
            });

            number= number.replace(/\+86/g, '')
              .replace('0086', '')
              .replace(/\s/g,"");

            // console.log("===== 电话号码：" + number);

            if (!this.utilService.checkPhone(number)) {
              continue;
            } else {
              if (contactPhones.indexOf(number) > -1) continue;

              // 增加人名显示逻辑
              let displayname = this.getLocalContactsName(contact.displayName, contact.name.familyName, contact.name.givenName, contact.name.formatted);

              let btbl: BTbl = new BTbl();

              //联系人别称
              btbl.ran = displayname;
              //名称
              btbl.rn = displayname;
              btbl.rc = number;
              contactPhones.push(number);
              btbls.push(btbl);
              // console.log("===== 加入联系人清单：" + JSON.stringify(btbl));
            }
          }
        }

        // console.log("===== 本地联系人处理结束 =====");
        resolve(btbls);
      }).catch(err=>{
        resolve(btbls);
      })
    })
  }

  /**
   * 获取手机本地联系人
   *
   * @author leon_xi@163.com
   */
  async getLocalContacts(callback: (name, phone) => void): Promise<Array<any>> {
    let results: Array<any> = new Array<any>();

    if (!this.utilService.isMobile()){
      return results;
    }

    let localdatas = await this.contacts.find(['*'], {
      filter: '',
      multiple: true,
      desiredFields: ["displayName", "phoneNumbers", 'name']
    });

    if (localdatas && localdatas.length > 0) {
      // console.log("===== 获取本地联系人：" + JSON.stringify(data));
      let contactPhones: Array<string> = new Array<string>();
      let contact:any;

      for (contact of localdatas) {
        // console.log("===== 本地联系人：" + JSON.stringify(contact));
        // XiaoMI 6X补丁
        if (contact._objectInstance) contact = contact._objectInstance;

        if (!contact.phoneNumbers) continue;
        // 可能存在没有姓名的联系人
        if (!contact.name) continue;

        for (let phone of contact.phoneNumbers) {
          //去除手机号中的空格
          let phonenumber = phone.value;
          let number = "";

          phonenumber.match(/\d+/g).forEach(v=>{
            number = number + v;
          });

          number= number.replace(/\+86/g, '')
            .replace('0086', '')
            .replace(/\s/g,"");

          // console.log("===== 电话号码：" + number);
          if (!this.utilService.checkPhone(number)) {
            continue;
          } else {
            if (contactPhones.indexOf(number) > -1) continue;

            // 增加人名显示逻辑
            let displayname = this.getLocalContactsName(contact.displayName, contact.name.familyName, contact.name.givenName, contact.name.formatted);

            // 排除重复联系人，手机号相同
            contactPhones.push(number);

            if (callback) {
              let onecontact = callback(displayname, number);

              if (onecontact) results.push(onecontact);
            } else {
              results.push({name: displayname, phone: displayname});
            }

            // console.log("===== 加入联系人清单：" + JSON.stringify(btbl));
          }
        }
      }

      // console.log("===== 本地联系人处理结束 =====");
      return results;
    }
  }

  getLocalContactsName(displayName, familyName, givenName, formatted) {
    if (displayName) return displayName;

    if (familyName && givenName) return familyName + ' ' + givenName;

    if (familyName && !givenName) return familyName;

    if (!familyName && givenName) return givenName;

    if (formatted) return formatted;

    return "";
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



}
