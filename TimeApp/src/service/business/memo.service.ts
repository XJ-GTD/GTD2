import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { SqliteExec } from "../util-service/sqlite.exec";
import { UtilService } from "../util-service/util.service";
import { MomTbl } from "../sqlite/tbl/mom.tbl";
import { BackupPro, BacRestful, OutRecoverPro, RecoverPro } from "../../service/restful/bacsev";
import {UserConfig} from "../../service/config/user.config";
import * as moment from "moment";

@Injectable()
export class MemoService extends BaseService {
	constructor(private sqlExce: SqliteExec,
		private bacRestful: BacRestful,
		private util: UtilService) {
		super();
	}
	/**
	 * 保存或者更新备忘
	 * @author ying
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
	 * @author ying
	 */
	async updateMemoPlan(ji: string, moi: string) {
		this.assertEmpty(ji); // 计划ID不能为空
		this.assertEmpty(moi); // 备案ID不能为空
		let memodb: MomTbl = new MomTbl();
		memodb.moi = moi;
		memodb.ji = ji;
		await this.sqlExce.updateByParam(memodb);
	}
	/**
	 * 删除备忘
	 * @author ying
	 */
	async removeMemo(moi: string) {
		this.assertEmpty(moi); // id不能为空
		let memodb: MomTbl = new MomTbl();
		memodb.moi = moi;
		let sqls: Array < any > = new Array < any > ();
		sqls.push(memodb.drTParam());
		//删除备忘相关的附件
		sqls.push(`delete * from gtd_fj where obt = '${ObjectType.Calendar}' and obi ='${moi}';`);
		//删除备忘相关的标签
		sqls.push(`delete * from gtd_mk where obt = '${ObjectType.Calendar}' and obi ='${moi}';`);
		//删除参与人表
		sqls.push(`delete * from gtd_d where obt = '${ObjectType.Calendar}' and obi ='${moi}';`);
		await this.sqlExce.batExecSqlByParam(sqls);
	}
	/**
	 * 发送备忘进行共享.
	 * @author ying
	 */
	sendMemo() {}
	/**
	 * 接收共享备忘
	 * @author ying
	 */
	receivedMemo() {}
	/**
	 * 同步备忘到服务器
	 * @author ying
	 */
	syncMemo() {}
	/**
	 * 未同步备忘,同步到服务器
	 * @author ying
	 */
	syncMemos() {}
	/**
	 * 服务器发送一个链接,然后客户端进行分享
	 * @author ying
	 */
	shareMemo() {}
	/**
	 * 备份备忘到服务器
	 * @author ying
	 */
	async backup() {
		let backupPro: BackupPro = new BackupPro();
		//操作账户ID
		backupPro.oai = UserConfig.account.id
		//操作手机号码
		backupPro.ompn = UserConfig.account.phone;
		//时间戳
		backupPro.d.bts = moment().unix();
		let mom = new MomTbl();
		//TODO 此处是否要新增逻辑判断只有未同步的数据,才会同步到服务器,暂时不做处理,后续变动
		backupPro.d.memo = await this.sqlExce.getLstByParam<MomTbl>(mom);
		await this.bacRestful.backup(backupPro);
	}
	/**
	 * 恢复备忘,根据服务器同步到客户端
	 * @author ying
	 */
	async recovery(bts: Number) {
		let recoverPro: RecoverPro = new RecoverPro();
		//操作账户ID
		recoverPro.oai = UserConfig.account.id;
		//操作手机号码
		recoverPro.ompn = UserConfig.account.phone;
		recoverPro.d.bts = bts;
		let outRecoverPro: OutRecoverPro = await this.bacRestful.recover(recoverPro);
		let mom = new MomTbl();
		let sqls = new Array < string > ();
		//先删除
		await this.sqlExce.dropByParam(mom);
		//在同步新的数据
		for(let j = 0, len = outRecoverPro.memo.length; j < len; j++) {
			let moi = new MomTbl();
			Object.assign(moi, outRecoverPro.memo[j]);
			sqls.push(moi.inTParam());
		}
		await this.sqlExce.batExecSql(sqls);
	}
}

export interface MemoData extends MomTbl {

}

export enum ObjectType {
	Event = 'event',
	Memo = 'memo',
	Calendar = 'calendar'
}
