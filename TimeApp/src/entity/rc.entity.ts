/**
 * create by on 2018/11/19
 */

//日程表
export class RcEntity {

  private _sI: string=null;   //UUID
  private _sN:string=null; //日程名
  private _lI: string=null;   //关联标签ID
  private _uI: string=null;          //创建人ID
  /*
   * 创建表
   * @type {string}
   * @private
   */
  private _csq:string = 'CREATE TABLE IF NOT EXISTS GTD_C(sI VARCHAR(100) PRIMARY KEY,' +
                          'sN VARCHAR(100),lI VARCHAR(10),uI VARCHAR(100))';
  private _drsq:string="DROP TABLE GTD_C"

  private _isq:string;
  private _usq:string;
  private _dsq:string;
  //查询单个
  private _qosq:string = 'select * from GTD_C where sI=' + this._sI;

  get qosq(): string {
    return this._qosq;
  }

  set qosq(value: string) {
    this._qosq = value;
  }

  get isq(): string {
    let sql='insert into GTD_C ' +
      '(sI,sN,lI,uI) values("'+ this._sI+'","'+ this._sN+'","'+this._lI+ '","'+ this._uI+'")';
    this._isq=sql;
    return this._isq;
  }

  set isq(value: string) {
    this._isq = value;
  }

  get usq(): string {
    let sql='update GTD_C set';
    if(this._sN!=null){
      sql=sql+' sN="' + this._sN +'",';
    }
    if(this._lI!=null){
      sql=sql+' lI="' + this._lI +'",';
    }
    if(this._uI!=null){
      sql=sql+' uI="' + this._uI +'",';
    }
    if(this._sI != null){
      sql = sql + ' sI="' + this._sI +'" where sI="' + this._sI +'"';
    }
    this._usq=sql;
    return this._usq;
  }
  set usq(value: string) {
    this._usq = value;
  }
  get dsq(): string {
    let sql='DELETE FROM GTD_C WHERE 1=1 ';
    if(this._sI!=null){
      sql=sql+' and sI="' + this._sI +'"';
    }
    if(this._sN!=null){
      sql=sql+' and sN="' + this._sN +'"';
    }
    if(this._lI!=null){
      sql=sql+' and lI="' + this._lI +'"';
    }
    if(this._uI!=null){
      sql=sql+' and uI="' + this._uI +'"';
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

  get sI(): string {
    return this._sI;
  }

  set sI(value: string) {
    this._sI = value;
  }

  get sN(): string {
    return this._sN;
  }

  set sN(value: string) {
    this._sN = value;
  }

  get lI(): string {
    return this._lI;
  }

  set lI(value: string) {
    this._lI = value;
  }

  get uI(): string {
    return this._uI;
  }

  set uI(value: string) {
    this._uI = value;
  }
}
