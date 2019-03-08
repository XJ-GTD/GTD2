/**
 * create by on 2019/3/5
 */
import {ITbl} from "./itbl";
import {UtilService} from "../../util-service/util.service";


export class CTbl implements  ITbl{
  constructor(private util : UtilService){

  }
  private _sI: string="";
  private _sN: string="";
  private _uI: string="";
  private _sd: string="";
  private _st: string="";
  private _ed: string="";
  private _et: string="";
  private _rT: string="";
  private _ji: string="";


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

  get rT(): string {
    return this._rT;
  }

  set rT(value: string) {
    this._rT = value;
  }

  get ji(): string {
    return this._ji;
  }

  set ji(value: string) {
    this._ji = value;
  }

  clp(){
    this._sI = null;
    this._sN = null;
    this._uI = null;
    this._sd = null;
    this._st = null;
    this._ed = null;
    this._et = null;
    this._rT = null;
    this._ji = null;
  };

  cT():string {

    let sq =' CREATE TABLE IF NOT EXISTS GTD_C(  sI varchar(50) PRIMARY KEY ,sN varchar(50)  ,uI varchar(50)  ,sd varchar(20)  ' +
      ',st varchar(20)  ,ed varchar(20)  ,et varchar(20)  ,rT varchar(4)  ,ji varchar(50));';

    return sq;
  }

  upT():string {
    let sq='update GTD_C set 1=1 ';
    if(this._sN!=null){
      sq=sq+', sN="' + this._sN +'"';
    }
    if(this._uI!=null){
      sq=sq+', uI="' + this._uI +'"';
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
    if(this._rT != null){
      sq = sq + ', rT="' + this._rT +'"';
    }
    if(this._ji != null){
      sq = sq + ', ji="' + this._ji +'"';
    }
    sq = sq + ' where sI = "'+ this._sI +'"';
    return sq;
  }

  dT():string {
    let sq = 'delete from GTD_C where sI = "' + this._sI +'"';
    return sq;
  }

  sloT():string {
    let sq='select * from GTD_C where sI = "'+ this._sI +'"';
    return sq;
  }

  slT():string {
    let sq='select * from  GTD_C where  1=1 ';
    if(this._sN!=null){
      sq=sq+' and sN="' + this._sN +'"';
    }
    if(this._uI!=null){
      sq=sq+' and uI="' + this._uI +'"';
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
    if(this._rT != null){
      sq = sq + ' and rT="' + this._rT +'"';
    }
    if(this._ji != null){
      sq = sq + ' and ji="' + this._ji +'"';
    }
    if(this._sI != null){
      sq = sq + ' and sI="' + this._sI +'"';
    }
    return sq;
  }

  drT():string {

    let sq ='DROP TABLE IF EXISTS GTD_C;';
    return sq;
  }

  inT():string {
    this._sI = this.util.getUuid();
    let sq ='insert into GTD_C ' +
      '( sI ,sN ,uI ,sd ,st ,ed ,et ,rT ,ji) values("'+ this._sI+'","'+ this._sN+'","'+this._uI+ '"' +
      ',"'+this._sd+ '","'+this._st+ '","'+this._ed+ '","'+this._et+ '","'+this._rT+ '","'+this._ji+ '")';

    return sq;
  }

  rpT():string {
    this._sI = this.util.getUuid();
    let sq ='replace into GTD_C ' +
      '( sI ,sN ,uI ,sd ,st ,ed ,et ,rT ,ji) values("'+ this._sI+'","'+ this._sN+'","'+this._uI+ '"' +
      ',"'+this._sd+ '","'+this._st+ '","'+this._ed+ '","'+this._et+ '","'+this._rT+ '","'+this._ji+ '")';

    return sq;
  }

}


