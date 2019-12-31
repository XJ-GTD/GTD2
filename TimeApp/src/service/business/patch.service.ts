import {DataConfig} from "../config/data.config";
import {BaseService} from "./base.service";
import {IPatch} from "../../patch/ipatch";
import {Patch15} from "../../patch/patch.15";
import {YTbl} from "../sqlite/tbl/y.tbl";
import {SqliteInit} from "../sqlite/sqlite.init";
import {UtilService} from "../util-service/util.service";
import {SqliteExec} from "../util-service/sqlite.exec";
import {Injectable} from "@angular/core";

/**
 * create by on 2019/3/5
 */
@Injectable()
export class PatchService extends BaseService {

  private _patchs : Array<IPatch> = new Array<IPatch>();

  constructor(private sqlLiteInit: SqliteInit,
              private sqlExce: SqliteExec,
              private util: UtilService,
              private patch15 : Patch15){
    super();
    this._patchs.length = 0;


    this._patchs.push(patch15);
  }
  /**
   * 补丁更新
   * @param {number} version
   * @param {number} from
   * @returns {Promise<void>}
   */
  async updatePatch(version: number) {

    let fromversion = version;

    while (DataConfig.version > version) {

      await this.sqlLiteInit.createTablespath(version + 1, fromversion);

      let findm =  this._patchs.find((value, index,arr)=>{
        return value.version ==  version + 1 ;
      });
      if (findm){
        if (fromversion > 0 && fromversion < findm.version ) {
          await findm.createPatch();
        }
      }

      let yTbl: YTbl = new YTbl();
      yTbl.yt = "FI";
      yTbl.yk = "FI";
      let stbls: Array<YTbl> = await this.sqlExce.getList<YTbl>(yTbl);
      if (stbls.length > 0) yTbl.yi = stbls[0].yi; else yTbl.yi = this.util.getUuid();
      yTbl.yv = (++version).toString();
      await this.sqlExce.replaceT(yTbl);

    }
  }

  get patchs(): Array<IPatch> {
    return this._patchs;
  }

  set patchs(value: Array<IPatch>) {
    this._patchs = value;
  }
}
