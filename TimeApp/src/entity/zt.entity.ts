/**
 * create by on 2018/11/19
 */

//字典类型表
export class ZtEntity {

  private _zt: string=null;   //字典值
  private _zv:string=null; //字典名称
  /**
   * 创建表
   * @type {string}
   * @private
   */
  private _csq:string = 'CREATE TABLE IF NOT EXISTS GTD_X(zt VARCHAR(100) PRIMARY KEY,' +
                          'zv VARCHAR(100));';
  private _drsq:string="DROP TABLE GTD_X"

  private _isq:string;
  private _usq:string;
  private _dsq:string;

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

  get isq(): string {
    let sql='insert into GTD_X ' +
      '(zt,zv) ' + 'values("'+ this._zt+'","'+ this._zv+'")';
    this._isq=sql;
    return this._isq;
  }

  set isq(value: string) {
    this._isq = value;
  }

  get usq(): string {
    return this._usq;
  }
  set usq(value: string) {
    this._usq = value;
  }
  get dsq(): string {
    let sql='DELETE FROM GTD_X WHERE 1=1 ';
    if(this._zt!=null){
      sql=sql+' and zt="' + this._zt +'"';
    }
    if(this._zv!=null){
      sql=sql+' and zv="' + this._zv +'"';
    }
    this._dsq=sql;
    return this._dsq;
  }

  set dsq(value: string) {
    this._dsq = value;
  }

  get zt(): string {
    return this._zt;
  }

  set zt(value: string) {
    this._zt = value;
  }

  get zv(): string {
    return this._zv;
  }

  set zv(value: string) {
    this._zv = value;
  }
}
