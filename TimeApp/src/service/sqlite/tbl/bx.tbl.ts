/**
 * create by on 2019/3/5
 */
import {ITbl} from "./itbl";


export class BxTbl implements ITbl{

  private _bi: string="";
  private _bmi: string="";


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
    this._bi = "";
    this._bmi = "";
  };

  cT():string {

    let sq ='create table if not exists gtd_b_x( bi varchar(50) primary key ,bmi varchar(50));';

    return sq;
  }

  upT():string {
    let sq='';
    if(this._bmi!=null && this._bmi!=""){
      sq=sq+', bmi="' + this._bmi +'"';
    }
    if (sq != null && sq != ""){
      sq = sq.substr(1);
    }
    sq ='update gtd_b_x set  '+ sq + ' where bi = "'+ this._bi +'";';
    return sq;
  }

  dT():string {
    let sq = 'delete from gtd_b_x where 1=1 ';
    if(this._bi != null && this._bi!=""){
      sq = sq + 'and  bi ="' + this._bi +'"';
    }
    sq = sq + ';'
    return sq;
  }

  sloT():string {
    let sq='select * from gtd_b_x where bi = "'+ this._bi +'";';
    return sq;
  }

  slT():string {
    let sq='select * from gtd_b_x where  1=1 ';
    if(this._bmi!=null && this._bmi!=""){
      sq=sq+' and bmi="' + this._bmi +'"';
    }
    sq = sq +';';
    return sq;
  }

  drT():string {

    let sq ='drop table if exists gtd_b_x;';
    return sq;
  }

  inT():string {
    let sq ='insert into gtd_g ' +
      '(  bi ,bmi) values("'+ this._bi+'","'+ this._bmi+'");';

    return sq;
  }

  rpT():string {
    let sq ='replace into gtd_g ' +
      '(  bi ,bmi) values("'+ this._bi+'","'+ this._bmi+'");';

    return sq;
  }

}
