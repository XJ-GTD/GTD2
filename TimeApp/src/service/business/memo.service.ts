import { Injectable } from "@angular/core";
import { SqliteExec } from "../util-service/sqlite.exec";
import { UtilService } from "../util-service/util.service";

@Injectable()
export class MemoService {
  constructor(private sqlExce: SqliteExec,
              private util: UtilService) {}
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

export class MemoData implements MoTbl {

}
