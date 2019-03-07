import{Injectable}from'@angular/core';
import {BaseTbl} from "./base.tbl";
import {BaseSqlite} from "../base-sqlite";
import {ITbl} from "./itbl";

/**
 * create by on 2019/3/5
 */
@Injectable()
export class JhTbl extends BaseTbl implements ITbl{
  constructor( private bs: BaseSqlite ){

    super( bs );
  }


  cT():Promise<any> {

    let sq ='CREATE TABLE IF NOT EXISTS GTD_J_H(  ji VARCHAR(50) PRIMARY KEY ,jn VARCHAR(100)  ,jg VARCHAR(100)' +
      ',jc VARCHAR(10));';

    return this._execT(sq);
  }

  upT(pro:JhPro):Promise<any> {
    let sq='update GTD_J_H set 1=1 ';
    if(pro.jn!=null){
      sq=sq+', jn="' + pro.jn +'"';
    }
    if(pro.jg!=null){
      sq=sq+', jg="' + pro.jg +'"';
    }
    if(pro.jc!=null){
      sq=sq+', jc="' + pro.jc +'"';
    }
    sq = sq + ' where ji = "'+ pro.ji +'"';
    return this._execT(sq);
  }

  dT(pro:JhPro):Promise<any> {
    let sq = 'delete from GTD_J_H where ji = "' + pro.ji +'"';
    return this._execT(sq);
  }

  sloT(pro:JhPro):Promise<any> {
    let sq='select * from GTD_J_H where ji = "'+ pro.ji +'"';
    return this._execT(sq);
  }

  slT(pro:JhPro):Promise<any> {
    let sq='select * from  GTD_J_H where  1=1 ';
    if(pro.jn!=null){
      sq=sq+' and jn="' + pro.jn +'"';
    }
    if(pro.jg!=null){
      sq=sq+' and jg="' + pro.jg +'"';
    }
    if(pro.jc!=null){
      sq=sq+' and jc="' + pro.jc +'"';
    }
    return this._execT(sq);
  }

  drT():Promise<any> {

    let sq ='DROP TABLE IF EXISTS GTD_J_H;';
    return this._execT(sq);
  }

  inT(pro:JhPro):Promise<any> {
    let sq ='insert into GTD_J_H ' +
      '(  ji ,jn ,jg,jc) values("'+ pro.ji+'","'+ pro.jn+'","'+pro.jg+ '","'+pro.jc+ '")';

    return this._execT(sq);
  }

  rpT(pro:JhPro):Promise<any> {
    let sq ='replace into GTD_J_H ' +
      '(  ji ,jn ,jg,jc) values("'+ pro.ji+'","'+ pro.jn+'","'+pro.jg+ '","'+pro.jc+ '")';

    return this._execT(sq);
  }

}

class JhPro{

  private _ji: string;
  private _jn: string;
  private _jg: string;
  private _jc: string;

  get jc(): string {
    return this._jc;
  }

  set jc(value: string) {
    this._jc = value;
  }

  get ji(): string {
    return this._ji;
  }

  set ji(value: string) {
    this._ji = value;
  }

  get jn(): string {
    return this._jn;
  }

  set jn(value: string) {
    this._jn = value;
  }

  get jg(): string {
    return this._jg;
  }

  set jg(value: string) {
    this._jg = value;
  }

  clp(){
    this._ji = null;
    this._jn = null;
    this._jg = null;
  };

}

