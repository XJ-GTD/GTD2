/**
 * create by on 2019/3/5
 */
import {ITbl} from "./itbl";


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
  private _sr: string =""


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
  };

  cT():string {

    let sq =' create table if not exists gtd_c(  si varchar(50) primary key ,sn varchar(50)  ,ui varchar(50)  ,sd varchar(20)  ' +
      ',st varchar(20)  ,ed varchar(20)  ,et varchar(20)  ,rt varchar(4)  ,ji varchar(50),sr varchar(50));';

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
    if (sq != null && sq != ""){
      sq = sq.substr(1);
    }
    sq ='update gtd_c set '+ sq + ' where si = "'+ this._si +'";';
    return sq;
  }

  dT():string {
    let sq = 'delete from gtd_c where si = "' + this._si +'";';
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
    sq = sq +';';
    return sq;
  }

  drT():string {

    let sq ='drop table if exists gtd_c;';
    return sq;
  }

  inT():string {
    let sq ='insert into gtd_c ' +
      '( si ,sn ,ui ,sd ,st ,ed ,et ,rt ,ji,sr) values("'+ this._si+'","'+ this._sn+'","'+this._ui+ '"' +
      ',"'+this._sd+ '","'+this._st+ '","'+this._ed+ '","'+this._et+ '","'+this._rt+ '","'+this._ji+ '"' +
      ',"'+this._sr+ '");';

    return sq;
  }

  rpT():string {
    let sq ='replace into gtd_c ' +
      '( si ,sn ,ui ,sd ,st ,ed ,et ,rt ,ji,sr) values("'+ this._si+'","'+ this._sn+'","'+this._ui+ '"' +
      ',"'+this._sd+ '","'+this._st+ '","'+this._ed+ '","'+this._et+ '","'+this._rt+ '","'+this._ji+ '"' +
      ',"'+this._sr+ '");';

    return sq;
  }

}


