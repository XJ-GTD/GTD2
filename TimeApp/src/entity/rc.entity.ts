/**
 * create by on 2018/11/19
 */

//日程表
export class RcEntity {

  private _sI: string='';   //UUID
  private _sN:string=''; //日程名
  private _lI: string='';   //关联标签ID
  private _uI: string='';          //创建人ID
  private _sd:string=''; //开始时间
  private _ed:string = ''; //结束时间
  private _ji:string=''; //计划ID
  private _ib: string='';  //是否本地:0非本地；1本地日历 默认非本地
  private _bi: string=''; //本地日程id
  private _fi: string=''; //日程发送状态0已发送，1未发送
  private _orgI: string=''; //初始日程id
  private _df: string=''; //删除状态0：未删除，1：以被删除
  /*
   * 创建表
   * @type {string}
   * @private
   */
  private _csq:string = 'CREATE TABLE IF NOT EXISTS GTD_C(sI VARCHAR(100) PRIMARY KEY,' +
                          'sN VARCHAR(100),lI VARCHAR(10),uI VARCHAR(100),sd VARCHAR(20),' +
    'ed VARCHAR(20),ji VARCHAR(20),ib VARCHAR(20),bi VARCHAR(200),fi VARCHAR(20),orgI VARCHAR(100),df VARCHAR(2));';
  private _drsq:string="DROP TABLE IF EXISTS GTD_C;"

  private _isq:string;
  private _rpsq:string;
  private _usq:string;
  private _dsq:string;
  //查询单个
  private _qosq:string;

  get qosq(): string {
    this._qosq = 'select * from GTD_C where sI=' + this._sI;
    return this._qosq;
  }

  set qosq(value: string) {
    this._qosq = value;
  }

  get isq(): string {
    let field='sI';
    let values = '"'+this._sI+'"';
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
    if(this._fi!=null && this._fi!=''){
      field=field+',fi';
      values =values+ ',"'+this._fi+'"'
    }
    if(this._df!=null && this._df!=''){
      field=field+',df';
      values =values+ ',"'+this._df+'"'
    }
    if(this._orgI!=null && this._orgI!=''){
      field=field+',orgI';
      values =values+ ',"'+this._orgI+'"'
    }
    let sql='insert into GTD_C ' +
      '('+field+') values('+ values+')';
    this._isq=sql;
    return this._isq;
  }

  set isq(value: string) {
    this._isq = value;
  }
  get rpsq(): string {
    let sql='replace into GTD_C ' +
      '(sI,sN,lI,uI,sd,ed,ji,ib,bi,fi,orgI) values("'+ this._sI+'","'+ this._sN+'","'+this._lI+ '","'+ this._uI
      +'","'+this._sd+ '","'+ this._ed+'","'+ this._ji+'","'+ this._ib+'","'+ this._bi+'","'+ this._fi+'","'+ this._orgI+'");';
    this._rpsq=sql;
    return this._rpsq;
  }

  set rpsq(value: string) {
    this._rpsq = value;
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
    if(this._fi!=null && this._fi!=''){
      sql=sql+' fi="' + this._fi +'",';
    }
    if(this._df!=null && this._df!=''){
      sql=sql+' df="' + this._df +'",';
    }
    if(this._fi!=null && this._fi!=''){
      sql=sql+' fi="' + this._fi +'",';
    }
    let str = sql.substr(sql.length-1,sql.length);
    if(str == ','){
      sql = sql.substr(0,sql.length-1);
    }
    if(this._sI != null && this._sI!=''){
      sql = sql +' where sI="' + this._sI +'"';
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
    if(this._sd != null && this._sd != ''){
      this._sd = this._sd.replace(new RegExp('-','g'),'/');
    }
    return this._sd;
  }

  set sd(value: string) {
    this._sd = value;
  }

  get ed(): string {
    if(this._ed != null && this._ed != ''){
      this._ed= this._ed.replace(new RegExp('-','g'),'/');
    }
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
  get ib(): string {
    return this._ib;
  }

  set ib(value: string) {
    this._ib = value;
  }

  get bi(): string {
    return this._bi;
  }

  set bi(value: string) {
    this._bi = value;
  }

  get fi(): string {
    return this._fi;
  }

  set fi(value: string) {
    this._fi = value;
  }

  get orgI(): string {
    return this._orgI;
  }

  set orgI(value: string) {
    this._orgI = value;
  }

  get df(): string {
    return this._df;
  }

  set df(value: string) {
    this._df = value;
  }
}
