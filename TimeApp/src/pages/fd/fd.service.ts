import {Injectable} from "@angular/core";
import {BlData} from "../bl/bl.service";

@Injectable()
export class FdService {
  constructor() {
  }

  get(id:String):Promise<FdData>{

    return new Promise<Array<BlData>>((resolve, reject)=>{
      //rest获取用户信息（包括头像）
      //更新本地用户信息
      //获取本地参与人信息
      //restFul查询是否是黑名单
    })

  }

  putBlack(id:String):Promise<any>{
    return new Promise<Array<BlData>>((resolve, reject)=>{
      //restFul 加入黑名单
    })

  }

  removeBlack(id:String):Promise<any>{
    return new Promise<Array<BlData>>((resolve, reject)=>{
      //restFul 移除入黑名单
    })

  }
}

export class FdData {
}


