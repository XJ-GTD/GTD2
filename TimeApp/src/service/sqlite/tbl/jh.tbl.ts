import {ITbl} from "./itbl";
import * as moment from "moment";

/**
 * create by on 2019/3/5
 */
export class JhTbl  implements ITbl{


  ji: string="";
  jn: string="";
  jg: string="";
  jc: string="";
  jt: string="";
  jtd: string="";
  wtt :Number=0;



  clp(){
    this.ji = "";
    this.jn = "";
    this.jc = "";
    this.jg = "";
    this.jt = "";
    this.jtd = "";
    this.wtt = 0;
  };

  cT():string{

    let sq ='create table if not exists gtd_j_h(  ji varchar(50) primary key ,jn varchar(100)  ,jg varchar(100)' +
      ',jc varchar(10),jt varchar(4),jtd varchar(4),wtt integer);';

    return sq;
  }

  upT():string{
    let sq='';
    if(this.jn!=null && this.jn!=""){
      sq=sq+', jn="' + this.jn +'"';
    }
    if(this.jg!=null && this.jg!=""){
      sq=sq+', jg="' + this.jg +'"';
    }
    if(this.jc!=null && this.jc!=""){
      sq=sq+', jc="' + this.jc +'"';
    }
    if(this.jt!=null && this.jt!=""){
      sq=sq+', jt="' + this.jt +'"';
    }
    if(this.jtd!=null && this.jtd!=""){
      sq=sq+', jtd="' + this.jtd +'"';
    }
    if (sq != null && sq != ""){
      sq = sq.substr(1);
    }
    sq = 'update gtd_j_h set  ' +sq + ' where ji = "'+ this.ji +'";';
    return sq;
  }

  dT():string{
    let sq = 'delete from gtd_j_h where 1=1 ';
    if(this.ji != null && this.ji!=""){
      sq = sq + 'and  ji ="' + this.ji +'"';
    }
    sq = sq + ';'
    return sq;
  }

  sloT():string{
    let sq='select * from gtd_j_h where ji = "'+ this.ji +'";';
    return sq;
  }

  slT():string{
    let sq='select * from  gtd_j_h where  1=1 ';
    if(this.jn!=null && this.jn!=""){
      sq=sq+' and jn="' + this.jn +'"';
    }
    if(this.jg!=null && this.jg!=""){
      sq=sq+' and jg="' + this.jg +'"';
    }
    if(this.jc!=null && this.jc!=""){
      sq=sq+' and jc="' + this.jc +'"';
    }
    if(this.jt!=null && this.jt!=""){
      sq=sq+' and jt="' + this.jt +'"';
    }
    sq = sq +';';
    return sq;
  }

  drT():string{

    let sq ='drop table if exists gtd_j_h;';
    return sq;
  }

  inT():string{
    let sq ='insert into gtd_j_h ' +
      '(  ji ,jn ,jg,jc,jt,jtd,wtt) values("'+ this.ji+'","'+ this.jn+'","'+this.jg+ '","'+this.jc+ '","'+this.jt+ '","'+this.jtd+ '",'+  moment().unix() +');';

    return sq;
  }

  rpT():string{
    let sq ='replace into gtd_j_h ' +
      '(  ji ,jn ,jg,jc,jt,jtd,wtt) values("'+ this.ji+'","'+ this.jn+'","'+this.jg+ '","'+this.jc+ '",' + '"'+this.jt+ '","'+this.jtd+ '",'+  moment().unix() +');';

    return sq;
  }

}
