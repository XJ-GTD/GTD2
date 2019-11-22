import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { SqliteExec } from "../util-service/sqlite.exec";
import { UtilService } from "../util-service/util.service";
import { MomTbl } from "../sqlite/tbl/mom.tbl";
import { BipdshaeData, Plan, PlanPa, ShareData, ShaeRestful } from "../restful/shaesev";
import { SyncData, PushInData, PullInData, DataRestful, DayCountCodec } from "../restful/datasev";
import { BackupPro, BacRestful, OutRecoverPro, RecoverPro } from "../restful/bacsev";
import { UserConfig } from "../config/user.config";
import * as moment from "moment";
import { SyncType, DelType, SyncDataSecurity, SyncDataStatus, CompleteState, InviteState } from "../../data.enum";
import {EmitService} from "../util-service/emit.service";

@Injectable()
export class MemoService extends BaseService {
	constructor(private sqlExce: SqliteExec,
		private bacRestful: BacRestful,
		private emitService: EmitService,
		private util: UtilService,
		private dataRestful: DataRestful,
		private shareRestful: ShaeRestful) {
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
			memodb.tb = SyncType.unsynch;

			await this.sqlExce.updateByParam(memodb);

			Object.assign(memo, memodb);
		} else {
			//创建
			memo.moi = this.util.getUuid();
			memo.sd = memo.sd || moment().format("YYYY/MM/DD");	// 没有设置日期默认当天

			let memodb: MomTbl = new MomTbl();
			Object.assign(memodb, memo);
			memodb.del = DelType.undel;
			memodb.tb = SyncType.unsynch;

			await this.sqlExce.saveByParam(memodb);

			Object.assign(memo, memodb);
		}

		this.emitService.emit("mwxing.calendar.activities.changed", memo);
		this.syncMemos([memo]);

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

		let memo: MemoData = await this.getMemo(moi);

		memo.del = DelType.del;

		let memodb: MomTbl = new MomTbl();

		Object.assign(memodb, memo);

		let sqls: Array <any> = new Array <any> ();
		sqls.push(memodb.rpTParam());
		//删除备忘相关的附件
		sqls.push(`delete from gtd_fj where obt = '${ObjectType.Calendar}' and obi ='${moi}';`);
		//删除备忘相关的标签
		sqls.push(`delete from gtd_mrk where obt = '${ObjectType.Calendar}' and obi ='${moi}';`);
		//删除参与人表
		sqls.push(`delete from gtd_par where obt = '${ObjectType.Calendar}' and obi ='${moi}';`);
		//删除消息表
		sqls.push(`delete from gtd_wa where obt = '${ObjectType.Calendar}' and obi ='${moi}';`);
		await this.sqlExce.batExecSqlByParam(sqls);

		this.emitService.emit("mwxing.calendar.activities.changed", memo);
		this.syncMemos([memo]);

