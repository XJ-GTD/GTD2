import {MQProcess} from "../interface.process";
import {WsContent} from "../model/content.model";
import {Injectable} from "@angular/core";
import {ProcesRs} from "../model/proces.rs";
import {F} from "../model/ws.enum";
import {FindPara} from "../model/find.para";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import * as moment from "moment";
import {CTbl} from "../../service/sqlite/tbl/c.tbl";
import {FsData} from "../../service/pagecom/pgbusi.service";
import {FsService} from "../../pages/fs/fs.service";
import {GlService} from "../../pages/gl/gl.service";
import {PageDcData} from "../../pages/gc/gc.service";

/**
 * 查询联系人和日历
 *
 * create by wzy on 2018/11/30.
 */
@Injectable()
export class FindProcess implements MQProcess {
  constructor(private sqliteExec: SqliteExec, private fsService: FsService, private glService: GlService) {
  }

  async go(content: WsContent, processRs: ProcesRs) {

    //处理所需要参数
    let findData: FindPara = content.parameters;
    //查找联系人
    processRs.fs = await this.findfs(findData.fs);
    console.log("============ mq返回内容："+ JSON.stringify(content));
    //处理区分
    if (content.option == F.C) {
      processRs.scd = await this.findScd(findData.scd);
    }

    //处理结果
    processRs.option4Speech = content.option;

    processRs.sucess = true;
    return processRs;
  }

  private findfs(ns: Array<any>): Array<FsData> {
    let res: Array<FsData> = new Array<FsData>();
    let rsbs: Map<string, FsData> = new Map<string, FsData>();
    if (!ns || ns.length == 0) {
      return;
    }

    //TODO 联系人和群组是否要放入环境中，每次取性能有影响

    //获取群组列表
    let gs: Array<PageDcData> = this.glService.getGroups(null);
    //循环参数中的pingy数组
    for (let n of ns) {
      let piny = n.n;
      //首先查找群组
      for (let g of gs) {
        if (piny.indexOf(g.gnpy) > -1) {
          piny = piny.replace(g.gnpy, "");
          for (let b1 of g.fsl) {
            rsbs.set(b1.ranpy, b1);
          }
        }
      }
    }

    //获取联系人列表
    let bs: Array<FsData> = this.fsService.getfriend(null);
    for (let n of ns) {
      let piny = n.n;
      //首先查找群组
      for (let b3 of bs) {
        if (piny.indexOf(b3.ranpy) > -1 || piny.indexOf(b3.rnpy) > -1) {
          piny = piny.replace(b3.ranpy, "").replace(b3.rnpy, "");
          rsbs.set(b3.ranpy, b3);
        }
      }
    }
    rsbs.forEach((value, key, map) => {
      res.push(value);
    })
    return res;
  }

  private findScd(scd: any): Promise<Array<CTbl>> {
    return new Promise<Array<CTbl>>(async resolve => {
      console.log("============ mq查询日程scd："+ JSON.stringify(scd));
      let res: Array<CTbl> = new Array<CTbl>();
      if (scd.de ||
        scd.ds ||
        scd.te ||
        scd.ti ||
        scd.ts) {
        let sql: string = `select distinct sp.spi as si,
                                           c.sn,
                                           c.ui,
                                           sp.sd     sd,
                                           c.st,
                                           c.ed,
                                           c.et,
                                           c.rt,
                                           c.ji,
                                           c.sr,
                                           c.bz,
                                           sp.wtt    wtt,
                                           c.tx,
                                           c.pni,
                                           c.du,
                                           c.gs
                           from gtd_sp sp
                                  inner join gtd_c c on sp.si = c.si
                                  left join gtd_d d on d.si = c.si
                           where 1 = 1`

        if (scd.ti) {
          sql = sql + ` and c.sn like '% ${scd.ti}%'`;
        }
        if (scd.ds) {
          sql = sql + ` and sp.sd >= '${scd.ds}'`;
        } else {
          sql = sql + ` and sp.sd >= '${moment().subtract(30, 'd').format('YYYY/MM/DD')}%'`;
        }
        if (scd.de) {
          sql = sql + ` and sp.sd <= '${scd.de}'`;
        } else {
          sql = sql + ` and sp.sd <= '${moment().add(30, 'd').format('YYYY/MM/DD')}%'`;
        }
        if (scd.ts) {
          sql = sql + ` and sp.st >= '${scd.ts}'`;
        }
        if (scd.te) {
          sql = sql + ` and sp.st <= '${scd.te}'`;
        }
        console.log("============ mq查询日程："+ sql);
        res = await this.sqliteExec.getExtList<CTbl>(sql);
      }
      resolve(res);
      return res;
    })
  }
}
