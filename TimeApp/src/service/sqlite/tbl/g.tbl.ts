import {ITbl} from "./itbl";

/**
 * create by on 2019/3/5
 */
export class GTbl implements ITbl {

  private _gI: string;
  private _gN: string;
  private _gM: string;

  get gI(): string {
    return this._gI;
  }

  set gI(value: string) {
    this._gI = value;
  }

  get gN(): string {
    return this._gN;
  }

  set gN(value: string) {
    this._gN = value;
  }

  get gM(): string {
    return this._gM;
  }

  set gM(value: string) {
    this._gM = value;
  }

  clp(){
    this._gI = null;
    this._gN = null;
    this._gM = null;

  };

  cT():string{

    let sq ='CREATE TABLE IF NOT EXISTS GTD_G(  gI varchar(50) PRIMARY KEY ,gN varchar(50)  ,gM varchar(50));';

    return sq;
  }

  upT():string{
    let sq='update GTD_G set 1=1 ';
    if(this._gN!=null){
      sq=sq+', gN="' + this._gN +'"';
    }
    if(this._gM!=null){
      sq=sq+', gM="' + this._gM +'"';
    }
    sq = sq + ' where gI = "'+ this._gI +'"';
    return sq;
  }

  dT():string{
    let sq = 'delete from GTD_G where gI = "' + this._gI +'"';
    return sq;
  }

  sloT():string{
    let sq='select * from GTD_G where gI = "'+ this._gI +'"';
    return sq;
  }

  slT():string{
    let sq='select * from  GTD_G where  1=1 ';
    if(this._gN!=null){
      sq=sq+', gN="' + this._gN +'"';
    }
    if(this._gM!=null){
      sq=sq+', gM="' + this._gM +'"';
    }
    return sq;
  }

  drT():string{

    let sq ='DROP TABLE IF EXISTS GTD_G;';
    return sq;
  }

  inT():string{
    let sq ='insert into GTD_G ' +
      '( gI ,gN ,gM) values("'+ this._gI+'","'+ this._gN+'","'+this._gM+ '")';

    return sq;
  }

  rpT():string{
    let sq ='replace into GTD_G ' +
      '( gI ,gN ,gM) values("'+ this._gI+'","'+ this._gN+'","'+this._gM+ '")';

    return sq;
  }

}

