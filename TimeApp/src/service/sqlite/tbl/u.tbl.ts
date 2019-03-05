import{Injectable}from'@angular/core';
import {BaseTbl} from "./base.tbl";
import {BaseSqlite} from "../base-sqlite";
import {ITbl} from "./itbl";

/**
 * create by on 2019/3/5
 */
@Injectable()
export class UTbl extends BaseTbl implements ITbl{
  constructor( private bs: BaseSqlite ){

    super( bs );
  }

  cT():Promise<any> {

    let sq ='CREATE TABLE IF NOT EXISTS GTD_U( uI varchar(50) PRIMARY KEY ,aI varchar(50)  ,' +
      'uN varchar(10)  ,hIU varchar(200)  ,biy varchar(10)  ,rn varchar(10)  ,iC varchar(20)  ,' +
      'uS int  ,uCt varchar(11);';

    return this._execT(sq);
  }

  upT(pro:BPro):Promise<any> {
    let sq='update GTD_U set 1=1 ';
    if(pro.uN!=null){
      sq=sq+', uN="' + pro.uN +'"';
    }
    if(pro.hIU!=null){
      sq=sq+', hIU="' + pro.hIU +'"';
    }
    if(pro.biy != null){
      sq = sq + ', biy="' + pro.biy +'"';
    }
    if(pro.rn != null){
      sq = sq + ', rn="' + pro.rn +'"';
    }
    if(pro.iC != null){
      sq = sq + ', iC="' + pro.iC +'"';
    }
    if(pro.uS != null){
      sq = sq + ', uS=' + pro.uS ;
    }
    if(pro.uCt != null){
      sq = sq + ', uCt="' + pro.uCt +'"';
    }
    sq = sq + ' where uI = "'+ pro.uI +'"';
    return this._execT(sq);
  }

  dT(pro:BPro):Promise<any> {
    let sq = 'delete from GTD_U where uI = "' + pro.uI +'"';
    return this._execT(sq);
  }

  sloT(pro:BPro):Promise<any> {
    let sq='select * GTD_U where uI = "'+ pro.uI +'"';
    return this._execT(sq);
  }

  slT(pro:BPro):Promise<any> {
    let sq='select *  GTD_U where  1=1 ';
    if(pro.hIU!=null){
      sq=sq+' and hIU="' + pro.hIU +'"';
    }
    if(pro.biy != null){
      sq = sq + ' and biy="' + pro.biy +'"';
    }
    if(pro.rn != null){
      sq = sq + ' and rn="' + pro.rn +'"';
    }
    if(pro.iC != null){
      sq = sq + ' and iC="' + pro.iC +'"';
    }
    if(pro.uS != null){
      sq = sq + ' and uS=' + pro.uS ;
    }
    if(pro.uCt != null){
      sq = sq + ' and uCt="' + pro.uCt +'"';
    }

    return this._execT(sq);
  }

  drT():Promise<any> {

    let sq ='DROP TABLE IF EXISTS GTD_U;';
    return this._execT(sq);
  }

  inT(pro:BPro):Promise<any> {
    let sq ='insert into GTD_U ' +
      '( uI ,aI ,uN ,hIU ,biy ,rn ,iC ,uS ,uCt) values("'+ pro.uI+'","'+ pro.aI+'","'+pro.uN+ '"' +
      ',"'+pro.hIU+ '","'+pro.biy+ '","'+pro.rn+ '","'+pro.iC+ '",'+ pro.uS + ',"'+pro.uCt+ '")';
    return this._execT(sq);
  }

  rpT(pro:BPro):Promise<any> {
    let sq ='replace into GTD_U ' +
      '( uI ,aI ,uN ,hIU ,biy ,rn ,iC ,uS ,uCt) values("'+ pro.uI+'","'+ pro.aI+'","'+pro.uN+ '"' +
      ',"'+pro.hIU+ '","'+pro.biy+ '","'+pro.rn+ '","'+pro.iC+ '",'+ pro.uS + ',"'+pro.uCt+ '")';

    return this._execT(sq);
  }


}

class BPro{

  private _uI :string;

  private _aI :string;

  private _uN :string;

  private _hIU :string;

  private _biy :string;

  private _rn :string;

  private _iC :string;

  private _uS :string;

  private _uCt :string;


  get uI(): string {
    return this._uI;
  }

  set uI(value: string) {
    this._uI = value;
  }

  get aI(): string {
    return this._aI;
  }

  set aI(value: string) {
    this._aI = value;
  }

  get uN(): string {
    return this._uN;
  }

  set uN(value: string) {
    this._uN = value;
  }

  get hIU(): string {
    return this._hIU;
  }

  set hIU(value: string) {
    this._hIU = value;
  }

  get biy(): string {
    return this._biy;
  }

  set biy(value: string) {
    this._biy = value;
  }

  get rn(): string {
    return this._rn;
  }

  set rn(value: string) {
    this._rn = value;
  }

  get iC(): string {
    return this._iC;
  }

  set iC(value: string) {
    this._iC = value;
  }

  get uS(): string {
    return this._uS;
  }

  set uS(value: string) {
    this._uS = value;
  }

  get uCt(): string {
    return this._uCt;
  }

  set uCt(value: string) {
    this._uCt = value;
  }

  clp(){
    this._uI = null;

    this._aI = null;

    this._uN = null;

    this._hIU= null;

    this._biy= null;

    this._rn = null;

    this._iC = null;

    this._uS = null;

    this._uCt= null;
  };
}
