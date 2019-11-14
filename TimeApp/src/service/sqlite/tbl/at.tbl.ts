import * as moment from "moment";
import {ITblParam} from "./itblparam";

/**
 * create by on 2019/3/5
 */
export class AtTbl implements ITblParam {

  ati: string;
  ui: string;
  obt: string;
  obi: string;
  dt: string;
  content: string;
  utt: number;
  wtt: number;

  fastParam(): any {
    let params: Array<any> = new Array<any>();
    params.push(this.ati);
    params.push(this.ui);
    params.push(this.obt);
    params.push(this.obi);
    params.push(this.dt);
    params.push(this.content);
    params.push(this.wtt || moment().unix());
    params.push(moment().unix());

    return [`replace into gtd_at
       (    ati
             ,ui
             ,obt
             ,obi
             ,dt
             ,content
             ,wtt
             ,utt)`,
     `select ?,?,?,?,?,?,?,?`,
    params];
  }

  cTParam():string {

    let sq =`create table if not exists gtd_at(
        ati varchar(50) PRIMARY KEY
       ,ui varchar(50) 
       ,obt varchar(50) 
       ,obi varchar(50) 
       ,dt varchar(20) 
       ,content varchar(50) 
       ,wtt integer 
       ,utt integer 
     );`;

    return sq;
  }

  upTParam():any {
    let sq='';
    let params = new Array<any>();

    if(this.ui!=null && this.ui!=''){      sq=sq+', ui= ? ';      params.push(this.ui);    }
    if(this.obt!=null && this.obt!=''){      sq=sq+', obt= ? ';      params.push(this.obt);    }
    if(this.obi!=null && this.obi!=''){      sq=sq+', obi= ? ';      params.push(this.obi);    }
    if(this.dt!=null && this.dt!=''){      sq=sq+', dt= ? ';      params.push(this.dt);    }
    if(this.content!=null && this.content!=''){      sq=sq+', content= ? ';      params.push(this.content);    }


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

    if(this.ui!=null && this.ui!=''){      sq=sq+' and ui= ? ';      params.push(this.ui);    }
    if(this.obt!=null && this.obt!=''){      sq=sq+' and obt= ? ';      params.push(this.obt);    }
    if(this.obi!=null && this.obi!=''){      sq=sq+' and obi= ? ';      params.push(this.obi);    }
    if(this.dt!=null && this.dt!=''){      sq=sq+' and dt= ? ';      params.push(this.dt);    }
    if(this.content!=null && this.content!=''){      sq=sq+' and content= ? ';      params.push(this.content);    }

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
             ,ui
             ,obt
             ,obi
             ,dt
             ,content
             ,wtt
             ,utt)
       values(?,?,?,?,?,?,?,?);`;
    params.push(this.ati);
    params.push(this.ui);
    params.push(this.obt);
    params.push(this.obi);
    params.push(this.dt);
    params.push(this.content);
    params.push(moment().unix());
    params.push(moment().unix());
    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

  rpTParam():any {
    let params = new Array<any>();
    let sq =`replace into gtd_at
       (   ati
             ,ui
             ,obt
             ,obi
             ,dt
             ,content
             ,wtt
             ,utt)
       values(?,?,?,?,?,?,?,?);`;
    params.push(this.ati);
    params.push(this.ui);
    params.push(this.obt);
    params.push(this.obi);
    params.push(this.dt);
    params.push(this.content);
    params.push(moment().unix());
    params.push(moment().unix());

    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }
}
