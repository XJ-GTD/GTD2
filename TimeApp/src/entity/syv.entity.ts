/**
 * create by on 2018/11/19
 */

//同步版本表
export class SyvEntity {
  private _si: number;   //主键ID
  private _fv:string=''; //同步服务器版本号
  private _bv: number;//同步本地版本号
  private _st: string=''; //同步服务器时间
  /*
   * 创建表
   * @type {string}
   * @private
   */
  private _csq:string = 'CREATE TABLE IF NOT EXISTS GTD_S_V(si INTEGER PRIMARY KEY,' +
    'fv VARCHAR(100),bv INTEGER,st VARCHAR(100));';
  private _drsq:string="DROP TABLE IF EXISTS GTD_S_V;";

  private _isq:string;
  private _usq:string;
  private _dsq:string;
  //查询单个
  private _qosq:string = 'select * from GTD_S_V where si=' + this._si;

  get qosq(): string {
    return this._qosq;
  }

  set qosq(value: string) {
    this._qosq = value;
  }

  get isq(): string {
    let sql='insert into GTD_S_V ' +
      '(si,fv,lI,uI) values('+this._si+',"'+ this._fv+'",'+ this._bv+',"'+this._st+ '")';
    this._isq=sql;
    return this._isq;
  }

  set isq(value: string) {
    this._isq = value;
  }

  get usq(): string {
    let sql='update GTD_S_V set';
    if(this._fv!=null){
      sql=sql+' fv="' + this._fv +'",';
    }
    if(this._bv!=null){
      sql=sql+' bv=' + this._bv +',';
    }
    if(this._st!=null){
      sql=sql+' st="' + this._st +'",';
    }
    if(this._si != null){
      sql = sql + ' si=' + this._si +' where si=' + this._si;
    }
    this._usq=sql;
    return this._usq;
  }
  set usq(value: string) {
    this._usq = value;
  }
  get dsq(): string {
    let sql='DELETE FROM GTD_S_V WHERE 1=1 ';
    if(this._si!=null){
      sql=sql+' and si="' + this._si +'"';
    }
    if(this._fv!=null){
      sql=sql+' and fv="' + this._fv +'"';
    }
    if(this._bv!=null){
      sql=sql+' and bv=' + this._bv;
    }
    if(this._st!=null){
      sql=sql+' and st="' + this._st +'"';
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
  get si(): number {
    return this._si;
  }

  set si(value: number) {
    this._si = value;
  }

  get fv(): string {
    return this._fv;
  }

  set fv(value: string) {
    this._fv = value;
  }

  get bv(): number {
    return this._bv;
  }

  set bv(value: number) {
    this._bv = value;
  }

  get st(): string {
    return this._st;
  }

  set st(value: string) {
    this._st = value;
  }
}
