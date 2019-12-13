import * as moment from "moment";
import {ITblParam} from "./itblparam";

/**
 * create by on 2019/3/5
 */
export class JtaTbl implements ITblParam {

  jti: string;
  ji: string;
  jtn: string;
  ui: string;           // 2019/10/12 增加所属帐号
  invitestatus: string; // 2019/10/12 增加邀请状态
  pn: number;           // 2019/10/12 增加参与人数
  md: string;           // 2019/10/12 增加修改权限
  iv: string;           // 2019/10/12 增加邀请权限
  sd: string;
  st: string;
  jtt: string;
  jtc: string;
  px: number;
  bz: string;
  ext: string;          // 2019/10/16 增加扩展信息(例如：存储天气结构信息)
  tb: string;
  del: string;
  utt: number;
  wtt: number;
  tx: string;
  txs: string;
  rt: string;
  rts: string;
  rfg: string;
  rtjti: string;
  checksum: string;

  fastParam(): any {
    let params: Array<any> = new Array<any>();
    params.push(this.jti);
    params.push(this.ji);
    params.push(this.jtn);
    params.push(this.ui);
    params.push(this.invitestatus);
    params.push(this.pn);
    params.push(this.md);
    params.push(this.iv);
    params.push(this.sd);
    params.push(this.st);
    params.push(this.jtt);
    params.push(this.jtc);
    params.push(this.px);
    params.push(this.nll2str(this.bz));
    params.push(this.nll2str(this.ext));
    params.push(this.wtt? this.wtt : moment().unix());
    params.push(moment().unix());
    params.push(this.tb);
    params.push(this.del);
    params.push(this.tx);
    params.push(this.txs);
    params.push(this.rt);
    params.push(this.rts);
    params.push(this.rfg);
    params.push(this.rtjti);
    params.push(this.checksum);

    return [`replace into gtd_jta
       (   jti ,ji ,jtn ,ui ,invitestatus ,pn ,md ,iv ,sd ,st ,jtt ,jtc ,px ,bz ,ext ,wtt ,utt,tb,del,tx,txs,rt,rts,rfg,rtjti,checksum)`,
     `select ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?`,
    params];
  }

  cTParam():string {

    let sq =`create table if not exists gtd_jta(
      jti varchar(50) PRIMARY KEY
     ,ji varchar(50)
     ,jtn varchar(50)
     ,ui varchar(50)
     ,invitestatus varchar(6)
     ,pn integer
     ,md varchar(4)
     ,iv varchar(4)
     ,sd varchar(20)
     ,st varchar(20)
     ,jtt varchar(4)
     ,jtc varchar(4)
     ,px integer
     ,bz varchar(50)
     ,ext varchar(50)
     ,wtt integer
     ,utt integer
     ,tb varchar(6)
     ,del varchar(6)
     ,tx varchar(50)
     ,txs varchar(50)
     ,rt varchar(50)
     ,rts varchar(50)
     ,rfg varchar(6)
     ,rtjti varchar(50)
     ,checksum varchar(50) 

     );`;

    return sq;
  }

