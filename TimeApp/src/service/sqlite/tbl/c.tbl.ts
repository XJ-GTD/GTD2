/**
 * create by on 2019/3/5
 */
import {ITbl} from "./itbl";
import * as moment from "moment";


export class CTbl implements  ITbl{

  private _si: string="";
  private _sn: string="";
  private _ui: string="";
  private _sd: string="";
  private _st: string="";
  private _ed: string="";
  private _et: string="";
  private _rt: string="";
  private _ji: string="";
  private _sr: string ="";
  private _bz: string ="";
  private _tx: string ="";
  private _wtt: Number=0;
  private _pni: string ="";

  get wtt(): Number {
    return this._wtt;
  }

  set wtt(value: Number) {
    this._wtt = value;
  }

  get bz(): string {
    return this._bz;
  }

  set bz(value: string) {
    this._bz = value;
  }

  get si(): string {
    return this._si;
  }

  set si(value: string) {
    this._si = value;
  }

  get sn(): string {
    return this._sn;
  }

  set sn(value: string) {
    this._sn = value;
  }

  get ui(): string {
    return this._ui;
  }

  set ui(value: string) {
    this._ui = value;
  }

  get sd(): string {
    return this._sd;
  }

  set sd(value: string) {
    this._sd = value;
  }

  get st(): string {
    return this._st;
  }

  set st(value: string) {
    this._st = value;
  }

  get ed(): string {
    return this._ed;
  }

  set ed(value: string) {
    this._ed = value;
  }

  get et(): string {
    return this._et;
  }

  set et(value: string) {
    this._et = value;
  }

  get rt(): string {
    return this._rt;
  }

  set rt(value: string) {
    this._rt = value;
  }

  get ji(): string {
    return this._ji;
  }

  set ji(value: string) {
    this._ji = value;
  }

  get sr(): string {
    return this._sr;
  }

  set sr(value: string) {
    this._sr = value;
  }

  get tx(): string {
    return this._tx;
  }

  set tx(value: string) {
    this._tx = value;
  }

  get pni(): string {
    return this._pni;
  }

  set pni(value: string) {
    this._pni = value;
  }

  clp(){
    this._si = "";
    this._sn = "";
    this._ui = "";
    this._sd = "";
    this._st = "";
    this._ed = "";
    this._et = "";
    this._rt = "";
    this._ji = "";
    this._tx = "";
    this._pni= "";
    this._wtt= 0;
  };

  cT():string {

    let sq =' create table if not exists gtd_c(  si varchar(50) primary key ,sn varchar(50)  ,ui varchar(50)  ,sd varchar(20)  ' +
      ',st varchar(20)  ,ed varchar(20)  ,et varchar(20)  ,rt varchar(4)  ,ji varchar(50),sr varchar(50),bz varchar(50),tx varcher(10),' +
      'wtt integer,pni varchar(50));';

    return sq;
  }

  upT():string {
    let sq='';
    if(this._sn!=null && this._sn!=""){
      sq=sq+', sn="' + this._sn +'"';
    }
    if(this._ui!=null && this._ui!=""){
      sq=sq+', ui="' + this._ui +'"';
    }
    if(this._sd != null && this._sd!=""){
      sq = sq + ', sd="' + this._sd +'"';
    }
    if(this._st != null && this._st!=""){
      sq = sq + ', st="' + this._st +'"';
    }
    if(this._ed != null && this._ed!=""){
      sq = sq + ', ed="' + this._ed +'"';
    }
    if(this._et != null && this._et!=""){
      sq = sq + ', et="' + this._et +'"';
    }
    if(this._rt != null && this._rt!=""){
      sq = sq + ', rt="' + this._rt +'"';
    }
    if(this._ji != null && this._ji!=""){
      sq = sq + ', ji="' + this._ji +'"';
    }
    if(this._sr != null && this._sr!=""){
      sq = sq + ', sr="' + this._sr +'"';
    }
    if(this._bz != null && this._bz!=""){
      sq = sq + ', bz="' + this._bz +'"';
    }
    if(this._tx != null && this._tx!=""){
      sq = sq + ', tx="' + this._tx +'"';
    }
    if(this._pni != null && this._pni!=""){
      sq = sq + ', pni="' + this._pni +'"';
    }
    if (sq != null && sq != ""){
      sq = sq.substr(1);
    }
    sq ='update gtd_c set '+ sq + ' where si = "'+ this._si +'";';
    return sq;
  }

  dT():string {
    let sq = 'delete from gtd_c where 1=1';
    if(this._si != null && this._si!=""){
      sq = sq + 'and  si ="' + this._si +'"';
    }
    sq = sq + ';'
    return sq;
  }

  sloT():string {
    let sq='select * from gtd_c where si = "'+ this._si +'";';
    return sq;
  }

  slT():string {
    let sq='select * from  gtd_c where  1=1 ';
    if(this._sn!=null && this._sn!=""){
      sq=sq+' and sn="' + this._sn +'"';
    }
    if(this._ui!=null && this._ui!=""){
      sq=sq+' and ui="' + this._ui +'"';
    }
    if(this._sd != null && this._sd!=""){
      sq = sq + ' and sd="' + this._sd +'"';
    }
    if(this._st != null && this._st!=""){
      sq = sq + ' and st="' + this._st +'"';
    }
    if(this._ed != null && this._ed!=""){
      sq = sq + ' and ed="' + this._ed +'"';
    }
    if(this._et != null && this._et!=""){
      sq = sq + ' and et="' + this._et +'"';
    }
    if(this._rt != null && this._rt!=""){
      sq = sq + ' and rt="' + this._rt +'"';
    }
    if(this._ji != null && this._ji!=""){
      sq = sq + ' and ji="' + this._ji +'"';
    }
    if(this._si != null && this._si!=""){
      sq = sq + ' and si="' + this._si +'"';
    }
    if(this._sr != null && this._sr!=""){
      sq = sq + ' and sr="' + this._sr +'"';
    }
    if(this._tx != null && this._tx!=""){
      sq = sq + ' and tx="' + this._tx +'"';
    }
    if(this._pni != null && this._pni!=""){
      sq = sq + ' and pni="' + this._pni +'"';
    }
    sq = sq +';';
    return sq;
  }

  drT():string {

    let sq ='drop table if exists gtd_c;';
    return sq;
  }

  inT():string {
    let sq ='insert into gtd_c ' +
      '( si ,sn ,ui ,sd ,st ,ed ,et ,rt ,ji,sr,bz,tx,wtt,pni) values("'+ this._si+'","'+ this._sn+'","'+this._ui+ '"' +
      ',"'+this._sd+ '","'+this._st+ '","'+this._ed+ '","'+this._et+ '","'+this._rt+ '","'+this._ji+ '"' +
      ',"'+this._sr+ '","'+this._bz+  '","'+this._tx+'",'+  moment().unix() + ',"'+this._pni+'");';

    return sq;
  }

  rpT():string {
    let sq ='replace into gtd_c ' +
      '( si ,sn ,ui ,sd ,st ,ed ,et ,rt ,ji,sr,bz,tx,wtt,pni) values("'+ this._si+'","'+ this._sn+'","'+this._ui+ '"' +
      ',"'+this._sd+ '","'+this._st+ '","'+this._ed+ '","'+this._et+ '","'+this._rt+ '","'+this._ji+ '"' +
      ',"'+this._sr+ '","'+this._bz+ '","' + this._tx + '",'+  moment().unix() +',"'+this._pni+'");';
    return sq;
  }

}


