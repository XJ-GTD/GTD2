/**
 * create by on 2018/11/19
 */

//日程标签表-日程标签（聚会、会议、事件、预约、运动）
export class RcbthEntity {

  private _sI:string='';   //UUID
  private _id:string=''; //主键
  private _tk:string='';  //标签key值
  private _cft:string=''; //重复类型：0日，1周，2月，3年
  private _dt:string=''; //日期（具体到天）
  private _wd:string = ''; //完成时间
  private _cf:string='';  //是否重复：0否1是
  private _rm:string=''; //备注
  private _ac:string=''; //提醒方式
  private _fh:string=''; //是否完成0否1是
  /*
   * 创建表
   * @type {string}
   * @private
   */
  private _csq:string = 'CREATE TABLE IF NOT EXISTS GTD_C_RC(sI VARCHAR(100) PRIMARY KEY,' +
                          'id VARCHAR(100),tk VARCHAR(10),cf VARCHAR(2),cft VARCHAR(20),dt VARCHAR(20),' +
    'wd VARCHAR(20),rm VARCHAR(100),ac VARCHAR(2),fh VARCHAR(2));';
  private _drsq:string="DROP TABLE IF EXISTS GTD_C_RC;"

  private _isq:string;
  private _usq:string;
  private _dsq:string;
  //查询单个
  private _qosq:string = 'select * from GTD_C_RC where sI="' + this._sI+'"';

  get qosq(): string {
    return this._qosq;
  }

  set qosq(value: string) {
    this._qosq = value;
  }

  get isq(): string {
    let sql='insert into GTD_C_RC ' +
      '(sI,id,tk,cf,cft,dt,wd,rm,ac,fh) values("'+ this._sI+'","'+ this._id+'","'+this._tk+ '","'+ this._cf
      +'","'+this._cft+ '","'+ this._dt+'","'+ this._wd+'","'+ this._rm+'","'+ this._ac+'","'+ this._fh+'")';
    this._isq=sql;
    return this._isq;
  }

  set isq(value: string) {
    this._isq = value;
  }

  get usq(): string {
    let sql='update GTD_C_RC set';
    if(this._id!=null){
      sql=sql+' id="' + this._id +'",';
    }
    if(this._tk!=null){
      sql=sql+' tk="' + this._tk +'",';
    }
    if(this._cf!=null){
      sql=sql+' cf="' + this._cf +'",';
    }
    if(this._cft!=null){
      sql=sql+' cft="' + this._cft +'",';
    }
    if(this._dt!=null){
      sql=sql+' dt="' + this._dt +'",';
    }
    if(this._wd!=null){
      sql=sql+' wd="' + this._wd +'",';
    }
    if(this._rm!=null){
      sql=sql+' rm="' + this._rm +'",';
    }
    if(this._ac!=null){
      sql=sql+' ac="' + this._ac +'",';
    }
    if(this._fh!=null){
      sql=sql+' fh="' + this._fh +'",';
    }
    if(this._sI != null){
      sql = sql + ' sI="' + this._sI +'" where sI="' + this._sI +'"';
    }
    this._usq=sql;
    return this._usq;
  }
  set usq(value: string) {
    this._usq = value;
  }
  get dsq(): string {
    let sql='DELETE FROM GTD_C_RC WHERE 1=1 ';
    if(this._sI!=null){
      sql=sql+' and sI="' + this._sI +'"';
    }
    if(this._id!=null){
      sql=sql+' and id="' + this._id +'"';
    }
    if(this._tk!=null){
      sql=sql+' and tk="' + this._tk +'"';
    }
    if(this._cf!=null){
      sql=sql+' and cf="' + this._cf +'"';
    }
    if(this._cft!=null){
      sql=sql+' and cft="' + this._cft +'"';
    }
    if(this._wd!=null){
      sql=sql+' and wd="' + this._wd +'"';
    }
    if(this._rm!=null){
      sql=sql+' and rm="' + this._rm +'"';
    }

    this._dsq=sql+';';
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

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get tk(): string {
    return this._tk;
  }

  set tk(value: string) {
    this._tk = value;
  }

  get cf(): string {
    return this._cf;
  }

  set cf(value: string) {
    this._cf = value;
  }


  get cft(): string {
    return this._cft;
  }

  set cft(value: string) {
    this._cft = value;
  }

  get wd(): string {
    return this._wd;
  }

  set wd(value: string) {
    this._wd = value;
  }

  get rm(): string {
    return this._rm;
  }

  set rm(value: string) {
    this._rm = value;
  }

  get dt(): string {
    return this._dt;
  }

  set dt(value: string) {
    this._dt = value;
  }

  get ac(): string {
    return this._ac;
  }

  set ac(value: string) {
    this._ac = value;
  }

  get fh(): string {
    return this._fh;
  }

  set fh(value: string) {
    this._fh = value;
  }
}
