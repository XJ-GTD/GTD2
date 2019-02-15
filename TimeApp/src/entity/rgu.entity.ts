/**
 * create by on 2018/11/19
 */

//群组中间表
export class RguEntity {

  private _id:string=''
  private _bi: string='';   //授权表主键ID
  private _bmi:string=''; //授权表关系人主键ID
  /**
   * 创建表
   * @type {string}
   * @private
   */
  private _csq:string = 'CREATE TABLE IF NOT EXISTS GTD_B_X(id VARCHAR(100) PRIMARY KEY,bi VARCHAR(100),' +
                          'bmi VARCHAR(100));';
  private _drsq:string="DROP TABLE IF EXISTS GTD_B_X;"

  private _isq:string;
  private _rpsq:string;
  private _usq:string;
  private _dsq:string;
  //查询单个
  private _qosq:string;

  get qosq(): string {
    this._qosq = 'select * from GTD_B_X where bi="' + this._bi+'"';
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
      '(id,bi,bmi) ' + 'values("'+ this._id+'","'+this._bi+'","'+ this._bmi+'");';
    this._isq=sql;
    return this._isq;
  }

  set isq(value: string) {
    this._isq = value;
  }

  get rpsq(): string {
    let sql='replace into GTD_B_X ' +
      '(id,bi,bmi) ' + 'values("'+ this._id+'","'+ this._bi+'","'+ this._bmi+'");';
    this._rpsq=sql;
    return this._rpsq;
  }

  set rpsq(value: string) {
    this._rpsq = value;
  }

  get usq(): string {
    return this._usq;
  }
  set usq(value: string) {
    this._usq = value;
  }
  get dsq(): string {
    let sql='DELETE FROM GTD_B_X WHERE 1=1 ';
    if(this._id!=null && this._id!=''){
      sql=sql+' and id="' + this._id +'"';
    }
    if(this._bi!=null && this._bi!=''){
      sql=sql+' and bi="' + this._bi +'"';
    }
    if(this._bmi!=null && this._bmi!=''){
      sql=sql+' and bmi="' + this._bmi +'"';
    }
    this._dsq=sql+';';
    return this._dsq;
  }

  set dsq(value: string) {
    this._dsq = value;
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
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
