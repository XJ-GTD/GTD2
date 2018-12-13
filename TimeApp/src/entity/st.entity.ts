/**
 * create by on 2018/11/19
 */

//系统设置
export class StEntity {

  private _si: number=null;   //系统设置自增主键ID
  private _sn:string=null; //系统设置名称
  private _ss: string=null;//系统设置状态
  private _st: string=null; //系统设置类型
  /*
   * 创建表
   * @type {string}
   * @private
   */
  private _csq:string = 'CREATE TABLE IF NOT EXISTS GTD_G(si INTEGER PRIMARY KEY AUTOINCREMENT,' +
                          'sn VARCHAR(100),ss VARCHAR(10),st VARCHAR(100));';
  private _drsq:string="DROP TABLE GTD_G;";

  private _isq:string;
  private _usq:string;
  private _dsq:string;
  //查询单个
  private _qosq:string = 'select * from GTD_G where si=' + this._si;

  get qosq(): string {
    return this._qosq;
  }

  set qosq(value: string) {
    this._qosq = value;
  }

  get isq(): string {
    let sql='insert into GTD_G ' +
      '(sN,lI,uI) values("'+ this._sn+'","'+ this._ss+'","'+this._st+ '")';
    this._isq=sql;
    return this._isq;
  }

  set isq(value: string) {
    this._isq = value;
  }

  get usq(): string {
    let sql='update GTD_G set';
    if(this._sn!=null){
      sql=sql+' sn="' + this._sn +'",';
    }
    if(this._ss!=null){
      sql=sql+' ss="' + this._ss +'",';
    }
    if(this._st!=null){
      sql=sql+' _st="' + this._st +'",';
    }
    if(this._si != null){
      sql = sql + ' si="' + this._si +'" where si="' + this._si +'"';
    }
    this._usq=sql;
    return this._usq;
  }
  set usq(value: string) {
    this._usq = value;
  }
  get dsq(): string {
    let sql='DELETE FROM GTD_G WHERE 1=1 ';
    if(this._si!=null){
      sql=sql+' and si="' + this._si +'"';
    }
    if(this._sn!=null){
      sql=sql+' and sn="' + this._sn +'"';
    }
    if(this._ss!=null){
      sql=sql+' and ss="' + this._ss +'"';
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
