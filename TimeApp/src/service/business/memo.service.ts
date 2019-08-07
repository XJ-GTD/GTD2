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
  saveMemo() {}
  updateMemoPlan() {}
  removeMemo() {}
  sendMemo() {}
  receivedMemo() {}
  syncMemo() {}
  syncMemos() {}
  shareMemo() {}
  backup() {}
  recovery() {}
}

export class MemoData extends MomTbl {

}
