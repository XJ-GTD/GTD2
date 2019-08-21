import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { SqliteExec } from "../util-service/sqlite.exec";
import { UtilService } from "../util-service/util.service";
import { MomTbl } from "../sqlite/tbl/mom.tbl";
import { BackupPro, BacRestful, OutRecoverPro, RecoverPro } from "../restful/bacsev";
import { UserConfig } from "../config/user.config";
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
	 * @author ying<343253410@qq.com>
	 */
	async saveMemo(memo: MemoData): Promise <MemoData> {
		this.assertEmpty(memo); // 对象不能为空
		this.assertEmpty(memo.mon); // 备忘内容不能为空
		if (memo.moi) {
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
	 * @author ying<343253410@qq.com>
	 */
	async updateMemoPlan(ji: string, moi: string) {
		this.assertEmpty(ji); // 计划ID不能为空
		this.assertEmpty(moi); // 备案ID不能为空
		let memodb: MomTbl = new MomTbl();
		memodb.moi = moi;
		memodb.ji = ji;
		await this.sqlExce.updateByParam(memodb);
		return ;
	}

	/**
	 * 删除备忘
	 * @author ying<343253410@qq.com>
	 */
	async removeMemo(moi: string) {
		this.assertEmpty(moi); // id不能为空
		let memodb: MomTbl = new MomTbl();
		memodb.moi = moi;
		let sqls: Array <any> = new Array <any> ();
		sqls.push(memodb.dTParam());
		//删除备忘相关的附件
		sqls.push(`delete from gtd_fj where obt = '${ObjectType.Calendar}' and obi ='${moi}';`);
		//删除备忘相关的标签
		sqls.push(`delete from gtd_mrk where obt = '${ObjectType.Calendar}' and obi ='${moi}';`);
		//删除参与人表
		sqls.push(`delete from gtd_par where obt = '${ObjectType.Calendar}' and obi ='${moi}';`);
		//删除消息表
		sqls.push(`delete from gtd_wa where obt = '${ObjectType.Calendar}' and obi ='${moi}';`);
		await this.sqlExce.batExecSqlByParam(sqls);
		return ;
	}

	/**
	 * 根据备忘ID获取备忘
	 *
	 * @author leon_xi@163.com
	 */
	async getMemo(moi: string): Promise<MemoData> {
		this.assertEmpty(moi); // id不能为空

		let memodb: MomTbl = new MomTbl();
		memodb.moi = moi;

		let existMemo: MomTbl = await this.sqlExce.getOneByParam<MomTbl>(memodb);

		if (existMemo && existMemo.moi) {
			let memo: MemoData = {} as MemoData;
			Object.assign(memo, existMemo);

			return memo;
		} else {
			return null;
		}
	}

	/**
	 * 发送备忘进行共享.
	 * @author ying<343253410@qq.com>
	 */
	sendMemo() {}

	/**
	 * 接收共享备忘
	 * @author ying<343253410@qq.com>
	 */
	receivedMemo() {}

	/**
	 * 同步备忘到服务器
	 * @author ying<343253410@qq.com>
	 */
	syncMemo() {}

	/**
	 * 未同步备忘,同步到服务器
	 * @author ying<343253410@qq.com>
	 */
	syncMemos() {}

	/**
	 * 服务器发送一个链接,然后客户端进行分享
	 * @author ying<343253410@qq.com>
	 */
	shareMemo() {}

	/**
	 * 备份备忘到服务器
	 * @author ying<343253410@qq.com>
	 */
	async backup(bts: Number) {
		let backupPro: BackupPro = new BackupPro();
		//操作账户ID
		backupPro.oai = UserConfig.account.id
		//操作手机号码
		backupPro.ompn = UserConfig.account.phone;
		//时间戳
		backupPro.d.bts = bts;
		let mom = new MomTbl();
		backupPro.d.mom = await this.sqlExce.getLstByParam <MomTbl> (mom);
		await this.bacRestful.backup(backupPro);
		return ;
	}

	/**
	 * 恢复备忘,根据服务器同步到客户端
	 * @author ying<343253410@qq.com>
	 */
	async recovery(outRecoverPro: OutRecoverPro, bts: Number = 0,flag: Number =0 ): Promise<Array<any>> {
		if (bts == 0) {
			this.assertNull(outRecoverPro);
		}
		let outRecoverProNew: OutRecoverPro = new OutRecoverPro();
		if (bts != 0) {
			let recoverPro: RecoverPro = new RecoverPro();
			//操作账户ID
			recoverPro.oai = UserConfig.account.id;
			//操作手机号码
			recoverPro.ompn = UserConfig.account.phone;
			recoverPro.d.bts = bts;
			let rdn = new Array <string> ();
			rdn.push('mom');
			recoverPro.d.rdn = rdn;
			outRecoverProNew = await this.bacRestful.recover(recoverPro);
		} else {
			outRecoverProNew = outRecoverPro;
		}
		let sqls = new Array <string> ();
		if (outRecoverProNew.mom.length > 0) {
			let mom = new MomTbl();
			//先删除
			await this.sqlExce.delByParam(mom);
			//恢复数据
			for(let j = 0, len = outRecoverProNew.mom.length; j < len; j++) {
				let mom = new MomTbl();
				Object.assign(mom, outRecoverProNew.mom[j]);
				sqls.push(mom.inTParam());
			}
			if(flag==0)
			{
				await this.sqlExce.batExecSqlByParam(sqls);
			}
		}
		return sqls;
	}
}

export interface MemoData extends MomTbl {

}

export enum ObjectType {
	Event = 'event',
	Memo = 'memo',
	Calendar = 'calendar'
}
