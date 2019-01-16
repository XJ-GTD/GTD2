
import {Contacts, Contact} from "@ionic-native/contacts";
import {Injectable} from "@angular/core";
import {BsModel} from "../../model/out/bs.model";
import {UtilService} from "./util.service";
import {RuModel} from "../../model/ru.model";
/**
 * 本地联系人读取
 * 2019/1/16
 */
@Injectable()
export class  ContactsService{

  static contactMap: Map<string,RuModel> = new Map<string, RuModel>();
  static contactList: Array<RuModel> = new Array<RuModel>();

  constructor(private contacts:Contacts,
              private utilService: UtilService){

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
        console.log(JSON.stringify(data));
        for(let contact of data){
          for(let i = 0;i<contact.phoneNumbers.length;i++){
            //去除手机号中的空格
            // ContactsService.contactMap.set(contact.phoneNumbers[i].value.replace(/\s/g,''),contact);
            // contact.phoneNumbers[i].value = contact.phoneNumbers[i].value.replace(/\s/g,'');

            let ru = new RuModel();
            ru.ran = contact.displayName;
            ru.rel = contact.phoneNumbers[i].value;
            ContactsService.contactList.push(ru);
            ContactsService.contactMap.set(contact.phoneNumbers[i].value,ru);
          }
        }
        resolve(bs)
      }).catch(reason => {
        reject(reason);
      });
    })
  }




}
