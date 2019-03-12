/**
 * create by on 2019/3/5
 */
import {ITbl} from "./itbl";


export class DTbl implements ITbl {
  private _pi: string="";
  private _si: string="";
  private _st: string="";
  private _son: string="";
  private _sa: string="";
  private _ai: string="";
  private _ib: string="";
  private _bi: string="";
  private _sdt: string="";


  get pi(): string {
    return this._pi;
  }

  set pi(value: string) {
    this._pi = value;
  }

  get si(): string {
    return this._si;
  }

  set si(value: string) {
    this._si = value;
  }

  get st(): string {
    return this._st;
  }

  set st(value: string) {
    this._st = value;
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

  get ai(): string {
    return this._ai;
  }

  set ai(value: string) {
    this._ai = value;
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
    this._pi=null;
    this._si=null;
    this._st=null;
    this._son=null;
    this._sa=null;
    this._ai=null;
    this._ib=null;
    this._bi=null;
    this._sdt=null;

  };


  cT():string {

    let sq ='create table if not exists gtd_d( pi varchar(50) primary key ,si varchar(50)  ,' +
      'st varchar(50)  ,son varchar(50)  ,sa varchar(4)  ,ai varchar(50)  ,ib varchar(4)  ,' +
      'bi varchar(50)  ,sdt varchar(4));';

    return sq;
  }

  upT():string {
    let sq='update gtd_d set 1=1 ';
    if(this._si!=null){
      sq=sq+', si="' + this._si +'"';
    }
    if(this._st!=null){
      sq=sq+', st="' + this._st +'"';
    }
    if(this._son != null){
      sq = sq + ', son="' + this._son +'"';
    }
    if(this._sa != null){
      sq = sq + ', sa="' + this._sa +'"';
    }
    if(this._ai != null){
      sq = sq + ', ai="' + this._ai +'"';
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
    sq = sq + ' where pi = "'+ this._pi +'"';
    return sq;
  }

  dT():string {
    let sq = 'delete from gtd_d where pi = "' + this._pi +'"';
    return sq;
  }

  sloT():string {
    let sq='select * from gtd_d where pi = "'+ this._pi +'"';
    return sq;
  }

  slT():string {
    let sq='select * from  gtd_d where  1=1 ';
    if(this._si!=null){
      sq=sq+' and si="' + this._si +'"';
    }
    if(this._st!=null){
      sq=sq+' and st="' + this._st +'"';
    }
    if(this._son != null){
      sq = sq + ' and son="' + this._son +'"';
    }
    if(this._sa != null){
      sq = sq + ' and sa="' + this._sa +'"';
    }
    if(this._ai != null){
      sq = sq + ' and ai="' + this._ai +'"';
    }
    if(this._sa != null){
      sq = sq + ' and sa="' + this._sa +'"';
    }
    if(this._ib != null){
      sq = sq + ' and ib="' + this._ib +'"';
    }
    if(this._bi != null){
      sq = sq + ' and bi="' + this._bi +'"';
    }
    if(this._sdt != null){
      sq = sq + ' and sdt="' + this._sdt +'"';
    }
    if(this._pi != null){
      sq = sq + ' and pi="' + this._pi +'"';
    }
    return sq;
  }

  drT():string {

    let sq ='drop table if exists gtd_d;';
    return sq;
  }

  inT():string {
    let sq ='insert into gtd_d ' +
      '( pi ,si ,st ,son ,sa ,ai ,ib ,bi ,sdt) values("'+ this._pi+'","'+ this._si+'","'+this._st+ '"' +
      ',"'+this._son+ '","'+this._sa+ '","'+this._ai+ '","'+this._ib+ '","'+this._bi+ '","'+this._sdt+ '")';

    return sq;
  }

  rpT():string {
    let sq ='replace into gtd_d ' +
      '( pi ,si ,st ,son ,sa ,ai ,ib ,bi ,sdt) values("'+ this._pi+'","'+ this._si+'","'+this._st+ '"' +
      ',"'+this._son+ '","'+this._sa+ '","'+this._ai+ '","'+this._ib+ '","'+this._bi+ '","'+this._sdt+ '")';

    return sq;
  }

}

