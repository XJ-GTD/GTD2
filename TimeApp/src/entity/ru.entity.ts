/**
 * create by on 2018/11/19
 */

//授权联系人表实体
export class RuEntity {

  private _id: string=''; //UUID
  private _ran:string=''; //别名
  private _ranpy:string=''; //别名拼音
  private _rI: string=''; //关联ID
  private _rN: string=''; //名称
  private _rNpy: string=''; //名称拼音
  private _rC: string=''; // 联系方式
  private _rF: string=''; // 授权标识0未授权1授权
  private _ot:string;//0是未被添加，1是同意，2是拉黑
  private _rel: string=''; // 联系类型0人;1群组
  private _hiu: string=''; // 联系人头像URL
  private _fi: string=''; //联系人发送邀请状态0已发送，1未发送
  /**
   * 创建表
   * @type {string}
   * @private
   */
  private _csq:string = 'CREATE TABLE IF NOT EXISTS GTD_B(id VARCHAR(100) PRIMARY KEY,' +
                          'ran VARCHAR(100),ranpy VARCHAR(100),rI VARCHAR(100),rN VARCHAR(100),' +
                          'rNpy VARCHAR(100),rC VARCHAR(100),rF VARCHAR(2),rel VARCHAR(20),' +
                          'hiu VARCHAR(100),ot VARCHAR(2),fi VARCHAR(2));';
  private _drsq:string="DROP TABLE IF EXISTS GTD_B;";

  private _isq:string;
  private _rpsq:string;
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
      '(id,ran,ranpy,rI,rN,rNpy,rC,rF,rel,hiu,ot,fi) ' +
      'values("'+ this._id+'","'+ this._ran+'","'+ this._ranpy+'","'+this._rI+ '","'+
      this._rN+'","'+this._rNpy+'","'+ this._rC+'","'+this._rF+'","'+this._rel+'","'
      +this._hiu+'","'+this._ot+'","'+this._fi+'")';
    this._isq=sql;
    return this._isq;
  }

  set isq(value: string) {
    this._isq = value;
  }

  get rpsq(): string {
    let sql='replace into GTD_B ' +
      '(id,ran,ranpy,rI,rN,rNpy,rC,rF,rel,hiu,ot,fi) ' +
      'values("'+ this._id+'","'+ this._ran+'","'+ this._ranpy+'","'+this._rI+ '","'+
      this._rN+'","'+this._rNpy+'","'+ this._rC+'","'+this._rF+'","'+this._rel+'","'+
      this._hiu+'","'+this._ot+'","'+this._fi+'");';
    this._rpsq=sql;
    return this._rpsq;
  }

  set rpsq(value: string) {
    this._rpsq = value;
  }

  get usq(): string {
    let sql='update GTD_B set';
    if(this._ran!=null && this._ran!=''){
      sql=sql+' ran="' + this._ran +'",';
    }
    if(this._ranpy!=null && this._ranpy!=''){
      sql=sql+' ranpy="' + this._ranpy +'",';
    }
    if(this._rI!=null && this._rI!=''){
      sql=sql+' rI="' + this._rI +'",';
    }
    if(this._rN!=null && this._rN!=''){
      sql=sql+' rN="' + this._rN +'",';
    }
    if(this._rNpy!=null && this._rNpy!=''){
      sql=sql+' rNpy="' + this._rNpy +'",';
    }
    if(this._rC!=null && this._rC!=''){
      sql=sql+' rC="' + this._rC +'",';
    }
    if(this._rF!=null && this._rF!=''){
      sql=sql+' rF="' + this._rF +'",';
    }
    if(this._rel!=null && this._rel!=''){
      sql=sql+' rel="' + this._rel +'",';
    }
    if(this._hiu!=null && this._hiu!=''){
      sql=sql+' hiu="' + this._hiu +'",';
    }
    if(this._ot!=null && this._ot!=''){
      sql=sql+' ot="' + this._ot +'",';
    }
    if(this._fi!=null && this._fi!=''){
      sql=sql+' fi="' + this._fi +'",';
    }
    if(this._id != null && this._id!=''){
      sql = sql + ' id="' + this._id +'" where id="' + this._id +'"';
    }
    this._usq=sql;
    return this._usq;
  }
  set usq(value: string) {
    this._usq = value;
  }
  get dsq(): string {
    let sql='DELETE FROM GTD_B WHERE 1=1 ';
    if(this._id!=null && this._id!=''){
      sql=sql+' and id="' + this._id +'"';
    }
    if(this._ran!=null && this._ran!=''){
      sql=sql+' and ran="' + this._ran +'"';
    }
    if(this._ranpy!=null && this._ranpy!=''){
      sql=sql+' and ranpy="' + this._ranpy +'"';
    }
    if(this._rI!=null && this._rI!=''){
      sql=sql+' and rI="' + this._rI +'"';
    }
    if(this._rN!=null && this._rN!=''){
      sql=sql+' and rN="' + this._rN +'"';
    }
    if(this._rNpy!=null && this._rNpy!=''){
      sql=sql+' and rNpy="' + this._rNpy +'"';
    }
    if(this._rC!=null && this._rC!=''){
      sql=sql+' and rC="' + this._rC +'"';
    }
    if(this._rF!=null && this._rF!=''){
      sql=sql+' and rF="' + this._rF +'"';
    }
    if(this._rel!=null && this._rel!=''){
      sql=sql+' and rel="' + this._rel +'"';
    }
    if(this._hiu!=null && this._hiu!=''){
      sql=sql+' and hiu="' + this._hiu +'"';
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

  get hiu(): string {
    return this._hiu;
  }

  set hiu(value: string) {
    this._hiu = value;
  }

  get ranpy(): string {
    return this._ranpy;
  }

  set ranpy(value: string) {
    this._ranpy = value;
  }

  get rNpy(): string {
    return this._rNpy;
  }

  set rNpy(value: string) {
    this._rNpy = value;
  }

  get ot(): string {
    return this._ot;
  }

  set ot(value: string) {
    this._ot = value;
  }

  get fi(): string {
    return this._fi;
  }

  set fi(value: string) {
    this._fi = value;
  }
}
