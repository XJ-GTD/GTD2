import { Injectable } from '@angular/core';
import {BaseSqlite} from "./base-sqlite";
import {FiEntity} from "../../entity/fi.entity";
import {BsModel} from "../../model/out/bs.model";
import {DataConfig} from "../../app/data.config";

/**
 * 版本表
 */
@Injectable()
export class FiSqlite {
  className:string = "FiSqlite";
  constructor(private baseSqlite: BaseSqlite) {}

  /**
   * 查询FI表是否存在
   * @returns {Promise<BsModel>} code 0正常打开，1报错暂无表，2无版本数据3，更新后首次打开
   */
  isFi(): Promise<BsModel> {
    return new Promise((resolve, reject) => {
      let bs=new BsModel();
      let code = 1;//表不存
      let sql="SELECT * FROM sqlite_master where type='table' and name='GTD_FI'";
      console.log(this.className + " ------------- isFi()  查询GTD_FI是否存在 -------------");
      //1.先查询表是否存在
      this.baseSqlite.executeSql(sql,[]).then(data=>{
        if(data && data.rows && data.rows.length>0){
          console.log(this.className + " fi is exist");
          let sql1="SELECT * FROM GTD_FI where id=1";
          code = 0;//表存在
          //2.查询GTD_FI表信息
          return this.baseSqlite.executeSql(sql,[]);
        }else{
          console.log(this.className + "isFi()  GTD_FI is not exist");
          code=1;
        }
      }).then(data=>{
        if(code==0){
          console.log(this.className + " isFi()  查询GTD_FI表数据 ：" + JSON.stringify(data));
          if(data && data.rows && data.rows.length>0){
            if(data.rows.item(0).isup && data.rows.item(0).isup != 0){
              console.log(this.className + " isFi()  GTD_FI is update");
              code=3;//更新后首次打开进入引导页
            }else{
              code=0;//无更新
            }
          }else{
            console.log(this.className + "isFi()  GTD_FI data is null");
            code = 2;//无数据
          }
        }
        DataConfig.isFirst= code;
        bs.code=code;
        resolve(bs);
      }).catch(e=>{
        console.error(this.className + " isFi() is Error:" + e.message);
        bs.code=1;
        bs.message=e.message;
        DataConfig.isFirst= bs.code;
        resolve(bs);
      })
    })
  }

  /**
   * 添加版本表
   */
  afi(firstIn:number,isup:number): Promise<any> {
    let fi = new FiEntity();
    fi.id=1;
    fi.firstIn=firstIn;
    fi.isup=isup;
    return this.baseSqlite.save(fi);
  }

  /**
   * 更新版本表
   * @param {number} firstIn 版本号
   * @param {number} isup 是否更新0暂无更新，1已更新；1状态进入引导页，并更新成0
   * @returns {Promise<any>}
   */
  ufi(firstIn:number,isup:number): Promise<any> {
    let fi = new FiEntity();
    fi.id=1;
    fi.firstIn=firstIn;
    fi.isup=isup;
    return this.baseSqlite.update(fi);
  }

  /**
   * 查询版本表
   * @param {string} id 主键
   */
  getfi(id:number): Promise<any> {
    let sql="SELECT * FROM GTD_FI where 1=1";
    if(id != null){
      sql = sql + " and id="+id;
    }
    return this.baseSqlite.executeSql(sql,[]);
  }

  /**
   * 删除版本表
   * @param {FiEntity}
   * @returns {Promise<any>}
   */
  djh(jh:FiEntity): Promise<any> {
    return this.baseSqlite.delete(jh);
  }

}
