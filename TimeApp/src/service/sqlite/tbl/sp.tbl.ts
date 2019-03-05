import{Injectable}from'@angular/core';
import {BaseTbl} from "./base.tbl";
import {BaseSqlite} from "../base-sqlite";
import {ITbl} from "./itbl";

/**
 * create by on 2019/3/5
 */
@Injectable()
export class SpTbl extends BaseTbl implements ITbl{
  constructor( private bs: BaseSqlite ){

    super( bs );
  }


  cT():Promise<any> {

    let sq =' CREATE TABLE IF NOT EXISTS GTD_SP(spI varchar(50) PRIMARY KEY ,sI varchar(50)  ,' +
      'spN varchar(50)  ,sd varchar(20)' +
      '  ,st varchar(20)  ,ed varchar(20)  ,et varchar(20)  ,ji varchar(50)  ,bz varchar(50)  ,' +
      'sta int);';

    return this._execT(sq);
  }

  upT(pro:SpPro):Promise<any> {
    let sq='update GTD_SP set 1=1 ';
    if(pro.sI!=null){
      sq=sq+', sI="' + pro.sI +'"';
    }
    if(pro.spN!=null){
      sq=sq+', spN="' + pro.spN +'"';
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
    if(pro.ji != null){
      sq = sq + ', ji="' + pro.ji +'"';
    }
    if(pro.bz != null){
      sq = sq + ', bz="' + pro.bz +'"';
    }
    if(pro.sta != null){
      sq = sq + ', sta=' + pro.sta ;
    }
    sq = sq + ' where spI = "'+ pro.spI +'"';
    return this._execT(sq);
  }

  dT(pro:SpPro):Promise<any> {
    let sq = '';
    return this._execT(sq);
  }

  sloT(pro:SpPro):Promise<any> {
    let sq='';
    return this._execT(sq);
  }

  slT(pro:SpPro):Promise<any> {
    let sq=' ';

    return this._execT(sq);
  }

  drT():Promise<any> {

    let sq ='';
    return this._execT(sq);
  }

  inT(pro:SpPro):Promise<any> {
    let sq =' ' ;

    return this._execT(sq);
  }

  rpT(pro:SpPro):Promise<any> {
    let sq =' ' ;

    return this._execT(sq);
  }

}

class SpPro{
  private _spI: string;
  private _sI: string;
  private _spN: string;
  private _sd: string;
  private _st: string;
  private _ed: string;
  private _et: string;
  private _ji: string;
  private _bz: string;
  private _sta: string;


  get spI(): string {
    return this._spI;
  }

  set spI(value: string) {
    this._spI = value;
  }

  get sI(): string {
    return this._sI;
  }

  set sI(value: string) {
    this._sI = value;
  }

  get spN(): string {
    return this._spN;
  }

  set spN(value: string) {
    this._spN = value;
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

  get ji(): string {
    return this._ji;
  }

  set ji(value: string) {
    this._ji = value;
  }

  get bz(): string {
    return this._bz;
  }

  set bz(value: string) {
    this._bz = value;
  }

  get sta(): string {
    return this._sta;
  }

  set sta(value: string) {
    this._sta = value;
  }

  clp(){
    this._spI = null;
    this._sI = null;
    this._spN = null;
    this._sd = null;
    this._st = null;
    this._ed = null;
    this._et = null;
    this._ji = null;
    this._bz = null;
    this._sta = null;
  };

}