		return ;
	}

	/**
	 * 根据备忘ID获取备忘
	 *
	 * @author ying<343253410@qq.com>
	 */
	async getMemo(moi: string): Promise<MemoData> {
		this.assertEmpty(moi); // id不能为空
		let params= Array<any>();
		let sqlparams: string = ` select * from gtd_mom where moi = '${moi}' and del ='undel' ;`;
		console.info("执行的SQL"+sqlparams);
		let existMemo  =  await this.sqlExce.getExtOneByParam<MomTbl>(sqlparams,params);
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
	async sendMemo(memo: MemoData) {
		this.assertEmpty(memo);     // 入参不能为空

		await this.syncMemos([memo]);

  	return;
	}

	/**
	 * 接收备忘数据同步
	 * @author ying<343253410@qq.com>
	 */
	async receivedMemo(moi: any) {
		this.assertEmpty(moi);   // 入参不能为空
		let pull: PullInData = new PullInData();

		if (moi instanceof Array) {
      pull.type = "Memo";
      pull.d.splice(0, 0, ...moi);
	  } else {
			pull.type = "Memo";
			pull.d.push(moi);
		}

		await this.dataRestful.pull(pull);

		return;
	}

	/**
	 * 接收备忘保存在本地
	 * @author ying<343253410@qq.com>
	 */
	async receivedMemoData(memo: MemoData, status: SyncDataStatus): Promise<MemoData> {
		 this.assertEmpty(memo);     // 入参不能为空
  	 this.assertEmpty(memo.moi);  // 备忘ID不能为空
  	 this.assertEmpty(status);   // 入参不能为空

  	 let memodb: MomTbl = new MomTbl();
  	 Object.assign(memodb, memo);
  	 memodb.del = status;
  	 memodb.tb = SyncType.synch;
  	 await this.sqlExce.repTByParam(memodb);
  	 let backMemo: MemoData = {} as MemoData;
  	 Object.assign(backMemo, memodb);

		 this.emitService.emit("mwxing.calendar.activities.changed", backMemo);

  	 return backMemo;
	}

	async codecMemos(): Promise<Array<DayCountCodec>> {
    let sql: string = `select sd day, count(*) count
                      from gtd_mom
                      where del <> ?1
                      group by day`;
    let daycounts: Array<DayCountCodec> = await this.sqlExce.getExtLstByParam<DayCountCodec>(sql, [DelType.del]) || new Array<DayCountCodec>();

    return daycounts;
  }

	/**
	 * 把指定或所有未同步备忘, 同步到服务器
	 *
	 * @author ying<343253410@qq.com>, leon_xi@163.com
	 */
	async syncMemos(memos: Array<MemoData> = new Array<MemoData>()) {
		this.assertEmpty(memos);	// 入参不能为空

		if (memos.length <= 0) {
			let sql: string = `select * from gtd_mom where  tb = ?`;
			memos = await this.sqlExce.getExtLstByParam<MemoData>(sql, [SyncType.unsynch]) || memos;

			if (memos && memos.length > 0) {
        this.util.toastStart(`发现${memos.length}条未同步备忘, 开始同步...`, 1000);
      }
		}

		//当存在未同步的情况下,进行同步
		if (memos && memos.length > 0) {
			 let push: PushInData = new PushInData();
			 for (let memo of memos) {
			 	 let sync: SyncData = new SyncData();

				 sync.src = UserConfig.account.id;
			 	 sync.id = memo.moi;
		     sync.type = "Memo";
				 sync.title = memo.mon;
		     sync.security = SyncDataSecurity.None;
				 sync.datetime = moment(memo.sd, "YYYY/MM/DD").format("YYYY/MM/DD HH:mm");
				 sync.main = true;

				 sync.todostate = CompleteState.None;
				 sync.invitestate = InviteState.None;
				 sync.to = [];

				 // 设置删除状态
         if (memo.del == DelType.del) {
           sync.status = SyncDataStatus.Deleted;
         } else {
           sync.status = SyncDataStatus.UnDeleted;
         }

		     sync.payload = memo;

		     push.d.push(sync);
			 }

			 await this.dataRestful.push(push);
		}

		return ;
	}

	/**
   * 更新已同步标志
   * 根据备忘ID和更新时间戳
   *
   * @author leon_xi@163.com
   **/
  async acceptSyncMemos(syncids: Array<string>) {
    this.assertEmpty(syncids);    // 入参不能为空

    if (syncids.length < 1) {     // 入参是空数组直接返回
      return;
    }

    let sqls: Array<any> = new Array<any>();

    for (let syncid of syncids) {
      sqls.push([`update gtd_mom set tb = ? where moi = ?`, [SyncType.synch, syncid]]);
    }

    await this.sqlExce.batExecSqlByParam(sqls);

		// 同步完成后刷新缓存
    for (let id of syncids) {
      this.getMemo(id).then((memo) => {
        if (memo) {
          this.emitService.emit("mwxing.calendar.activities.changed", memo);
        }
      });
    }

    return;
  }

	/**
	 * 服务器发送一个链接,然后客户端进行分享
	 * @author ying<343253410@qq.com>
	 */
	async shareMemo(memo: MemoData): Promise<string> {
		this.assertEmpty(memo);     // 入参不能为空
    	this.assertEmpty(memo.moi);  // 备忘ID不能为空

//  	let upplan: ShareData = new ShareData();
//  	upplan.oai = "";
//  	upplan.ompn = "";
//  	upplan.c = "";
//  	//upplan.d.p = memo;
//  	let shared = await this.shareRestful.share(upplan);
//  	if (shared)
//	      return shared.psurl;
//	    else
//	      return "";
		return ;
	}

	/**
	 * 备份备忘到服务器
	 * @author ying<343253410@qq.com>
	 */
	async backup(bts: number) {
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
   * 恢复备忘
   *
	 * @author leon_xi@163.com
   */
  recovery(recoveries: OutRecoverPro): Array<any> {
		this.assertNull(recoveries);

    let sqls: Array<any> = new Array<any>();

		//恢复备忘表
    let memos = recoveries.mom;

    // 删除备忘
    sqls.push([`delete from gtd_mom;`, []]);

    // 恢复备份备忘
    for (let memo of memos) {
			let momdb: MomTbl = new MomTbl();
			Object.assign(momdb, memo);

      sqls.push(momdb.inTParam());
    }

		return sqls;
  }

	/**
	 * 恢复备忘,根据服务器同步到客户端
	 * @author ying<343253410@qq.com>
	 */
	/*async recovery(outRecoverPro: OutRecoverPro, bts: Number = 0,flag: Number =0 ): Promise<Array<any>> {
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
	}*/
}

export interface MemoData extends MomTbl {

}

export enum ObjectType {
	Event = 'event',
	Memo = 'memo',
	Calendar = 'calendar'
}
