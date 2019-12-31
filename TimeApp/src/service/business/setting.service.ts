import {DataConfig} from "../config/data.config";
import {BaseService} from "./base.service";
import {YTbl} from "../sqlite/tbl/y.tbl";
import {SqliteInit} from "../sqlite/sqlite.init";
import {UtilService} from "../util-service/util.service";
import {SqliteExec} from "../util-service/sqlite.exec";
import {Injectable} from "@angular/core";

/**
 * create by on 2019/3/5
 */
@Injectable()
export class SettingService extends BaseService {



  constructor(private sqlLiteInit: SqliteInit,
              private sqlExce: SqliteExec,
              private util: UtilService,){
    super();

  }


}
