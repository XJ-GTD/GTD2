import {Injectable} from "@angular/core";
import {BlaRestful} from "../../service/restful/blasev";
import {UtilService} from "../../service/util-service/util.service";
import {DataConfig} from "../../service/config/data.config";
import {UserConfig} from "../../service/config/user.config";
import {FsData} from "../../service/pagecom/pgbusi.service";
import {ContactsService} from "../../service/cordova/contacts.service";

@Injectable()
export class BlService {

  constructor(private blaRes: BlaRestful,
              private contacts: ContactsService,
              private util:UtilService) {

  }

  //获取黑名单列表
  async get(){
    let blaList:Array<PageBlData> = new Array<PageBlData>();
    this.util.loadingStart();
      //rest获取黑名单
      let bs = await this.blaRes.list();
      blaList = bs.data;
      for(let fs of blaList) {
        //TODO 返回的openid 获取本地联系人信息 如果本地没有的话，获取联系人信息，插入本地
        let fsData:FsData = UserConfig.friends.find((value)=>value.ui == fs.ai);
        if(!fsData){
          fsData = await this.contacts.updateOneFs(fs.ai);
        }
        fs.a = fsData.bhiu;
        if (!fs.a || fs.a == null || fs.a == '') {
          fs.a = DataConfig.HUIBASE64;
        }
      }
    this.util.loadingEnd();
    return blaList;
  }
}

export class PageBlData{
  //帐户ID
  ai: string;
  //手机号码
  mpn: string;
  //姓名
  n: string;
  //头像
  a: string;
  //性别
  s: string;
  //生日
  bd: string;

}
