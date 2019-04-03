import {Injectable} from "@angular/core";
import {GTbl} from "../../service/sqlite/tbl/g.tbl";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {BxTbl} from "../../service/sqlite/tbl/bx.tbl";
import {BsModel} from "../../service/restful/out/bs.model";
import {UtilService} from "../../service/util-service/util.service";
import {FsData} from "../../service/pagecom/pgbusi.service";

@Injectable()
export class GcService {
  constructor(  private sqlExce: SqliteExec,private util:UtilService) {
  }

  //编辑群名称(添加群成员)
  save(dc:PageDcData): Promise<BsModel<any>> {
    return new Promise<BsModel<any>>((resolve, reject) => {
      let bs = new BsModel<any>();
      console.log('---------- GcService save 添加/编辑群名称(添加群成员) 入参:'+ JSON.stringify(dc));
      if(dc.gi != null &&dc.gi != '' && dc.fsl.length>0){
         let bxL = new Array<string>();
         for(let fs of dc.fsl){
           let bx = new BxTbl();
           bx.bi = dc.gi;
           bx.bmi = fs.pwi;
           bxL.push(bx.rpT());
         }
         console.log('---------- GcService save 编辑群名称(添加群成员) sql:'+ JSON.stringify(bxL));
         this.sqlExce.batExecSql(bxL).then(data=>{
           console.log('---------- GcService save 编辑群名称(添加群成员) 结果:'+ JSON.stringify(data));
           bs.data = data;
           resolve(bs);
         }).catch(e=>{
           console.error('---------- GcService save 编辑群名称(添加群成员) 错误:'+ JSON.stringify(e));
           bs.code=-99;
           bs.message = e.message;
           resolve(bs);
         })
      }else if(dc.gi == null || dc.gi == ''){
        let gc = new GTbl();
        Object.assign(gc,dc);
        gc.gi = this.util.getUuid();
        gc.gnpy = this.util.chineseToPinYin(gc.gn);
        console.log('---------- GcService save 添加群名称(添加群成员) 入参:'+ JSON.stringify(gc));
        this.sqlExce.save(gc).then(data=>{
          console.log('---------- GcService save 添加群名称 结果:'+ JSON.stringify(data));
          if(dc.fsl.length>0){
            let bxL = new Array<string>();
            for(let fs of dc.fsl){
              let bx = new BxTbl();
              bx.bi = dc.gi;
              bx.bmi = fs.pwi;
              bxL.push(bx.rpT());
            }
            console.log('---------- GcService save 添加添加群成员 sql:'+ JSON.stringify(bxL));
            return this.sqlExce.batExecSql(bxL);
          }
        }).then(data=>{
          console.log('---------- GcService save 添加添加群成员 结果:'+ JSON.stringify(data));
          bs.data = data;
          resolve(bs);
        }).catch(e=>{
          console.error('---------- GcService save 添加群名称(添加群成员) 错误:'+ JSON.stringify(e));
          bs.code=-99;
          bs.message = e.message;
          resolve(bs);
        })
      }

    })
  }

  /**
   * 删除群成员
   * @param {string} gi 群组ID
   * @param {string} pwi 联系人ID
   * @returns {Promise<BsModel<any>>}
   */
  deleteBx(gi:string , pwi:string): Promise<BsModel<any>> {
    return new Promise<BsModel<any>>((resolve, reject) => {
      let bs = new BsModel<any>();
      console.log('---------- GcService deleteBx 删除群成员 入参gi:'+ gi + ',pwi:'+pwi);
      if(gi != null &&gi != '' && pwi != null &&pwi != ''){
        let bx = new BxTbl();
        bx.bi = gi;
        bx.bmi = pwi;
        console.log('---------- GcService deleteBx 删除群成员 sql:'+ bx.dT());
        this.sqlExce.delete(bx).then(data=>{
          console.log('---------- GcService deleteBx 删除群成员 结果:'+ JSON.stringify(data));
          bs.data = data;
          resolve(bs);
        }).catch(e=>{
          console.error('---------- GcService deleteBx 删除群成员 错误:'+ JSON.stringify(e));
          bs.code=-99;
          bs.message = e.message;
          resolve(bs);
        })
      }
      //保存群成员到本地
    })
  }

  //删除群
  delete(gId:string): Promise<BsModel<any>> {
    return new Promise<any>((resolve, reject) => {
      let bs = new BsModel<any>();
      //删除本地群成员
      let bx = new BxTbl();
      bx.bi = gId;
      console.log('---------- GcService delete 删除群开始 ----------------');
      this.sqlExce.delete(bx).then(data=>{
        console.log('---------- GcService delete 删除群群成员 结果:'+ JSON.stringify(data));
        //删除本地群
        let gtbl:GTbl = new GTbl();
        gtbl.gi = gId;
        return this.sqlExce.delete(gtbl)
      }).then(data=>{
        console.log('---------- GcService delete 删除群 结果:'+ JSON.stringify(data));
        resolve(bs);
      }).catch(e=>{
        console.log('---------- GcService delete 删除群 ERROR:'+ JSON.stringify(e));
        bs.code=-99;
        bs.message = e.message;
        resolve(bs);
      })
    })
  }

  //根据条件查询参与人
  getfriend(condtion:string):Promise<Array<PageDcData>>{
    return new Promise<Array<PageDcData>>((resolve, reject)=>{
      //获取本地参与人 调用fs

    })
  }

  //查询群成员
  getGroupfriend(cId:string):Promise<Array<PageDcData>>{
    return new Promise<Array<PageDcData>>((resolve, reject)=>{
      //获取本地参与人 调用fs
    })
  }

}

export class PageDcData {

  gi: string=""; //关系群组主键ID
  gn: string="";//组名
  gnpy: string="";//组名拼音
  gm: string=""; //备注
  gc:number = 0; //群组人数
  fsl:Array<FsData> = new Array<FsData>(); //群组成员

}
