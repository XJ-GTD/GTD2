/**
 * 处理或查询参数
 *
 * create by zhangjy on 2019/03/12.
 */
import {CTbl} from "../../service/sqlite/tbl/c.tbl";
import {FsData} from "../../data.mapping";


export class ProcesRs{
  //参与人
  fs:Array<FsData>=[];

  //日程
  scd:Array<CTbl>=[];

  option4Speech = "";

  sucess:boolean;
}
