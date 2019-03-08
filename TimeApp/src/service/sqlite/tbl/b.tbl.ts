/**
 * create by on 2019/3/5
 */
import {ITbl} from "./itbl";
import {UtilService} from "../../util-service/util.service";


export class BTbl implements ITbl{
  constructor(private util : UtilService){

  }
  private _pwI: string="";
  private _ran: string="";
  private _ranpy: string="";
  private _rI: string="";
  private _hiu: string="";
  private _rN: string="";
  private _rNpy: string="";
  private _rC: string="";
  private _rF: string="";
  private _ot: string="";
  private _rel: string="";
  private _uI: string="";


  get pwI(): string {
    return this._pwI;
  }

  set pwI(value: string) {
    this._pwI = value;
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

  get rI(): string {
    return this._rI;
  }

  set rI(value: string) {
    this._rI = value;
  }

  get hiu(): string {
    return this._hiu;
  }

  set hiu(value: string) {
    this._hiu = value;
  }

  get rN(): string {
    return this._rN;
  }

  set rN(value: string) {
    this._rN = value;
  }

  get rNpy(): string {
    return this._rNpy;
  }

  set rNpy(value: string) {
    this._rNpy = value;
  }

  get rC(): string {
    return this._rC;
  }

  set rC(value: string) {
    this._rC = value;
  }

  get rF(): string {
    return this._rF;
  }

  set rF(value: string) {
    this._rF = value;
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

  get uI(): string {
    return this._uI;
  }

  set uI(value: string) {
    this._uI = value;
  }

  clp(){
    this._pwI = null;
    this._ran = null;
    this._ranpy = null;
    this._rI = null;
    this._hiu = null;
    this._rN = null;
    this._rNpy = null;
    this._rC = null;
    this._rF = null;
    this._ot = null;
    this._rel = null;
    this._uI = null;

  };

  cT():string {

    let sq =' CREATE TABLE IF NOT EXISTS GTD_B( pwI varchar(50) PRIMARY KEY ,ran varchar(50)  ,' +
      'ranpy varchar(20)  ,rI varchar(50)  ,hiu varchar(200)  ,rN varchar(20)  ,' +
      'rNpy varchar(20)  ,rC varchar(20)  ,rF varchar(4)  ,ot varchar(4)  ,rel varchar(4)  ,' +
      'uI varchar(50) );';

    return sq;
  }

  upT():string {
    let sq='update GTD_B set 1=1 ';
    if(this._ran!=null){
      sq=sq+', ran="' + this._ran +'"';
    }
    if(this._ranpy!=null){
      sq=sq+', ranpy="' + this._ranpy +'"';
    }
    if(this._rI != null){
      sq = sq + ', rI="' + this._rI +'"';
    }
    if(this._hiu != null){
      sq = sq + ', hiu="' + this._hiu +'"';
    }
    if(this._rN != null){
      sq = sq + ', rN="' + this._rN +'"';
    }
    if(this._rNpy != null){
      sq = sq + ', rNpy="' + this._rNpy +'"';
    }
    if(this._rC != null){
      sq = sq + ', rC="' + this._rC +'"';
    }
    if(this._rF != null){
      sq = sq + ', rF="' + this._rF +'"';
    }
    if(this._ot != null){
      sq = sq + ', ot="' + this._ot +'"';
    }
    if(this._rel != null){
      sq = sq + ', rel="' + this._rel +'"';
    }
    if(this._uI != null){
      sq = sq + ', uI="' + this._uI +'"';
    }
    sq = sq + ' where pwI = "'+ this._pwI +'"';
    return sq;
  }

  dT():string {
    let sq = 'delete from GTD_B where pwI = "' + this._pwI +'"';
    return sq;
  }

  sloT():string {
    let sq='select * from GTD_B where pwI = "'+ this._pwI +'"';
    return sq;
  }

  slT():string {
    let sq='select * from  GTD_B where  1=1 ';
    if(this._ran!=null){
      sq=sq+' and ran="' + this._ran +'"';
    }
    if(this._ranpy!=null){
      sq=sq+' and ranpy="' + this._ranpy +'"';
    }
    if(this._rI != null){
      sq = sq + ' and rI="' + this._rI +'"';
    }
    if(this._hiu != null){
      sq = sq + ' and hiu="' + this._hiu +'"';
    }
    if(this._rN != null){
      sq = sq + ', rN="' + this._rN +'"';
    }
    if(this._rNpy != null){
      sq = sq + ' and rNpy="' + this._rNpy +'"';
    }
    if(this._rC != null){
      sq = sq + ' and rC="' + this._rC +'"';
    }
    if(this._rF != null){
      sq = sq + ' and rF="' + this._rF +'"';
    }
    if(this._ot != null){
      sq = sq + ' and ot="' + this._ot +'"';
    }
    if(this._rel != null){
      sq = sq + ' and rel="' + this._rel +'"';
    }
    if(this._uI != null){
      sq = sq + ' and uI="' + this._uI +'"';
    }
    return sq;
  }

  drT():string {

    let sq ='DROP TABLE IF EXISTS GTD_B;';
    return sq;
  }

  inT():string {
    this._pwI = this.util.getUuid();
    let sq ='insert into GTD_B ' +
      '(  pwI ,ran ,ranpy ,rI ,hiu ,rN ,rNpy ,rC ,rF ,ot ,rel ,uI) values("'+ this._pwI+'",' +
      '"'+ this._ran+'","'+this._ranpy+ '"' +
      ',"'+this._rI+ '","'+this._hiu+ '","'+this._rN+ '","'+this._rNpy+ '","'+this._rC+ '","'+this._rF+ '",' +
      '"'+this._ot+ '","'+this._rel+ '","'+this._uI+ '")';

    return sq;
  }

  rpT():string {
    this._pwI = this.util.getUuid();
    let sq ='replace into GTD_B ' +
      '(  pwI ,ran ,ranpy ,rI ,hiu ,rN ,rNpy ,rC ,rF ,ot ,rel ,uI) values("'+ this._pwI+'",' +
      '"'+ this._ran+'","'+this._ranpy+ '"' +
      ',"'+this._rI+ '","'+this._hiu+ '","'+this._rN+ '","'+this._rNpy+ '","'+this._rC+ '","'+this._rF+ '",' +
      '"'+this._ot+ '","'+this._rel+ '","'+this._uI+ '")';

    return sq;
  }

}



