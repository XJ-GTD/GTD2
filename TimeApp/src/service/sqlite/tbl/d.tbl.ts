/**
 * create by on 2019/3/5
 */
import {ITbl} from "./itbl";


export class DTbl implements ITbl {
  private _pI: string="";
  private _sI: string="";
  private _sT: string="";
  private _son: string="";
  private _sa: string="";
  private _aI: string="";
  private _ib: string="";
  private _bi: string="";
  private _sdt: string="";

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


  cT():string {

    let sq ='CREATE TABLE IF NOT EXISTS GTD_D( pI varchar(50) PRIMARY KEY ,sI varchar(50)  ,' +
      'sT varchar(50)  ,son varchar(50)  ,sa varchar(4)  ,aI varchar(50)  ,ib varchar(4)  ,' +
      'bi varchar(50)  ,sdt varchar(4));';

    return sq;
  }

  upT():string {
    let sq='update GTD_D set 1=1 ';
    if(this._sI!=null){
      sq=sq+', sI="' + this._sI +'"';
    }
    if(this._sT!=null){
      sq=sq+', sT="' + this._sT +'"';
    }
    if(this._son != null){
      sq = sq + ', son="' + this._son +'"';
    }
    if(this._sa != null){
      sq = sq + ', sa="' + this._sa +'"';
    }
    if(this._aI != null){
      sq = sq + ', aI="' + this._aI +'"';
    }
    if(this._sa != null){
      sq = sq + ', sa="' + this._sa +'"';
    }
    if(this._ib != null){
      sq = sq + ', ib="' + this._ib +'"';
    }
    if(this._bi != null){
      sq = sq + ', bi="' + this._bi +'"';
    }
    if(this._sdt != null){
      sq = sq + ', sdt="' + this._sdt +'"';
    }
    sq = sq + ' where pI = "'+ this._pI +'"';
    return sq;
  }

  dT():string {
    let sq = 'delete from GTD_D where pI = "' + this._pI +'"';
    return sq;
  }

  sloT():string {
    let sq='select * from GTD_D where pI = "'+ this._pI +'"';
    return sq;
  }

  slT():string {
    let sq='select * from  GTD_D where  1=1 ';
    if(this._sI!=null){
      sq=sq+' and sI="' + this._sI +'"';
    }
    if(this._sT!=null){
      sq=sq+' and sT="' + this._sT +'"';
    }
    if(this._son != null){
      sq = sq + ' and son="' + this._son +'"';
    }
    if(this._sa != null){
      sq = sq + ' and sa="' + this._sa +'"';
    }
    if(this._aI != null){
      sq = sq + ' and aI="' + this._aI +'"';
    }
    if(this._sa != null){
      sq = sq + ' and sa="' + this._sa +'"';
    }
    if(this._ib != null){
      sq = sq + ' and ib="' + this._ib +'"';
    }
    if(this._bi != null){
      sq = sq + ', bi="' + this._bi +'"';
    }
    if(this._sdt != null){
      sq = sq + ' and sdt="' + this._sdt +'"';
    }
    if(this._pI != null){
      sq = sq + ' and pI="' + this._pI +'"';
    }
    return sq;
  }

  drT():string {

    let sq ='DROP TABLE IF EXISTS GTD_D;';
    return sq;
  }

  inT():string {
    let sq ='insert into GTD_D ' +
      '( pI ,sI ,sT ,son ,sa ,aI ,ib ,bi ,sdt) values("'+ this._pI+'","'+ this._sI+'","'+this._sT+ '"' +
      ',"'+this._son+ '","'+this._sa+ '","'+this._aI+ '","'+this._ib+ '","'+this._bi+ '","'+this._sdt+ '")';

    return sq;
  }

  rpT():string {
    let sq ='replace into GTD_D ' +
      '( pI ,sI ,sT ,son ,sa ,aI ,ib ,bi ,sdt) values("'+ this._pI+'","'+ this._sI+'","'+this._sT+ '"' +
      ',"'+this._son+ '","'+this._sa+ '","'+this._aI+ '","'+this._ib+ '","'+this._bi+ '","'+this._sdt+ '")';

    return sq;
  }

}

