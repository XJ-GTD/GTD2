/**
 * create by on 2018/11/19
 */

//日程忽略表
export class RcdEntity {

  private _dI: string='';   //UUid
  private _sI: string='';   //日程id
  private _uI: string='';          //创建人ID
  private _sd:string=''; //日期 yyyy/MM/dd
  private _sT: string=''; //状态：0 忽略，1 删除

  private _yM: string=''; //查询用年月yyyyMM
  /*
   * 创建表
   * @type {string}
   * @private
   */
  //查询单个

  qosq(): string {
    let sql = 'select * from GTD_C_D where dI=' + this._dI;
    return sql;
  }

  isq(): string {
    let sql='insert into GTD_C_D ' +
      ' (dI,sI,uI,sd,ed,sT) '+
      ' values("'+ this._dI+'","'+ this._sI+'","'+ this._uI+'","'+this._sd+ '","'+this._sT+'");';

    return sql;
  }

  rpsq(): string {
    let sql='replace into GTD_C_D ' +
      ' (dI,sI,uI,sd,ed,sT) '+
      ' values("'+ this._dI+'","'+ this._sI+'","'+ this._uI+'","'+this._sd+ '","'+this._sT+'");';

    return sql;
  }

  dsq(): string {
    let sql='DELETE FROM GTD_C_D WHERE 1=1 ';
    if(this._dI!=null && this._dI!=''){
      sql=sql+' and dI="' + this._dI +'"';
    }

    return sql;
  }

  csq(): string {
    let sql = 'CREATE TABLE IF NOT EXISTS GTD_C_D(dI VARCHAR(100) PRIMARY KEY,' +
      'sI VARCHAR(100),uI VARCHAR(100),sd VARCHAR(20),' +
      'sT VARCHAR(20));';
    return sql;
  }

  drsq(): string {
    let sql="DROP TABLE IF EXISTS GTD_C_D;"
    return sql;
  }

  get dI(): string {
    return this._dI;
  }

  set dI(value: string) {
    this._dI = value;
  }

  get sI(): string {
    return this._sI;
  }

  set sI(value: string) {
    this._sI = value;
  }

  get uI(): string {
    return this._uI;
  }

  set uI(value: string) {
    this._uI = value;
  }

  get sd(): string {
    if(this._sd != null && this._sd != ''){
      this._sd = this._sd.replace(new RegExp('-','g'),'/');
    }
    return this._sd;
  }

  set sd(value: string) {
    this._sd = value;
  }

  get sT(): string {
    return this._sT;
  }

  set sT(value: string) {
    this._sT = value;
  }


  get yM(): string {
    return this._yM;
  }

  set yM(value: string) {
    this._yM = value;
  }
}
