import { Injectable } from '@angular/core';
import {BaseSqlite} from "./base-sqlite";
import {LbEntity} from "../../entity/lb.entity";

/**
 * 标签表
 */
@Injectable()
export class LbSqlite {

  constructor(private baseSqlite: BaseSqlite) {}

  /**
   * 添加标签
   */
  alb(lb:LbEntity):Promise<any>{
    return this.baseSqlite.save(lb);
  }

  /**
   * 不存在则添加标签
   */
  alnb(lb:LbEntity):Promise<any>{
    let sql = 'insert into GTD_F (lai,lan,lat) select "'+ lb.lai +'","'+ lb.lan +'","'+ lb.lat +'" ' +
      'where not exists (select lai,lan,lat from GTD_F)'
    return this.baseSqlite.executeSql(sql,[]);
  }

  restAdd(data:Array<any>):Promise<any>{
    if(data != null && data.length>0){
      let sql = ''
      for(let i=0;i<data.length;i++){
        sql = sql+'insert into GTD_F (lai,lan,lat) select "'+ data[i].lai +'","'+ data[i].lan +'","'+ data[i].lat +'" ' +
          'where not exists (select lai,lan,lat from GTD_F)';
      }

      return this.baseSqlite.executeSql(sql,[]);
    }
  }

  /**
   * 更新标签
   */
  ulb(lb:LbEntity):Promise<any>{
    return this.baseSqlite.update(lb);
  }

  /**
   * 查询标签
   * @param {string} jn 标签名
   */
  getlbs():Promise<any>{
    let sql="SELECT * FROM GTD_F order by lai";
    return this.baseSqlite.executeSql(sql,[]);
  }

  initlb(data:any){
    data.push({lai:'BQA01',lat:'BQA',lan:'任务'});
    data.push({lai:'BQB01',lat:'BQA',lan:'生活'})
    data.push({lai:'BQB02',lat:'BQA',lan:'工作'})
    data.push({lai:'BQC01',lat:'BQA',lan:'聚会'})
    data.push({lai:'BQC02',lat:'BQA',lan:'会议'})
    data.push({lai:'BQC03',lat:'BQA',lan:'事件'})
    data.push({lai:'BQC04',lat:'BQA',lan:'预约'})
    data.push({lai:'BQC05',lat:'BQA',lan:'运动'})
    data.push({lai:'BQD01',lat:'BQA',lan:'特殊日期'})
    data.push({lai:'BQD02',lat:'BQA',lan:'法定假日'})
    data.push({lai:'BQE01',lat:'BQA',lan:'里程碑'})
    data.push({lai:'BQE02',lat:'BQA',lan:'随手记'})
    data.push({lai:'BQE03',lat:'BQA',lan:'记账'})
    for(let i=0;i<data.length;i++){
      let lb=new LbEntity();
      lb.lai = data[i].lai;
      lb.lan = data[i].lan;
      lb.lat=data[i].lat;
      this.alnb(lb);
    }
  }
}
