import {Injectable} from "@angular/core";
import {BlaRestful} from "../../service/restful/blasev";
import {UtilService} from "../../service/util-service/util.service";
import {UserConfig} from "../../service/config/user.config";
import {ContactsService} from "../../service/cordova/contacts.service";
import {FsData, PageBlData} from "../../data.mapping";
import {DataConfig} from "../../service/config/data.config";
import {Friend, GrouperService} from "../../service/business/grouper.service";

@Injectable()
export class BlService {

  constructor(private blaRes: BlaRestful,
              private grouperService: GrouperService,
              private util:UtilService) {

  }

  //获取黑名单列表
  async get(){
    let blfss:Array<Friend> = new Array<Friend>();
    this.util.loadingStart();
      //rest获取黑名单
    let blaList:Array<PageBlData> = await this.blaRes.list();
      for(let fs of blaList) {
        //TODO 返回的openid 获取本地联系人信息 如果本地没有的话，获取联系人信息，插入本地
        if (fs.ai && fs.ai != '') {
          let fsData:Friend = UserConfig.friends.find((value)=>value.ui == fs.ai);
          if(!fsData){
            fsData = await this.grouperService.updateOneFs(fs.ai);
          }
          if(!fsData.ui || fsData.ui == null || fsData.ui == ''){
            fsData.ui =fs.ai;
          }
          if(!fsData.rc || fsData.rc == null || fsData.rc == ''){
            fsData.rc =fs.mpn;
          }
          if(!fsData.ran || fsData.ran == null || fsData.ran == ''){
            fsData.ran =fs.n;
          }
          if(!fsData.bhiu || fsData.bhiu == null || fsData.bhiu == ''){
            fsData.bhiu = DataConfig.HUIBASE64;
          }
          blfss.push(fsData);
        }
      }
    this.util.loadingEnd();
    return blfss;
  }
}

