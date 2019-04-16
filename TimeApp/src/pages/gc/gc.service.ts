import {Injectable} from "@angular/core";
import {GTbl} from "../../service/sqlite/tbl/g.tbl";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {BxTbl} from "../../service/sqlite/tbl/bx.tbl";
import {BsModel} from "../../service/restful/out/bs.model";
import {UtilService} from "../../service/util-service/util.service";
import {BTbl} from "../../service/sqlite/tbl/b.tbl";
import {UserConfig} from "../../service/config/user.config";
import {PageDcData} from "../../data.mapping";

@Injectable()
export class GcService {
  constructor(private sqlExce: SqliteExec,
              private userConfig: UserConfig,
              private util: UtilService) {
  }

  //编辑群名称(添加群成员)
  async save(dc: PageDcData) {
    let bs = new BsModel<any>();
    console.log('---------- GcService save 添加/编辑群名称(添加群成员) ');
    if (dc.gi != null && dc.gi != '' && dc.fsl.length > 0) {
      let bxL = new Array<string>();
      let sql = 'select gb.* from gtd_b gb inner join gtd_b_x bx on bx.bmi = gb.pwi where bx.bi = "' + dc.gi + '"';
      let data: Array<BTbl> = await this.sqlExce.getExtList<BTbl>(sql);
      for (let fs of dc.fsl) {
        let bx = new BxTbl();
        bx.bi = dc.gi;
        bx.bmi = fs.pwi;
        let ie = false;
        for (let bt of data) {
          if (bt.pwi == fs.pwi) {
            ie = true;
            break;
          }
        }
        if (!ie) {
          let bx = new BxTbl();
          bx.bi = dc.gi;
          bx.bmi = fs.pwi;
          bxL.push(bx.inT());
        }
      }
      await this.sqlExce.batExecSql(bxL);
      bs.data = data;
    } else if (dc.gi == null || dc.gi == '') { // 新建群
      let gc = new GTbl();
      Object.assign(gc, dc);
      gc.gi = this.util.getUuid();
      gc.gnpy = this.util.chineseToPinYin(gc.gn);
      //gc.gm = DataConfig.QZ_HUIBASE64;
      console.log('---------- GcService save 添加群名称(新建群)');
      let data = await this.sqlExce.save(gc)
      bs.data = data;
    }
    await this.userConfig.RefreshFriend();
    return bs;
  }

  /**
   * 删除群成员
   * @param {string} gi 群组ID
   * @param {string} pwi 联系人ID
   * @returns {Promise<BsModel<any>>}
   */
  async deleteBx(gi: string, pwi: string) {
    let bs = new BsModel<any>();
    if (gi != null && gi != '' && pwi != null && pwi != '') {
      let bx = new BxTbl();
      bx.bi = gi;
      bx.bmi = pwi;
      await this.sqlExce.delete(bx);

    }
    //刷新群组表
    await this.userConfig.RefreshFriend();
    return;
  }

//删除群
  async delete(gId: string) {
    let bs = new BsModel<any>();
    //删除本地群成员
    let bx = new BxTbl();
    bx.bi = gId;
    console.log('---------- GcService delete 删除群开始 ----------------');
    await this.sqlExce.delete(bx)
    //删除本地群
    let gtbl: GTbl = new GTbl();
    gtbl.gi = gId;
    await this.sqlExce.delete(gtbl)
    //刷新群组表
    await this.userConfig.RefreshFriend();
  }
}