  upTParam():any {
    let sq='';
    let params = new Array<any>();

    if(this.ji!=null && this.ji!=''){      sq=sq+', ji= ? ';      params.push(this.ji);    }
    if(this.jtn!=null && this.jtn!=''){      sq=sq+', jtn= ? ';      params.push(this.jtn);    }
    if(this.ui!=null && this.ui!=''){      sq=sq+', ui= ? ';      params.push(this.ui);    }
    if(this.invitestatus!=null && this.invitestatus!=''){      sq=sq+', invitestatus= ? ';      params.push(this.invitestatus);    }
    if(this.pn!=null){      sq=sq+', pn= ? ';      params.push(this.pn);    }
    if(this.md!=null && this.md!=''){      sq=sq+', md= ? ';      params.push(this.md);    }
    if(this.iv!=null && this.iv!=''){      sq=sq+', iv= ? ';      params.push(this.iv);    }
    if(this.sd!=null && this.sd!=''){      sq=sq+', sd= ? ';      params.push(this.sd);    }
    if(this.st!=null && this.st!=''){      sq=sq+', st= ? ';      params.push(this.st);    }
    if(this.jtt!=null && this.jtt!=''){      sq=sq+', jtt= ? ';      params.push(this.jtt);    }
    if(this.jtc!=null && this.jtc!=''){      sq=sq+', jtc= ? ';      params.push(this.jtc);    }
    if(this.px!=null ){      sq=sq+', px= ? ';      params.push(this.px);    }
    if(this.bz!=null && this.bz!=''){      sq=sq+', bz= ? ';      params.push(this.bz);    }
    if(this.ext!=null && this.ext!=''){      sq=sq+', ext= ? ';      params.push(this.ext);    }
    if(this.tb!=null && this.tb!=''){      sq=sq+', tb= ? ';      params.push(this.tb);    }
    if(this.del!=null && this.del!=''){      sq=sq+', del= ? ';      params.push(this.del);    }
    if(this.tx!=null && this.tx!=''){      sq=sq+', tx= ? ';      params.push(this.tx);    }
    if(this.txs!=null && this.txs!=''){      sq=sq+', txs= ? ';      params.push(this.txs);    }
    if(this.rt!=null && this.rt!=''){      sq=sq+', rt= ? ';      params.push(this.rt);    }
    if(this.rts!=null && this.rts!=''){      sq=sq+', rts= ? ';      params.push(this.rts);    }
    if(this.rfg!=null && this.rfg!=''){      sq=sq+', rfg= ? ';      params.push(this.rfg);    }
    if(this.rtjti!=null && this.rtjti!=''){      sq=sq+', rtjti= ? ';      params.push(this.rtjti);    }
    if(this.checksum!=null && this.checksum!=''){      sq=sq+', checksum= ? ';      params.push(this.checksum);    }

    sq =`update gtd_jta set utt =${moment().unix()}  ${sq} where jti = ? ;`;
    params.push(this.jti);

    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

  dTParam():any {
    let sq = 'delete from gtd_jta where 1=1 ';
    let params = new Array<any>();
    if(this.jti != null && this.jti!=""){
      sq = sq + 'and  jti = ? ';
      params.push(this.jti);
    }
    sq = sq + ';';
    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

  sloTParam():any {
    let params = new Array<any>();
    let sq='select * from gtd_jta where jti = ?  ;';
    params.push(this.jti);
    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);

    return ret;
  }

  slTParam():any {
    let params = new Array<any>();
    let sq='select * from  gtd_jta where  1=1 ';

    if(this.ji!=null && this.ji!=''){      sq=sq+' and ji= ? ';      params.push(this.ji);    }
    if(this.jtn!=null && this.jtn!=''){      sq=sq+' and jtn= ? ';      params.push(this.jtn);    }
    if(this.ui!=null && this.ui!=''){      sq=sq+' and ui= ? ';      params.push(this.ui);    }
    if(this.invitestatus!=null && this.invitestatus!=''){      sq=sq+' and invitestatus= ? ';      params.push(this.invitestatus);    }
    if(this.pn!=null){      sq=sq+' and pn= ? ';      params.push(this.pn);    }
    if(this.md!=null && this.md!=''){      sq=sq+' and md= ? ';      params.push(this.md);    }
    if(this.iv!=null && this.iv!=''){      sq=sq+' and iv= ? ';      params.push(this.iv);    }
    if(this.sd!=null && this.sd!=''){      sq=sq+' and sd= ? ';      params.push(this.sd);    }
    if(this.st!=null && this.st!=''){      sq=sq+' and st= ? ';      params.push(this.st);    }
    if(this.jtt!=null && this.jtt!=''){      sq=sq+' and jtt= ? ';      params.push(this.jtt);    }
    if(this.jtc!=null && this.jtc!=''){      sq=sq+' and jtc= ? ';      params.push(this.jtc);    }
    if(this.px!=null ){      sq=sq+' and px= ? ';      params.push(this.px);    }
    if(this.bz!=null && this.bz!=''){      sq=sq+' and bz= ? ';      params.push(this.bz);    }
    if(this.ext!=null && this.ext!=''){      sq=sq+' and ext= ? ';      params.push(this.ext);    }
    if(this.tb!=null && this.tb!=''){      sq=sq+' and tb= ? ';      params.push(this.tb);    }
    if(this.del!=null && this.del!=''){      sq=sq+' and del= ? ';      params.push(this.del);    }
    if(this.tx!=null && this.tx!=''){      sq=sq+' and tx= ? ';      params.push(this.tx);    }
    if(this.txs!=null && this.txs!=''){      sq=sq+' and txs= ? ';      params.push(this.txs);    }
    if(this.rt!=null && this.rt!=''){      sq=sq+' and rt= ? ';      params.push(this.rt);    }
    if(this.rts!=null && this.rts!=''){      sq=sq+' and rts= ? ';      params.push(this.rts);    }
    if(this.rfg!=null && this.rfg!=''){      sq=sq+' and rfg= ? ';      params.push(this.rfg);    }
    if(this.rtjti!=null && this.rtjti!=''){      sq=sq+' and rtjti= ? ';      params.push(this.rtjti);    }
    if(this.checksum!=null && this.checksum!=''){      sq=sq+' and checksum= ? ';      params.push(this.checksum);    }

    sq = sq + ';';

    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

  drTParam():string {

    let sq ='drop table if exists gtd_jta;';
    return sq;
  }

  inTParam():any {
    let params = new Array<any>();
    let sq =`insert into gtd_jta
       (   jti ,ji ,jtn ,ui ,invitestatus ,pn ,md ,iv ,sd ,st ,jtt ,jtc ,px ,bz 
       ,ext ,wtt ,utt,tb,del,tx,txs,rt,rts,rfg,rtjti,checksum)
       values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`;
    params.push(this.jti);
    params.push(this.ji);
    params.push(this.jtn);
    params.push(this.ui);
    params.push(this.invitestatus);
    params.push(this.pn);
    params.push(this.md);
    params.push(this.iv);
    params.push(this.sd);
    params.push(this.st);
    params.push(this.jtt);
    params.push(this.jtc);
    params.push(this.px);
    params.push(this.nll2str(this.bz));
    params.push(this.nll2str(this.ext));
    params.push(moment().unix());
    params.push(moment().unix());
    params.push(this.tb);
    params.push(this.del);
    params.push(this.tx);
    params.push(this.txs);
    params.push(this.rt);
    params.push(this.rts);
    params.push(this.rfg);
    params.push(this.rtjti);
    params.push(this.checksum);

    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

  rpTParam():any {
    let params = new Array<any>();
    let sq =`replace into gtd_jta
       (   jti ,ji ,jtn ,ui ,invitestatus ,pn ,md ,iv ,sd ,st ,jtt ,jtc ,px ,bz 
       ,ext ,wtt ,utt,tb,del,tx,txs,rt,rts,rfg,rtjti,checksum)
       values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,${moment().unix()},${moment().unix()},?,?,?,?,?,?,?,?,?);`;
    params.push(this.jti);
    params.push(this.ji);
    params.push(this.jtn);
    params.push(this.ui);
    params.push(this.invitestatus);
    params.push(this.pn);
    params.push(this.md);
    params.push(this.iv);
    params.push(this.sd);
    params.push(this.st);
    params.push(this.jtt);
    params.push(this.jtc);
    params.push(this.px);
    params.push(this.nll2str(this.bz));
    params.push(this.nll2str(this.ext));
    params.push(this.tb);
    params.push(this.del);
    params.push(this.tx);
    params.push(this.txs);
    params.push(this.rt);
    params.push(this.rts);
    params.push(this.rfg);
    params.push(this.rtjti);
    params.push(this.checksum);

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
