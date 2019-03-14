import {ITbl} from "./itbl";
import * as moment from "moment";

/**
 * create by on 2019/3/5
 */
export class GTbl implements ITbl {

  private _gi: string="";
  private _gn: string="";
  private _gm: string="";
  private _gnpy: string="";
  private _wtt :Number=0;

  get wtt(): Number {
    return this._wtt;
  }

  set wtt(value: Number) {
    this._wtt = value;
  }

  get gi(): string {
    return this._gi;
  }

  set gi(value: string) {
    this._gi = value;
  }

  get gn(): string {
    return this._gn;
  }

  set gn(value: string) {
    this._gn = value;
  }

  get gm(): string {
    return this._gm;
  }

  set gm(value: string) {
    this._gm = value;
  }

  get gnpy(): string {
    return this._gnpy;
  }

  set gnpy(value: string) {
    this._gnpy = value;
  }

  clp(){
    this._gi = "";
    this._gn = "";
    this._gm = "";
    this._gnpy = "";
  };

  cT():string{

    let sq ='create table if not exists gtd_g(  gi varchar(50) primary key ,gn varchar(50)  ,' +
      'gm varchar(50),gnpy varchar(50),wtt integer);';

    return sq;
  }

  upT():string{
    let sq='';
    if(this._gn!=null && this._gn!=""){
      sq=sq+', gn="' + this._gn +'"';
    }
    if(this._gnpy!=null && this._gnpy!=""){
      sq=sq+', gnpy="' + this._gnpy +'"';
    }
    if(this._gm!=null && this._gm!=""){
      sq=sq+', gm="' + this._gm +'"';
    }
    if (sq != null && sq != ""){
      sq = sq.substr(1);
    }
    sq = 'update gtd_g set  '+sq + ' where gi = "'+ this._gi +'";';
    return sq;
  }

  dT():string{
    let sq = 'delete from gtd_g where 1=1 ';
    if(this._gi != null && this._gi!=""){
      sq = sq + 'and  gi ="' + this._gi +'"';
    }
    sq = sq + ';'
    return sq;
  }

  sloT():string{
    let sq='select * from gtd_g where gi = "'+ this._gi +'";';
    return sq;
  }

  slT():string{
    let sq='select * from  gtd_g where  1=1 ';
    if(this._gn!=null && this._gn!=""){
      sq=sq+' and gn="' + this._gn +'"';
    }
    if(this._gm!=null && this._gm!=""){
      sq=sq+' and gm="' + this._gm +'"';
    }
    if(this._gnpy!=null && this._gnpy!=""){
      sq=sq+' and gnpy="' + this._gnpy +'"';
    }
    sq = sq +';';
    return sq;
  }

  drT():string{

    let sq ='drop table if exists gtd_g;';
    return sq;
  }

  inT():string{
    let sq ='insert into gtd_g ' +
      '( gi ,gn ,gm,gnpy) values("'+ this._gi+'","'+ this._gn+'","'+this._gm+ '","'+this._gnpy+'",'+  moment().unix() +');';

    return sq;
  }

  rpT():string{
    let sq ='replace into gtd_g ' +
      '( gi ,gn ,gm,gnpy) values("'+ this._gi+'","'+ this._gn+'","'+this._gm+'","'+this._gnpy+ '",'+  moment().unix() +');';

    return sq;
  }

}

