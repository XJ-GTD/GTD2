/**
 * create by on 2018/11/19
 */

//标签表
export class JhEntity {
  private _ji: string=null;   //计划编号
  private _jn:string=null; //计划名
  private _jg: string=null; //计划描述
  /*
   * 创建表
   * @type {string}
   * @private
   */
  private _csq:string = 'CREATE TABLE IF NOT EXISTS GTD_J_H(ji VARCHAR(20) PRIMARY KEY,' +
                          'jn VARCHAR(100),jg VARCHAR(100));';
  private _drsq:string="DROP TABLE IF EXISTS GTD_J_H;";

  private _isq:string;
  private _rpsq:string;
  private _usq:string;
  private _dsq:string;
  //查询单个
  private _qosq:string = 'select * from GTD_J_H where ji="' + this._ji +'"';

  get qosq(): string {
    return this._qosq;
  }

  set qosq(value: string) {
    this._qosq = value;
  }

  get isq(): string {
    let sql='insert into GTD_J_H ' +
      '(ji,jn,jg) values("'+ this._ji+'","'+ this._jn+'","'+this._jg+ '")';
    this._isq=sql;
    return this._isq;
  }

  set isq(value: string) {
    this._isq = value;
  }
  get rpsq(): string {
    let sql='replace into GTD_J_H ' +
      '(ji,jn,jg) values("'+ this._ji+'","'+ this._jn+'","'+this._jg+ '");';
    this._rpsq=sql;
    return this._rpsq;
  }

  set rpsq(value: string) {
    this._rpsq = value;
  }
  get usq(): string {
    let sql='update GTD_J_H set';
    if(this._jn!=null){
      sql=sql+' jn="' + this._jn +'",';
    }
    if(this._jg!=null){
      sql=sql+' jg="' + this._jg +'",';
    }
    if(this._ji != null){
      sql = sql + ' ji="' + this._ji +'" where ji="' + this._ji + '"';
    }
    this._usq=sql;
    return this._usq;
  }
  set usq(value: string) {
    this._usq = value;
  }
  get dsq(): string {
    let sql='DELETE FROM GTD_J_H WHERE 1=1 ';
    if(this._ji!=null){
      sql=sql+' and ji="' + this._ji +'"';
    }
    if(this._jn!=null){
      sql=sql+' and jn="' + this._jn +'"';
    }
    if(this._jg!=null){
      sql=sql+' and jg="' + this._jg +'"';
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

  get jn(): string {
    return this._jn;
  }

  set jn(value: string) {
    this._jn = value;
  }

  get jg(): string {
    return this._jg;
  }

  set jg(value: string) {
    this._jg = value;
  }

  get ji(): string {
    return this._ji;
  }

  set ji(value: string) {
    this._ji = value;
  }
}
