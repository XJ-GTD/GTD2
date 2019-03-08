import{Injectable}from'@angular/core';
import {SqliteExec} from "../util-service/sqlite.exec";

/**
 * create by on 2019/3/5
 */
@Injectable()
export class YTbl  {

  constructor( private sqlExec: SqliteExec ){

  }


  cT():Promise<any> {

    let sq ='CREATE TABLE IF NOT EXISTS GTD_Y(  yi varchar(50) PRIMARY KEY ,yt VARCHAR(20)  ,' +
      'ytn VARCHAR(20)  ,yn VARCHAR(20)  ,yk VARCHAR(20)  ,yv VARCHAR(400)   );';

    return this.sqlExec.execSql(sq,[]);
  }

  upT(pro:YPro):Promise<any> {
    let sq='update GTD_Y set 1=1 ';
    if(pro.yt!=null){
      sq=sq+', yt="' + pro.yt +'"';
    }
    if(pro.ytn!=null){
      sq=sq+', ytn="' + pro.ytn +'"';
    }
    if(pro.yn != null){
      sq = sq + ', yn="' + pro.yn +'"';
    }
    if(pro.yk != null){
      sq = sq + ', yk="' + pro.yk +'"';
    }
    if(pro.yv != null){
      sq = sq + ', yv="' + pro.yv +'"';
    }
    sq = sq + ' where yi = "'+ pro.yi +'"';
    return this.sqlExec.execSql(sq,[]);
  }

  dT(pro:YPro):Promise<any> {
    let sq = 'delete from GTD_Y where yi = "' + pro.yi +'"';
    return this.sqlExec.execSql(sq,[]);
  }

  sloT(pro:YPro):Promise<any> {
    let sq='select * from GTD_Y where yi = "'+ pro.yi +'"';
    return this.sqlExec.execSql(sq,[]);
  }

  slT(pro:YPro):Promise<any> {
    let sq='select * from  GTD_Y where  1=1 ';
    if(pro.yt!=null){
      sq=sq+' and yt="' + pro.yt +'"';
    }
    if(pro.ytn!=null){
      sq=sq+' and ytn="' + pro.ytn +'"';
    }
    if(pro.yn != null){
      sq = sq + ' and yn="' + pro.yn +'"';
    }
    if(pro.yk != null){
      sq = sq + ' and yk="' + pro.yk +'"';
    }
    if(pro.yv != null){
      sq = sq + ' and yv="' + pro.yv +'"';
    }
    return this.sqlExec.execSql(sq,[]);
  }

  drT():Promise<any> {

    let sq ='DROP TABLE IF EXISTS GTD_Y;';
    return this.sqlExec.execSql(sq,[]);
  }

  inT(pro:YPro):Promise<any> {
    let sq ='insert into GTD_Y ' +
      '(  yi ,yt ,ytn ,yn ,yk ,yv) values("'+ pro.yi+'","'+ pro.yt+'","'+pro.ytn+ '"' +
      ',"'+pro.yn+ '","'+pro.yk+ '","'+pro.yv+ '")';

    return this.sqlExec.execSql(sq,[]);
  }

  rpT(pro:YPro):Promise<any> {
    let sq ='replace into GTD_Y ' +
      '(  yi ,yt ,ytn ,yn ,yk ,yv) values("'+ pro.yi+'","'+ pro.yt+'","'+pro.ytn+ '"' +
      ',"'+pro.yn+ '","'+pro.yk+ '","'+pro.yv+ '")';

    return this.sqlExec.execSql(sq,[]);
  }

}

class YPro{
  private _yi: string;
  private _yt: string;
  private _ytn: string;
  private _yn: string;
  private _yk: string;
  private _yv: string;


  get yi(): string {
    return this._yi;
  }

  set yi(value: string) {
    this._yi = value;
  }

  get yt(): string {
    return this._yt;
  }

  set yt(value: string) {
    this._yt = value;
  }

  get ytn(): string {
    return this._ytn;
  }

  set ytn(value: string) {
    this._ytn = value;
  }

  get yn(): string {
    return this._yn;
  }

  set yn(value: string) {
    this._yn = value;
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

  clp(){
    this._yi= null;
    this._yt= null;
    this._ytn= null;
    this._yn= null;
    this._yk= null;
    this._yv= null;

  };

}

