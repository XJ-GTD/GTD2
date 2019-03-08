import{Injectable}from'@angular/core';
import {SqliteExec} from "../util-service/sqlite.exec";

/**
 * create by on 2019/3/5
 */
@Injectable()
export class GTbl  {

  constructor( private sqlExec: SqliteExec ){

  }

  cT():Promise<any> {

    let sq ='CREATE TABLE IF NOT EXISTS GTD_G(  gI varchar(50) PRIMARY KEY ,gN varchar(50)  ,gM varchar(50));';

    return this.sqlExec.execSql(sq,[]);
  }

  upT(pro:GPro):Promise<any> {
    let sq='update GTD_G set 1=1 ';
    if(pro.gN!=null){
      sq=sq+', gN="' + pro.gN +'"';
    }
    if(pro.gM!=null){
      sq=sq+', gM="' + pro.gM +'"';
    }
    sq = sq + ' where gI = "'+ pro.gI +'"';
    return this.sqlExec.execSql(sq,[]);
  }

  dT(pro:GPro):Promise<any> {
    let sq = 'delete from GTD_G where gI = "' + pro.gI +'"';
    return this.sqlExec.execSql(sq,[]);
  }

  sloT(pro:GPro):Promise<any> {
    let sq='select * from GTD_G where gI = "'+ pro.gI +'"';
    return this.sqlExec.execSql(sq,[]);
  }

  slT(pro:GPro):Promise<any> {
    let sq='select * from  GTD_G where  1=1 ';
    if(pro.gN!=null){
      sq=sq+', gN="' + pro.gN +'"';
    }
    if(pro.gM!=null){
      sq=sq+', gM="' + pro.gM +'"';
    }
    return this.sqlExec.execSql(sq,[]);
  }

  drT():Promise<any> {

    let sq ='DROP TABLE IF EXISTS GTD_G;';
    return this.sqlExec.execSql(sq,[]);
  }

  inT(pro:GPro):Promise<any> {
    let sq ='insert into GTD_G ' +
      '( gI ,gN ,gM) values("'+ pro.gI+'","'+ pro.gN+'","'+pro.gM+ '")';

    return this.sqlExec.execSql(sq,[]);
  }

  rpT(pro:GPro):Promise<any> {
    let sq ='replace into GTD_G ' +
      '( gI ,gN ,gM) values("'+ pro.gI+'","'+ pro.gN+'","'+pro.gM+ '")';

    return this.sqlExec.execSql(sq,[]);
  }

}

class GPro{

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

}

