import{Injectable}from'@angular/core';
import {BaseTbl} from "./base.tbl";
import {BaseSqlite} from "../base-sqlite";
import {ITbl} from "./itbl";

/**
 * create by on 2019/3/5
 */
@Injectable()
export class BTbl extends BaseTbl implements ITbl{
  constructor( private bs: BaseSqlite ){

    super( bs );
  }


  cT():Promise<any> {

    let sq =' CREATE TABLE IF NOT EXISTS GTD_B( pwI varchar(50) PRIMARY KEY ,ran varchar(50)  ,' +
      'ranpy varchar(20)  ,rI varchar(50)  ,hiu varchar(200)  ,rN varchar(20)  ,' +
      'rNpy varchar(20)  ,rC varchar(20)  ,rF varchar(4)  ,ot varchar(4)  ,rel varchar(4)  ,' +
      'uI varchar(50) );';

    return this._execT(sq);
  }

  upT(pro:BPro):Promise<any> {
    let sq='update GTD_B set 1=1 ';
    if(pro.ran!=null){
      sq=sq+', ran="' + pro.ran +'"';
    }
    if(pro.ranpy!=null){
      sq=sq+', ranpy="' + pro.ranpy +'"';
    }
    if(pro.rI != null){
      sq = sq + ', rI="' + pro.rI +'"';
    }
    if(pro.hiu != null){
      sq = sq + ', hiu="' + pro.hiu +'"';
    }
    if(pro.rN != null){
      sq = sq + ', rN="' + pro.rN +'"';
    }
    if(pro.rNpy != null){
      sq = sq + ', rNpy="' + pro.rNpy +'"';
    }
    if(pro.rC != null){
      sq = sq + ', rC="' + pro.rC +'"';
    }
    if(pro.rF != null){
      sq = sq + ', rF="' + pro.rF +'"';
    }
    if(pro.ot != null){
      sq = sq + ', ot="' + pro.ot +'"';
    }
    if(pro.rel != null){
      sq = sq + ', rel="' + pro.rel +'"';
    }
    if(pro.uI != null){
      sq = sq + ', uI="' + pro.uI +'"';
    }
    sq = sq + ' where pwI = "'+ pro.pwI +'"';
    return this._execT(sq);
  }

  dT(pro:BPro):Promise<any> {
    let sq = 'delete from GTD_B where pwI = "' + pro.pwI +'"';
    return this._execT(sq);
  }

  sloT(pro:BPro):Promise<any> {
    let sq='select * from GTD_B where pwI = "'+ pro.pwI +'"';
    return this._execT(sq);
  }

  slT(pro:BPro):Promise<any> {
    let sq='select * from  GTD_B where  1=1 ';
    if(pro.ran!=null){
      sq=sq+' and ran="' + pro.ran +'"';
    }
    if(pro.ranpy!=null){
      sq=sq+' and ranpy="' + pro.ranpy +'"';
    }
    if(pro.rI != null){
      sq = sq + ' and rI="' + pro.rI +'"';
    }
    if(pro.hiu != null){
      sq = sq + ' and hiu="' + pro.hiu +'"';
    }
    if(pro.rN != null){
      sq = sq + ', rN="' + pro.rN +'"';
    }
    if(pro.rNpy != null){
      sq = sq + ' and rNpy="' + pro.rNpy +'"';
    }
    if(pro.rC != null){
      sq = sq + ' and rC="' + pro.rC +'"';
    }
    if(pro.rF != null){
      sq = sq + ' and rF="' + pro.rF +'"';
    }
    if(pro.ot != null){
      sq = sq + ' and ot="' + pro.ot +'"';
    }
    if(pro.rel != null){
      sq = sq + ' and rel="' + pro.rel +'"';
    }
    if(pro.uI != null){
      sq = sq + ' and uI="' + pro.uI +'"';
    }
    return this._execT(sq);
  }

  drT():Promise<any> {

    let sq ='DROP TABLE IF EXISTS GTD_B;';
    return this._execT(sq);
  }

  inT(pro:BPro):Promise<any> {
    let sq ='insert into GTD_B ' +
      '(  pwI ,ran ,ranpy ,rI ,hiu ,rN ,rNpy ,rC ,rF ,ot ,rel ,uI) values("'+ pro.pwI+'",' +
      '"'+ pro.ran+'","'+pro.ranpy+ '"' +
      ',"'+pro.rI+ '","'+pro.hiu+ '","'+pro.rN+ '","'+pro.rNpy+ '","'+pro.rC+ '","'+pro.rF+ '",' +
      '"'+pro.ot+ '","'+pro.rel+ '","'+pro.uI+ '")';

    return this._execT(sq);
  }

  rpT(pro:BPro):Promise<any> {
    let sq ='replace into GTD_B ' +
      '(  pwI ,ran ,ranpy ,rI ,hiu ,rN ,rNpy ,rC ,rF ,ot ,rel ,uI) values("'+ pro.pwI+'",' +
      '"'+ pro.ran+'","'+pro.ranpy+ '"' +
      ',"'+pro.rI+ '","'+pro.hiu+ '","'+pro.rN+ '","'+pro.rNpy+ '","'+pro.rC+ '","'+pro.rF+ '",' +
      '"'+pro.ot+ '","'+pro.rel+ '","'+pro.uI+ '")';

    return this._execT(sq);
  }

}

class BPro{
  private _pwI: string;
  private _ran: string;
  private _ranpy: string;
  private _rI: string;
  private _hiu: string;
  private _rN: string;
  private _rNpy: string;
  private _rC: string;
  private _rF: string;
  private _ot: string;
  private _rel: string;
  private _uI: string;


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

}

