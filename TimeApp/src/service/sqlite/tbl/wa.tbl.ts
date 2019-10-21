import * as moment from "moment";
import {ITblParam} from "./itblparam";

/**
 * create by on 2019/3/5
 */
export class WaTbl implements ITblParam {

  wai: string;
  obt: string;
  obi: string;
  st: string;
  wd: string;
  wt: string;
  tb: string;
  wc: string;
  wtt: number;

  fastParam(): any {
    let params: Array<any> = new Array<any>();
    params.push(this.wai);
    params.push(this.obt);
    params.push(this.obi);
    params.push(this.st);
    params.push(this.wd);
    params.push(this.wt);
    params.push(this.tb);
    params.push(this.wc);
    params.push(this.wtt || moment().unix());

    return [`replace into gtd_wa
       (   wai ,obt ,obi ,st ,wd ,wt ,tb,wc,wtt)`,
     `select ?,?,?,?,?,?,?`,
    params];
  }

  cTParam():string {

    let sq =`create table if not exists gtd_wa(
     wai varchar(50) PRIMARY KEY
     ,obt varchar(50)
     ,obi varchar(50)
     ,st varchar(50)
     ,wd varchar(20)
     ,wt varchar(20)
     ,tb varchar(6) 
     ,wc varchar(4) 
     ,wtt integer
        );`;

    return sq;
  }

  upTParam():any {
    let sq='';
    let params = new Array<any>();

    if(this.obt!=null && this.obt!=''){      sq=sq+', obt= ? ';      params.push(this.obt);    }
    if(this.obi!=null && this.obi!=''){      sq=sq+', obi= ? ';      params.push(this.obi);    }
    if(this.st!=null && this.st!=''){      sq=sq+', st= ? ';      params.push(this.st);    }
    if(this.wd!=null && this.wd!=''){      sq=sq+', wd= ? ';      params.push(this.wd);    }
    if(this.wt!=null && this.wt!=''){      sq=sq+', wt= ? ';      params.push(this.wt);    }
    if(this.tb!=null && this.tb!=''){      sq=sq+', tb= ? ';      params.push(this.tb);    }
    if(this.wc!=null && this.wc!=''){      sq=sq+', wc= ? ';      params.push(this.wc);    }

    sq =`update gtd_wa set ${sq} where wai = ? ;`;
    params.push(this.wai);

    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

  dTParam():any {
    let sq = 'delete from gtd_wa where 1=1 ';
    let params = new Array<any>();
    if(this.wai != null && this.wai!=""){
      sq = sq + 'and  evi = ? ';
      params.push(this.wai);
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
    let sq='select * from gtd_wa where wai = ?  ;';
    params.push(this.wai);
    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);

    return ret;
  }

  slTParam():any {
    let params = new Array<any>();
    let sq='select * from  gtd_wa where  1=1 ';

    if(this.obt!=null && this.obt!=''){      sq=sq+' and  obt= ? ';      params.push(this.obt);    }
    if(this.obi!=null && this.obi!=''){      sq=sq+' and obi= ? ';      params.push(this.obi);    }
    if(this.st!=null && this.st!=''){      sq=sq+' and st= ? ';      params.push(this.st);    }
    if(this.wd!=null && this.wd!=''){      sq=sq+' and wd= ? ';      params.push(this.wd);    }
    if(this.wt!=null && this.wt!=''){      sq=sq+' and wt= ? ';      params.push(this.wt);    }
    if(this.tb!=null && this.tb!=''){      sq=sq+' and tb= ? ';      params.push(this.tb);    }
    if(this.wc!=null && this.wc!=''){      sq=sq+' and wc= ? ';      params.push(this.wc);    }

    sq = sq + ';';

    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

  drTParam():string {

    let sq ='drop table if exists gtd_wa;';
    return sq;
  }

  inTParam():any {
    let params = new Array<any>();
    let sq =`insert into gtd_wa
       (   wai ,obt ,obi ,st ,wd ,wt ,tb,wc,wtt)
       values(?,?,?,?,?,?,?);`;
    params.push(this.wai);
    params.push(this.obt);
    params.push(this.obi);
    params.push(this.st);
    params.push(this.wd);
    params.push(this.wt);
    params.push(this.tb);
    params.push(this.wc);
    params.push(moment().unix());

    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

  rpTParam():any {
    let params = new Array<any>();
    let sq =`replace into gtd_wa
       (   wai ,obt ,obi ,st ,wd ,wt ,tb,wc,wtt)
       values(?,?,?,?,?,?,?);`;
    params.push(this.wai);
    params.push(this.obt);
    params.push(this.obi);
    params.push(this.st);
    params.push(this.wd);
    params.push(this.wt);
    params.push(this.tb);
    params.push(this.wc)
    params.push(moment().unix());

    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

}
