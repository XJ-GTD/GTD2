/**
 * create by on 2018/11/19
 */

//更新表
export class FiEntity {

  private _id: number;   //主键
  private _firstIn:number; //版本号
  private _isup: number;//是否更新0暂无更新，1已更新
  /*
   * 创建表
   * @type {string}
   * @private
   */
  private _csq:string = 'CREATE TABLE IF NOT EXISTS GTD_FI(id Integer PRIMARY KEY,' +
                          'firstIn Integer,isup Integer);';
  private _drsq:string="DROP TABLE IF EXISTS GTD_FI;";

  private _isq:string;
  private _usq:string;
  private _dsq:string;
  //查询单个
  private _qosq:string = 'select * from GTD_FI where id=' + this._id;

  get qosq(): string {
    return this._qosq;
  }

  set qosq(value: string) {
    this._qosq = value;
  }

  get isq(): string {
    let sql='insert into GTD_FI ' +
      '(id,firstIn,isup) values('+ this._id+','+ this._firstIn+','+ this._isup+');';
    this._isq=sql;
    return this._isq;
  }

  set isq(value: string) {
    this._isq = value;
  }

  get usq(): string {
    let sql='update GTD_FI set';
    if(this._firstIn!=null){
      sql=sql+' firstIn=' + this._firstIn +',';
    }
    if(this._isup!=null){
      sql=sql+' isup=' + this._isup +',';
    }
    if(this._id != null){
      sql = sql + ' id=' + this._id +' where id=' + this._id;
    }
    this._usq=sql;
    return this._usq;
  }
  set usq(value: string) {
    this._usq = value;
  }
  get dsq(): string {
    let sql='DELETE FROM GTD_FI WHERE 1=1 ';
    if(this._id!=null){
      sql=sql+' and id=' + this._id;
    }
    if(this._firstIn!=null){
      sql=sql+' and firstIn=' + this._firstIn;
    }
    if(this._isup!=null){
      sql=sql+' and isup=' + this._isup;
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

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get firstIn(): number {
    return this._firstIn;
  }

  set firstIn(value: number) {
    this._firstIn = value;
  }

  get isup(): number {
    return this._isup;
  }

  set isup(value: number) {
    this._isup = value;
  }
}
