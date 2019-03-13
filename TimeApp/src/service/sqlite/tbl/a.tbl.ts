import {ITbl} from "./itbl";

/**
 * create by on 2019/3/5
 */
export class ATbl implements ITbl {

  private _ai :string="";

  private _an :string="";

  private _am :string="";

  private _ae :string="";

  private _at :string="";

  private _aq :string="";


  get ai(): string {
    return this._ai;
  }

  set ai(value: string) {
    this._ai = value;
  }

  get an(): string {
    return this._an;
  }

  set an(value: string) {
    this._an = value;
  }

  get am(): string {
    return this._am;
  }

  set am(value: string) {
    this._am = value;
  }

  get ae(): string {
    return this._ae;
  }

  set ae(value: string) {
    this._ae = value;
  }

  get at(): string {
    return this._at;
  }

  set at(value: string) {
    this._at = value;
  }

  get aq(): string {
    return this._aq;
  }

  set aq(value: string) {
    this._aq = value;
  }

  cT():string {

    let sq ='create table if not exists gtd_a(ai varchar(50) primary key,' +
      'an varchar(10),am varchar(11),ae varchar(20) ,at varchar(50) ,aq varchar(100));';

    return sq;
  }

  upT():string {
    let sq='update gtd_a set  ';
    if(this._an!=null && this._an!=""){
      sq=sq+', an="' + this._an +'"';
    }
    if(this._am!=null && this._am!=""){
      sq=sq+', am="' + this._am +'"';
    }
    if(this._ae != null && this._ae!=""){
      sq = sq + ', ae="' + this._ae +'"';
    }
    if(this._aq != null && this._aq!=""){
      sq = sq + ', aq="' + this._aq +'"';
    }
    sq = sq + ' where ai = "'+ this._ai +'";';
    return sq;
  }

  dT():string {
    let sq = 'delete from gtd_a where ai = "' + this._ai +'";';
    return sq;
  }

  sloT():string {
    let sq='select * from gtd_a;';
    return sq;
  }

  slT():string {
    let sq='select * from  gtd_a where  1=1 ';
    if(this._ai != null && this._ai!=""){
      sq = sq + ' and ai="' + this._ai +'"';
    }
    if(this._an!=null && this._an!=""){
      sq=sq+' and an="' + this._an +'"';
    }
    if(this._am!=null && this._am!=""){
      sq=sq+' and am="' + this._am +'"';
    }
    if(this._ae != null && this._ae!=""){
      sq = sq + ' and ae="' + this._ae +'"';
    }
    if(this._aq != null && this._aq!=""){
      sq = sq + ' and aq="' + this._aq +'"';
    }
    sq = sq + ';';
    return sq;
  }

  drT():string {

    let sq ='drop table if exists gtd_a;';
    return sq;
  }

  inT():string {
    let sq ='insert into gtd_a ' +
      '(ai,an,am,ae,at,aq) values("'+ this._ai+'","'+ this._an+'","'+this._am+ '"' +
      ',"'+this._ae+ '","'+this._at+ '","'+this._aq+ '");';

    return sq;
  }

  rpT():string {
    let sq ='replace into gtd_a ' +
      '(ai,an,am,ae,at,aq) values("'+ this._ai+'","'+ this._an+'","'+this._am+ '"' +
      ',"'+this._ae+ '","'+this._at+ '","'+this._aq+ '");';

    return sq;
  }
  clp(){
    this._ai = "";
    this._an = "";
    this._ae= "";
    this._at = "";
    this._aq= "";
  };
}

