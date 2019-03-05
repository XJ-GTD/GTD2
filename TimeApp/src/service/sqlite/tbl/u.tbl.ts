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

  ssqC(){
    let sq ='CREATE TABLE IF NOT EXISTS GTD_U( uI varchar(50) PRIMARY KEY ,aI varchar(50)  ,' +
      'uN varchar(10)  ,hIU varchar(200)  ,biy varchar(10)  ,rn varchar(10)  ,iC varchar(20)  ,' +
      'uS int  ,uCt varchar(11);';
    this.sq = sq;
  }

  ssqUp(){
    let sq='update GTD_U set 1=1 ';
    if(this._uN!=null){
      sq=sq+', uN="' + this._uN +'"';
    }
    if(this._hIU!=null){
      sq=sq+', hIU="' + this._hIU +'"';
    }
    if(this._biy != null){
      sq = sq + ', biy="' + this._biy +'"';
    }
    if(this._rn != null){
      sq = sq + ', rn="' + this._rn +'"';
    }
    if(this._iC != null){
      sq = sq + ', iC="' + this._iC +'"';
    }
    if(this._uS != null){
      sq = sq + ', uS=" + this._uS +"';
    }
    if(this._uCt != null){
      sq = sq + ', uCt="' + this._uCt +'"';
    }
    sq = sq + ' where uI = "'+ this._uI +'"';
    this.sq = sq;
  }

  ssqD(){
    let sq = 'delete from GTD_U where uI = "' + this._uI +'"';
    this.sq = sq;
  }

  ssqSlo(){
    let sq='select * GTD_U where uI = "'+ this._uI +'"';
    this.sq = sq;
  }

  ssqSl(){
    let sq='select *  GTD_A where  1=1 ';
    if(this._hIU!=null){
      sq=sq+' and hIU="' + this._hIU +'"';
    }
    if(this._biy != null){
      sq = sq + ' and biy="' + this._biy +'"';
    }
    if(this._rn != null){
      sq = sq + ' and rn="' + this._rn +'"';
    }
    if(this._iC != null){
      sq = sq + ' and iC="' + this._iC +'"';
    }
    if(this._uS != null){
      sq = sq + ' and uS=" + this._uS +"';
    }
    if(this._uCt != null){
      sq = sq + ' and uCt="' + this._uCt +'"';
    }
    this.sq = sq;
  }
  ssqDr(){
    let sq ='DROP TABLE IF EXISTS GTD_U;';
    this.sq = sq;
  }

  ssqIn(){
    let sq ='insert into GTD_U ' +
      '( uI ,aI ,uN ,hIU ,biy ,rn ,iC ,uS ,uCt) values("'+ this._uI+'","'+ this._aI+'","'+this._uN+ '"' +
      ',"'+this._hIU+ '","'+this._biy+ '","'+this._rn+ '","'+this._iC+ '","+this._uS+ ",,"'+this._uCt+ '")';
    this.sq = sq;
  }

  ssqRp(){
    let sq ='replace into GTD_U ' +
      '( uI ,aI ,uN ,hIU ,biy ,rn ,iC ,uS ,uCt) values("'+ this._uI+'","'+ this._aI+'","'+this._uN+ '"' +
      ',"'+this._hIU+ '","'+this._biy+ '","'+this._rn+ '","'+this._iC+ '","+this._uS+ ",,"'+this._uCt+ '")';
    this.sq = sq;
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
