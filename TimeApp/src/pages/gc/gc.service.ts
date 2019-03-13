import {Injectable} from "@angular/core";
import {GTbl} from "../../service/sqlite/tbl/g.tbl";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {PageFsData} from "../fs/fs.service";

@Injectable()
export class GcService {
  constructor(  private sqlExce: SqliteExec,) {
  }

  //编辑群名称
  save(dc:PageDcData): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      //删除本地群成员

      //保存群成员到本地
    })
  }

  //删除群
  delete(gId:string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      //删除本地群成员


      //删除本地群
      let gtbl:GTbl = new GTbl();
      gtbl.gi = gId;
      this.sqlExce.delete(gtbl).then(data=>{

      })

    })
  }

  //根据条件查询参与人
  getfriend(condtion:string):Promise<Array<PageDcData>>{
    return new Promise<Array<PageDcData>>((resolve, reject)=>{
      //获取本地参与人
    })
  }

  //查询群成员
  getGroupfriend(cId:string):Promise<Array<PageDcData>>{
    return new Promise<Array<PageDcData>>((resolve, reject)=>{
      //获取本地参与人
    })
  }

}

export class PageDcData {

  gi: string=""; //关系群组主键ID
  gn: string="";//组名
  gm: string=""; //备注
  gc:number = 0; //群组人数
  fsl:Array<PageFsData> = new Array<PageFsData>(); //群组成员

}
