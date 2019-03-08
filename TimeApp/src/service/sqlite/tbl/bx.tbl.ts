import{Injectable}from'@angular/core';
import {SqliteExec} from "../../util-service/sqlite.exec";

/**
 * create by on 2019/3/5
 */
@Injectable()
export class BxTbl {

  constructor( private sqlExec: SqliteExec ){

  }

  cT():Promise<any> {

    let sq ='CREATE TABLE IF NOT EXISTS GTD_B_X( bi varchar(50) PRIMARY KEY ,bmi varchar(50));';

    return this.sqlExec.execSql(sq,[]);
  }

  upT(pro:BxPro):Promise<any> {
    let sq='update GTD_B_X set 1=1 ';
    if(pro.bmi!=null){
      sq=sq+', bmi="' + pro.bmi +'"';
    }
    sq = sq + ' where bi = "'+ pro.bi +'"';
    return this.sqlExec.execSql(sq,[]);
  }

  dT(pro:BxPro):Promise<any> {
    let sq = 'delete from GTD_B_X where bi = "' + pro.bi +'"';
    return this.sqlExec.execSql(sq,[]);
  }

  sloT(pro:BxPro):Promise<any> {
    let sq='select * from GTD_B_X where bi = "'+ pro.bi +'"';
    return this.sqlExec.execSql(sq,[]);
  }

  slT(pro:BxPro):Promise<any> {
    let sq='select * from GTD_B_X where  1=1 ';
    if(pro.bmi!=null){
      sq=sq+' and bmi="' + pro.bmi +'"';
    }
    return this.sqlExec.execSql(sq,[]);
  }

  drT():Promise<any> {

    let sq ='DROP TABLE IF EXISTS GTD_B_X;';
    return this.sqlExec.execSql(sq,[]);
  }

  inT(pro:BxPro):Promise<any> {
    let sq ='insert into GTD_G ' +
      '(  bi ,bmi) values("'+ pro.bi+'","'+ pro.bmi+'")';

    return this.sqlExec.execSql(sq,[]);
  }

  rpT(pro:BxPro):Promise<any> {
    let sq ='replace into GTD_G ' +
      '(  bi ,bmi) values("'+ pro.bi+'","'+ pro.bmi+'")';

    return this.sqlExec.execSql(sq,[]);
  }

}

class BxPro{
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

}

