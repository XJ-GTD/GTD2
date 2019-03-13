
import {ITbl} from "./itbl";

/**
 * create by on 2019/3/5
 */
export class SpTbl  implements ITbl {

  private _spi: string="";
  private _si: string="";
  private _spn: string="";
  private _sd: string="";
  private _st: string="";
  private _ed: string="";
  private _et: string="";
  private _ji: string="";
  private _bz: string="";
  private _sta: string="";


  get spi(): string {
    return this._spi;
  }

  set spi(value: string) {
    this._spi = value;
  }

  get si(): string {
    return this._si;
  }

  set si(value: string) {
    this._si = value;
  }

  get spn(): string {
    return this._spn;
  }

  set spn(value: string) {
    this._spn = value;
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

  get ji(): string {
    return this._ji;
  }

  set ji(value: string) {
    this._ji = value;
  }

  get bz(): string {
    return this._bz;
  }

  set bz(value: string) {
    this._bz = value;
  }

  get sta(): string {
    return this._sta;
  }

  set sta(value: string) {
    this._sta = value;
  }


  cT():string {

    let sq =' create table if not exists gtd_sp(spi varchar(50) primary key ,si varchar(50)  ,' +
      'spn varchar(50)  ,sd varchar(20)' +
      '  ,st varchar(20)  ,ed varchar(20)  ,et varchar(20)  ,ji varchar(50)  ,bz varchar(50)  ,' +
      'sta varchar(4));';

    return sq;
  }

  upT():string {
    let sq='';
    if(this._si!=null && this._si!=""){
      sq=sq+', si="' + this._si +'"';
    }
    if(this._spn!=null && this._spn!=""){
      sq=sq+', spn="' + this._spn +'"';
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
    if(this._ji != null && this._ji!=""){
      sq = sq + ', ji="' + this._ji +'"';
    }
    if(this._bz != null && this._bz!=""){
      sq = sq + ', bz="' + this._bz +'"';
    }
    if(this._sta != null && this._sta!=""){
      sq = sq + ', sta="' + this._sta +'"';
    }
    if (sq != null && sq != ""){
      sq = sq.substr(1);
    }
    sq = 'update gtd_sp set  '+sq + ' where spi = "'+ this._spi +'";';
    return sq;
  }

  dT():string {
    let sq = 'delete from gtd_sp where 1=1 ';
    if(this._spi != null && this._spi!=""){
      sq = sq + 'and  spi ="' + this._spi +'"';
    }
    sq = sq + ';'
    return sq;
  }

  sloT():string {
    let sq='select * from gtd_sp where spi = "'+ this._spi +'";';
    return sq;
  }

  slT():string {
    let sq='select * from  gtd_sp where  1=1 ';
    if(this._si!=null && this._si!=""){
      sq=sq+' and si="' + this._si +'"';
    }
    if(this._spn!=null && this._spn!=""){
      sq=sq+' and spn="' + this._spn +'"';
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
    if(this._ji != null && this._ji!=""){
      sq = sq + ' and ji="' + this._ji +'"';
    }
    if(this._bz != null && this._bz!=""){
      sq = sq + ' and bz="' + this._bz +'"';
    }
    if(this._sta != null && this._sta!=""){
      sq = sq + ' and sta="' + this._sta +'"';
    }
    if(this._spi != null && this._spi!=""){
      sq = sq + ' and spi="' + this._spi +'"';
    }
    sq = sq +';';
    return sq;
  }

  drT():string {

    let sq ='drop table if exists gtd_sp;';
    return sq;
  }

  inT():string {
    let sq ='insert into gtd_sp ' +
      '( spi ,si ,spn ,sd ,st ,ed ,et ,ji ,bz ,sta) values("'+ this._spi+'","'+ this._si+'","'+this._spn+ '"' +
      ',"'+this._sd+ '","'+this._st+ '","'+this._ed+ '","'+this._et+ '","'+this._ji+ '","'+this._bz+ '","'+this._sta+ '");';

    return sq;
  }

  rpT():string {
    let sq ='replace into gtd_sp ' +
      '( spi ,si ,spn ,sd ,st ,ed ,et ,ji ,bz ,sta) values("'+ this._spi+'","'+ this._si+'","'+this._spn+ '"' +
      ',"'+this._sd+ '","'+this._st+ '","'+this._ed+ '","'+this._et+ '","'+this._ji+ '","'+this._bz+ '","'+this._sta+ '");';

    return sq;
  }
  clp(){
    this._spi="";
    this._si="";
    this._spn="";
    this._sd="";
    this._st="";
    this._ed="";
    this._et="";
    this._ji="";
    this._bz="";
    this._sta="";
  }
}


