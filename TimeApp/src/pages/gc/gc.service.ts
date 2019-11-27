import {Injectable} from "@angular/core";
import {GTbl} from "../../service/sqlite/tbl/g.tbl";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {BxTbl} from "../../service/sqlite/tbl/bx.tbl";
import {UtilService} from "../../service/util-service/util.service";
import {BTbl} from "../../service/sqlite/tbl/b.tbl";
import {UserConfig} from "../../service/config/user.config";
import {PageDcData} from "../../data.mapping";
import {Grouper, GrouperRelation, GrouperService} from "../../service/business/grouper.service";
import * as anyenum from "../../data.enum";

@Injectable()
export class GcService {
  constructor(private sqlExce: SqliteExec,
              private userConfig: UserConfig,
              private util: UtilService,
              private grouperService: GrouperService) {
  }

  //编辑群名称(添加群成员)
  async save(dc: PageDcData) {
    let ret:boolean = false;
    let gi :string;
    if (dc.gi != null && dc.gi != '' && dc.fsl.length > 0) {
      gi = dc.gi;
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
      ret = true;
    } else if (dc.gi == null || dc.gi == '') { // 新建群
      let gc = new GTbl();
      Object.assign(gc, dc);
      gc.gi = this.util.getUuid();
      gc.gnpy = this.util.chineseToPinYin(gc.gn);
      //gc.gm = DataConfig.QZ_HUIBASE64;
      gi = gc.gi;
      let data = await this.sqlExce.save(gc);
      ret = true;
    }

    await this.syncGrouper(gi);
    await this.userConfig.RefreshFriend();
    return ret;
  }

  /**
   * 删除群成员
   * @param {string} gi 群组ID
   * @param {string} pwi 联系人ID
   * @returns {Promise<BsModel<any>>}
   */
  async deleteBx(gi: string, pwi: string) {
    let bx = new BxTbl();
    if (gi != null && gi != '' && pwi != null && pwi != '') {

      bx.bi = gi;
      bx.bmi = pwi;
      bx.del = anyenum.DelType.del;
      await this.sqlExce.update(bx);

    }

    await this.syncGrouper(gi);

    //刷新群组表
    await this.userConfig.RefreshFriend();
    return;
  }

//删除群
  async delete(gId: string) {
    //删除本地群成员
    let bx = new BxTbl();
    bx.bi = gId;
    bx.del = anyenum.DelType.del;
    await this.sqlExce.update(bx);
    //删除本地群
    let gtbl: GTbl = new GTbl();
    gtbl.gi = gId;
    gtbl.del = anyenum.DelType.del;
    await this.sqlExce.update(gtbl);

    await this.syncGrouper(gId);

    //刷新群组表
    await this.userConfig.RefreshFriend();
  }

  private async syncGrouper(gi : string){
    let groupers = new Array<Grouper>();
    let gtbl: GTbl = new GTbl();
    gtbl.gi = gi;
    let gp : Grouper = await this.sqlExce.getOne<Grouper>(gtbl);

    let bx = new BxTbl();
    bx.bi = gi;
    let grouperRelations :Array<GrouperRelation> = await await this.sqlExce.getList<GrouperRelation>(bx);

    if (gp != null){
      gp.grouperRelations = grouperRelations;
      groupers.push(gp);
      await this.grouperService.syncGrouper(groupers);
    }
  }
}
