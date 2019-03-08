import {ITbl} from "./itbl";

/**
 * create by on 2019/3/5
 */
export class STbl implements ITbl   {

  private _si: string;
  private _st: string;
  private _stn: string;
  private _sn: string;
  private _yk: string;
  private _yv: string;


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

  get stn(): string {
    return this._stn;
  }

  set stn(value: string) {
    this._stn = value;
  }

  get sn(): string {
    return this._sn;
  }

  set sn(value: string) {
    this._sn = value;
  }

  get yk(): string {
    return this._yk;
  }

  set yk(value: string) {
    this._yk = value;
  }

  get yv(): string {
    return this._yv;
  }

  set yv(value: string) {
    this._yv = value;
  }
 

  cT():string {

    let sq ='CREATE TABLE IF NOT EXISTS GTD_S( si varchar(50) PRIMARY KEY ,st VARCHAR(20)  ,' +
      'stn VARCHAR(20)  ,sn VARCHAR(20)  ,yk VARCHAR(20)  ,yv VARCHAR(400)   );';

    return sq;
  }

  upT():string {
    let sq='update GTD_S set 1=1 ';
    if(this._st!=null){
      sq=sq+', st="' + this._st +'"';
    }
    if(this._stn!=null){
      sq=sq+', stn="' + this._stn +'"';
    }
    if(this._sn != null){
      sq = sq + ', sn="' + this._sn +'"';
    }
    if(this._yk != null){
      sq = sq + ', yk="' + this._yk +'"';
    }
    if(this._yv != null){
      sq = sq + ', yv="' + this._yv +'"';
    }
    sq = sq + ' where si = "'+ this._si +'"';
    return sq;
  }

  dT():string {
    let sq = 'delete from GTD_S where si = "' + this._si +'"';
    return sq;
  }

  sloT():string {
    let sq='select * from GTD_S where si = "'+ this._si +'"';
    return sq;
  }

  slT():string
  {
    let sq='select * from  GTD_S where  1=1 ';
    if(this._st!=null){
      sq=sq+' and st="' + this._st +'"';
    }
    if(this._stn!=null){
      sq=sq+' and stn="' + this._stn +'"';
    }
    if(this._sn != null){
      sq = sq + ' and sn="' + this._sn +'"';
    }
    if(this._yk != null){
      sq = sq + ' and yk="' + this._yk +'"';
    }
    if(this._yv != null){
      sq = sq + ' and yv="' + this._yv +'"';
    }
    return sq;
  }

  drT():string {

    let sq ='DROP TABLE IF EXISTS GTD_S;';
    return sq;
  }

  inT():string {
    let sq ='insert into GTD_S ' +
      '( si ,st ,stn ,sn ,yk ,yv) values("'+ this._si+'","'+ this._st+'","'+this._stn+ '"' +
      ',"'+this._sn+ '","'+this._yk+ '","'+this._yv+ '")';

    return sq;
  }

  rpT():string {
    let sq ='replace into GTD_S ' +
      '( si ,st ,stn ,sn ,yk ,yv) values("'+ this._si+'","'+ this._st+'","'+this._stn+ '"' +
      ',"'+this._sn+ '","'+this._yk+ '","'+this._yv+ '")';

    return sq;
  }

}

