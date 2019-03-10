import {Injectable} from "@angular/core";

@Injectable()
export class GlService {
  constructor() {
  }

  //获取本地群列表

  getGroups():Promise<any>{
    return new Promise<any>((resolve, reject) => {
      //获取本地群列表
      //或单群人数
    })
  }
}
