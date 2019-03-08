import{Injectable}from'@angular/core';
import {SqliteExec} from "../util-service/sqlite.exec";

/**
 * create by on 2019/3/5
 */
@Injectable()
export class ATbl  {
  constructor( private sqlExec: SqliteExec ){

  }


  cT():Promise<any> {

    let sq ='CREATE TABLE IF NOT EXISTS GTD_A(aI VARCHAR(50) PRIMARY KEY,' +
      'aN varchar(10),aM varchar(11),aE varchar(20) ,aT varchar(50) ,aQ varchar(100));';

    return this.sqlExec.execSql(sq,[]);
  }

  upT(pro:APro):Promise<any> {
    let sq='update GTD_A set 1=1 ';
    if(pro.aN!=null){
      sq=sq+', aN="' + pro.aN +'"';
    }
    if(pro.aM!=null){
      sq=sq+', aM="' + pro.aM +'"';
    }
    if(pro.aE != null){
      sq = sq + ', aE="' + pro.aE +'"';
    }
    if(pro.aQ != null){
      sq = sq + ', aQ="' + pro.aQ +'"';
    }
    sq = sq + ' where aI = "'+ pro.aI +'"';
    return this.sqlExec.execSql(sq,[]);
  }

  dT(pro:APro):Promise<any> {
    let sq = 'delete from GTD_A where aI = "' + pro.aI +'"';
    return this.sqlExec.execSql(sq,[]);
  }

  sloT():Promise<any> {
    let sq='select * from GTD_A';
    return this.sqlExec.execSql(sq,[]);
  }

  slT(pro:APro):Promise<any> {
    let sq='select * from  GTD_A where  1=1 ';
    if(pro.aI != null){
      sq = sq + ' and aI="' + pro.aI +'"';
    }
    if(pro.aN!=null){
      sq=sq+' and aN="' + pro.aN +'"';
    }
    if(pro.aM!=null){
      sq=sq+' and aM="' + pro.aM +'"';
    }
    if(pro.aE != null){
      sq = sq + ' and aE="' + pro.aE +'"';
    }
    if(pro.aQ != null){
      sq = sq + ' and aQ="' + pro.aQ +'"';
    }

    return this.sqlExec.execSql(sq,[]);
  }

  drT():Promise<any> {

    let sq ='DROP TABLE IF EXISTS GTD_A;';
    return this.sqlExec.execSql(sq,[]);
  }

  inT(pro:APro):Promise<any> {
    let sq ='insert into GTD_A ' +
      '(aI,aN,aM,aE,aT,aQ) values("'+ pro.aI+'","'+ pro.aN+'","'+pro.aM+ '"' +
      ',"'+pro.aE+ '","'+pro.aT+ '","'+pro.aQ+ '")';

    return this.sqlExec.execSql(sq,[]);
  }

  rpT(pro:APro):Promise<any> {
    let sq ='replace into GTD_A ' +
      '(aI,aN,aM,aE,aT,aQ) values("'+ pro.aI+'","'+ pro.aN+'","'+pro.aM+ '"' +
      ',"'+pro.aE+ '","'+pro.aT+ '","'+pro.aQ+ '")';

    return this.sqlExec.execSql(sq,[]);
  }

}

export class APro{
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

}

