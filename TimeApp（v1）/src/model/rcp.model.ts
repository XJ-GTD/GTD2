/**
 * create by on 2018/11/19
 */

//日程参与表
export class RcpModel {

  private _pI: string='';//日程参与人表uuID
  private _sI: string='';   //关联日程UUID
  private _son:string=''; //日程别名
  private _sa: string='';   //修改权限
  private _ps:string=''; //完成状态
  private _tm:string=''; //时间
  private _pd: string='';   //完成时间
  private _uI: string='';  //参与人ID
  private _ib: string='0';  //是否本地:0非本地；1本地日历 默认非本地

  get pI(): string {
    return this._pI;
  }

  set pI(value: string) {
    this._pI = value;
  }

  get sI(): string {
    return this._sI;
  }

  set sI(value: string) {
    this._sI = value;
  }

  get son(): string {
    return this._son;
  }

  set son(value: string) {
    this._son = value;
  }

  get sa(): string {
    return this._sa;
  }

  set sa(value: string) {
    this._sa = value;
  }

  get ps(): string {
    return this._ps;
  }

  set ps(value: string) {
    this._ps = value;
  }

  get tm(): string {
    return this._tm;
  }

  set tm(value: string) {
    this._tm = value;
  }

  get pd(): string {
    return this._pd;
  }

  set pd(value: string) {
    this._pd = value;
  }

  get uI(): string {
    return this._uI;
  }

  set uI(value: string) {
    this._uI = value;
  }

  get ib(): string {
    return this._ib;
  }

  set ib(value: string) {
    this._ib = value;
  }
}
