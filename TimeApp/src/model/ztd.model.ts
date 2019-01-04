/**
 * create by on 2018/11/19
 */
import {BsModel} from "./out/bs.model";

//字典数据表
export class ZtdModel extends BsModel{

  private _zt: string=null;   //字典类型
  private _zk: string=null; //字典健值
  private _zkv: string=null;//名称
  private _px: number=0; //排序

  get zt(): string {
    return this._zt;
  }

  set zt(value: string) {
    this._zt = value;
  }

  get zk(): string {
    return this._zk;
  }

  set zk(value: string) {
    this._zk = value;
  }

  get zkv(): string {
    return this._zkv;
  }

  set zkv(value: string) {
    this._zkv = value;
  }

  get px(): number {
    return this._px;
  }

  set px(value: number) {
    this._px = value;
  }
}
