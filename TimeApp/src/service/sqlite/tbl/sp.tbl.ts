
import {ITbl} from "./itbl";

/**
 * create by on 2019/3/5
 */
export class SpTbl  implements ITbl {

  private _spI: string;
  private _sI: string;
  private _spN: string;
  private _sd: string;
  private _st: string;
  private _ed: string;
  private _et: string;
  private _ji: string;
  private _bz: string;
  private _sta: string;


  get spI(): string {
    return this._spI;
  }

  set spI(value: string) {
    this._spI = value;
  }

  get sI(): string {
    return this._sI;
  }

  set sI(value: string) {
    this._sI = value;
  }

  get spN(): string {
    return this._spN;
  }

  set spN(value: string) {
    this._spN = value;
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

    let sq =' CREATE TABLE IF NOT EXISTS GTD_SP(spI varchar(50) PRIMARY KEY ,sI varchar(50)  ,' +
      'spN varchar(50)  ,sd varchar(20)' +
      '  ,st varchar(20)  ,ed varchar(20)  ,et varchar(20)  ,ji varchar(50)  ,bz varchar(50)  ,' +
      'sta varchar(4));';

    return sq;
  }

  upT():string {
    let sq='update GTD_SP set 1=1 ';
    if(this._sI!=null){
      sq=sq+', sI="' + this._sI +'"';
    }
    if(this._spN!=null){
      sq=sq+', spN="' + this._spN +'"';
    }
    if(this._sd != null){
      sq = sq + ', sd="' + this._sd +'"';
    }
    if(this._st != null){
      sq = sq + ', st="' + this._st +'"';
    }
    if(this._ed != null){
      sq = sq + ', ed="' + this._ed +'"';
    }
    if(this._et != null){
      sq = sq + ', et="' + this._et +'"';
    }
    if(this._ji != null){
      sq = sq + ', ji="' + this._ji +'"';
    }
    if(this._bz != null){
      sq = sq + ', bz="' + this._bz +'"';
    }
    if(this._sta != null){
      sq = sq + ', sta="' + this._sta +'"';
    }
    sq = sq + ' where spI = "'+ this._spI +'"';
    return sq;
  }

  dT():string {
    let sq = 'delete from GTD_SP where spI = "' + this._spI +'"';
    return sq;
  }

  sloT():string {
    let sq='select * from GTD_SP where spI = "'+ this._spI +'"';
    return sq;
  }

  slT():string {
    let sq='select * from  GTD_SP where  1=1 ';
    if(this._sI!=null){
      sq=sq+' and sI="' + this._sI +'"';
    }
    if(this._spN!=null){
      sq=sq+' and spN="' + this._spN +'"';
    }
    if(this._sd != null){
      sq = sq + ' and sd="' + this._sd +'"';
    }
    if(this._st != null){
      sq = sq + ' and st="' + this._st +'"';
    }
    if(this._ed != null){
      sq = sq + ' and ed="' + this._ed +'"';
    }
    if(this._et != null){
      sq = sq + ' and et="' + this._et +'"';
    }
    if(this._ji != null){
      sq = sq + ' and ji="' + this._ji +'"';
    }
    if(this._bz != null){
      sq = sq + ' and bz="' + this._bz +'"';
    }
    if(this._sta != null){
      sq = sq + ' and sta="' + this._sta +'"';
    }
    if(this._spI != null){
      sq = sq + ' and spI="' + this._spI +'"';
    }

    return sq;
  }

  drT():string {

    let sq ='DROP TABLE IF EXISTS GTD_SP;';
    return sq;
  }

  inT():string {
    let sq ='insert into GTD_SP ' +
      '( spI ,sI ,spN ,sd ,st ,ed ,et ,ji ,bz ,sta) values("'+ this._spI+'","'+ this._sI+'","'+this._spN+ '"' +
      ',"'+this._sd+ '","'+this._st+ '","'+this._ed+ '","'+this._et+ '","'+this._ji+ '","'+this._bz+ '","'+this._sta+ '")';

    return sq;
  }

  rpT():string {
    let sq ='replace into GTD_SP ' +
      '( spI ,sI ,spN ,sd ,st ,ed ,et ,ji ,bz ,sta) values("'+ this._spI+'","'+ this._sI+'","'+this._spN+ '"' +
      ',"'+this._sd+ '","'+this._st+ '","'+this._ed+ '","'+this._et+ '","'+this._ji+ '","'+this._bz+ '","'+this._sta+ '")';

    return sq;
  }

}


