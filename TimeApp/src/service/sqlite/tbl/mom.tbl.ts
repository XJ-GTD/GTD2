import * as moment from "moment";
import {ITblParam} from "./itblparam";

/**
 * create by on 2019/3/5
 */
export class MomTbl implements ITblParam {

  moi: string;
  ji: string;
  sd: string;
  mon: string;
  mk: string;
  fj: string;
  tb: string;
  del: string;
  utt: number;
  wtt: number;
  checksum: string;


  fastParam(): any {
    let params: Array<any> = new Array<any>();
    params.push(this.moi);
    params.push(this.ji);
    params.push(this.sd || moment().format('YYYY/MM/DD'));
    params.push(this.mon);
    params.push(this.mk);
    params.push(this.fj);
    params.push(this.tb);
    params.push(this.del);
    params.push(this.wtt || moment().valueOf());
    params.push(moment().valueOf());
    params.push(this.checksum);

    return [`replace into gtd_mom
       (  moi ,ji ,sd,mon ,mk ,fj ,tb,del ,wtt ,utt,checksum)`,
     `select ?,?,?,?,?,?,?,?,?,?,?`,
    params];
  }

  cTParam():string {

    let sq =`create table if not exists gtd_mom(
     moi varchar(50) PRIMARY KEY
     ,ji varchar(50)
      ,sd varchar(50)
     ,mon varchar(50)
     ,mk varchar(50)
     ,fj varchar(50)
     ,tb varchar(6)
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

    if(this.ji!=null && this.ji!=''){      sq=sq+', ji= ? ';      params.push(this.ji);    }
    if(this.sd!=null && this.sd!=''){      sq=sq+', sd= ? ';      params.push(this.sd);    }
    if(this.mon!=null && this.mon!=''){      sq=sq+', mon= ? ';      params.push(this.mon);    }
    if(this.mk!=null && this.mk!=''){      sq=sq+', mk= ? ';      params.push(this.mk);    }
    if(this.fj!=null && this.fj!=''){      sq=sq+', fj= ? ';      params.push(this.fj);    }
    if(this.tb!=null && this.tb!=''){      sq=sq+', tb= ? ';      params.push(this.tb);    }
    if(this.del!=null && this.del!=''){      sq=sq+', del= ? ';      params.push(this.del);    }
    if(this.checksum!=null && this.checksum!=''){      sq=sq+', checksum= ? ';      params.push(this.checksum);    }


    sq =`update gtd_mom set sd = ${moment().format('YYYY/MM/DD')},
     utt =${moment().valueOf()}  ${sq} where moi = ? ;`;
    params.push(this.moi);

    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

  dTParam():any {
    let sq = 'delete from gtd_mom where 1=1 ';
    let params = new Array<any>();
    if(this.moi != null && this.moi!=""){
      sq = sq + 'and  moi = ? ';
      params.push(this.moi);
    }
    sq = sq + ';';
    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

  sloTParam():any {
    let params = new Array<any>();
    let sq='select * from gtd_mom where moi = ?  ;';
    params.push(this.moi);
    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);

    return ret;
  }

  slTParam():any {
    let params = new Array<any>();
    let sq='select * from  gtd_mom where  1=1 ';

    if(this.ji!=null && this.ji!=''){      sq=sq+' and ji= ? ';      params.push(this.ji);    }
    if(this.sd!=null && this.sd!=''){      sq=sq+' and sd= ? ';      params.push(this.sd);    }
    if(this.mon!=null && this.mon!=''){      sq=sq+' and mon= ? ';      params.push(this.mon);    }
    if(this.mk!=null && this.mk!=''){      sq=sq+' and mk= ? ';      params.push(this.mk);    }
    if(this.fj!=null && this.fj!=''){      sq=sq+' and fj= ? ';      params.push(this.fj);    }
    if(this.tb!=null && this.tb!=''){      sq=sq+' and tb= ? ';      params.push(this.tb);    }
    if(this.del!=null && this.del!=''){      sq=sq+'and  del= ? ';      params.push(this.del);    }
    if(this.checksum!=null && this.checksum!=''){      sq=sq+' and checksum= ? ';      params.push(this.checksum);    }

    sq = sq + ';';

    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

  drTParam():string {

    let sq ='drop table if exists gtd_mom;';
    return sq;
  }

  inTParam():any {
    let params = new Array<any>();
    let sq =`insert into gtd_mom
       (  moi ,ji ,sd,mon ,mk ,fj ,tb,del,wtt ,utt,checksum)
       values(?,?,?,?,?,?,?,?,?,?,?);`;
    params.push(this.moi);
    params.push(this.ji);
    params.push(this.sd || moment().format('YYYY/MM/DD'));
    params.push(this.mon);
    params.push(this.mk);
    params.push(this.fj);
    params.push(this.tb);
    params.push(this.del);
    params.push(moment().valueOf());
    params.push(moment().valueOf());
    params.push(this.checksum);

    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

  rpTParam():any {
    let params = new Array<any>();
    let sq =`replace into gtd_mom
       (  moi ,ji ,sd,mon ,mk ,fj ,tb,del ,wtt ,utt,checksum)
       values(?,?,?,?,?,?,?,?,?,?,?);`;
    params.push(this.moi);
    params.push(this.ji);
    params.push(this.sd || moment().format('YYYY/MM/DD'));
    params.push(this.mon);
    params.push(this.mk);
    params.push(this.fj);
    params.push(this.tb);
    params.push(this.del);
    params.push(this.wtt || moment().valueOf());
    params.push(moment().valueOf());
    params.push(this.checksum);

    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

}
