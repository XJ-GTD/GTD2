/**
 * create by on 2019/3/5
 */
import {ITbl} from "./itbl";


export class BTbl implements ITbl{
  private _pwi: string="";
  private _ran: string="";
  private _ranpy: string="";
  private _ri: string="";
  private _hiu: string="";
  private _rn: string="";
  private _rnpy: string="";
  private _rc: string="";
  private _rf: string="";
  private _ot: string="";
  private _rel: string="";
  private _ui: string="";


  get pwi(): string {
    return this._pwi;
  }

  set pwi(value: string) {
    this._pwi = value;
  }

  get ran(): string {
    return this._ran;
  }

  set ran(value: string) {
    this._ran = value;
  }

  get ranpy(): string {
    return this._ranpy;
  }

  set ranpy(value: string) {
    this._ranpy = value;
  }

  get ri(): string {
    return this._ri;
  }

  set ri(value: string) {
    this._ri = value;
  }

  get hiu(): string {
    return this._hiu;
  }

  set hiu(value: string) {
    this._hiu = value;
  }

  get rn(): string {
    return this._rn;
  }

  set rn(value: string) {
    this._rn = value;
  }

  get rnpy(): string {
    return this._rnpy;
  }

  set rnpy(value: string) {
    this._rnpy = value;
  }

  get rc(): string {
    return this._rc;
  }

  set rc(value: string) {
    this._rc = value;
  }

  get rf(): string {
    return this._rf;
  }

  set rf(value: string) {
    this._rf = value;
  }

  get ot(): string {
    return this._ot;
  }

  set ot(value: string) {
    this._ot = value;
  }

  get rel(): string {
    return this._rel;
  }

  set rel(value: string) {
    this._rel = value;
  }

  get ui(): string {
    return this._ui;
  }

  set ui(value: string) {
    this._ui = value;
  }

  clp(){
    this._pwi = null;
    this._ran = null;
    this._ranpy = null;
    this._ri = null;
    this._hiu = null;
    this._rn = null;
    this._rnpy = null;
    this._rc = null;
    this._rf = null;
    this._ot = null;
    this._rel = null;
    this._ui = null;

  };

  cT():string {

    let sq =' create table if not exists gtd_b( pwi varchar(50) primary key ,ran varchar(50)  ,' +
      'ranpy varchar(20)  ,ri varchar(50)  ,hiu varchar(200)  ,rn varchar(20)  ,' +
      'rnpy varchar(20)  ,rc varchar(20)  ,rf varchar(4)  ,ot varchar(4)  ,rel varchar(4)  ,' +
      'ui varchar(50) );';

    return sq;
  }

  upT():string {
    let sq='update gtd_b set 1=1 ';
    if(this._ran!=null){
      sq=sq+', ran="' + this._ran +'"';
    }
    if(this._ranpy!=null){
      sq=sq+', ranpy="' + this._ranpy +'"';
    }
    if(this._ri != null){
      sq = sq + ', ri="' + this._ri +'"';
    }
    if(this._hiu != null){
      sq = sq + ', hiu="' + this._hiu +'"';
    }
    if(this._rn != null){
      sq = sq + ', rn="' + this._rn +'"';
    }
    if(this._rnpy != null){
      sq = sq + ', rnpy="' + this._rnpy +'"';
    }
    if(this._rc != null){
      sq = sq + ', rc="' + this._rc +'"';
    }
    if(this._rf != null){
      sq = sq + ', rf="' + this._rf +'"';
    }
    if(this._ot != null){
      sq = sq + ', ot="' + this._ot +'"';
    }
    if(this._rel != null){
      sq = sq + ', rel="' + this._rel +'"';
    }
    if(this._ui != null){
      sq = sq + ', ui="' + this._ui +'"';
    }
    sq = sq + ' where pwi = "'+ this._pwi +'"';
    return sq;
  }

  dT():string {
    let sq = 'delete from gtd_b where pwi = "' + this._pwi +'"';
    return sq;
  }

  sloT():string {
    let sq='select * from gtd_b where pwi = "'+ this._pwi +'"';
    return sq;
  }

  slT():string {
    let sq='select * from  gtd_b where  1=1 ';
    if(this._ran!=null){
      sq=sq+' and ran="' + this._ran +'"';
    }
    if(this._ranpy!=null){
      sq=sq+' and ranpy="' + this._ranpy +'"';
    }
    if(this._ri != null){
      sq = sq + ' and ri="' + this._ri +'"';
    }
    if(this._hiu != null){
      sq = sq + ' and hiu="' + this._hiu +'"';
    }
    if(this._rn != null){
      sq = sq + ' and rn="' + this._rn +'"';
    }
    if(this._rnpy != null){
      sq = sq + ' and rnpy="' + this._rnpy +'"';
    }
    if(this._rc != null){
      sq = sq + ' and rc="' + this._rc +'"';
    }
    if(this._rf != null){
      sq = sq + ' and rf="' + this._rf +'"';
    }
    if(this._ot != null){
      sq = sq + ' and ot="' + this._ot +'"';
    }
    if(this._rel != null){
      sq = sq + ' and rel="' + this._rel +'"';
    }
    if(this._ui != null){
      sq = sq + ' and ui="' + this._ui +'"';
    }
    return sq;
  }

  drT():string {

    let sq ='drop table if exists gtd_b;';
    return sq;
  }

  inT():string {
    let sq ='insert into gtd_b ' +
      '(  pwi ,ran ,ranpy ,ri ,hiu ,rn ,rnpy ,rc ,rf ,ot ,rel ,ui) values("'+ this._pwi+'",' +
      '"'+ this._ran+'","'+this._ranpy+ '"' +
      ',"'+this._ri+ '","'+this._hiu+ '","'+this._rn+ '","'+this._rnpy+ '","'+this._rc+ '","'+this._rf+ '",' +
      '"'+this._ot+ '","'+this._rel+ '","'+this._ui+ '")';

    return sq;
  }

  rpT():string {
    let sq ='replace into gtd_b ' +
      '(  pwi ,ran ,ranpy ,ri ,hiu ,rn ,rnpy ,rc ,rf ,ot ,rel ,ui) values("'+ this._pwi+'",' +
      '"'+ this._ran+'","'+this._ranpy+ '"' +
      ',"'+this._ri+ '","'+this._hiu+ '","'+this._rn+ '","'+this._rnpy+ '","'+this._rc+ '","'+this._rf+ '",' +
      '"'+this._ot+ '","'+this._rel+ '","'+this._ui+ '")';

    return sq;
  }

}



