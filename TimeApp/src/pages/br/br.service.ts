import {Injectable} from "@angular/core";
import {CTbl} from "../../service/sqlite/tbl/c.tbl";
import {BackupPro, BacRestful, OutRecoverPro, RecoverPro} from "../../service/restful/bacsev";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {SpTbl} from "../../service/sqlite/tbl/sp.tbl";
import {ETbl} from "../../service/sqlite/tbl/e.tbl";
import {BTbl} from "../../service/sqlite/tbl/b.tbl";
import {DTbl} from "../../service/sqlite/tbl/d.tbl";
import {GTbl} from "../../service/sqlite/tbl/g.tbl";
import {JhTbl} from "../../service/sqlite/tbl/jh.tbl";
import {BxTbl} from "../../service/sqlite/tbl/bx.tbl";
import {STbl} from "../../service/sqlite/tbl/s.tbl";
import {BsModel} from "../../service/restful/out/bs.model";
import {UtilService} from "../../service/util-service/util.service";

@Injectable()
export class BrService {
  constructor(private bacRestful: BacRestful,private sqlexec :SqliteExec,
              private util :UtilService) {

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
    backupPro.d.bts="0";

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

    //test
    let s = new STbl();
    backupPro.d.s = await this.sqlexec.getList<STbl>(s);

    //restFul上传
    return await this.bacRestful.backup(backupPro);

  }

  //页面获取最后更新时间
  getLastDt(): Promise<BsModel<BrData>> {
    //restFul 获取服务器 日历条数
    return new Promise((resolve,reject)=>{
      let bsModel = new BsModel<BrData>();
      this.bacRestful.getlastest().then(data =>{
        bsModel.data.bts = data.data.bts;
        bsModel.data.dt = this.util.tranDate(bsModel.data.bts,"yyyy/MM/dd hh:mm")
        resolve(bsModel)
      })
    })
  }

  //恢复
  recover(bts :string): Promise<BsModel<any>> {
    return new Promise((resolve,reject)=>{
      let bsModel = new BsModel<any>();

        let recoverPro: RecoverPro = new RecoverPro();
        //操作账户ID
        recoverPro.oai="a13661617252"
        //操作手机号码
        recoverPro.ompn="13661617252";
        recoverPro.d.bts = bts;
        // 设定恢复指定表
        // recoverPro.d.rdn=[];
        this.bacRestful.recover(recoverPro).then(data =>{
          //resolve(data);

          //restFul 下载用户数据

          //插入本地日历（插入前删除）

          //插入特殊日历（插入前删除）
          //插入提醒数据（插入前删除）
          //插入特殊提醒数据（插入前删除）
          //插入联系人信息（插入前删除）
          //插入群组信息（插入前删除）
          //插入本地计划（插入前删除）
          //插入本地用户设置（插入前删除）

        }).catch(err =>{
          //处理返回错误
          bsModel.code = -98;
          bsModel.message = "页面服务处理出错";
          resolve(bsModel);

        })

    })
  }
}


export class BrData {
  //画面时间戳
  bts:string ="";

  //页面时间
  dt:string ="";
}
