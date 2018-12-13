/**
 * create by on 2018/11/19
 */

//群组中间表
export class RguEntity {

  private _bi: string=null;   //授权表主键ID
  private _bmi:string=null; //授权表关系人主键ID
  /**
   * 创建表
   * @type {string}
   * @private
   */
  private _csq:string = 'CREATE TABLE IF NOT EXISTS GTD_B_X(bi VARCHAR(100),' +
                          'bmi VARCHAR(100));';
  private _drsq:string="DROP TABLE GTD_B_X;"

  private _isq:string;
  private _usq:string;
  private _dsq:string;
  //查询单个
  private _qosq:string = 'select * from GTD_B_X where bi=' + this._bi;

  get qosq(): string {
    return this._qosq;
  }

  set qosq(value: string) {
    this._qosq = value;
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

  get isq(): string {
    let sql='insert into GTD_B_X ' +
      '(bi,bmi) ' + 'values("'+ this._bi+'","'+ this._bmi+'")';
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
    let sql='DELETE FROM GTD_B_X WHERE 1=1 ';
    if(this._bi!=null){
      sql=sql+' and bi="' + this._bi +'"';
    }
    if(this._bmi!=null){
      sql=sql+' and bmi="' + this._bmi +'"';
    }
    this._dsq=sql;
    return this._dsq;
  }

  set dsq(value: string) {
    this._dsq = value;
  }

  get bi(): string {
    return this._bi;
  }

  set bi(value: string) {
    this._bi = value;
  }

  get bmi(): string {
    return this._bmi;
  }

  set bmi(value: string) {
    this._bmi = value;
  }
}
