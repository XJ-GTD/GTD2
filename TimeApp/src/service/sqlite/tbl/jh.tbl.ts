import {ITbl} from "./itbl";

/**
 * create by on 2019/3/5
 */
export class JhTbl  implements ITbl{


  private _ji: string="";
  private _jn: string="";
  private _jg: string="";
  private _jc: string="";
  private _jt: string="";

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

  get jt(): string {
    return this._jt;
  }

  set jt(value: string) {
    this._jt = value;
  }
  clp(){
    this._ji = "";
    this._jn = "";
    this._jg = "";
    this._jt = "";
  };

  cT():string{

    let sq ='create table if not exists gtd_j_h(  ji varchar(50) primary key ,jn varchar(100)  ,jg varchar(100)' +
      ',jc varchar(10),jt varchar(4));';

    return sq;
  }

  upT():string{
    let sq='';
    if(this._jn!=null && this._jn!=""){
      sq=sq+', jn="' + this._jn +'"';
    }
    if(this._jg!=null && this._jg!=""){
      sq=sq+', jg="' + this._jg +'"';
    }
    if(this._jc!=null && this._jc!=""){
      sq=sq+', jc="' + this._jc +'"';
    }
    if(this._jt!=null && this._jt!=""){
      sq=sq+', jt="' + this._jt +'"';
    }
    if (sq != null && sq != ""){
      sq = sq.substr(1);
    }
    sq = 'update gtd_j_h set  ' +sq + ' where ji = "'+ this._ji +'";';
    return sq;
  }

  dT():string{
    let sq = 'delete from gtd_j_h where ji = "' + this._ji +'";';
    return sq;
  }

  sloT():string{
    let sq='select * from gtd_j_h where ji = "'+ this._ji +'";';
    return sq;
  }

  slT():string{
    let sq='select * from  gtd_j_h where  1=1 ';
    if(this._jn!=null && this._jn!=""){
      sq=sq+' and jn="' + this._jn +'"';
    }
    if(this._jg!=null && this._jg!=""){
      sq=sq+' and jg="' + this._jg +'"';
    }
    if(this._jc!=null && this._jc!=""){
      sq=sq+' and jc="' + this._jc +'"';
    }
    if(this._jt!=null && this._jt!=""){
      sq=sq+' and jt="' + this._jt +'"';
    }
    sq = sq +';';
    return sq;
  }

  drT():string{

    let sq ='drop table if exists gtd_j_h;';
    return sq;
  }

  inT():string{
    let sq ='insert into gtd_j_h ' +
      '(  ji ,jn ,jg,jc,jt) values("'+ this._ji+'","'+ this._jn+'","'+this._jg+ '","'+this._jc+ '","'+this._jt+ '");';

    return sq;
  }

  rpT():string{
    let sq ='replace into gtd_j_h ' +
      '(  ji ,jn ,jg,jc,jt) values("'+ this._ji+'","'+ this._jn+'","'+this._jg+ '","'+this._jc+ '","'+this._jt+ '");';

    return sq;
  }

}
