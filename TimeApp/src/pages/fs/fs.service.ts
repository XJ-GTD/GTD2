import {Injectable} from "@angular/core";
import {BlData} from "../bl/bl.service";

@Injectable()
export class FsService {
  constructor() {
  }

  //根据条件查询参与人
  getfriend(condtion:string):Promise<FsData>{
    return new Promise<Array<BlData>>((resolve, reject)=>{
      //获取本地参与人
    })
  }

  //获取分享日程的参与人
  getCalfriend(calId:string):Promise<FsData>{
    return new Promise<Array<BlData>>((resolve, reject)=>{
      //获取日程有参与人
    })
  }

  //分享给参与人操作
  sharefriend(calId:string):Promise<FsData>{
    return new Promise<Array<BlData>>((resolve, reject)=>{
      //restFul 通知参与人
    })
  }

  //查询群组中的参与人
  getfriend4group(groupId:string):Promise<FsData>{
    return new Promise<Array<BlData>>((resolve, reject)=>{
      //查询本地群组中的参与人
    })
  }
}


export class FsData {
}

