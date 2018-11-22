/**
 * create by on 2018/11/19
 */

//标签表
export class LbEntity {

  private _lai: number=null;   //主键
  private _lan:string=null; //标签名
  private _lat: string=null;//标签类型
  private _lau: string=null; //标签功能
  /*
   * 创建表
   * @type {string}
   * @private
   */
  private _csq:string = 'CREATE TABLE IF NOT EXISTS GTD_F(lai INTEGER PRIMARY KEY,' +
                          'lan VARCHAR(100),lat VARCHAR(10),lau VARCHAR(100))';
  private _drsq:string="DROP TABLE GTD_F";

  private _isq:string;
  private _usq:string;
  private _dsq:string;
  //查询单个
  private _qosq:string = 'select * from GTD_F where lai=' + this._lai;

  get qosq(): string {
    return this._qosq;
  }

  set qosq(value: string) {
    this._qosq = value;
  }

  get isq(): string {
    let sql='insert into GTD_F ' +
      '(sN,lI,uI) values('+ this._lai+',"'+ this._lan+'","'+ this._lat+'","'+this._lau+ '")';
    this._isq=sql;
    return this._isq;
  }

  set isq(value: string) {
    this._isq = value;
  }

  get usq(): string {
    let sql='update GTD_F set';
    if(this._lan!=null){
      sql=sql+' lan="' + this._lan +'",';
    }
    if(this._lat!=null){
      sql=sql+' lat="' + this._lat +'",';
    }
    if(this._lau!=null){
      sql=sql+' _lau="' + this._lau +'",';
    }
    if(this._lai != null){
      sql = sql + ' lai=' + this._lai +' where lai=' + this._lai;
    }
    this._usq=sql;
    return this._usq;
  }
  set usq(value: string) {
    this._usq = value;
  }
  get dsq(): string {
    let sql='DELETE FROM GTD_F WHERE 1=1 ';
    if(this._lai!=null){
      sql=sql+' and lai=' + this._lai;
    }
    if(this._lan!=null){
      sql=sql+' and lan="' + this._lan +'"';
    }
    if(this._lat!=null){
      sql=sql+' and lat="' + this._lat +'"';
    }
    if(this._lau!=null){
      sql=sql+' and lau="' + this._lau +'"';
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
  get lai(): number {
    return this._lai;
  }

  set lai(value: number) {
    this._lai = value;
  }

  get lan(): string {
    return this._lan;
  }

  set lan(value: string) {
    this._lan = value;
  }

  get lat(): string {
    return this._lat;
  }

  set lat(value: string) {
    this._lat = value;
  }

  get lau(): string {
    return this._lau;
  }

  set lau(value: string) {
    this._lau = value;
  }

}
