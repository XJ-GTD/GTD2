import{Injectable}from'@angular/core';
import {BaseTbl} from "./base.tbl";
import {BaseSqlite} from "../base-sqlite";
import {ITbl} from "./itbl";

/**
 * create by on 2019/3/5
 */
@Injectable()
export class CTbl extends BaseTbl implements ITbl{
  constructor( private bs: BaseSqlite ){

    super( bs );
  }


  cT():Promise<any> {

    let sq =' sI varchar(50) PRIMARY KEY ,sN varchar(50)  ,uI varchar(50)  ,sd varchar(20)  ' +
      ',st varchar(20)  ,ed varchar(20)  ,et varchar(20)  ,rT varchar(4)  ,ji varchar(50);';

    return this._execT(sq);
  }

  upT(pro:CPro):Promise<any> {
    let sq='update GTD_C set 1=1 ';
    if(pro.sN!=null){
      sq=sq+', sN="' + pro.sN +'"';
    }
    if(pro.uI!=null){
      sq=sq+', uI="' + pro.uI +'"';
    }
    if(pro.sd != null){
      sq = sq + ', sd="' + pro.sd +'"';
    }
    if(pro.st != null){
      sq = sq + ', st="' + pro.st +'"';
    }
    if(pro.ed != null){
      sq = sq + ', ed="' + pro.ed +'"';
    }
    if(pro.et != null){
      sq = sq + ', et="' + pro.et +'"';
    }
    if(pro.rT != null){
      sq = sq + ', rT="' + pro.rT +'"';
    }
    if(pro.ji != null){
      sq = sq + ', ji="' + pro.ji +'"';
    }
    sq = sq + ' where sI = "'+ pro.sI +'"';
    return this._execT(sq);
  }

  dT(pro:CPro):Promise<any> {
    let sq = 'delete from GTD_C where sI = "' + pro.sI +'"';
    return this._execT(sq);
  }

  sloT(pro:CPro):Promise<any> {
    let sq='select * GTD_C where sI = "'+ pro.sI +'"';
    return this._execT(sq);
  }

  slT(pro:CPro):Promise<any> {
    let sq='select *  GTD_C where  1=1 ';
    if(pro.sN!=null){
      sq=sq+' and sN="' + pro.sN +'"';
    }
    if(pro.uI!=null){
      sq=sq+' and uI="' + pro.uI +'"';
    }
    if(pro.sd != null){
      sq = sq + ' and sd="' + pro.sd +'"';
    }
    if(pro.st != null){
      sq = sq + ' and st="' + pro.st +'"';
    }
    if(pro.ed != null){
      sq = sq + ' and ed="' + pro.ed +'"';
    }
    if(pro.et != null){
      sq = sq + ' and et="' + pro.et +'"';
    }
    if(pro.rT != null){
      sq = sq + ' and rT="' + pro.rT +'"';
    }
    if(pro.ji != null){
      sq = sq + ' and ji="' + pro.ji +'"';
    }
    if(pro.sI != null){
      sq = sq + ' and sI="' + pro.sI +'"';
    }
    return this._execT(sq);
  }

  drT():Promise<any> {

    let sq ='DROP TABLE IF EXISTS GTD_C;';
    return this._execT(sq);
  }

  inT(pro:CPro):Promise<any> {
    let sq ='insert into GTD_C ' +
      '( sI ,sN ,uI ,sd ,st ,ed ,et ,rT ,ji) values("'+ pro.sI+'","'+ pro.sN+'","'+pro.uI+ '"' +
      ',"'+pro.sd+ '","'+pro.st+ '","'+pro.ed+ '","'+pro.et+ '","'+pro.rT+ '","'+pro.ji+ '")';

    return this._execT(sq);
  }

  rpT(pro:CPro):Promise<any> {
    let sq ='replace into GTD_C ' +
      '( sI ,sN ,uI ,sd ,st ,ed ,et ,rT ,ji) values("'+ pro.sI+'","'+ pro.sN+'","'+pro.uI+ '"' +
      ',"'+pro.sd+ '","'+pro.st+ '","'+pro.ed+ '","'+pro.et+ '","'+pro.rT+ '","'+pro.ji+ '")';

    return this._execT(sq);
  }

}

class CPro{

  private _sI: string;
  private _sN: string;
  private _uI: string;
  private _sd: string;
  private _st: string;
  private _ed: string;
  private _et: string;
  private _rT: string;
  private _ji: string;


  get sI(): string {
    return this._sI;
  }

  set sI(value: string) {
    this._sI = value;
  }

  get sN(): string {
    return this._sN;
  }

  set sN(value: string) {
    this._sN = value;
  }

  get uI(): string {
    return this._uI;
  }

  set uI(value: string) {
    this._uI = value;
  }

  get sd(): string {
    return this._sd;
  }

  set sd(value: string) {
    this._sd = value;
  }

  get st(): string {
    return this._st;
  }

  set st(value: string) {
    this._st = value;
  }

  get ed(): string {
    return this._ed;
  }

  set ed(value: string) {
    this._ed = value;
  }

  get et(): string {
    return this._et;
  }

  set et(value: string) {
    this._et = value;
  }

  get rT(): string {
    return this._rT;
  }

  set rT(value: string) {
    this._rT = value;
  }

  get ji(): string {
    return this._ji;
  }

  set ji(value: string) {
    this._ji = value;
  }

  clp(){
    this._sI = null;
    this._sN = null;
    this._uI = null;
    this._sd = null;
    this._st = null;
    this._ed = null;
    this._et = null;
    this._rT = null;
    this._ji = null;
  };

}

