import * as moment from "moment";
import {ITblParam} from "./itblparam";

/**
 * create by on 2019/3/5
 */
export class AtTbl implements ITblParam {

  ati: string;
  rc: string;
  ui: string;
  obt: string;
  obi: string;
  tb: string;
  dt: string;
  content: string;
  sdt: string;
  gs: string;
  utt: number;
  wtt: number;
  checksum: string;

  fastParam(): any {
    let params: Array<any> = new Array<any>();
    params.push(this.ati);
    params.push(this.rc);
    params.push(this.ui);
    params.push(this.obt);
    params.push(this.obi);
    params.push(this.tb);
    params.push(this.dt);
    params.push(this.content);
    params.push(this.sdt);
    params.push(this.gs);
    params.push(this.wtt || moment().unix());
    params.push(moment().unix());
    params.push(this.checksum);

    return [`replace into gtd_at
       (     ati
             ,rc
             ,ui
             ,obt
             ,obi
             ,tb
             ,dt
             ,content
             ,sdt
             ,gs
             ,wtt
            ,utt
             ,checksum
          )`,
     `select ?,?,?,?,?,?,?,?,?,?,?,?,?`,
    params];
  }

  cTParam():string {

    let sq =`create table if not exists gtd_at(
         ati varchar(50) PRIMARY KEY
         ,rc varchar(50) 
         ,ui varchar(50) 
         ,obt varchar(50) 
         ,obi varchar(50) 
         ,tb varchar(6) 
         ,dt varchar(20) 
         ,content varchar(50) 
         ,sdt varchar(4) 
         ,gs varchar(4) 
       ,wtt integer 
       ,utt integer 
        ,checksum varchar(50) 

     );`;

    return sq;
  }

  upTParam():any {
    let sq='';
    let params = new Array<any>();

    if(this.ati!=null && this.ati!=''){      sq=sq+', ati= ? ';      params.push(this.ati);    }
    if(this.rc!=null && this.rc!=''){      sq=sq+', rc= ? ';      params.push(this.rc);    }
    if(this.ui!=null && this.ui!=''){      sq=sq+', ui= ? ';      params.push(this.ui);    }
    if(this.obt!=null && this.obt!=''){      sq=sq+', obt= ? ';      params.push(this.obt);    }
    if(this.obi!=null && this.obi!=''){      sq=sq+', obi= ? ';      params.push(this.obi);    }
    if(this.tb!=null && this.tb!=''){      sq=sq+', tb= ? ';      params.push(this.tb);    }
    if(this.dt!=null && this.dt!=''){      sq=sq+', dt= ? ';      params.push(this.dt);    }
    if(this.content!=null && this.content!=''){      sq=sq+', content= ? ';      params.push(this.content);    }
    if(this.sdt!=null && this.sdt!=''){      sq=sq+', sdt= ? ';      params.push(this.sdt);    }
    if(this.gs!=null && this.gs!=''){      sq=sq+', gs= ? ';      params.push(this.gs);    }
    if(this.checksum!=null && this.checksum!=''){      sq=sq+', checksum= ? ';      params.push(this.checksum);    }



    sq =`update gtd_at set utt =${moment().unix()}  ${sq} where ati = ? ;`;
    params.push(this.ati);

    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

  dTParam():any {
    let sq = 'delete from gtd_at where 1=1 ';
    let params = new Array<any>();
    if(this.ati != null && this.ati!=""){
      sq = sq + 'and  ati = ? ';
      params.push(this.ati);
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
    let sq='select * from gtd_at where ati = ?  ;';
    params.push(this.ati);
    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);

    return ret;
  }

  slTParam():any {
    let params = new Array<any>();
    let sq='select * from  gtd_at where  1=1 ';

    if(this.ati!=null && this.ati!=''){      sq=sq+' and ati= ? ';      params.push(this.ati);    }
    if(this.rc!=null && this.rc!=''){      sq=sq+' and rc= ? ';      params.push(this.rc);    }
    if(this.ui!=null && this.ui!=''){      sq=sq+' and ui= ? ';      params.push(this.ui);    }
    if(this.obt!=null && this.obt!=''){      sq=sq+' and obt= ? ';      params.push(this.obt);    }
    if(this.obi!=null && this.obi!=''){      sq=sq+' and obi= ? ';      params.push(this.obi);    }
    if(this.tb!=null && this.tb!=''){      sq=sq+' and tb= ? ';      params.push(this.tb);    }
    if(this.dt!=null && this.dt!=''){      sq=sq+' and dt= ? ';      params.push(this.dt);    }
    if(this.content!=null && this.content!=''){      sq=sq+' and content= ? ';      params.push(this.content);    }
    if(this.sdt!=null && this.sdt!=''){      sq=sq+' and sdt= ? ';      params.push(this.sdt);    }
    if(this.gs!=null && this.gs!=''){      sq=sq+' and gs= ? ';      params.push(this.gs);    }
    if(this.checksum!=null && this.checksum!=''){      sq=sq+' and checksum= ? ';      params.push(this.checksum);    }


    sq = sq + ';';

    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

  drTParam():string {

    let sq ='drop table if exists gtd_at;';
    return sq;
  }

  inTParam():any {
    let params = new Array<any>();
    let sq =`insert into gtd_at
       (   ati
             ,rc
             ,ui
             ,obt
             ,obi
             ,tb
             ,dt
             ,content
             ,sdt
             ,gs
             ,wtt
              ,utt,checksum)
       values(?,?,?,?,?,?,?,?,?,?,?,?,?);`;
    params.push(this.ati);
    params.push(this.rc);
    params.push(this.ui);
    params.push(this.obt);
    params.push(this.obi);
    params.push(this.tb);
    params.push(this.dt);
    params.push(this.content);
    params.push(this.sdt);
    params.push(this.gs);
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
    let sq =`replace into gtd_at
       (   ati
             ,rc
             ,ui
             ,obt
             ,obi
             ,tb
             ,dt
             ,content
             ,sdt
             ,gs
             ,wtt
              ,utt,checksum)
       values(?,?,?,?,?,?,?,?,?,?,?,?,?);`;
    params.push(this.ati);
    params.push(this.rc);
    params.push(this.ui);
    params.push(this.obt);
    params.push(this.obi);
    params.push(this.tb);
    params.push(this.dt);
    params.push(this.content);
    params.push(this.sdt);
    params.push(this.gs);
    params.push(moment().unix());
    params.push(moment().unix());
    params.push(this.checksum);

    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }
}
