import{Injectable}from'@angular/core';
import {ITbl} from "./itbl";
import {SqliteExec} from "../../util-service/sqlite.exec";

/**
 * create by on 2019/3/5
 */
@Injectable()
export class STbl  {

  constructor( private sqlExec: SqliteExec ){

  }


  cT():Promise<any> {

    let sq ='CREATE TABLE IF NOT EXISTS GTD_S( si varchar(50) PRIMARY KEY ,st VARCHAR(20)  ,' +
      'stn VARCHAR(20)  ,sn VARCHAR(20)  ,yk VARCHAR(20)  ,yv VARCHAR(400)   );';

    return this.sqlExec.execSql(sq,[]);
  }

  upT(pro:SPro):Promise<any> {
    let sq='update GTD_S set 1=1 ';
    if(pro.st!=null){
      sq=sq+', st="' + pro.st +'"';
    }
    if(pro.stn!=null){
      sq=sq+', stn="' + pro.stn +'"';
    }
    if(pro.sn != null){
      sq = sq + ', sn="' + pro.sn +'"';
    }
    if(pro.yk != null){
      sq = sq + ', yk="' + pro.yk +'"';
    }
    if(pro.yv != null){
      sq = sq + ', yv="' + pro.yv +'"';
    }
    sq = sq + ' where si = "'+ pro.si +'"';
    return this.sqlExec.execSql(sq,[]);
  }

  dT(pro:SPro):Promise<any> {
    let sq = 'delete from GTD_S where si = "' + pro.si +'"';
    return this.sqlExec.execSql(sq,[]);
  }

  sloT(pro:SPro):Promise<any> {
    let sq='select * from GTD_S where si = "'+ pro.si +'"';
    return this.sqlExec.execSql(sq,[]);
  }

  slT(pro:SPro):Promise<Array<SPro>>
  {
    let sq='select * from  GTD_S where  1=1 ';
    if(pro.st!=null){
      sq=sq+' and st="' + pro.st +'"';
    }
    if(pro.stn!=null){
      sq=sq+' and stn="' + pro.stn +'"';
    }
    if(pro.sn != null){
      sq = sq + ' and sn="' + pro.sn +'"';
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

    let sq ='DROP TABLE IF EXISTS GTD_S;';
    return this.sqlExec.execSql(sq,[]);
  }

  inT(pro:SPro):Promise<any> {
    let sq ='insert into GTD_S ' +
      '( si ,st ,stn ,sn ,yk ,yv) values("'+ pro.si+'","'+ pro.st+'","'+pro.stn+ '"' +
      ',"'+pro.sn+ '","'+pro.yk+ '","'+pro.yv+ '")';

    return this.sqlExec.execSql(sq,[]);
  }

  rpT(pro:SPro):Promise<any> {
    let sq ='replace into GTD_S ' +
      '( si ,st ,stn ,sn ,yk ,yv) values("'+ pro.si+'","'+ pro.st+'","'+pro.stn+ '"' +
      ',"'+pro.sn+ '","'+pro.yk+ '","'+pro.yv+ '")';

    return this.sqlExec.execSql(sq,[]);
  }

}

export class SPro{
  private _si: string;
  private _st: string;
  private _stn: string;
  private _sn: string;
  private _yk: string;
  private _yv: string;


  get si(): string {
    return this._si;
  }

  set si(value: string) {
    this._si = value;
  }

  get st(): string {
    return this._st;
  }

  set st(value: string) {
    this._st = value;
  }

  get stn(): string {
    return this._stn;
  }

  set stn(value: string) {
    this._stn = value;
  }

  get sn(): string {
    return this._sn;
  }

  set sn(value: string) {
    this._sn = value;
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
    this._si=null;
    this._st=null;
    this._stn=null;
    this._sn=null;
    this._yk=null;
    this._yv=null;

  };

}

