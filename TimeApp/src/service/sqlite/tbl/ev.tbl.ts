import * as moment from "moment";
import {ITblParam} from "./itblparam";

/**
 * create by on 2019/3/5
 */
export class EvTbl implements ITblParam {

  evi: string;
  evn: string;
  ui: string;
  mi: string;
  evd: string;
  rtevi: string;
  ji: string;
  bz: string;
  type: string;
  tx: string;
  txs: string;
  rt: string;
  rts: string;
  fj: string;
  pn: Number;
  md: string;
  iv: string;
  sr: string;
  gs: string;




  cTParam():string {

    let sq =`create table if not exists gtd_ev( evi varchar(50) PRIMARY KEY ,
          evn varchar(50)  ,ui varchar(50)  ,mi varchar(50)  ,evd varchar(20)  ,
          rtevi varchar(50)  ,ji varchar(50)  ,bz varchar(50)  ,type varchar(4)  ,
          tx varchar(50)  ,txs varchar(50)  ,rt varchar(50)  ,rts varchar(50)  ,
          fj varchar(50)  ,pn integer  ,md varchar(4)  ,iv varchar(4)  ,sr varchar(50)  ,
          wtt integer  ,utt integer  ,gs varchar(4) 
        );`;

    return sq;
  }

  upTParam():any {
    let sq='';
    let params = new Array<any>();

    if(this.evn!=null && this.evn!=""){
      sq=sq+', evn= ? ';
      params.push(this.evn);
    }
    if(this.ui!=null && this.ui!=""){
      sq=sq+', ui= ? ';
      params.push(this.ui);
    }
    if(this.mi!=null && this.mi!=""){
      sq=sq+', mi= ? ';
      params.push(this.mi);
    }
    if(this.evd!=null && this.evd!=""){
      sq=sq+', evd= ? ';
      params.push(this.evd);
    }
    if(this.rtevi!=null && this.rtevi!=""){
      sq=sq+', rtevi= ? ';
      params.push(this.rtevi);
    }
    if(this.ji!=null && this.ji!=""){
      sq=sq+', ji= ? ';
      params.push(this.ji);
    }
    if(this.bz!=null && this.bz!=''){
      sq=sq+', bz= ? ';
      params.push(this.bz);
    }

    if(this.type!=null && this.type!=''){
      sq=sq+', type= ? ';
      params.push(this.type);
    }
    if(this.tx!=null && this.tx!=''){
      sq=sq+', tx= ? ';
      params.push(this.tx);
    }
    if(this.txs!=null && this.txs!=''){
      sq=sq+', txs= ? ';
      params.push(this.txs);
    }
    if(this.rt!=null && this.rt!=''){
      sq=sq+', rt= ? ';
      params.push(this.rt);
    }
    if(this.rts!=null && this.rts!=''){
      sq=sq+', rts= ? ';
      params.push(this.rts);
    }
    if(this.fj!=null && this.fj!=''){
      sq=sq+', fj= ? ';
      params.push(this.fj);
    }
    if(this.pn!=null ){
      sq=sq+', pn= ? ';
      params.push(this.pn);
    }
    if(this.md!=null && this.md!=''){
      sq=sq+', md= ? ';
      params.push(this.md);
    }
    if(this.iv!=null && this.iv!=''){
      sq=sq+', iv= ? ';
      params.push(this.iv);
    }
    if(this.sr!=null && this.sr!=''){
      sq=sq+', sr= ? ';
      params.push(this.sr);
    }

    if(this.gs!=null && this.gs!=''){
      sq=sq+', gs= ? ';
      params.push(this.gs);
    }

    sq =`update gtd_ev set wtt = ${moment().unix()}  ${sq} where evi = ? ;`;
    params.push(this.evi);

    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

  dTParam():any {
    let sq = 'delete from gtd_ev where 1=1 ';
    let params = new Array<any>();
    if(this.evi != null && this.evi!=""){
      sq = sq + 'and  evi = ? ';
      params.push(this.evi);
    }
    sq = sq + ';';
    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

  sloTParam():any {
    let params = new Array<any>();
    let sq='select * from gtd_ev where evi = ?  ;';
    params.push(this.evi);
    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);

    return ret;
  }

  slTParam():any {
    let params = new Array<any>();
    let sq='select * from  gtd_ev where  1=1 ';

    if(this.evn!=null && this.evn!=""){
      sq=sq+' and evn= ? ';
      params.push(this.evn);
    }
    if(this.ui!=null && this.ui!=""){
      sq=sq+' and ui= ? ';
      params.push(this.ui);
    }
    if(this.mi!=null && this.mi!=""){
      sq=sq+' and mi= ? ';
      params.push(this.mi);
    }
    if(this.evd!=null && this.evd!=""){
      sq=sq+' and evd= ? ';
      params.push(this.evd);
    }
    if(this.rtevi!=null && this.rtevi!=""){
      sq=sq+' and rtevi= ? ';
      params.push(this.rtevi);
    }
    if(this.ji!=null && this.ji!=""){
      sq=sq+' and ji= ? ';
      params.push(this.ji);
    }
    if(this.bz!=null && this.bz!=''){
      sq=sq+' and bz= ? ';
      params.push(this.bz);
    }

    if(this.type!=null && this.type!=''){
      sq=sq+' and type= ? ';
      params.push(this.type);
    }

    if(this.txs!=null && this.txs!=''){
      sq=sq+' and txs= ? ';
      params.push(this.txs);
    }

    if(this.rts!=null && this.rts!=''){
      sq=sq+' and rts= ? ';
      params.push(this.rts);
    }
    if(this.fj!=null && this.fj!=''){
      sq=sq+' and fj= ? ';
      params.push(this.fj);
    }
    if(this.pn!=null ){
      sq=sq+' and pn= ? ';
      params.push(this.pn);
    }
    if(this.md!=null && this.md!=''){
      sq=sq+' and md= ? ';
      params.push(this.md);
    }
    if(this.iv!=null && this.iv!=''){
      sq=sq+' and iv= ? ';
      params.push(this.iv);
    }
    if(this.sr!=null && this.sr!=''){
      sq=sq+' and sr= ? ';
      params.push(this.sr);
    }

    if(this.gs!=null && this.gs!=''){
      sq=sq+' and gs= ? ';
      params.push(this.gs);
    }
    sq = sq + ';';

    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

  drTParam():string {

    let sq ='drop table if exists gtd_ev;';
    return sq;
  }

  inTParam():any {
    let params = new Array<any>();
    let sq =`insert into gtd_ev 
       ( evi ,evn ,ui ,mi ,evd ,rtevi ,ji ,bz ,
       type ,tx ,txs ,rt ,rts ,fj ,pn ,md ,iv ,
       sr ,wtt ,utt ,gs) 
       values( ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,${moment().unix()},${moment().unix()},?);`;
    params.push(this.evi);
    params.push(this.evn);
    params.push(this.ui);
    params.push(this.mi);
    params.push(this.evd);
    params.push(this.rtevi);
    params.push(this.ji);
    params.push(this.nll2str(this.bz));
    params.push(this.type);
    params.push(this.tx);
    params.push(this.nll2str(this.txs));
    params.push(this.rt);
    params.push(this.nll2str(this.rts));
    params.push(this.fj);
    params.push(this.pn);
    params.push(this.md);
    params.push(this.iv);
    params.push(this.sr);
    params.push(this.gs);

    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

  rpTParam():any {
    let params = new Array<any>();
    let sq =`replace into gtd_ev 
       ( evi ,evn ,ui ,mi ,evd ,rtevi ,ji ,bz ,
       type ,tx ,txs ,rt ,rts ,fj ,pn ,md ,iv ,
       sr ,wtt ,utt ,gs) 
       values( ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,${moment().unix()},${moment().unix()},?);`;
    params.push(this.evi);
    params.push(this.evn);
    params.push(this.ui);
    params.push(this.mi);
    params.push(this.evd);
    params.push(this.rtevi);
    params.push(this.ji);
    params.push(this.nll2str(this.bz));
    params.push(this.type);
    params.push(this.tx);
    params.push(this.nll2str(this.txs));
    params.push(this.rt);
    params.push(this.nll2str(this.rts));
    params.push(this.fj);
    params.push(this.pn);
    params.push(this.md);
    params.push(this.iv);
    params.push(this.sr);
    params.push(this.gs);

    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }


  nll2str(ob):any{
    if (ob == null || !ob ){
      return "";
    }else{
      return ob;
    }
  }
}