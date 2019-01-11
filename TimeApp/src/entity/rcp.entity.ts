/**
 * create by on 2018/11/19
 */

//日程参与表
export class RcpEntity {

  private _pI: string='';//日程参与人表uuID
  private _sI: string='';   //关联日程UUID
  private _son:string=''; //日程别名
  private _sa: string='';   //修改权限 0不可修改，1可修改
  private _ps:string=''; //完成状态
  private _cd:string='';  //创建时间
  private _pd: string='';   //完成时间
  private _uI: string='';  //参与人用户ID
  private _rui: string='';  //联系人ID
  private _ib: string='0';  //是否本地:0非本地；1本地日历 默认非本地
  private _bi: string=''; //本地日程id
  private _sdt: number = 0; //日程是否发送状态;0未发送，1同意发送，2拒绝发送，3未注册
  /*
   * 创建表
   * @type {string}
   * @private
   */
  private _csq:string = 'CREATE TABLE IF NOT EXISTS GTD_D(pI VARCHAR(100) PRIMARY KEY,sI VARCHAR(100),' +
                          'son VARCHAR(100),sa VARCHAR(2),ps VARCHAR(2),cd VARCHAR(20),pd VARCHAR(20),' +
    'uI VARCHAR(100),rui VARCHAR(100),ib VARCHAR(2),bi VARCHAR(20),sdt INTEGER);';
  private _drsq:string="DROP TABLE IF EXISTS GTD_D;";

  private _isq:string;
  private _rpsq:string;
  private _usq:string;
  private _dsq:string;
  //查询单个
  private _qosq:string = 'select * from GTD_D where pI=' + this._pI;

  get qosq(): string {
    return this._qosq;
  }

  set qosq(value: string) {
    this._qosq = value;
  }

  get isq(): string {
    let sql='insert into GTD_D ' +
      '(pI,sI,son,sa,ps,cd,pd,uI,rui,ib,bi,sdt) values("'+ this._pI+'","'+ this._sI+'","'+ this._son+'","'
      +this._sa+ '","'+this._ps+ '","'+this._cd+ '","'+this._pd+ '","'+ this._uI+'","'+ this._rui+'","'
      + this._ib+'","'+this._bi+'",'+this._sdt+');';
    this._isq=sql;
    return this._isq;
  }
  get rpsq(): string {
    let sql='replace into GTD_D ' +
      '(pI,sI,son,sa,ps,cd,pd,uI,rui,ib,bi,sdt) values("'+ this._pI+'","'+ this._sI+'","'+ this._son+'","'
      +this._sa+ '","'+this._ps+ '","'+this._cd+ '","'+this._pd+ '","'+ this._uI+'","'+ this._rui+'","'
      + this._ib+'","'+this._bi+'",'+this._sdt+');';
    this._rpsq=sql;
    return this._rpsq;
  }

  set rpsq(value: string) {
    this._rpsq = value;
  }
  set isq(value: string) {
    this._isq = value;
  }

  get usq(): string {
    let sql='update GTD_D set';
    if(this._sI!=null && this._sI!=''){
      sql=sql+' sI="' + this._sI +'",';
    }
    if(this._son!=null && this._son!=''){
      sql=sql+' son="' + this._son +'",';
    }
    if(this._sa!=null && this._sa!=''){
      sql=sql+' sa="' + this._sa +'",';
    }
    if(this._ps!=null && this._ps!=''){
      sql=sql+' ps="' + this._ps +'",';
    }
    if(this._cd!=null && this._cd!=''){
      sql=sql+' cd="' + this._cd +'",';
    }
    if(this._pd!=null && this._pd!=''){
      sql=sql+' pd="' + this._pd +'",';
    }
    if(this._uI!=null && this._uI!=''){
      sql=sql+' uI="' + this._uI +'",';
    }
    if(this._ib!=null && this._ib!=''){
      sql=sql+' ib="' + this._ib +'",';
    }
    if(this._bi!=null && this._bi!=''){
      sql=sql+' bi="' + this._bi +'",';
    }
    if(this._rui!=null && this._rui!=''){
      sql=sql+' rui="' + this._rui +'",';
    }
    if(this._sdt!=null){
      sql=sql+' sdt=' + this._sdt+',';
    }
    let str = sql.substr(sql.length-1,sql.length);
    if(str == ','){
      sql = sql.substr(0,sql.length-1);
    }
    if(this._pI != null && this._pI!=''){
      sql = sql + ' where pI="' + this._pI +'"';
    }else if(this._sI!=null && this._sI!=''){
      sql = sql  +' where sI="' + this._sI +'"';
    }
    this._usq=sql;
    return this._usq;
  }
  set usq(value: string) {
    this._usq = value;
  }
  get dsq(): string {
    let sql='DELETE FROM GTD_D WHERE 1=1 ';
    if(this._sI!=null && this._sI!=''){
      sql=sql+' and sI="' + this._sI +'"';
    }
    if(this._pI!=null && this._pI!=''){
      sql=sql+' and pI="' + this._pI +'"';
    }
    if(this._son!=null && this._son!=''){
      sql=sql+' and son="' + this._son +'"';
    }
    if(this._sa!=null && this._sa!=''){
      sql=sql+' and sa="' + this._sa +'"';
    }
    if(this._ps!=null && this._ps!=''){
      sql=sql+' and ps="' + this._ps +'"';
    }
    if(this._cd!=null && this._cd!=''){
      sql=sql+' and cd="' + this._cd +'"';
    }
    if(this._pd!=null && this._pd!=''){
      sql=sql+' and pd="' + this._pd +'"';
    }
    if(this._uI!=null && this._uI!=''){
      sql=sql+' and uI="' + this._uI +'"';
    }
    if(this._ib!=null && this._ib!=''){
      sql=sql+' and ib="' + this._ib +'"';
    }
    if(this._bi!=null && this._bi!=''){
      sql=sql+' and bi="' + this._bi +'"';
    }
    if(this._rui!=null && this._rui!=''){
      sql=sql+' and rui="' + this._rui +'"';
    }
    if(this._sdt!=null){
      sql=sql+' and sdt=' + this._sdt;
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

  get pI(): string {
    return this._pI;
  }

  set pI(value: string) {
    this._pI = value;
  }

  get sI(): string {
    return this._sI;
  }

  set sI(value: string) {
    this._sI = value;
  }

  get son(): string {
    return this._son;
  }

  set son(value: string) {
    this._son = value;
  }

  get sa(): string {
    return this._sa;
  }

  set sa(value: string) {
    this._sa = value;
  }

  get ps(): string {
    return this._ps;
  }

  set ps(value: string) {
    this._ps = value;
  }

  get pd(): string {
    return this._pd;
  }

  set pd(value: string) {
    this._pd = value;
  }

  get uI(): string {
    return this._uI;
  }

  set uI(value: string) {
    this._uI = value;
  }

  get ib(): string {
    return this._ib;
  }

  set ib(value: string) {
    this._ib = value;
  }

  get cd(): string {
    return this._cd;
  }

  set cd(value: string) {
    this._cd = value;
  }
  get rui(): string {
    return this._rui;
  }

  set rui(value: string) {
    this._rui = value;
  }

  get bi(): string {
    return this._bi;
  }

  set bi(value: string) {
    this._bi = value;
  }

  get sdt(): number {
    return this._sdt;
  }

  set sdt(value: number) {
    this._sdt = value;
  }
}
