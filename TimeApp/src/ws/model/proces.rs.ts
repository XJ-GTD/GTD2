/**
 * 处理或查询参数
 *
 * create by zhangjy on 2019/03/12.
 */
import {FsData, ScdData} from "../../data.mapping";


export class ProcesRs{
  //参与人
  fs:Array<FsData>=[];

  //日程
  scd:Array<ScdData>=[];

  option4Speech = "";

  sucess:boolean;
}
