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
  evt: string;
  rtevi: string;
  ji: string;
  bz: string;
  type: string;
  tx: string;
  txs: string;
  rt: string;
  rts: string;
  fj: string;
  pn: number;
  md: string;
  iv: string;
  sr: string;
  gs: string;
  tb: string;
  wc: string;       // 2019/09/06 增加完成状态
  todolist: string; // 2019/09/06 增加todolist标记
  invitestatus: string; // 2019/10/06 增加邀请状态
  del: string;
  rfg : string;
  adr:string;
  adrx:number;
  adry:number;
  utt: number;
  wtt: number;
  updstate: string;
  evrelate: string;
  checksum: string;


  cTParam():string {

    let sq =`create table if not exists gtd_ev( evi varchar(50) PRIMARY KEY ,
          evn varchar(50)  ,ui varchar(50)  ,mi varchar(50)  ,evd varchar(20)  ,evt varchar(20)  ,
          rtevi varchar(50)  ,ji varchar(50)  ,bz varchar(50)  ,type varchar(4)  ,
          tx varchar(50)  ,txs varchar(50)  ,rt varchar(50)  ,rts varchar(50)  ,
          fj varchar(50)  ,pn integer  ,md varchar(4)  ,iv varchar(4)  ,sr varchar(50)  ,
          wtt integer  ,utt integer  ,gs varchar(4)  ,tb varchar(6)  ,wc varchar(6)  ,todolist varchar(6)  ,invitestatus varchar(6)  ,
          del varchar(6),rfg varchar(6),adr varchar(6)
          ,adrx integer
          ,adry integer
           ,updstate varchar(10) 
           ,evrelate varchar(50) 
            ,checksum varchar(50) 
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
    if(this.evt!=null && this.evt!=""){
      sq=sq+', evt= ? ';
      params.push(this.evt);
    }
    if(this.rtevi!=null ){
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
    if(this.rts!=null ){
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

    if(this.tb!=null && this.tb!=''){      sq=sq+', tb= ? ';      params.push(this.tb);    }
    if(this.wc!=null && this.wc!=''){      sq=sq+', wc= ? ';      params.push(this.wc);    }
    if(this.todolist!=null && this.todolist!=''){      sq=sq+', todolist= ? ';      params.push(this.todolist);    }
    if(this.invitestatus!=null && this.invitestatus!=''){      sq=sq+', invitestatus= ? ';      params.push(this.invitestatus);    }
    if(this.del!=null && this.del!=''){      sq=sq+', del= ? ';      params.push(this.del);    }
    if(this.rfg!=null && this.rfg!=''){      sq=sq+', rfg= ? ';      params.push(this.rfg);    }
    if(this.adr!=null && this.adr!=''){      sq=sq+', adr= ? ';      params.push(this.adr);    }
    if(this.adrx!=null ){      sq=sq+', adrx= ? ';      params.push(this.adrx);    }
    if(this.adry!=null ){      sq=sq+', adry= ? ';      params.push(this.adry);    }
    if(this.updstate!=null && this.updstate!=''){      sq=sq+', updstate= ? ';      params.push(this.updstate);    }
    if(this.evrelate!=null && this.evrelate!=''){      sq=sq+', evrelate= ? ';      params.push(this.evrelate);    }
    if(this.checksum!=null && this.checksum!=''){      sq=sq+', checksum= ? ';      params.push(this.checksum);    }

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
    if(this.evt!=null && this.evt!=""){
      sq=sq+' and evt= ? ';
      params.push(this.evt);
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

    if(this.tb!=null && this.tb!=''){      sq=sq+' and  tb= ? ';      params.push(this.tb);    }
    if(this.wc!=null && this.wc!=''){      sq=sq+' and  wc= ? ';      params.push(this.wc);    }
    if(this.todolist!=null && this.todolist!=''){      sq=sq+' and  todolist= ? ';      params.push(this.todolist);    }
    if(this.invitestatus!=null && this.invitestatus!=''){      sq=sq+' and  invitestatus= ? ';      params.push(this.invitestatus);    }
    if(this.del!=null && this.del!=''){      sq=sq+' and del= ? ';      params.push(this.del);    }
    if(this.rfg!=null && this.rfg!=''){      sq=sq+' and rfg= ? ';      params.push(this.rfg);    }
    if(this.adr!=null && this.adr!=''){      sq=sq+' and adr= ? ';      params.push(this.adr);    }
    if(this.adrx!=null ){      sq=sq+' and adrx= ? ';      params.push(this.adrx);    }
    if(this.adry!=null ){      sq=sq+' and adry= ? ';      params.push(this.adry);    }
    if(this.updstate!=null && this.updstate!=''){      sq=sq+' and updstate= ? ';      params.push(this.updstate);    }
    if(this.evrelate!=null && this.evrelate!=''){      sq=sq+' and evrelate= ? ';      params.push(this.evrelate);    }
    if(this.checksum!=null && this.checksum!=''){      sq=sq+' and checksum= ? ';      params.push(this.checksum);    }

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
       ( evi ,evn ,ui ,mi ,evd ,evt ,rtevi ,ji ,bz ,
       type ,tx ,txs ,rt ,rts ,fj ,pn ,md ,iv ,
       sr ,wtt ,utt ,gs,tb,wc,todolist,invitestatus,del,rfg,adr,adrx,adry
        ,updstate
        ,evrelate 
        ,checksum)
       values( ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?
       ,?,?,?);`;
    params.push(this.evi);
    params.push(this.evn);
    params.push(this.ui);
    params.push(this.mi);
    params.push(this.evd);
    params.push(this.evt);
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
    params.push(moment().unix());
    params.push(moment().unix());
    params.push(this.gs);
    params.push(this.tb);
    params.push(this.wc);
    params.push(this.todolist);
    params.push(this.invitestatus);
    params.push(this.del);
    params.push(this.rfg);
    params.push(this.adr);
    params.push(this.adrx);
    params.push(this.adry);
    params.push(this.updstate);
    params.push(this.evrelate);
    params.push(this.checksum);

    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

  rpTParam():any {
    let params = new Array<any>();
    let sq =`replace into gtd_ev
       ( evi ,evn ,ui ,mi ,evd ,evt ,rtevi ,ji ,bz ,
       type ,tx ,txs ,rt ,rts ,fj ,pn ,md ,iv ,
       sr ,wtt ,utt ,gs,tb,wc,todolist,invitestatus,del,rfg,adr,adrx,adry
       ,updstate
       ,evrelate
       ,checksum)
       values( ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?
       ,?,?,?);`;
    params.push(this.evi);
    params.push(this.evn);
    params.push(this.ui);
    params.push(this.mi);
    params.push(this.evd);
    params.push(this.evt);
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
    params.push(moment().unix());
    params.push(moment().unix());
    params.push(this.gs);
    params.push(this.tb);
    params.push(this.wc);
    params.push(this.todolist);
    params.push(this.invitestatus);
    params.push(this.del);
    params.push(this.rfg);
    params.push(this.adr);
    params.push(this.adrx);
    params.push(this.adry);
    params.push(this.updstate);
    params.push(this.evrelate);
    params.push(this.checksum);

    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;

  }

  fastParam(): any {
    let params: Array<any> = new Array<any>();

    params.push(this.evi);
    params.push(this.evn);
    params.push(this.ui);
    params.push(this.mi);
    params.push(this.evd);
    params.push(this.evt);
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
    params.push(this.wtt? this.wtt : moment().unix());
    params.push(moment().unix());
    params.push(this.gs);
    params.push(this.tb);
    params.push(this.wc);
    params.push(this.todolist);
    params.push(this.invitestatus);
    params.push(this.del);
    params.push(this.rfg);
    params.push(this.adr);
    params.push(this.adrx);
    params.push(this.adry);
    params.push(this.updstate);
    params.push(this.evrelate);
    params.push(this.checksum);

    return [`replace into gtd_ev (
        evi,
        evn,
        ui,
        mi,
        evd,
        evt,
        rtevi,
        ji,
        bz,
        type,
        tx,
        txs,
        rt,
        rts,
        fj,
        pn,
        md,
        iv,
        sr,
        wtt,
        utt,
        gs,
        tb,
        wc,
        todolist,
        invitestatus,
        del,
        rfg,
        adr,
        adrx,
        adry
        ,updstate
        ,evrelate
         ,checksum
      )`,
      `select ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?`,
      params
     ]
  }

  nll2str(ob):any{
    if (ob == null || !ob ){
      return "";
    }else{
      return ob;
    }
  }
}
