import * as moment from "moment";
import {ITblParam} from "./itblparam";

/**
 * create by on 2019/3/5
 */
export class ParTbl implements ITblParam {

  pari: string;
  pwi: string;
  ui: string;
  obt: string;
  obi: string;
  sa: string;
  sdt: string;
  tb: string;
  wc: string;       // 2019/09/06 增加完成状态
  del: string;
  utt: number;
  wtt: number;
  checksum: string;

  fastParam(): any {
    let params: Array<any> = new Array<any>();
    params.push(this.pari);
    params.push(this.pwi);
    params.push(this.ui);
    params.push(this.obt);
    params.push(this.obi);
    params.push(this.sa);
    params.push(this.sdt);
    params.push(this.tb);
    params.push(this.wc);
    params.push(this.del);
    params.push(this.wtt || moment().unix());
    params.push(moment().unix());
    params.push(this.checksum);

    return [`replace into gtd_par
       (   pari ,pwi ,ui ,obt ,obi ,sa ,sdt ,tb ,wc ,del ,wtt ,utt,checksum)`,
     `select ?,?,?,?,?,?,?,?,?,?,?,?,?`,
    params];
  }

  cTParam():string {

    let sq =`create table if not exists gtd_par(
       pari varchar(50) PRIMARY KEY
       ,pwi varchar(50)
       ,ui varchar(50)
       ,obt varchar(50)
       ,obi varchar(50)
       ,sa varchar(4)
       ,sdt varchar(4)
       ,tb varchar(6)
       ,wc varchar(6)
       ,del varchar(6)
       ,wtt integer
       ,utt integer
        ,checksum varchar(50) 

     );`;

    return sq;
  }

  upTParam():any {
    let sq='';
    let params = new Array<any>();

    if(this.pwi!=null && this.pwi!=''){      sq=sq+', pwi= ? ';      params.push(this.pwi);    }
    if(this.ui!=null && this.ui!=''){      sq=sq+', ui= ? ';      params.push(this.ui);    }
    if(this.obt!=null && this.obt!=''){      sq=sq+', obt= ? ';      params.push(this.obt);    }
    if(this.obi!=null && this.obi!=''){      sq=sq+', obi= ? ';      params.push(this.obi);    }
    if(this.sa!=null && this.sa!=''){      sq=sq+', sa= ? ';      params.push(this.sa);    }
    if(this.sdt!=null && this.sdt!=''){      sq=sq+', sdt= ? ';      params.push(this.sdt);    }
    if(this.tb!=null && this.tb!=''){      sq=sq+', tb= ? ';      params.push(this.tb);    }
    if(this.wc!=null && this.wc!=''){      sq=sq+', wc= ? ';      params.push(this.wc);    }
    if(this.del!=null && this.del!=''){      sq=sq+', del= ? ';      params.push(this.del);    }
    if(this.checksum!=null && this.checksum!=''){      sq=sq+', checksum= ? ';      params.push(this.checksum);    }


    sq =`update gtd_par set utt =${moment().unix()}  ${sq} where pari = ? ;`;
    params.push(this.pari);

    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

  dTParam():any {
    let sq = 'delete from gtd_par where 1=1 ';
    let params = new Array<any>();
    if(this.pari != null && this.pari!=""){
      sq = sq + 'and  pari = ? ';
      params.push(this.pari);
    }
    if(this.obt != null && this.obt!=""){
      sq = sq + 'and  obt = ? ';
      params.push(this.obt);
    }
    if(this.obi != null && this.obi!=""){
      sq = sq + 'and  obi = ? ';
      params.push(this.obi);
    }
    sq = sq + ';';
    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

  sloTParam():any {
    let params = new Array<any>();
    let sq='select * from gtd_par where pari = ?  ;';
    params.push(this.pari);
    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);

    return ret;
  }

  slTParam():any {
    let params = new Array<any>();
    let sq='select * from  gtd_par where  1=1 ';

    if(this.pwi!=null && this.pwi!=''){      sq=sq+' and pwi= ? ';      params.push(this.pwi);    }
    if(this.ui!=null && this.ui!=''){      sq=sq+' and ui= ? ';      params.push(this.ui);    }
    if(this.obt!=null && this.obt!=''){      sq=sq+' and obt= ? ';      params.push(this.obt);    }
    if(this.obi!=null && this.obi!=''){      sq=sq+' and obi= ? ';      params.push(this.obi);    }
    if(this.sa!=null && this.sa!=''){      sq=sq+' and sa= ? ';      params.push(this.sa);    }
    if(this.sdt!=null && this.sdt!=''){      sq=sq+' and sdt= ? ';      params.push(this.sdt);    }
    if(this.tb!=null && this.tb!=''){      sq=sq+' and tb= ? ';      params.push(this.tb);    }
    if(this.wc!=null && this.wc!=''){      sq=sq+' and wc= ? ';      params.push(this.wc);    }
    if(this.del!=null && this.del!=''){      sq=sq+' and del= ? ';      params.push(this.del);    }
    if(this.checksum!=null && this.checksum!=''){      sq=sq+' and checksum= ? ';      params.push(this.checksum);    }

    sq = sq + ';';

    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

  drTParam():string {

    let sq ='drop table if exists gtd_par;';
    return sq;
  }

  inTParam():any {
    let params = new Array<any>();
    let sq =`insert into gtd_par
       (   pari ,pwi ,ui ,obt ,obi ,sa ,sdt ,tb ,wc ,del ,wtt ,utt,checksum)
       values(?,?,?,?,?,?,?,?,?,?,?,?,?);`;
    params.push(this.pari);
    params.push(this.pwi);
    params.push(this.ui);
    params.push(this.obt);
    params.push(this.obi);
    params.push(this.sa);
    params.push(this.sdt);
    params.push(this.tb);
    params.push(this.wc);
    params.push(this.del);
    params.push(moment().unix());
    params.push(moment().unix());
    params.push(this.checksum);


    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

  rpTParam():any {
    let params = new Array<any>();
    let sq =`replace into gtd_par
       (   pari ,pwi ,ui ,obt ,obi ,sa ,sdt ,tb ,wc ,del ,wtt ,utt,checksum)
       values(?,?,?,?,?,?,?,?,?,?,?,?,?);`;
    params.push(this.pari);
    params.push(this.pwi);
    params.push(this.ui);
    params.push(this.obt);
    params.push(this.obi);
    params.push(this.sa);
    params.push(this.sdt);
    params.push(this.tb);
    params.push(this.wc);
    params.push(this.del);
    params.push(moment().unix());
    params.push(moment().unix());
    params.push(this.checksum);

    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }
}
