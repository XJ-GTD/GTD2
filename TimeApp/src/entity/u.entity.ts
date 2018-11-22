/**
 * create by on 2018/11/19
 */

//用户类
export class UEntity {

  private _uI: string=null;   //用户ID
  private _oUI:string=null; //原用户ID
  private _uN: string=null;   //昵称
  private _hIU: string=null;          //头像URL
  private _biy: string=null;    // 生日
  private _uS: string=null;     // 性别
  private _uCt: string=null; // 联系方式
  private _aQ: string=null;    //消息队列
  private _uT:string=null; //token
  private _uty:string=null;//0游客1正式用户
  /**
   * 创建表
   * @type {string}
   * @private
   */
  private _csq:string = 'CREATE TABLE IF NOT EXISTS GTD_A(uI VARCHAR(100) PRIMARY KEY,' +
                          'uN VARCHAR(100),iC VARCHAR(100),biy VARCHAR(10),' +
                          'uS VARCHAR(2),uC VARCHAR(20),aQ VARCHAR(20),'+
                          'uTy VARCHAR(2),uT VARCHAR(200),hIU VARCHAR(300));';
  private _drsq:string="DROP TABLE GTD_A"

  private _isq:string;
  private _usq:string;
  private _dsq:string;
  //查询单个
  private _qosq:string = 'select * from GTD_A where uI=' + this._uI;

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
    let sql='insert into GTD_A ' +
      '(uI,uN,biy,uT,hIU,uC,aQ,uty) ' +
      'values("'+ this._uI+ '","'+ this._uN+'","'+ this._biy+'","'+this.uT+ '","'+
      this._hIU+'","'+ this._uCt+'","'+this._aQ+'","'+this._uty+'")';
    this._isq=sql;
    return this._isq;
  }

  set isq(value: string) {
    this._isq = value;
  }

  get usq(): string {
    let sql='update GTD_A set';
    if(this._uN!=null){
      sql=sql+' uN="' + this._uN +'",';
    }
    if(this.biy!=null){
      sql=sql+' biy="' + this.biy +'",';
    }
    if(this._uT!=null){
      sql=sql+' uT="' + this._uT +'",';
    }
    if(this._hIU!=null){
      sql=sql+' hIU="' + this._hIU +'",';
    }
    if(this._uCt!=null){
      sql=sql+' uCt="' + this._uCt +'",';
    }
    if(this._aQ!=null){
      sql=sql+' aQ="' + this._aQ +'",';
    }
    if(this._uS!=null){
      sql=sql+' uS="' + this._uS +'",';
    }
    if(this._oUI != null){
      sql = sql + ' uI="' + this._oUI +'" where uI="' + this._uI +'"';
    }else{
      sql = sql + ' uI="' + this._uI +'" where uI="' + this._uI +'"';
    }
    this._usq=sql;
    return this._usq;
  }

  set usq(value: string) {
    this._usq = value;
  }

  get dsq(): string {
    let sql='DELETE FROM GTD_A WHERE 1=1 ';
    if(this._uN!=null){
      sql=sql+' and uN="' + this._uN +'"';
    }
    if(this.biy!=null){
      sql=sql+' and biy="' + this.biy +'"';
    }
    if(this._uT!=null){
      sql=sql+' and uT="' + this._uT +'"';
    }
    if(this._hIU!=null){
      sql=sql+' and hIU="' + this._hIU +'"';
    }
    if(this._uCt!=null){
      sql=sql+' and uCt="' + this._uCt +'"';
    }
    if(this._aQ!=null){
      sql=sql+' and aQ="' + this._aQ +'"';
    }
    if(this._uS!=null){
      sql=sql+' and uS="' + this._uS +'"';
    }
    if(this._uI != null){
      sql = sql + ' and uI="' + this._uI +'"';
    }
    this._dsq=sql;
    return this._dsq;
  }

  set dsq(value: string) {
    this._dsq = value;
  }

  get uI(): string {
    return this._uI;
  }

  set uI(value: string) {
    this._uI = value;
  }

  get oUI(): string {
    return this._oUI;
  }

  set oUI(value: string) {
    this._oUI = value;
  }

  get uN(): string {
    return this._uN;
  }

  set uN(value: string) {
    this._uN = value;
  }

  get hIU(): string {
    return this._hIU;
  }

  set hIU(value: string) {
    this._hIU = value;
  }

  get biy(): string {
    return this._biy;
  }

  set biy(value: string) {
    this._biy = value;
  }

  get uS(): string {
    return this._uS;
  }

  set uS(value: string) {
    this._uS = value;
  }

  get uCt(): string {
    return this._uCt;
  }

  set uCt(value: string) {
    this._uCt = value;
  }

  get aQ(): string {
    return this._aQ;
  }

  set aQ(value: string) {
    this._aQ = value;
  }

  get uT(): string {
    return this._uT;
  }

  set uT(value: string) {
    this._uT = value;
  }

  get uty(): string {
    return this._uty;
  }

  set uty(value: string) {
    this._uty = value;
  }
}
