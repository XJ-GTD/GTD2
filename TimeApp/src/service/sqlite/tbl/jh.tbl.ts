import {ITbl} from "./itbl";

/**
 * create by on 2019/3/5
 */
export class JhTbl  implements ITbl{
  private _ji: string;
  private _jn: string;
  private _jg: string;
  private _jc: string;

  get jc(): string {
    return this._jc;
  }

  set jc(value: string) {
    this._jc = value;
  }

  get ji(): string {
    return this._ji;
  }

  set ji(value: string) {
    this._ji = value;
  }

  get jn(): string {
    return this._jn;
  }

  set jn(value: string) {
    this._jn = value;
  }

  get jg(): string {
    return this._jg;
  }

  set jg(value: string) {
    this._jg = value;
  }

  clp(){
    this._ji = null;
    this._jn = null;
    this._jg = null;
  };

  cT():string{

    let sq ='CREATE TABLE IF NOT EXISTS GTD_J_H(  ji VARCHAR(50) PRIMARY KEY ,jn VARCHAR(100)  ,jg VARCHAR(100)' +
      ',jc VARCHAR(10));';

    return sq;
  }

  upT():string{
    let sq='update GTD_J_H set 1=1 ';
    if(this._jn!=null){
      sq=sq+', jn="' + this._jn +'"';
    }
    if(this._jg!=null){
      sq=sq+', jg="' + this._jg +'"';
    }
    if(this._jc!=null){
      sq=sq+', jc="' + this._jc +'"';
    }
    sq = sq + ' where ji = "'+ this._ji +'"';
    return sq;
  }

  dT():string{
    let sq = 'delete from GTD_J_H where ji = "' + this._ji +'"';
    return sq;
  }

  sloT():string{
    let sq='select * from GTD_J_H where ji = "'+ this._ji +'"';
    return sq;
  }

  slT():string{
    let sq='select * from  GTD_J_H where  1=1 ';
    if(this._jn!=null){
      sq=sq+' and jn="' + this._jn +'"';
    }
    if(this._jg!=null){
      sq=sq+' and jg="' + this._jg +'"';
    }
    if(this._jc!=null){
      sq=sq+' and jc="' + this._jc +'"';
    }
    return sq;
  }

  drT():string{

    let sq ='DROP TABLE IF EXISTS GTD_J_H;';
    return sq;
  }

  inT():string{
    let sq ='insert into GTD_J_H ' +
      '(  ji ,jn ,jg,jc) values("'+ this._ji+'","'+ this._jn+'","'+this._jg+ '","'+this._jc+ '")';

    return sq;
  }

  rpT():string{
    let sq ='replace into GTD_J_H ' +
      '(  ji ,jn ,jg,jc) values("'+ this._ji+'","'+ this._jn+'","'+this._jg+ '","'+this._jc+ '")';

    return sq;
  }

}
