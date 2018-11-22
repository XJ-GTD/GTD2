/**
 * create by on 2018/11/19
 */

//标签表
export class ZtdEntity {

  private _zt: number=null;   //字典类型
  private _zk: string=null; //字典健值
  private _zkv: string=null;//名称
  private _px: number=0; //排序
  /*
   * 创建表
   * @type {string}
   * @private
   */
  private _csq:string = 'CREATE TABLE IF NOT EXISTS GTD_Y(zt VARCHAR(100) NOT NULL,' +
                          'zk VARCHAR(100) NOT NULL,zkv VARCHAR(10),px INTEGER);';
  private _drsq:string="DROP TABLE GTD_Y"

  private _isq:string;
  private _usq:string;
  private _dsq:string;


  get isq(): string {
    let sql='insert into GTD_Y ' +
      '(sN,lI,uI) values("'+ this._zk+'","'+ this._zkv+'",'+this._px+ ')';
    this._isq=sql;
    return this._isq;
  }

  set isq(value: string) {
    this._isq = value;
  }

  get usq(): string {
    let sql='update GTD_Y set';
    if(this._zk!=null){
      sql=sql+' zk="' + this._zk +'",';
    }
    if(this._zkv!=null){
      sql=sql+' zkv="' + this._zkv +'",';
    }
    if(this._px!=null){
      sql=sql+' _px=' + this._px +',';
    }
    if(this._zt != null){
      sql = sql + ' zt="' + this._zt +'" where zt="' + this._zt +'"';
    }
    this._usq=sql;
    return this._usq;
  }
  set usq(value: string) {
    this._usq = value;
  }
  get dsq(): string {
    let sql='DELETE FROM GTD_Y WHERE 1=1 ';
    if(this._zt!=null){
      sql=sql+' and zt="' + this._zt +'"';
    }
    if(this._zk!=null){
      sql=sql+' and zk="' + this._zk +'"';
    }
    if(this._zkv!=null){
      sql=sql+' and zkv="' + this._zkv +'"';
    }
    if(this._px!=null){
      sql=sql+' and px=' + this._px;
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
  get zt(): number {
    return this._zt;
  }

  set zt(value: number) {
    this._zt = value;
  }

  get zk(): string {
    return this._zk;
  }

  set zk(value: string) {
    this._zk = value;
  }

  get zkv(): string {
    return this._zkv;
  }

  set zkv(value: string) {
    this._zkv = value;
  }

  get px(): number {
    return this._px;
  }

  set px(value: number) {
    this._px = value;
  }
}
