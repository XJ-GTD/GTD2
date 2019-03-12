import {Injectable} from "@angular/core";
import {CTbl} from "../../service/sqlite/tbl/c.tbl";
import {BackupPro, BacRestful} from "../../service/restful/bacsev";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {UserConfig} from "../../service/config/user.config";
import {SpTbl} from "../../service/sqlite/tbl/sp.tbl";
import {ETbl} from "../../service/sqlite/tbl/e.tbl";
import {BTbl} from "../../service/sqlite/tbl/b.tbl";
import {DTbl} from "../../service/sqlite/tbl/d.tbl";
import {GTbl} from "../../service/sqlite/tbl/g.tbl";
import {JhTbl} from "../../service/sqlite/tbl/jh.tbl";
import {BxTbl} from "../../service/sqlite/tbl/bx.tbl";
import {STbl} from "../../service/sqlite/tbl/s.tbl";

@Injectable()
export class BrService {
  constructor(private bacRestful: BacRestful,private sqlexec :SqliteExec) {

  }

  //备份方法，需要传入页面 ，画面显示备份进度条
  async backup(){
    //定义上传信息JSSON List

    let backupPro: BackupPro = new BackupPro();
    //操作账户ID
    backupPro.oai="a13661617252"
    //操作手机号码
    backupPro.ompn="13661617252";
    //时间戳
    backupPro.d.bts=0;

    //获取本地日历
    let c = new CTbl();
    backupPro.d.c = await this.sqlexec.getList<CTbl>(c);

    //获取特殊日历
    let sp = new SpTbl();
    backupPro.d.sp = await this.sqlexec.getList<SpTbl>(sp);

    //获取提醒数据
    let e = new ETbl();
    backupPro.d.e = await this.sqlexec.getList<ETbl>(e);

    //获取日程参与人数据
    let d = new DTbl();
    backupPro.d.d = await this.sqlexec.getList<DTbl>(d);

    //获取联系人信息
    let b = new BTbl();
    backupPro.d.b = await this.sqlexec.getList<BTbl>(b);

    //获取群组信息
    let g = new GTbl();
    backupPro.d.g = await this.sqlexec.getList<GTbl>(g);

    //获取群组人员信息
    let bx = new BxTbl();
    backupPro.d.bx = await this.sqlexec.getList<BxTbl>(bx);

    //获取本地计划
    let jh = new JhTbl();
    backupPro.d.jh = await this.sqlexec.getList<JhTbl>(jh);

    /*//test
    let s = new STbl();
    let aa : Array<STbl> =new Array<STbl>();
    aa = await this.sqlexec.getList<STbl>(s);
    console.log(aa[0]);*/
    //restFul上传
    return await this.bacRestful.backup(backupPro);

  }

  getCount(): Promise<number> {
    //restFul 获取服务器 日历条数
    return null
  }


  recover(): Promise<any> {
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


export class BrData {
  //日历list
  a1: Array<any>
  //提醒数据list。。。。。

}
