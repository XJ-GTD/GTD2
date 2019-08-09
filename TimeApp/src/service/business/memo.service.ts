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
	async saveMemo(memo: MemoData): Promise < MemoData > {
		this.assertEmpty(memo); // 对象不能为空
		this.assertEmpty(memo.mon); // 备忘内容不能为空
		if(memo.moi) {
			//更新内容
			let memodb: MomTbl = new MomTbl();
			Object.assign(memodb, memo);
			await this.sqlExce.updateByParam(memodb);
		} else {
			//创建
			memo.moi = this.util.getUuid();
			let memodb: MomTbl = new MomTbl();
			Object.assign(memodb, memo);
			await this.sqlExce.saveByParam(memodb);
		}
		return memo;
	}
	/**
	 *  更新备忘计划,只是更新计划ID
	 */
	async updateMemoPlan(memo: MemoData): Promise < MemoData > {
		this.assertEmpty(memo); // 对象不能为空
		this.assertEmpty(memo.moi); // 主键ID不能为空
		this.assertEmpty(memo.mon); //备忘内容不能为空
		if(memo.moi) {
			//更新内容
			let memodb: MomTbl = new MomTbl();
			Object.assign(memodb, memo);
			await this.sqlExce.updateByParam(memodb);
		}
		return memo;
	}
	/**
	 * 删除备忘
	 */
	async removeMemo(moi: string) {
		this.assertEmpty(moi); // id不能为空
		let memodb: MomTbl = new MomTbl();
		memodb.moi = moi;
		let sqls: Array < any > = new Array < any > ();
		sqls.push(memodb.drTParam());
		await this.sqlExce.batExecSqlByParam(sqls);
	}
	/**
	 * 发送备忘进行共享.
	 */
	sendMemo() {}
	/**
	 * 接收共享备忘
	 */
	receivedMemo() {}
	/**
	 * 同步备忘到服务器
	 */
	syncMemo() {}
	/**
	 * 未同步备忘,同步到服务器
	 */
	syncMemos() {}
	/**
	 * 服务器发送一个链接,然后客户端进行分享
	 */
	shareMemo() {}
	/**
	 * 备份备忘到服务器
	 */
	backup() {}
	/**
	 * 恢复备忘,根据服务器同步到客户端
	 */
	recovery() {}
}

export interface MemoData extends MomTbl {

}