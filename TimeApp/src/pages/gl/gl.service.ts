import {Injectable} from "@angular/core";
import {UserConfig} from "../../service/config/user.config";
import {PageDcData} from "../../data.mapping";

@Injectable()
export class GlService {
  constructor() {
  }

  //获取本地群列表
  getGroups(name:string):Array<PageDcData> {
    if (name)
    return UserConfig.groups.filter((value)=>{
      return value.gn.indexOf(name) > -1 || value.gnpy.indexOf(name) > -1
    });
    else
      return UserConfig.groups;
  }
}

export class PageGlData {

  gl:Array<PageDcData> = new Array<PageDcData>(); //群组成员

}
