/**
 * create by on 2018/11/19
 */

//授权联系人表实体
export class RuEntity {

  private _id: string=null;   //UUID
  private _ran:string=null; //别名
  private _rI: string=null;   //关联ID
  private _rN: string=null;          //名称
  private _rC: string=null;    // 联系方式
  private _rF: string=null;     // 授权标识0未授权1授权
  private _rel: string=null; // 联系类型
  /**
   * 创建表
   * @type {string}
   * @private
   */
  private _csq:string = 'CREATE TABLE IF NOT EXISTS GTD_B(id VARCHAR(100) PRIMARY KEY,' +
                          'ran VARCHAR(100),rI VARCHAR(100),rN VARCHAR(10),' +
                          'rC VARCHAR(2),rF VARCHAR(2),rel VARCHAR(20))';
  private _drsq:string="DROP TABLE GTD_B";

  private _isq:string;
  private _usq:string;
  private _dsq:string;
  //查询单个
  private _qosq:string = 'select * from GTD_B where id=' + this._id;

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
    let sql='insert into GTD_B ' +
      '(id,ran,rI,rN,rC,rF,rel) ' +
      'values("'+ this._id+'","'+ this._ran+'","'+this._rI+ '","'+
      this._rN+'","'+ this._rC+'","'+this._rF+'","'+this._rel+'")';
    this._isq=sql;
    return this._isq;
  }

  set isq(value: string) {
    this._isq = value;
  }

  get usq(): string {
    let sql='update GTD_B set';
    if(this._ran!=null){
      sql=sql+' ran="' + this._ran +'",';
    }
    if(this._rI!=null){
      sql=sql+' rI="' + this._rI +'",';
    }
    if(this._rN!=null){
      sql=sql+' rN="' + this._rN +'",';
    }
    if(this._rC!=null){
      sql=sql+' rC="' + this._rC +'",';
    }
    if(this._rF!=null){
      sql=sql+' rF="' + this._rF +'",';
    }
    if(this._rel!=null){
      sql=sql+' rel="' + this._rel +'",';
    }
    if(this._id != null){
      sql = sql + ' _id="' + this._id +'" where _id="' + this._id +'"';
    }
    this._usq=sql;
    return this._usq;
  }
  set usq(value: string) {
    this._usq = value;
  }
  get dsq(): string {
    let sql='DELETE FROM GTD_B WHERE 1=1 ';
    if(this._id!=null){
      sql=sql+' and id="' + this._id +'"';
    }
    if(this._ran!=null){
      sql=sql+' and ran="' + this._ran +'"';
    }
    if(this._rI!=null){
      sql=sql+' and rI="' + this._rI +'"';
    }
    if(this._rN!=null){
      sql=sql+' and rN="' + this._rN +'"';
    }
    if(this._rC!=null){
      sql=sql+' and rC="' + this._rC +'"';
    }
    if(this._rF!=null){
      sql=sql+' and rF="' + this._rF +'"';
    }
    if(this._rel!=null){
      sql=sql+' and rel="' + this._rel +'"';
    }

    this._dsq=sql;
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

  get ran(): string {
    return this._ran;
  }

  set ran(value: string) {
    this._ran = value;
  }

  get rI(): string {
    return this._rI;
  }

  set rI(value: string) {
    this._rI = value;
  }

  get rN(): string {
    return this._rN;
  }

  set rN(value: string) {
    this._rN = value;
  }

  get rC(): string {
    return this._rC;
  }

  set rC(value: string) {
    this._rC = value;
  }

  get rF(): string {
    return this._rF;
  }

  set rF(value: string) {
    this._rF = value;
  }

  get rel(): string {
    return this._rel;
  }

  set rel(value: string) {
    this._rel = value;
  }
}
