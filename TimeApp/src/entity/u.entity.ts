/**
 * create by on 2018/11/19
 */

//用户类
export class UEntity {

  private _uI: string='';   //用户ID
  private _oUI:string=''; //原用户ID
  private _uN: string='';   //昵称
  private _hIU: string='';          //头像URL
  private _rn: string='';   //真实姓名
  private _iC:string=''; //身份证
  private _biy: string='';    // 生日
  private _uS: string='';     // 性别
  private _uCt: string=''; // 联系方式
  private _aQ: string='';    //消息队列
  private _uT:string=''; //token
  private _uty:string='';//0游客1正式用户
  private _uc:string='';//账号
  /**
   * 创建表
   * @type {string}
   * @private
   */
  private _csq:string = 'CREATE TABLE IF NOT EXISTS GTD_A(uI VARCHAR(100) PRIMARY KEY,' +
                          'uN VARCHAR(100),hIU VARCHAR(300),rn VARCHAR(50),iC VARCHAR(100),biy VARCHAR(10),' +
                          'uS VARCHAR(2),uCt VARCHAR(20),aQ VARCHAR(20),'+
                          'uT VARCHAR(200),uty VARCHAR(2),uc VARCHAR(30));';
  private _drsq:string="DROP TABLE IF EXISTS GTD_A;"

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
    let field = 'uI';
    let values = '"'+this._uI+'"';
    if(this._uN != null && this._uN != ''){
      field+=',uN';
      values = values+',"'+this._uN+'"';
    }
    if(this._biy != null && this._biy != ''){
      field+=',biy';
      values = values+',"'+this._biy+'"';
    }
    if(this._uT != null && this._uT != ''){
      field+=',uT';
      values = values+',"'+this._uT+'"';
    }
    if(this._hIU != null && this._hIU != ''){
      field+=',hIU';
      values = values+',"'+this._hIU+'"';
    }
    if(this._uCt != null && this._uCt != ''){
      field+=',uCt';
      values = values+',"'+this._uCt+'"';
    }
    if(this._aQ != null && this._aQ != ''){
      field+=',aQ';
      values = values+',"'+this._aQ+'"';
    }
    if(this._uty != null && this._uty != ''){
      field+=',uty';
      values = values+',"'+this._uty+'"';
    }
    if(this._rn != null && this._rn != ''){
      field+=',rn';
      values = values+',"'+this._rn+'"';
    }
    if(this._iC != null && this._iC != ''){
      field+=',iC';
      values = values+',"'+this._iC+'"';
    }
    if(this._uc != null && this._uc != ''){
      field+=',uc';
      values = values+',"'+this._uc+'"';
    }
    let sql='insert into GTD_A ('+field+') values('+ values +');';
    this._isq=sql;
    return this._isq;
  }

  set isq(value: string) {
    this._isq = value;
  }

  get usq(): string {
    let sql='update GTD_A set';
    if(this._uN!=null && this._uN!=''){
      sql=sql+' uN="' + this._uN +'",';
    }
    if(this._biy!=null && this._biy!=''){
      sql=sql+' biy="' + this._biy +'",';
    }
    if(this._uT!=null && this._uT!=''){
      sql=sql+' uT="' + this._uT +'",';
    }
    if(this._hIU!=null && this._hIU!=''){
      sql=sql+' hIU="' + this._hIU +'",';
    }
    if(this._uCt!=null && this._uCt!=''){
      sql=sql+' uCt="' + this._uCt +'",';
    }
    if(this._aQ!=null && this._aQ!=''){
      sql=sql+' aQ="' + this._aQ +'",';
    }
    if(this._uS!=null && this._uS!=''){
      sql=sql+' uS="' + this._uS +'",';
    }
    if(this._uc!=null && this._uc!=''){
      sql=sql+' uc="' + this._uc +'",';
    }
    if(this._iC!=null && this._iC!=''){
      sql=sql+' iC="' + this._iC +'",';
    }
    if(this._rn!=null && this._rn!=''){
      sql=sql+' rn="' + this._rn +'",';
    }
    if(this._uty!=null && this._uty!=''){
      sql=sql+' uty="' + this._uty +'",';
    }
    if(this._oUI != null && this._oUI!=''){
      sql = sql + ' uI="' + this._uI +'" where uI="' + this._oUI +'";';
    }else{
      sql = sql + ' uI="' + this._uI +'" where uI="' + this._uI +'";';
    }
    this._usq=sql;
    return this._usq;
  }

  set usq(value: string) {
    this._usq = value;
  }

  get dsq(): string {
    let sql='DELETE FROM GTD_A WHERE 1=1 ';
    if(this._uN!=null && this._uN!=''){
      sql=sql+' and uN="' + this._uN +'"';
    }
    if(this._biy!=null && this._biy!=''){
      sql=sql+' and biy="' + this._biy +'"';
    }
    if(this._uT!=null && this._uT!=''){
      sql=sql+' and uT="' + this._uT +'"';
    }
    if(this._hIU!=null && this._hIU!=''){
      sql=sql+' and hIU="' + this._hIU +'"';
    }
    if(this._uCt!=null && this._uCt!=''){
      sql=sql+' and uCt="' + this._uCt +'"';
    }
    if(this._aQ!=null && this._aQ!=''){
      sql=sql+' and aQ="' + this._aQ +'"';
    }
    if(this._uS!=null && this._uS!=''){
      sql=sql+' and uS="' + this._uS +'"';
    }
    if(this._uI != null && this._uI!=''){
      sql = sql + ' and uI="' + this._uI +'"';
    }
    if(this._uc!=null && this._uc!=''){
      sql=sql+' and uc="' + this._uc +'"';
    }
    if(this._iC != null && this._iC!=''){
      sql = sql + ' and iC="' + this._iC +'"';
    }
    if(this._rn != null && this._rn!=''){
      sql = sql + ' and rn="' + this._rn +'"';
    }
    this._dsq=sql+";";
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

  get iC(): string {
    return this._iC;
  }

  set iC(value: string) {
    this._iC = value;
  }

  get uc(): string {
    return this._uc;
  }

  set uc(value: string) {
    this._uc = value;
  }

  get rn(): string {
    return this._rn;
  }

  set rn(value: string) {
    this._rn = value;
  }
}
