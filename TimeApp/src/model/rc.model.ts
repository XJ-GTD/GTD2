/**
 * create by on 2018/11/19
 */
import {BsModel} from "./out/bs.model";
import {RguModel} from "./rgu.model";
import {RuModel} from "./ru.model";

//日程表
export class RcModel extends BsModel{

  private _sI: string='';   //UUID
  private _sN:string=''; //日程名
  private _lI: string='';   //关联标签ID
  private _lan: string='';   //关联标签名称
  private _ji: string='';   //关联计划ID
  private _jn: string='';   //关联计划名称
  private _uI: string='';          //创建人ID
  private _sd:string=''; //开始时间
  private _ed:string = ''; //结束时间
  private _orgI: string=''; //初始日程id
  private _df: string=''; //删除状态0：未删除，1：以被删除

  private _sa:string = ''; //修改权限 0不可修改，1可修改
  private _pI: string='';//日程参与人表uuID
  private _son: string='';//日程别名
  private _rus : Array<RuModel> //联系人
  //标签数据
  private _subId:string=''; //子表ID
  private _cft:string=''; //重复类型
  private _ac:string=''; //提醒方式
  private _fh:string=''; //完成情况
  private _dt:string=''; //日期（具体到天）
  private _wd:string = ''; //完成时间
  private _rm:string=''; //备注

  //本地日历
  private _ib: string='0';  //是否本地:0非本地；1本地日历 默认非本地
  private _bi: string=''; //本地日程id

  //mq
  private _noca:string;
  private _nocb:string;
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

  get lan(): string {
    return this._lan;
  }

  set lan(value: string) {
    this._lan = value;
  }

  get ji(): string {
    return this._ji;
  }

  set ji(value: string) {
    this._ji = value;
  }

  get jn(): string {
    return this._jn;
  }

  set jn(value: string) {
    this._jn = value;
  }

  get sa(): string {
    return this._sa;
  }

  set sa(value: string) {
    this._sa = value;
  }

  get pI(): string {
    return this._pI;
  }

  set pI(value: string) {
    this._pI = value;
  }

  get rus(): Array<RuModel> {
    return this._rus;
  }

  set rus(value: Array<RuModel>) {
    this._rus = value;
  }

  get noca(): string {
    return this._noca;
  }

  set noca(value: string) {
    this._noca = value;
  }

  get nocb(): string {
    return this._nocb;
  }

  set nocb(value: string) {
    this._nocb = value;
  }

  get cft(): string {
    return this._cft;
  }

  set cft(value: string) {
    this._cft = value;
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

  get subId(): string {
    return this._subId;
  }

  set subId(value: string) {
    this._subId = value;
  }

  get dt(): string {
    return this._dt;
  }

  set dt(value: string) {
    this._dt = value;
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
  get son(): string {
    return this._son;
  }

  set son(value: string) {
    this._son = value;
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
