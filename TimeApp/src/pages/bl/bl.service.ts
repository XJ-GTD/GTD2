import {Injectable} from "@angular/core";
import {BlaRestful} from "../../service/restful/blasev";
import {UtilService} from "../../service/util-service/util.service";
import {DataConfig} from "../../service/config/data.config";

@Injectable()
export class BlService {

  constructor(private blaRes: BlaRestful,
              private util:UtilService) {

  }

  //获取黑名单列表
  get():Promise<Array<PageBlData>>{

    this.util.loadingStart();
    return new Promise<Array<PageBlData>>((resolve, reject)=>{
      //rest获取黑名单
      this.blaRes.list().then(data=>{
        let blaList:Array<PageBlData> = data.data;
        for(let fs of blaList) {
          if (!fs.a || fs.a == null || fs.a == '') {
            //TODO 返回的openid 获取本地联系人信息 如果本地没有的话，获取联系人信息，插入本地
            fs.a = DataConfig.HUIBASE64;

          }
        }
        resolve(blaList);
        this.util.loadingEnd();
      })
    })
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
