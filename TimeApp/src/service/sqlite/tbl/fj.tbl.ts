import * as moment from "moment";
import {ITblParam} from "./itblparam";

/**
 * create by on 2019/3/5
 */
export class FjTbl implements ITblParam {

  fji: string;
  obt: string;
  obi: string;
  fjn: string;
  ext: string;
  ui: string;     // 2019/10/16 增加所属帐号
  fj: string;
  tb: string;
  del: string;
  wtt: number;
  utt: number;
  checksum: string;

  fastParam(): any {
    let params: Array<any> = new Array<any>();
    params.push(this.fji);
    params.push(this.obt);
    params.push(this.obi);
    params.push(this.fjn);
    params.push(this.ext);
    params.push(this.ui);
    params.push(this.fj);
    params.push(this.tb);
    params.push(this.del);
    params.push(this.wtt || moment().unix());
    params.push(moment().unix());
    params.push(this.checksum);

    return [`replace into gtd_fj
       (    fji ,obt ,obi ,fjn ,ext ,ui ,fj ,tb,del,wtt ,utt,checksum )`,
     `select ?,?,?,?,?,?,?,?,?,?,?,?`,
    params];
  }

  cTParam():string {

    let sq =`create table if not exists gtd_fj(
     fji varchar(50) PRIMARY KEY
     ,obt varchar(50)
     ,obi varchar(50)
     ,fjn varchar(50)
     ,ext varchar(50)
     ,ui varchar(50)
     ,fj varchar(50)
      ,tb varchar(6)
      ,del varchar(6)
     ,wtt integer  ,utt integer
      ,checksum varchar(50)
     );`;

    return sq;
  }

  upTParam():any {
    let sq='';
    let params = new Array<any>();

    if(this.obt!=null && this.obt!=''){      sq=sq+', obt= ? ';      params.push(this.obt);    }
    if(this.obi!=null && this.obi!=''){      sq=sq+', obi= ? ';      params.push(this.obi);    }
    if(this.fjn!=null && this.fjn!=''){      sq=sq+', fjn= ? ';      params.push(this.fjn);    }
    if(this.ext!=null && this.ext!=''){      sq=sq+', ext= ? ';      params.push(this.ext);    }
    if(this.ui!=null && this.ui!=''){      sq=sq+', ui= ? ';      params.push(this.ui);    }
    if(this.fj!=null && this.fj!=''){      sq=sq+', fj= ? ';      params.push(this.fj);    }
    if(this.tb!=null && this.tb!=''){      sq=sq+', tb= ? ';      params.push(this.tb);    }
    if(this.del!=null && this.del!=''){      sq=sq+', del= ? ';      params.push(this.del);    }
    if(this.checksum!=null && this.checksum!=''){      sq=sq+', checksum= ? ';      params.push(this.checksum);    }

    sq =`update gtd_fj set utt =${moment().unix()}  ${sq} where fji = ? ;`;
    params.push(this.fji);

    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

  dTParam():any {
    let sq = 'delete from gtd_fj where 1=1 ';
    let params = new Array<any>();
    if(this.fji != null && this.fji!=""){
      sq = sq + 'and  fji = ? ';
      params.push(this.fji);
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
    let sq='select * from gtd_fj where fji = ?  ;';
    params.push(this.fji);
    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);

    return ret;
  }

  slTParam():any {
    let params = new Array<any>();
    let sq='select * from  gtd_fj where  1=1 ';

    if(this.obt!=null && this.obt!=''){      sq=sq+' and obt= ? ';      params.push(this.obt);    }
    if(this.obi!=null && this.obi!=''){      sq=sq+' and obi= ? ';      params.push(this.obi);    }
    if(this.fjn!=null && this.fjn!=''){      sq=sq+' and fjn= ? ';      params.push(this.fjn);    }
    if(this.ext!=null && this.ext!=''){      sq=sq+' and  ext= ? ';      params.push(this.ext);    }
    if(this.ui!=null && this.ui!=''){      sq=sq+' and  ui= ? ';      params.push(this.ui);    }
    if(this.fj!=null && this.fj!=''){      sq=sq+' and fj= ? ';      params.push(this.fj);    }
    if(this.tb!=null && this.tb!=''){      sq=sq+' and tb= ? ';      params.push(this.tb);    }
    if(this.del!=null && this.del!=''){      sq=sq+' and del= ? ';      params.push(this.del);    }
    if(this.checksum!=null && this.checksum!=''){      sq=sq+' and checksum= ? ';      params.push(this.checksum);    }

    sq = sq + ' order by wtt asc;';

    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

  drTParam():string {

    let sq ='drop table if exists gtd_fj;';
    return sq;
  }

  inTParam():any {
    let params = new Array<any>();
    let sq =`insert into gtd_fj
       (    fji ,obt ,obi ,fjn ,ext ,ui ,fj ,tb,del,wtt,utt,checksum)
       values(?,?,?,?,?,?,?,?,?,?,?,?);`;
    params.push(this.fji);
    params.push(this.obt);
    params.push(this.obi);
    params.push(this.fjn);
    params.push(this.ext);
    params.push(this.ui);
    params.push(this.fj);
    params.push(this.tb);
    params.push(this.del);
    params.push(this.wtt || moment().unix());
    params.push(moment().unix());
    params.push(this.checksum);

    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

  rpTParam():any {
    let params = new Array<any>();
    let sq =`replace into gtd_fj
       (    fji ,obt ,obi ,fjn ,ext ,ui ,fj ,tb,del,wtt ,utt,checksum )
       values(?,?,?,?,?,?,?,?,?,?,?,?);`;
    params.push(this.fji);
    params.push(this.obt);
    params.push(this.obi);
    params.push(this.fjn);
    params.push(this.ext);
    params.push(this.ui);
    params.push(this.fj);
    params.push(this.tb);
    params.push(this.del);
    params.push(this.wtt || moment().unix());
    params.push(moment().unix());
    params.push(this.checksum);

    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

}
