import * as moment from "moment";
import {ITblParam} from "./itblparam";

/**
 * create by on 2019/3/5
 */
export class JhaTbl implements ITblParam {

  ji: string;
  jn: string;
  jg: string;
  jc: string;
  jt: string;
  jtd: string;
  tb: string;
  del: string;
  utt: number;
  wtt: number;
  checksum: string;

  fastParam(): any {
    let params: Array<any> = new Array<any>();
    params.push(this.ji);
    params.push(this.jn);
    params.push(this.jg);
    params.push(this.jc);
    params.push(this.jt);
    params.push(this.jtd);
    params.push(this.wtt? this.wtt : moment().unix());
    params.push(moment().unix());
    params.push(this.tb);
    params.push(this.del);
    params.push(this.checksum);

    return [`replace into gtd_jha
       (     ji ,jn ,jg ,jc ,jt ,jtd ,wtt ,utt,tb,del,checksum)`,
     `select ?,?,?,?,?,?,?,?,?,?,?`,
    params];
  }

  cTParam():string {

    let sq =`create table if not exists gtd_jha(
       ji VARCHAR(50) PRIMARY KEY
       ,jn VARCHAR(100)
       ,jg VARCHAR(100)
       ,jc VARCHAR(10)
       ,jt VARCHAR(4)
       ,jtd VARCHAR(4)
       ,wtt integer
       ,utt integer
       ,tb varchar(6)
       ,del varchar(6)
        ,checksum varchar(50) 

     );`;

    return sq;
  }

  upTParam():any {
    let sq='';
    let params = new Array<any>();

    if(this.jn!=null && this.jn!=''){      sq=sq+', jn= ? ';      params.push(this.jn);    }
    if(this.jg!=null && this.jg!=''){      sq=sq+', jg= ? ';      params.push(this.jg);    }
    if(this.jc!=null && this.jc!=''){      sq=sq+', jc= ? ';      params.push(this.jc);    }
    if(this.jt!=null && this.jt!=''){      sq=sq+', jt= ? ';      params.push(this.jt);    }
    if(this.jtd!=null && this.jtd!=''){      sq=sq+', jtd= ? ';      params.push(this.jtd);    }
    if(this.tb!=null && this.tb!=''){      sq=sq+', tb= ? ';      params.push(this.tb);    }
    if(this.del!=null && this.del!=''){      sq=sq+', del= ? ';      params.push(this.del);    }
    if(this.checksum!=null && this.checksum!=''){      sq=sq+', checksum= ? ';      params.push(this.checksum);    }

    sq =`update gtd_jha set utt =${moment().unix()}  ${sq} where ji = ? ;`;
    params.push(this.ji);

    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

  dTParam():any {
    let sq = 'delete from gtd_jha where 1=1 ';
    let params = new Array<any>();
    if(this.ji != null && this.ji!=""){
      sq = sq + 'and  ji = ? ';
      params.push(this.ji);
    }
    sq = sq + ';';
    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

  sloTParam():any {
    let params = new Array<any>();
    let sq='select * from gtd_jha where ji = ?  ;';
    params.push(this.ji);
    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);

    return ret;
  }

  slTParam():any {
    let params = new Array<any>();
    let sq='select * from  gtd_jha where  1=1 ';

    if(this.jn!=null && this.jn!=''){      sq=sq+' and  jn= ? ';      params.push(this.jn);    }
    if(this.jg!=null && this.jg!=''){      sq=sq+' and jg= ? ';      params.push(this.jg);    }
    if(this.jc!=null && this.jc!=''){      sq=sq+' and jc= ? ';      params.push(this.jc);    }
    if(this.jt!=null && this.jt!=''){      sq=sq+' and jt= ? ';      params.push(this.jt);    }
    if(this.jtd!=null && this.jtd!=''){      sq=sq+' and jtd= ? ';      params.push(this.jtd);    }
    if(this.tb!=null && this.tb!=''){      sq=sq+' and tb= ? ';      params.push(this.tb);    }
    if(this.del!=null && this.del!=''){      sq=sq+' and del= ? ';      params.push(this.del);    }
    if(this.checksum!=null && this.checksum!=''){      sq=sq+' and checksum= ? ';      params.push(this.checksum);    }

    sq = sq + ';';

    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

  drTParam():string {

    let sq ='drop table if exists gtd_jha;';
    return sq;
  }

  inTParam():any {
    let params = new Array<any>();
    let sq =`insert into gtd_jha
       (     ji ,jn ,jg ,jc ,jt ,jtd ,wtt ,utt,tb,del,checksum)
       values(?,?,?,?,?,?,${moment().unix()},${moment().unix()},?,?,?);`;
    params.push(this.ji);
    params.push(this.jn);
    params.push(this.jg);
    params.push(this.jc);
    params.push(this.jt);
    params.push(this.jtd);
    params.push(this.tb);
    params.push(this.del);
    params.push(this.checksum);

    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }

  rpTParam():any {
    let params = new Array<any>();
    let sq =`replace into gtd_jha
       (     ji ,jn ,jg ,jc ,jt ,jtd ,wtt ,utt,tb,del,checksum)
       values(?,?,?,?,?,?,${moment().unix()},${moment().unix()},?,?,?);`;
    params.push(this.ji);
    params.push(this.jn);
    params.push(this.jg);
    params.push(this.jc);
    params.push(this.jt);
    params.push(this.jtd);
    params.push(this.tb);
    params.push(this.del);
    params.push(this.checksum);

    let ret = new Array<any>();
    ret.push(sq);
    ret.push(params);
    return ret;
  }
}
