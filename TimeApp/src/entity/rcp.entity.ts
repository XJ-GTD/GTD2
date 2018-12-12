/**
 * create by on 2018/11/19
 */

//日程参与表
export class RcpEntity {

  private _pI: string=null;//日程参与人表uuID
  private _sI: string=null;   //关联日程UUID
  private _son:string=null; //日程别名
  private _sa: string=null;   //修改权限 0不可修改，1可修改
  private _ps:string=null; //完成状态
  private _cd:string=null;  //创建时间
  private _pd: string=null;   //完成时间
  private _uI: string=null;  //参与人用户ID
  private _rui: string=null;  //联系人ID
  private _ib: string='0';  //是否本地:0非本地；1本地日历 默认非本地
  /*
   * 创建表
   * @type {string}
   * @private
   */
  private _csq:string = 'CREATE TABLE IF NOT EXISTS GTD_D(pI VARCHAR(100) PRIMARY KEY,sI VARCHAR(100),' +
                          'son VARCHAR(100),sa VARCHAR(2),ps VARCHAR(2),cd VARCHAR(20),pd VARCHAR(20),' +
    'uI VARCHAR(100),rui VARCHAR(100),ib VARCHAR(2));';
  private _drsq:string="DROP TABLE GTD_D";

  private _isq:string;
  private _usq:string;
  private _dsq:string;
  //查询单个
  private _qosq:string = 'select * from GTD_D where pI=' + this._pI;

  get qosq(): string {
    return this._qosq;
  }

  set qosq(value: string) {
    this._qosq = value;
  }

  get isq(): string {
    let sql='insert into GTD_D ' +
      '(pI,sI,son,sa,ps,cd,pd,uI,rui,ib) values("'+ this._pI+'","'+ this._sI+'","'+ this._son+'","'
      +this._sa+ '","'+this._ps+ '","'+this._cd+ '","'+this._pd+ '","'+ this._uI+'","'+ this._rui+'","'+ this._ib+'")';
    this._isq=sql;
    return this._isq;
  }

  set isq(value: string) {
    this._isq = value;
  }

  get usq(): string {
    let sql='update GTD_D set';
    if(this._sI!=null){
      sql=sql+' sI="' + this._sI +'",';
    }
    if(this._son!=null){
      sql=sql+' son="' + this._son +'",';
    }
    if(this._sa!=null){
      sql=sql+' sa="' + this._sa +'",';
    }
    if(this._ps!=null){
      sql=sql+' ps="' + this._ps +'",';
    }
    if(this._cd!=null){
      sql=sql+' cd="' + this._cd +'",';
    }
    if(this._pd!=null){
      sql=sql+' pd="' + this._pd +'",';
    }
    if(this._uI!=null){
      sql=sql+' uI="' + this._uI +'",';
    }
    if(this._ib!=null){
      sql=sql+' ib="' + this._ib +'",';
    }
    if(this._rui!=null){
      sql=sql+' rui="' + this._rui +'",';
    }
    if(this._pI != null){
      sql = sql + ' pI="' + this._pI +'" where pI="' + this._pI +'"';
    }
    this._usq=sql;
    return this._usq;
  }
  set usq(value: string) {
    this._usq = value;
  }
  get dsq(): string {
    let sql='DELETE FROM GTD_D WHERE 1=1 ';
    if(this._sI!=null){
      sql=sql+' and sI="' + this._sI +'"';
    }
    if(this._pI!=null){
      sql=sql+' and pI="' + this._pI +'"';
    }
    if(this._son!=null){
      sql=sql+' and son="' + this._son +'"';
    }
    if(this._sa!=null){
      sql=sql+' and sa="' + this._sa +'"';
    }
    if(this._ps!=null){
      sql=sql+' and ps="' + this._ps +'"';
    }
    if(this._cd!=null){
      sql=sql+' and cd="' + this._cd +'"';
    }
    if(this._pd!=null){
      sql=sql+' and pd="' + this._pd +'"';
    }
    if(this._uI!=null){
      sql=sql+' and uI="' + this._uI +'"';
    }
    if(this._ib!=null){
      sql=sql+' and ib="' + this._ib +'"';
    }
    if(this._rui!=null){
      sql=sql+' and rui="' + this._rui +'"';
    }
    this._dsq=sql;
    return this._dsq;
  }

  set dsq(value: string) {
    this._dsq = value;
  }
  get csq(): string {
    return this._csq;
  }

  set csq(value: string) {
    this._csq = value;
  }

  get drsq(): string {
    return this._drsq;
  }

  set drsq(value: string) {
    this._drsq = value;
  }

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

  get cd(): string {
    return this._cd;
  }

  set cd(value: string) {
    this._cd = value;
  }
  get rui(): string {
    return this._rui;
  }

  set rui(value: string) {
    this._rui = value;
  }
}
