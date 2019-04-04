/**
 * 处理或查询参数
 *
 * create by zhangjy on 2019/03/12.
 */
import {BTbl} from "../../service/sqlite/tbl/b.tbl";
import {CTbl} from "../../service/sqlite/tbl/c.tbl";


export class ProcesRs{
  //参与人
  fs:Array<BTbl>=[];

  //日程
  scd:Array<CTbl>=[];

  option4Speech = "";

  sucess:boolean;
}
