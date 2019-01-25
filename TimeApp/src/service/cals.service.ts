import { Injectable } from '@angular/core';
import { BaseSqlite } from "./sqlite/base-sqlite";
import { UtilService } from "./util-service/util.service";
import { BsModel } from "../model/out/bs.model";
import {ReturnConfig} from "../app/return.config";
import {DataConfig} from "../app/data.config";
import {CalsSqlite} from "./sqlite/cals-sqlite";
import {RcdEntity} from "../entity/rcd.entity";


/**
 *
 */
@Injectable()
export class CalsService {
  constructor(private calsSqlite: CalsSqlite,
                private util:UtilService) {
  }

  /**
   * check单日所有日程是否有被删除的日程
   * @param {string} sd 单日日期
   * @returns {Promise<BsModel>}
   */
  cfh(sd:string):Promise<BsModel>{
    return new Promise((resolve, reject) => {
      let rcd = new RcdEntity();

      let bs=new BsModel();

      this.calsSqlite.getRcd(rcd).then(data=>{
      }).then(data=>{
        console.log('--------- JhService:ajh 计划添加同步库结束 ----------');
        resolve(bs)
      }).catch(e=>{

        bs.code=ReturnConfig.ERR_CODE;
        bs.message=e.message;
        reject(bs);
      })
    })
  }



}
