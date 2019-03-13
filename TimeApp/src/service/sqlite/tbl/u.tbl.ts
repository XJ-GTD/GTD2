import {ITbl} from "./itbl";

/**
 * create by on 2019/3/5
 */
export class UTbl  implements ITbl{


  private _ui :string="";

  private _ai :string="";

  private _un :string="";

  private _hiu :string="";

  private _biy :string="";

  private _rn :string="";

  private _ic :string="";

  private _us :string="";

  private _uct :string="";


  get ui(): string {
    return this._ui;
  }

  set ui(value: string) {
    this._ui = value;
  }

  get ai(): string {
    return this._ai;
  }

  set ai(value: string) {
    this._ai = value;
  }

  get un(): string {
    return this._un;
  }

  set un(value: string) {
    this._un = value;
  }

  get hiu(): string {
    return this._hiu;
  }

  set hiu(value: string) {
    this._hiu = value;
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

  get ic(): string {
    return this._ic;
  }

  set ic(value: string) {
    this._ic = value;
  }

  get us(): string {
    return this._us;
  }

  set us(value: string) {
    this._us = value;
  }

  get uct(): string {
    return this._uct;
  }

  set uct(value: string) {
    this._uct = value;
  }


  cT():string {

    let sq ='create table if not exists gtd_u( ui varchar(50) primary key ,ai varchar(50)  ,' +
      'un varchar(10)  ,hiu varchar(200)  ,biy varchar(10)  ,rn varchar(10)  ,ic varchar(20)  ,' +
      'us varchar(4)  ,uct varchar(11));';

    return sq;
  }

  upT():string {
    let sq='update gtd_u set  ';
    if(this._un!=null && this._un!=""){
      sq=sq+', un="' + this._un +'"';
    }
    if(this._hiu!=null && this._hiu!=""){
      sq=sq+', hiu="' + this._hiu +'"';
    }
    if(this._biy != null && this._biy!=""){
      sq = sq + ', biy="' + this._biy +'"';
    }
    if(this._rn != null && this._rn!=""){
      sq = sq + ', rn="' + this._rn +'"';
    }
    if(this._ic != null && this._ic!=""){
      sq = sq + ', ic="' + this._ic +'"';
    }
    if(this._us != null && this._us!=""){
      sq = sq + ', us="' + this._us +'"';
    }
    if(this._uct != null && this._uct!=""){
      sq = sq + ', uct="' + this._uct +'"';
    }
    sq = sq + ' where ui = "'+ this._ui +'"';
    sq = sq +';';
    return sq;
  }

  dT():string {
    let sq = 'delete from gtd_u where ui = "' + this._ui +'";';
    return sq;
  }

  sloT():string {
    let sq='select * from gtd_u where ui = "'+ this._ui +'";';
    return sq;
  }

  slT():string {
    let sq='select * from  gtd_u where  1=1 ';
    if(this._hiu!=null && this._hiu!=""){
      sq=sq+' and hiu="' + this._hiu +'"';
    }
    if(this._biy != null && this._biy!=""){
      sq = sq + ' and biy="' + this._biy +'"';
    }
    if(this._rn != null && this._rn!=""){
      sq = sq + ' and rn="' + this._rn +'"';
    }
    if(this._ic != null && this._ic!=""){
      sq = sq + ' and ic="' + this._ic +'"';
    }
    if(this._us != null && this._us!=""){
      sq = sq + ', us="' + this._us +'"';
    }
    if(this._uct != null && this._uct!=""){
      sq = sq + ' and uct="' + this._uct +'"';
    }
    sq = sq +';';
    return sq;
  }

  drT():string {

    let sq ='drop table if exists gtd_u;';
    return sq;
  }

  inT():string {
    let sq ='insert into gtd_u ' +
      '( ui ,ai ,un ,hiu ,biy ,rn ,ic ,us ,uct) values("'+ this._ui+'","'+ this._ai+'","'+this._un+ '"' +
      ',"'+this._hiu+ '","'+this._biy+ '","'+this._rn+ '","'+this._ic+ '","'+ this._us + '","'+this._uct+ '");';
    return sq;
  }

  rpT():string {
    let sq ='replace into gtd_u ' +
      '( ui ,ai ,un ,hiu ,biy ,rn ,ic ,us ,uct) values("'+ this._ui+'","'+ this._ai+'","'+this._un+ '"' +
      ',"'+this._hiu+ '","'+this._biy+ '","'+this._rn+ '","'+this._ic+ '","'+ this._us + '","'+this._uct+ '");';

    return sq;
  }
  clp(){
  this._ui ="";

  this._ai ="";

  this._un ="";

  this._hiu ="";

  this._biy ="";

  this._rn ="";

  this._ic ="";

  this._us ="";

  this._uct ="";
  }

}

