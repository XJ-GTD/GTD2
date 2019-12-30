import {DataConfig} from "../config/data.config";
import {BaseService} from "./base.service";
import {IPatch} from "../patch/ipatch";
import {MytestPatch} from "../patch/mytest.patch";
import {YTbl} from "../sqlite/tbl/y.tbl";
import {SqliteInit} from "../sqlite/sqlite.init";
import {UtilService} from "../util-service/util.service";
import {SqliteExec} from "../util-service/sqlite.exec";

/**
 * create by on 2019/3/5
 */
export class PatchService extends BaseService {

  private _patchs : Array<IPatch> = new Array<IPatch>();

  constructor(private sqlLiteInit: SqliteInit,
              private sqlExce: SqliteExec,
              private util: UtilService,){
    super();
    this._patchs.length = 0;

    //测试补丁
    let mytestPatch = new MytestPatch();
    this._patchs.push(mytestPatch);
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
        return value.version ==  version ;
      });
      if (!findm){
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
