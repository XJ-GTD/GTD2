/**
 * create by on 2018/11/19
 */

//日程表
export class RcEntity {

  private _sI: string=null;   //UUID
  private _sN:string=null; //日程名
  private _lI: string=null;   //关联标签ID
  private _uI: string=null;          //创建人ID
  private _sd:string=null; //开始时间
  private _ed:string = null; //结束时间
  private _ji:string=null; //计划ID
  /*
   * 创建表
   * @type {string}
   * @private
   */
  private _csq:string = 'CREATE TABLE IF NOT EXISTS GTD_C(sI VARCHAR(100) PRIMARY KEY,' +
                          'sN VARCHAR(100),lI VARCHAR(10),uI VARCHAR(100),sd VARCHAR(20),' +
    'ed VARCHAR(20),ji VARCHAR(20));';
  private _drsq:string="DROP TABLE IF EXISTS GTD_C;"

  private _isq:string;
  private _usq:string;
  private _dsq:string;
  //查询单个
  private _qosq:string = 'select * from GTD_C where sI=' + this._sI;

  get qosq(): string {
    return this._qosq;
  }

  set qosq(value: string) {
    this._qosq = value;
  }

  get isq(): string {
    let field='sI'
    let values = '"'+this._sI+'"'
    if(this._sN!=null && this._sN!=''){
      field=field+',sN';
      values =values+  ',"'+this._sN+'"'
    }
    if(this._lI!=null && this._lI!=''){
      field=field+',lI';
      values =values+  ',"'+this._lI+'"'
    }
    if(this._uI!=null && this._uI!=''){
      field=field+',uI';
      values = values+ ',"'+this._uI+'"'
    }
    if(this._sd!=null && this._sd!=''){
      field=field+',sd';
      values = values+ ',"'+this._sd+'"'
    }
    if(this._ed!=null && this._ed!=''){
      field=field+',ed';
      values =values+  ',"'+this._ed+'"'
    }
    if(this._ji!=null && this._ji!=''){
      field=field+',ji';
      values =values+ ',"'+this._ji+'"'
    }
    let sql='insert into GTD_C ' +
      '('+field+') values('+ values+')';
    this._isq=sql;
    return this._isq;
  }

  set isq(value: string) {
    this._isq = value;
  }

  get usq(): string {
    let sql='update GTD_C set';
    if(this._sN!=null && this._sN!=''){
      sql=sql+' sN="' + this._sN +'",';
    }
    if(this._lI!=null && this._lI!=''){
      sql=sql+' lI="' + this._lI +'",';
    }
    if(this._uI!=null && this._uI!=''){
      sql=sql+' uI="' + this._uI +'",';
    }
    if(this._sd!=null && this._sd!=''){
      sql=sql+' sd="' + this._sd +'",';
    }
    if(this._ed!=null && this._ed!=''){
      sql=sql+' ed="' + this._ed +'",';
    }
    if(this._ji!=null && this._ji!=''){
      sql=sql+' ji="' + this._ji +'",';
    }
    let str = sql.substr(sql.length-1,sql.length);
    if(str == ','){
      sql = sql.substr(0,sql.length-1);
    }
    if(this._sI != null && this._sI!=''){
      sql = sql +'" where sI="' + this._sI +'"';
    }

    this._usq=sql;
    return this._usq;
  }
  set usq(value: string) {
    this._usq = value;
  }
  get dsq(): string {
    let sql='DELETE FROM GTD_C WHERE 1=1 ';
    if(this._sI!=null && this._sI!=''){
      sql=sql+' and sI="' + this._sI +'"';
    }
    if(this._sN!=null && this._sN!=''){
      sql=sql+' and sN="' + this._sN +'"';
    }
    if(this._lI!=null && this._lI!=''){
      sql=sql+' and lI="' + this._lI +'"';
    }
    if(this._uI!=null && this._uI!=''){
      sql=sql+' and uI="' + this._uI +'"';
    }
    if(this._sd!=null && this._sd!=''){
      sql=sql+' and sd="' + this._sd +'"';
    }
    if(this._ed!=null && this._ed!=''){
      sql=sql+' and ed="' + this._ed +'"';
    }
    if(this._ji!=null && this._ji!=''){
      sql=sql+' and ji="' + this._ji +'"';
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

  get sI(): string {
    return this._sI;
  }

  set sI(value: string) {
    this._sI = value;
  }

  get sN(): string {
    return this._sN;
  }

  set sN(value: string) {
    this._sN = value;
  }

  get lI(): string {
    return this._lI;
  }

  set lI(value: string) {
    this._lI = value;
  }

  get uI(): string {
    return this._uI;
  }

  set uI(value: string) {
    this._uI = value;
  }


  get sd(): string {
    return this._sd;
  }

  set sd(value: string) {
    this._sd = value;
  }

  get ed(): string {
    return this._ed;
  }

  set ed(value: string) {
    this._ed = value;
  }

  get ji(): string {
    return this._ji;
  }

  set ji(value: string) {
    this._ji = value;
  }
}
