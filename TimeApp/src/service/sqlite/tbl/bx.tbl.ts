/**
 * create by on 2019/3/5
 */
import {ITbl} from "./itbl";


export class BxTbl implements ITbl{

  private _bi: string;
  private _bmi: string;


  get bi(): string {
    return this._bi;
  }

  set bi(value: string) {
    this._bi = value;
  }

  get bmi(): string {
    return this._bmi;
  }

  set bmi(value: string) {
    this._bmi = value;
  }

  clp(){
    this._bi = null;
    this._bmi = null;
  };

  cT():string {

    let sq ='CREATE TABLE IF NOT EXISTS GTD_B_X( bi varchar(50) PRIMARY KEY ,bmi varchar(50));';

    return sq;
  }

  upT():string {
    let sq='update GTD_B_X set 1=1 ';
    if(this._bmi!=null){
      sq=sq+', bmi="' + this._bmi +'"';
    }
    sq = sq + ' where bi = "'+ this._bi +'"';
    return sq;
  }

  dT():string {
    let sq = 'delete from GTD_B_X where bi = "' + this._bi +'"';
    return sq;
  }

  sloT():string {
    let sq='select * from GTD_B_X where bi = "'+ this._bi +'"';
    return sq;
  }

  slT():string {
    let sq='select * from GTD_B_X where  1=1 ';
    if(this._bmi!=null){
      sq=sq+' and bmi="' + this._bmi +'"';
    }
    return sq;
  }

  drT():string {

    let sq ='DROP TABLE IF EXISTS GTD_B_X;';
    return sq;
  }

  inT():string {
    let sq ='insert into GTD_G ' +
      '(  bi ,bmi) values("'+ this._bi+'","'+ this._bmi+'")';

    return sq;
  }

  rpT():string {
    let sq ='replace into GTD_G ' +
      '(  bi ,bmi) values("'+ this._bi+'","'+ this._bmi+'")';

    return sq;
  }

}
