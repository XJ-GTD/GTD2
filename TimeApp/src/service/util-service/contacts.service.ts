
import {Contacts, Contact} from "@ionic-native/contacts";
import {Injectable} from "@angular/core";
import {BsModel} from "../../model/out/bs.model";
import {UtilService} from "./util.service";
import {RuModel} from "../../model/ru.model";
import {PnRestful} from "../restful/pn-restful";
/**
 * 本地联系人读取
 * 2019/1/16
 */
@Injectable()
export class  ContactsService{

  static contactTel: Array<string> = new Array<string>();
  static contactList: Array<RuModel> = new Array<RuModel>();

  constructor(private contacts:Contacts,
              private utilService: UtilService,
              private pnRes:PnRestful,){

  }


  /**
   * 所有联系人
   * @returns {Promise<any>}
   */
  getContacts(){
    return new Promise((resolve, reject)=>{
      let bs = new BsModel();
      this.contacts.find(['phoneNumbers'],{
        filter:'',
        multiple:true,
        desiredFields:["displayName","phoneNumbers"]
      }).then(data=>{
        console.log("contacts data :: " + JSON.stringify(data));
        for(let contact of data){
          for(let i = 0;i<contact.phoneNumbers.length;i++){
            //去除手机号中的空格
            // ContactsService.contactMap.set(contact.phoneNumbers[i].value.replace(/\s/g,''),contact);
            contact.phoneNumbers[i].value = contact.phoneNumbers[i].value.replace(/\s/g,'');

            if(this.utilService.checkPhone(contact.phoneNumbers[i].value) != 3){
              break;
            }
            let ru = new RuModel();
            ru.ran = contact.displayName;
            ru.rC = contact.phoneNumbers[i].value;
            ru.rel = '0';
            ContactsService.contactList.push(ru);
            ContactsService.contactTel.push(contact.phoneNumbers[i].value);

          }
        }
        console.log("1111111 :: "+JSON.stringify(ContactsService.contactTel));
        console.log("2222222 :: "+JSON.stringify(ContactsService.contactList));
        this.dddd();
        resolve(bs)
      }).catch(reason => {
        reject(reason);
      });
    })
  }

  dddd(){

    let tellist = ContactsService.contactTel;
    console.log("手机号集 :: " + JSON.stringify(tellist));
    let all = [];
    for(let tel of tellist){
      all.push(this.pnRes.su(tel));
    }
    Promise.all(all).then(data=>{
      console.log("批量查询结果 :: " + JSON.stringify(data));
      for(let i = 0 ;i< data.length;i++){
        if(data[i].code == '0'){
          ContactsService.contactList[i].sdt = 0;
          ContactsService.contactList[i].rN = data[i].data.userName;
        }
        if(data[i].code == '11500'){
          ContactsService.contactList[i].sdt = 3;
        }
      }

    }).catch(reason => {
      console.log("批量查询异常 :: " +JSON.stringify(reason));
        for(let i = 0;i<ContactsService.contactList.length; i++){
          ContactsService.contactList[i].sdt = 3;
        }
    });

  }



}
