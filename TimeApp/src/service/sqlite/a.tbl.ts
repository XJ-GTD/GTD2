import {ITbl} from "./itbl";

/**
 * create by on 2019/3/5
 */
export class ATbl implements ITbl {

  private _aI :string;

  private _aN :string;

  private _aM :string;

  private _aE :string;

  private _aT :string;

  private _aQ :string;

  get aI(): string {
    return this._aI;
  }

  set aI(value: string) {
    this._aI = value;
  }

  get aN(): string {
    return this._aN;
  }

  set aN(value: string) {
    this._aN = value;
  }

  get aM(): string {
    return this._aM;
  }

  set aM(value: string) {
    this._aM = value;
  }

  get aE(): string {
    return this._aE;
  }

  set aE(value: string) {
    this._aE = value;
  }

  get aT(): string {
    return this._aT;
  }

  set aT(value: string) {
    this._aT = value;
  }

  get aQ(): string {
    return this._aQ;
  }

  set aQ(value: string) {
    this._aQ = value;
  }

  clp(){
    this._aI = null;
    this._aN = null;
    this._aM = null;
    this._aE = null;
    this._aT = null;
    this._aQ = null;
  };

  cT():string {

    let sq ='CREATE TABLE IF NOT EXISTS GTD_A(aI VARCHAR(50) PRIMARY KEY,' +
      'aN varchar(10),aM varchar(11),aE varchar(20) ,aT varchar(50) ,aQ varchar(100));';

    return sq;
  }

  upT():string {
    let sq='update GTD_A set 1=1 ';
    if(this._aN!=null){
      sq=sq+', aN="' + this._aN +'"';
    }
    if(this._aM!=null){
      sq=sq+', aM="' + this._aM +'"';
    }
    if(this._aE != null){
      sq = sq + ', aE="' + this._aE +'"';
    }
    if(this._aQ != null){
      sq = sq + ', aQ="' + this._aQ +'"';
    }
    sq = sq + ' where aI = "'+ this._aI +'"';
    return sq;
  }

  dT(pro):string {
    let sq = 'delete from GTD_A where aI = "' + this._aI +'"';
    return sq;
  }

  sloT():string {
    let sq='select * from GTD_A';
    return sq;
  }

  slT(pro):string {
    let sq='select * from  GTD_A where  1=1 ';
    if(this._aI != null){
      sq = sq + ' and aI="' + this._aI +'"';
    }
    if(this._aN!=null){
      sq=sq+' and aN="' + this._aN +'"';
    }
    if(this._aM!=null){
      sq=sq+' and aM="' + this._aM +'"';
    }
    if(this._aE != null){
      sq = sq + ' and aE="' + this._aE +'"';
    }
    if(this._aQ != null){
      sq = sq + ' and aQ="' + this._aQ +'"';
    }

    return sq;
  }

  drT():string {

    let sq ='DROP TABLE IF EXISTS GTD_A;';
    return sq;
  }

  inT(pro):string {
    let sq ='insert into GTD_A ' +
      '(aI,aN,aM,aE,aT,aQ) values("'+ this._aI+'","'+ this._aN+'","'+this._aM+ '"' +
      ',"'+this._aE+ '","'+this._aT+ '","'+this._aQ+ '")';

    return sq;
  }

  rpT(pro):string {
    let sq ='replace into GTD_A ' +
      '(aI,aN,aM,aE,aT,aQ) values("'+ this._aI+'","'+ this._aN+'","'+this._aM+ '"' +
      ',"'+this._aE+ '","'+this._aT+ '","'+this._aQ+ '")';

    return sq;
  }

}

