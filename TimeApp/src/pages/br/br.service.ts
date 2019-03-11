import {Injectable} from "@angular/core";

@Injectable()
export class BrService {
  constructor() {

  }

  //备份方法，需要传入页面 ，画面显示备份进度条
  async backup():Promise<any>{
    //定义上传信息JSSON List
      //获取本地日历
      //获取特殊日历
      //获取提醒数据
      //获取特殊提醒数据
      //获取联系人信息
      //获取群组信息
      //获取本地计划

    //restFul上传
    return null

  }

  getCount():Promise<number>{
    //restFul 获取服务器 日历条数
    return null
  }


  recover():Promise<any>{
    //restFul 下载用户数据


    //插入本地日历（插入前删除）
    //插入特殊日历（插入前删除）
    //插入提醒数据（插入前删除）
    //插入特殊提醒数据（插入前删除）
    //插入联系人信息（插入前删除）
    //插入群组信息（插入前删除）
    //插入本地计划（插入前删除）
    //插入本地用户设置（插入前删除）

    return null;

  }
}


export class BrData{
  //日历list
  a1:Array<any>
  //提醒数据list。。。。。

}
