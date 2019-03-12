import {ITbl} from "./itbl";

/**
 * create by on 2019/3/5
 */
export class GTbl implements ITbl {

  private _gi: string="";
  private _gn: string="";
  private _gm: string="";

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

  clp(){
    this._gi = null;
    this._gn = null;
    this._gm = null;

  };

  cT():string{

    let sq ='create table if not exists gtd_g(  gi varchar(50) primary key ,gn varchar(50)  ,gm varchar(50));';

    return sq;
  }

  upT():string{
    let sq='update gtd_g set 1=1 ';
    if(this._gn!=null){
      sq=sq+', gn="' + this._gn +'"';
    }
    if(this._gm!=null){
      sq=sq+', gm="' + this._gm +'"';
    }
    sq = sq + ' where gi = "'+ this._gi +'"';
    return sq;
  }

  dT():string{
    let sq = 'delete from gtd_g where gi = "' + this._gi +'"';
    return sq;
  }

  sloT():string{
    let sq='select * from gtd_g where gi = "'+ this._gi +'"';
    return sq;
  }

  slT():string{
    let sq='select * from  gtd_g where  1=1 ';
    if(this._gn!=null){
      sq=sq+', gn="' + this._gn +'"';
    }
    if(this._gm!=null){
      sq=sq+', gm="' + this._gm +'"';
    }
    return sq;
  }

  drT():string{

    let sq ='drop table if exists gtd_g;';
    return sq;
  }

  inT():string{
    let sq ='insert into gtd_g ' +
      '( gi ,gn ,gm) values("'+ this._gi+'","'+ this._gn+'","'+this._gm+ '")';

    return sq;
  }

  rpT():string{
    let sq ='replace into gtd_g ' +
      '( gi ,gn ,gm) values("'+ this._gi+'","'+ this._gn+'","'+this._gm+ '")';

    return sq;
  }

}

