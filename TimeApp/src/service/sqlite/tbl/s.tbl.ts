import {ITbl} from "./itbl";

/**
 * create by on 2019/3/5
 */
export class STbl implements ITbl   {

  private _si: string="";
  private _st: string="";
  private _stn: string="";
  private _sn: string="";
  private _yk: string="";
  private _yv: string="";


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


  cT():string {

    let sq ='create table if not exists gtd_s( si varchar(50) primary key ,st varchar(20)  ,' +
      'stn varchar(20)  ,sn varchar(20)  ,yk varchar(20)  ,yv varchar(400)   );';

    return sq;
  }

  upT():string {
    let sq='';
    if(this._st!=null && this._st !=""){
      sq=sq+', st="' + this._st +'"';
    }
    if(this._stn!=null && this._stn!=""){
      sq=sq+', stn="' + this._stn +'"';
    }
    if(this._sn != null &&this._sn !=""){
      sq = sq + ', sn="' + this._sn +'"';
    }
    if(this._yk != null&&this._yk != ""){
      sq = sq + ', yk="' + this._yk +'"';
    }
    if(this._yv != null&&this._yv !=""){
      sq = sq + ', yv="' + this._yv +'"';
    }
    if (sq != null && sq != ""){
      sq = sq.substr(1);
    }
    sq ='update gtd_s set  '+ sq + ' where si = "'+ this._si +'";';
    return sq;
  }

  dT():string {
    let sq = 'delete from gtd_s where si = "' + this._si +'";';
    return sq;
  }

  sloT():string {
    let sq='select * from gtd_s where si = "'+ this._si +'";';
    return sq;
  }

  slT():string
  {
    let sq='select * from  gtd_s where  1=1 ';
    if(this._st!=null && this._st!=""){
      sq=sq+' and st="' + this._st +'"';
    }
    if(this._stn!=null && this._stn!=""){
      sq=sq+' and stn="' + this._stn +'"';
    }
    if(this._sn != null && this._sn != ""){
      sq = sq + ' and sn="' + this._sn +'"';
    }
    if(this._yk != null && this._yk != ""){
      sq = sq + ' and yk="' + this._yk +'"';
    }
    if(this._yv != null && this._yv != ""){
      sq = sq + ' and yv="' + this._yv +'"';
    }
    sq = sq +';';
    return sq;
  }

  drT():string {

    let sq ='drop table if exists gtd_s;';
    return sq;
  }

  inT():string {
    let sq ='insert into gtd_s ' +
      '( si ,st ,stn ,sn ,yk ,yv) values("'+ this._si+'","'+ this._st+'","'+this._stn+ '"' +
      ',"'+this._sn+ '","'+this._yk+ '","'+this._yv+ '");';

    return sq;
  }

  rpT():string {
    let sq ='replace into gtd_s ' +
      '( si ,st ,stn ,sn ,yk ,yv) values("'+ this._si+'","'+ this._st+'","'+this._stn+ '"' +
      ',"'+this._sn+ '","'+this._yk+ '","'+this._yv+ '");';

    return sq;
  }
  clp(){
    this._si ="";
    this._st ="";
    this._stn ="";
    this._sn ="";
    this._yk ="";
    this._yv ="";
  }
}

