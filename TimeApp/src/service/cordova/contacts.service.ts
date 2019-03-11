import {Contacts, Contact} from "@ionic-native/contacts";
import {Injectable} from "@angular/core";
import {BsModel} from "../../model/out/bs.model";
/**
 * 本地联系人读取
 * 2019/1/16
 */
@Injectable()
export class  ContactsService{

  static contactTel: Array<string> = new Array<string>();

  constructor(private contacts:Contacts){

  }


  /**
   * 所有联系人
   * @returns {Promise<any>}
   */
  getContacts():Promise<BsModel>{
    return new Promise((resolve, reject)=>{
      let bs = new BsModel();
      this.contacts.find(['phoneNumbers'],{
        filter:'',
        multiple:true,
        desiredFields:["displayName","phoneNumbers",'name']
      }).then(data=>{
        console.log("contacts data :: " + JSON.stringify(data));
        for(let contact of data){
          for(let i = 0;contact.phoneNumbers != null && i<contact.phoneNumbers.length;i++){
            //去除手机号中的空格
            // ContactsService.contactMap.set(contact.phoneNumbers[i].value.replace(/\s/g,''),contact);
            contact.phoneNumbers[i].value = contact.phoneNumbers[i].value.replace(/\s/g,'');

            // if(this.utilService.checkPhone(contact.phoneNumbers[i].value) != 3){
            //   break;
            // }
            // let ru = new RuModel();
            // ru.ran = contact.displayName;
            // ru.rC = contact.phoneNumbers[i].value;
            // ru.rel = '0';
            // ru.sdt = 3;
            // ContactsService.contactList.push(ru);
            // ContactsService.contactTel.push(contact.phoneNumbers[i].value);

            // this.baseSqlite.save(ru);
          }
        }
        // console.log("1111111 :: "+JSON.stringify(ContactsService.contactTel));
        // console.log("2222222 :: "+JSON.stringify(ContactsService.contactList));
        this.dddd();
        resolve(bs)
      }).catch(reason => {
        reject(reason);
      });
    })
  }



  getByDisplayName(name:string){
    return new Promise((resolve, reject)=>{
      let bs = new BsModel();
      this.contacts.find(['displayName'],{
        filter:name,
        multiple:true,
        desiredFields:["displayName","phoneNumbers","name"]
      }).then(data=>{
        console.log("contacts data :: " + JSON.stringify(data));
        for(let contact of data){
          for(let i = 0;contact.phoneNumbers != null && i<contact.phoneNumbers.length;i++){
            //去除手机号中的空格
            contact.phoneNumbers[i].value = contact.phoneNumbers[i].value.replace(/\s/g,'');

            // if(this.utilService.checkPhone(contact.phoneNumbers[i].value) != 3){
            //   break;
            // }
            // let ru = new RuModel();
            // ru.sdt = 3;
            // ru.ran = contact.displayName;
            // ru.rC = contact.phoneNumbers[i].value;
            // ru.rel = '0';
            // ContactsService.contactList.push(ru);
            // ContactsService.contactTel.push(contact.phoneNumbers[i].value);
          }
        }
        this.dddd();
        resolve(bs)
      }).catch(reason => {
        reject(reason);
      });
    })

  }


  dddd(){
    //手机号排序
    for(let i = 0;i<ContactsService.contactTel.length;i++){
      for(let j = 0;j<ContactsService.contactTel.length-i;j++){
        if(ContactsService.contactTel[j] > ContactsService.contactTel[j+1]){
          let tmp = ContactsService.contactTel[j];
          ContactsService.contactTel[j] = ContactsService.contactTel[j+1];
          ContactsService.contactTel[j+1] = tmp;
          // let tmp2 = ContactsService.contactList[j];
          // ContactsService.contactList[j] = ContactsService.contactList[j+1];
          // ContactsService.contactList[j+1] = tmp2;
        }
      }
    }

    let tellist = ContactsService.contactTel;
    console.log("手机号集 :: " + JSON.stringify(tellist));
    // this.pnRes.sus(tellist).then(data=>{
    //   console.log("查询结果 :: " + JSON.stringify(data));
    //   let list = data.data.playerList;
    //   for(let li of list){
    //     let tel = li.userName.substr(5,11);
    //     console.log(JSON.stringify(tel));
    //     for(let i = 0;i<ContactsService.contactList.length;i++){
    //       let tmp = ContactsService.contactList[i];
    //       if(li.accountMobile == tmp.rC){
    //         ContactsService.contactList[i].hiu = li.headImg;
    //         ContactsService.contactList[i].rN = li.userName;
    //         ContactsService.contactList[i].id = li.userId;
    //         ContactsService.contactList[i].rNpy = li.pyOfUserName;
    //         ContactsService.contactList[i].sdt = 0;
    //       }
    //     }
    //   }
    //   console.log("处理结果::" + JSON.stringify(ContactsService.contactList));
    // }).catch(reason => {
    //   console.log("查询结果 :: " + JSON.stringify(reason));
    // })

  }



}
