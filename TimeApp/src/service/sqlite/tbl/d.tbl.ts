import{Injectable}from'@angular/core';
import {SqliteExec} from "../../util-service/sqlite.exec";

/**
 * create by on 2019/3/5
 */
@Injectable()
export class DTbl  {

  constructor( private sqlExec: SqliteExec ){

  }


  cT():Promise<any> {

    let sq ='CREATE TABLE IF NOT EXISTS GTD_D( pI varchar(50) PRIMARY KEY ,sI varchar(50)  ,' +
      'sT varchar(50)  ,son varchar(50)  ,sa varchar(4)  ,aI varchar(50)  ,ib varchar(4)  ,' +
      'bi varchar(50)  ,sdt varchar(4));';

    return this.sqlExec.execSql(sq,[]);
  }

  upT(pro:DPro):Promise<any> {
    let sq='update GTD_D set 1=1 ';
    if(pro.sI!=null){
      sq=sq+', sI="' + pro.sI +'"';
    }
    if(pro.sT!=null){
      sq=sq+', sT="' + pro.sT +'"';
    }
    if(pro.son != null){
      sq = sq + ', son="' + pro.son +'"';
    }
    if(pro.sa != null){
      sq = sq + ', sa="' + pro.sa +'"';
    }
    if(pro.aI != null){
      sq = sq + ', aI="' + pro.aI +'"';
    }
    if(pro.sa != null){
      sq = sq + ', sa="' + pro.sa +'"';
    }
    if(pro.ib != null){
      sq = sq + ', ib="' + pro.ib +'"';
    }
    if(pro.bi != null){
      sq = sq + ', bi="' + pro.bi +'"';
    }
    if(pro.sdt != null){
      sq = sq + ', sdt="' + pro.sdt +'"';
    }
    sq = sq + ' where pI = "'+ pro.pI +'"';
    return this.sqlExec.execSql(sq,[]);
  }

  dT(pro:DPro):Promise<any> {
    let sq = 'delete from GTD_D where pI = "' + pro.pI +'"';
    return this.sqlExec.execSql(sq,[]);
  }

  sloT(pro:DPro):Promise<any> {
    let sq='select * from GTD_D where pI = "'+ pro.pI +'"';
    return this.sqlExec.execSql(sq,[]);
  }

  slT(pro:DPro):Promise<any> {
    let sq='select * from  GTD_D where  1=1 ';
    if(pro.sI!=null){
      sq=sq+' and sI="' + pro.sI +'"';
    }
    if(pro.sT!=null){
      sq=sq+' and sT="' + pro.sT +'"';
    }
    if(pro.son != null){
      sq = sq + ' and son="' + pro.son +'"';
    }
    if(pro.sa != null){
      sq = sq + ' and sa="' + pro.sa +'"';
    }
    if(pro.aI != null){
      sq = sq + ' and aI="' + pro.aI +'"';
    }
    if(pro.sa != null){
      sq = sq + ' and sa="' + pro.sa +'"';
    }
    if(pro.ib != null){
      sq = sq + ' and ib="' + pro.ib +'"';
    }
    if(pro.bi != null){
      sq = sq + ', bi="' + pro.bi +'"';
    }
    if(pro.sdt != null){
      sq = sq + ' and sdt="' + pro.sdt +'"';
    }
    if(pro.pI != null){
      sq = sq + ' and pI="' + pro.pI +'"';
    }
    return this.sqlExec.execSql(sq,[]);
  }

  drT():Promise<any> {

    let sq ='DROP TABLE IF EXISTS GTD_D;';
    return this.sqlExec.execSql(sq,[]);
  }

  inT(pro:DPro):Promise<any> {
    let sq ='insert into GTD_D ' +
      '( pI ,sI ,sT ,son ,sa ,aI ,ib ,bi ,sdt) values("'+ pro.pI+'","'+ pro.sI+'","'+pro.sT+ '"' +
      ',"'+pro.son+ '","'+pro.sa+ '","'+pro.aI+ '","'+pro.ib+ '","'+pro.bi+ '","'+pro.sdt+ '")';

    return this.sqlExec.execSql(sq,[]);
  }

  rpT(pro:DPro):Promise<any> {
    let sq ='replace into GTD_D ' +
      '( pI ,sI ,sT ,son ,sa ,aI ,ib ,bi ,sdt) values("'+ pro.pI+'","'+ pro.sI+'","'+pro.sT+ '"' +
      ',"'+pro.son+ '","'+pro.sa+ '","'+pro.aI+ '","'+pro.ib+ '","'+pro.bi+ '","'+pro.sdt+ '")';

    return this.sqlExec.execSql(sq,[]);
  }

}

class DPro{

  private _pI: string;
  private _sI: string;
  private _sT: string;
  private _son: string;
  private _sa: string;
  private _aI: string;
  private _ib: string;
  private _bi: string;
  private _sdt: string;

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

  get sT(): string {
    return this._sT;
  }

  set sT(value: string) {
    this._sT = value;
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

  get aI(): string {
    return this._aI;
  }

  set aI(value: string) {
    this._aI = value;
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

  get sdt(): string {
    return this._sdt;
  }

  set sdt(value: string) {
    this._sdt = value;
  }

  clp(){
    this._pI=null;
    this._sI=null;
    this._sT=null;
    this._son=null;
    this._sa=null;
    this._aI=null;
    this._ib=null;
    this._bi=null;
    this._sdt=null;

  };

}

