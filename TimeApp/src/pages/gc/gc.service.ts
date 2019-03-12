import {Injectable} from "@angular/core";
import {BlData} from "../bl/bl.service";
import {FsData} from "../fs/fs.service";
import {GTbl} from "../../service/sqlite/tbl/g.tbl";
import {SqliteExec} from "../../service/util-service/sqlite.exec";

@Injectable()
export class GcService {
  constructor(  private sqlExce: SqliteExec,) {
  }

  //编辑群名称
  save(friends:Array<DcData>): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      //删除本地群成员
      //保存群成员到本地
    })
  }

  //删除群
  delete(gId:string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      //删除本地群成员


      //删除本地群
      let gtbl:GTbl = new GTbl();
      gtbl.gi = gId;
      this.sqlExce.delete(gtbl).then(data=>{

      })

    })
  }

  //根据条件查询参与人
  getfriend(condtion:string):Promise<Array<DcData>>{
    return new Promise<Array<DcData>>((resolve, reject)=>{
      //获取本地参与人
    })
  }

  //查询群成员
  getGroupfriend(cId:string):Promise<Array<DcData>>{
    return new Promise<Array<DcData>>((resolve, reject)=>{
      //获取本地参与人
    })
  }

}

export class DcData {

  private _id: string = '';   //UUID
  private _pI: string = '';   //UUID
  private _ran: string = ''; //别名
  private _ranpy: string = ''; //别名拼音
  private _rI: string = '';  //关联ID
  private _rN: string = '';  //名称
  private _rNpy: string = '';  //名称拼音
  private _rC: string = '';  // 联系方式
  private _rF: string = '';     // 授权标识0未授权1授权
  private _rel: string = ''; // 联系类型
  private _hiu: string = ''; // 联系人头像URL
  private _sdt: number = 0; //日程是否发送状态;0未发送，1同意发送，2拒绝发送，3未注册
  private _ot: string = '';//0是未被添加，1是同意，2是拉黑
  private _is: string = '';//0本地存在，1本地不存在
  private _rugId: string = ''; //群组关联ID
  private _bi: string = ''; //群组ID
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

  get sdt(): number {
    return this._sdt;
  }

  set sdt(value: number) {
    this._sdt = value;
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

  get is(): string {
    return this._is;
  }

  set is(value: string) {
    this._is = value;
  }

  get rugId(): string {
    return this._rugId;
  }

  set rugId(value: string) {
    this._rugId = value;
  }

  get bi(): string {
    return this._bi;
  }

  set bi(value: string) {
    this._bi = value;
  }

  get pI(): string {
    return this._pI;
  }

  set pI(value: string) {
    this._pI = value;
  }

}
