import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { SqliteExec } from "../util-service/sqlite.exec";
import { UtilService } from "../util-service/util.service";
import { MomTbl } from "../sqlite/tbl/mom.tbl";

@Injectable()
export class MemoService extends BaseService {
  constructor(private sqlExce: SqliteExec,
              private util: UtilService) {
    super();
  }
 /**
  * 保存或者更新备忘
  */
 async saveMemo(memo:MemoData):Promise<MemoData> {
  	this.assertEmpty(memo);      // 对象不能为空
    this.assertEmpty(memo.mon);   // 备忘内容不能为空
    if (memo.moi) {
    	//更新内容
    	  let memodb: MomTbl = new MomTbl();
    	  Object.assign(memodb,memo);
    	  await this.sqlExce.updateByParam(memodb);
    }
    else
    {
    	//创建
    	 memo.moi=this.util.getUuid();
    	 let memodb: MomTbl = new MomTbl();
    	  Object.assign(memodb,memo);
    	  await this.sqlExce.saveByParam(memodb);
    }
     return memo;
  }
 /**
  *  更新备忘
  */
  async updateMemoPlan(memo:MemoData):Promise<MemoData> {
  	this.assertEmpty(memo);      // 对象不能为空
    this.assertEmpty(memo.moi);   // 主键ID不能为空
    this.assertEmpty(memo.mon);   //备忘内容不能为空
  	if (memo.moi) {
    	//更新内容
    	  let memodb: MomTbl = new MomTbl();
    	  Object.assign(memodb,memo);
    	  await this.sqlExce.updateByParam(memodb);
    }
  	return memo;
  }
  /**
   * 删除备忘
   */
  async removeMemo(moi:string): Array<any> {
  	 this.assertEmpty(moi);   // id不能为空
  	 let memodb: MomTbl = new MomTbl();
  	 memodb.moi=moi;
  	 let sqls: Array<any> = new Array<any>();
  	 sqls.push(memodb.drTParam());
  	 await this.sqlExce.batExecSqlByParam(sqls);
  	 return;
  }
  sendMemo() {}
  receivedMemo() {}
  syncMemo() {}
  syncMemos() {}
  shareMemo() {}
  backup() {}
  recovery() {}
}

export interface MemoData extends MomTbl {

}
