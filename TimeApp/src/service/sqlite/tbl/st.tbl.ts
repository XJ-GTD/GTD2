
import {ITbl} from "./itbl";
import * as moment from "moment";

/**
 * create by on 2019/3/5
 * 日程总表
 */
export class StTbl  implements ITbl {
  get d(): string {
    return this._d;
  }

  set d(value: string) {
    this._d = value;
  }

  get c(): number {
    return this._c;
  }

  set c(value: number) {
    this._c = value;
  }

  get n(): boolean {
    return this._n;
  }

  set n(value: boolean) {
    this._n = value;
  }

  get bz(): string {
    return this._bz;
  }

  set bz(value: string) {
    this._bz = value;
  }

  get wtt(): number {
    return this._wtt;
  }

  set wtt(value: number) {
    this._wtt = value;
  }

  private _d: string="";
  private _c: number=0;
  private _n: boolean;
  private _bz: string="";
  private _wtt:number=0;



  cT():string {

    let sq =' create table if not exists gtd_st(d varchar(10) primary key ,c integer ,n boolean  ,bz varchar(50)  ,wtt integer);';

    return sq;
  }

  upT():string {
    let sq='';
    if(this._c!=null){
      sq=sq+', c="' + this._c +'"';
    }
    if(this._n != null){
      sq = sq + ', n=' + this._n ;
    }
    if(this._bz != null && this._bz!=""){
      sq = sq + ', bz="' + this._bz +'"';
    }
    if (sq != null && sq != ""){
      sq = sq.substr(1);
    }
    sq = 'update gtd_st set  '+sq + ' where d = "'+ this._d +'";';
    return sq;
  }

  dT():string {
    let sq = 'delete from gtd_st where 1=2 ';
    sq = sq + ';'
    return sq;
  }

  sloT():string {
    let sq='select * from gtd_st where d = "'+ this._d +'";';
    return sq;
  }

  slT():string {
    let sq='select * from  gtd_st where  1=1 ';
    sq = sq +';';
    return sq;
  }

  drT():string {

    let sq ='drop table if exists gtd_st;';
    return sq;
  }

  inT():string {
    let sq ='insert into gtd_st ' +
      '( d,c,n ,bz ,wtt) values("'+ this._d+'","'+ this._c+'","'+this._n+ '"' + '","'+this._bz+ '",' +  moment().unix() +');';

    return sq;
  }

  rpT():string {
    let sq ='replace into gtd_sp ' +
      '( d,c,n ,bz ,wtt) values("'+ this._d+'","'+ this._c+'","'+this._n+ '"' + '","'+this._bz+ '",' +  moment().unix() +');';

    return sq;
  }
}


