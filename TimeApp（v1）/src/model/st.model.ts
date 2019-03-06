/**
 * create by on 2018/11/19
 */

//系统设置
export class StEntity {

  private _si: number=null;   //系统设置自增主键ID
  private _sn:string=null; //系统设置名称
  private _ss: string=null;//系统设置状态
  private _st: string=null; //系统设置类型

  get si(): number {
    return this._si;
  }

  set si(value: number) {
    this._si = value;
  }

  get sn(): string {
    return this._sn;
  }

  set sn(value: string) {
    this._sn = value;
  }

  get ss(): string {
    return this._ss;
  }

  set ss(value: string) {
    this._ss = value;
  }

  get st(): string {
    return this._st;
  }

  set st(value: string) {
    this._st = value;
  }
}
