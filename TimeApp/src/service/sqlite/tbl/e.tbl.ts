import {ITbl} from "./itbl";

/**
 * create by on 2019/3/5
 */
export class ETbl  implements ITbl {

  private _wi: string="";
  private _si: string="";
  private _st: string="";
  private _wd: string="";
  private _wt: string="";


  get wi(): string {
    return this._wi;
  }

  set wi(value: string) {
    this._wi = value;
  }

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

  get wd(): string {
    return this._wd;
  }

  set wd(value: string) {
    this._wd = value;
  }

  get wt(): string {
    return this._wt;
  }

  set wt(value: string) {
    this._wt = value;
  }

  clp(){
    this._wi=null;
    this._si=null;
    this._st=null;
    this._wd=null;
    this._wt=null;
  };

  cT():string{

    let sq ='create table if not exists gtd_e(  wi varchar(50) primary key ,si varchar(50)  ,' +
      'st varchar(50)  ,wd varchar(20)  ,wt varchar(20))';

    return sq;
  }

  upT():string{
    let sq='update gtd_e set 1=1 ';
    if(this._si!=null){
      sq=sq+', si="' + this._si +'"';
    }
    if(this._st!=null){
      sq=sq+', st="' + this._st +'"';
    }
    if(this._wd != null){
      sq = sq + ', wd="' + this._wd +'"';
    }
    if(this._wt != null){
      sq = sq + ', wt="' + this._wt +'"';
    }
    sq = sq + ' where wi = "'+ this._wi +'"';
    return sq;
  }

  dT():string{
    let sq = 'delete from gtd_e where wi = "' + this._wi +'"';
    return sq;
  }

  sloT():string{
    let sq='select * from gtd_e where wi = "'+ this._wi +'"';

    return sq;
  }

  slT():string{
    let sq='select * from  gtd_e where  1=1 ';
    if(this._si!=null){
      sq=sq+' and si="' + this._si +'"';
    }
    if(this._st!=null){
      sq=sq+' and st="' + this._st +'"';
    }
    if(this._wd != null){
      sq = sq + ' and wd="' + this._wd +'"';
    }
    if(this._wt != null){
      sq = sq + ' and wt="' + this._wt +'"';
    }
    return sq;
  }

  drT():string{

    let sq ='drop table if exists gtd_e;';
    return sq;
  }

  inT():string{
    let sq ='insert into gtd_e ' +
      '(  wi ,si ,st ,wd ,wt) values("'+ this._wi+'","'+ this._si+'","'+this._st+ '"' +
      ',"'+this._wd+ '","'+this._wt+ '")';

    return sq;
  }

  rpT():string{
    let sq ='replace into gtd_e ' +
      '(  wi ,si ,st ,wd ,wt) values("'+ this._wi+'","'+ this._si+'","'+this._st+ '"' +
      ',"'+this._wd+ '","'+this._wt+ '")';

    return sq;
  }

}
