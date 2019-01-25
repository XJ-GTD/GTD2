/**
 * create by on 2018/11/19
 */

//Message消息表
export class MsEntity {

  private _mi: number; //UmtD
  private _mn:string=''; //message内容
  private _md: string=''; //发布时间
  private _mt: string=''; //类型0日程
  private _mf: string=''; //状态0未读，1已读
  private _rI: string=''; //关联ID
  /*
   * 创建表
   * @type {string}
   * @private
   */
  private _csq:string = 'CREATE TABLE IF NOT EXISTS GTD_H(mi INTEGER PRIMARY KEY AUTOINCREMENT,' +
                          'mn VARCHAR(100),md VARCHAR(20),mt VARCHAR(100),mf VARCHAR(2),rI VARCHAR(200));';
  private _drsq:string="DROP TABLE IF EXISTS GTD_H;";

  private _isq:string;
  private _usq:string;
  private _dsq:string;
//查询单个
  private _qosq:string = 'select * from GTD_H where mi=' + this._mi;

  get qosq(): string {
    return this._qosq;
  }

  set qosq(value: string) {
    this._qosq = value;
  }

  get isq(): string {
    let sql='insert into GTD_H ' +
      '(mn,md,mt,mf,rI) values("'+ this._mn+'","'+this._md+ '","'+ this._mt+'","'+this._mf+ '","'+ this._rI+'")';
    this._isq=sql;
    return this._isq;
  }

  set isq(value: string) {
    this._isq = value;
  }

  get usq(): string {
    let sql='update GTD_H set';
    if(this._mn!=null){
      sql=sql+' mn="' + this._mn +'",';
    }
    if(this._md!=null){
      sql=sql+' md="' + this._md +'",';
    }
    if(this._mt!=null){
      sql=sql+' mt="' + this._mt +'",';
    }
    let str = sql.substr(sql.length-1,sql.length);
    if(str == ','){
      sql = sql.substr(0,sql.length-1);
    }
    if(this._mi != null){
      sql = sql + ' where mi="' + this._mi +'"';
    }
    this._usq=sql;
    return this._usq;
  }
  set usq(value: string) {
    this._usq = value;
  }
  get dsq(): string {
    let sql='DELETE FROM GTD_H WHERE 1=1 ';
    if(this._mi!=null){
      sql=sql+' and mi="' + this._mi +'"';
    }
    if(this._mn!=null){
      sql=sql+' and mn="' + this._mn +'"';
    }
    if(this._md!=null){
      sql=sql+' and md="' + this._md +'"';
    }
    if(this._mt!=null){
      sql=sql+' and mt="' + this._mt +'"';
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


  get mi(): number {
    return this._mi;
  }

  set mi(value: number) {
    this._mi = value;
  }

  get mn(): string {
    return this._mn;
  }

  set mn(value: string) {
    this._mn = value;
  }

  get md(): string {
    return this._md;
  }

  set md(value: string) {
    value = value.replace(new RegExp('-','g'),'/');
    this._md = value;
  }

  get mt(): string {
    return this._mt;
  }

  set mt(value: string) {
    this._mt = value;
  }

  get mf(): string {
    return this._mf;
  }

  set mf(value: string) {
    this._mf = value;
  }

  get rI(): string {
    return this._rI;
  }

  set rI(value: string) {
    this._rI = value;
  }
}
