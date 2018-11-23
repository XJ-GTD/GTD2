/**
 * create by on 2018/11/19
 */

//闹铃表
export class ReEntity {

  private _ri: string=null;   //提醒时间UUID
  private _pi:string=null; //参与人表ID
  private _rd: string=null;   //日程提醒时间
  /*
   * 创建表
   * @type {string}
   * @private
   */
  private _csq:string = 'CREATE TABLE IF NOT EXISTS GTD_E(ri VARCHAR(100) PRIMARY KEY,' +
                          'pi VARCHAR(100),rd VARCHAR(10));';
  private _drsq:string="DROP TABLE GTD_E"

  private _isq:string;
  private _usq:string;
  private _dsq:string;
  //查询单个
  private _qosq:string = 'select * from GTD_E where ri=' + this._ri;

  get qosq(): string {
    return this._qosq;
  }

  set qosq(value: string) {
    this._qosq = value;
  }

  get isq(): string {
    let sql='insert into GTD_E ' +
      '(ri,pi,rd) values("'+ this._ri+'","'+ this._pi+'","'+this._rd+'")';
    this._isq=sql;
    return this._isq;
  }

  set isq(value: string) {
    this._isq = value;
  }

  get usq(): string {
    let sql='update GTD_E set';
    if(this._pi!=null){
      sql=sql+' pi="' + this._pi +'",';
    }
    if(this._rd!=null){
      sql=sql+' rd="' + this._rd +'",';
    }
    if(this._ri != null){
      sql = sql + ' ri="' + this._ri +'" where ri="' + this._ri +'"';
    }
    this._usq=sql;
    return this._usq;
  }
  set usq(value: string) {
    this._usq = value;
  }
  get dsq(): string {
    let sql='DELETE FROM GTD_E WHERE 1=1 ';
    if(this._ri!=null){
      sql=sql+' and ri="' + this._ri +'"';
    }
    if(this._pi!=null){
      sql=sql+' and pi="' + this._pi +'"';
    }
    if(this._rd!=null){
      sql=sql+' and rd="' + this._rd +'"';
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

  get ri(): string {
    return this._ri;
  }

  set ri(value: string) {
    this._ri = value;
  }

  get pi(): string {
    return this._pi;
  }

  set pi(value: string) {
    this._pi = value;
  }

  get rd(): string {
    return this._rd;
  }

  set rd(value: string) {
    this._rd = value;
  }
}
