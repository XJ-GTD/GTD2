
import {ITbl} from "./itbl";
import * as moment from "moment";

/**
 * create by on 2019/4/16
 */
export class JtTbl  implements ITbl {

  jti: string="";
  si:string="";
  ji: string="";
  spn: string="";
  sd: string="";
  st: string="";
  ed: string="";
  et: string="";
  px: Number=0;
  bz: string="";
  wtt:Number=0;

  cT():string {

    let sq =' create table if not exists gtd_jt(jti varchar(50) primary key ,' +
      'si varchar(50)  ,ji varchar(50)  ,spn varchar(50)  ,sd varchar(20)' +
      ' ,st varchar(20)  ,ed varchar(20)  ,et varchar(20),px integer,bz varchar(50)  ,' +
      'wtt integer);';

    return sq;
  }

  upT():string {
    let sq='';
    if(this.jti!=null && this.jti!=""){
      sq=sq+', jti="' + this.jti +'"';
    }
    if(this.spn!=null && this.spn!=""){
      sq=sq+', spn="' + this.spn +'"';
    }
    if(this.sd != null && this.sd!=""){
      sq = sq + ', sd="' + this.sd +'"';
    }
    if(this.st != null && this.st!=""){
      sq = sq + ', st="' + this.st +'"';
    }
    if(this.ed != null && this.ed!=""){
      sq = sq + ', ed="' + this.ed +'"';
    }
    if(this.et != null && this.et!=""){
      sq = sq + ', et="' + this.et +'"';
    }
    if(this.ji != null && this.ji!=""){
      sq = sq + ', ji="' + this.ji +'"';
    }
    if(this.si!=null && this.si!=""){
      sq=sq+', si="' + this.si +'"';
    }
    if(this.bz != null && this.bz!=""){
      sq = sq + ', bz="' + this.bz +'"';
    }
    if(this.px != null){
      sq = sq + ', px="' + this.px +'"';
    }
    if (sq != null && sq != ""){
      sq = sq.substr(1);
    }
    sq = 'update gtd_jt set  '+sq + ' where jti = "'+ this.jti +'";';
    return sq;
  }

  dT():string {
    let sq = 'delete from gtd_jt where 1=1 ';
    if(this.jti != null && this.jti!=""){
      sq = sq + 'and  jti ="' + this.jti +'"';
    }
    if(this.ji != null && this.ji!=""){
      sq = sq + 'and  ji ="' + this.ji +'"';
    }
    if(this.si != null && this.si!=""){
      sq = sq + 'and  si ="' + this.si +'"';
    }
    sq = sq + ';'
    return sq;
  }

  sloT():string {
    let sq='select * from gtd_jt where jti = "'+ this.jti +'";';
    return sq;
  }

  slT():string {
    let sq='select * from  gtd_jt where  1=1 ';

    if(this.spn!=null && this.spn!=""){
      sq=sq+' and spn="' + this.spn +'"';
    }
    if(this.sd != null && this.sd!=""){
      sq = sq + ' and sd="' + this.sd +'"';
    }
    if(this.st != null && this.st!=""){
      sq = sq + ' and st="' + this.st +'"';
    }
    if(this.ed != null && this.ed!=""){
      sq = sq + ' and ed="' + this.ed +'"';
    }
    if(this.et != null && this.et!=""){
      sq = sq + ' and et="' + this.et +'"';
    }
    if(this.ji != null && this.ji!=""){
      sq = sq + ' and ji="' + this.ji +'"';
    }
    if(this.si != null && this.si!=""){
      sq = sq + ' and si="' + this.si +'"';
    }
    if(this.bz != null && this.bz!=""){
      sq = sq + ' and bz="' + this.bz +'"';
    }
    if(this.jti != null && this.jti!=""){
      sq = sq + ' and jti="' + this.jti +'"';
    }
    sq = sq +';';
    return sq;
  }

  drT():string {

    let sq ='drop table if exists gtd_jt;';
    return sq;
  }

  inT():string {
    let sq ='insert into gtd_jt ' +
      '( jti ,si , ji ,spn ,sd ,st ,ed ,et ,px ,bz ,wtt) values("'+ this.jti+'","'+ this.si+'","'+ this.ji+'","'+this.spn+ '"' +
      ',"'+this.sd+ '","'+this.st+ '","'+this.ed+ '","'+this.et+ '",'+this.px+ ',"'+this.bz+ '",' +  moment().unix() +');';

    return sq;
  }

  rpT():string {
    let sq ='replace into gtd_jt ' +
      '( jti ,si ,ji ,spn ,sd ,st ,ed ,et ,px ,bz ,wtt) values("'+ this.jti+'","'+ this.si+'","'+ this.ji+'","'+this.spn+ '"' +
      ',"'+this.sd+ '","'+this.st+ '","'+this.ed+ '","'+this.et+ '",'+this.px+ ',"'+this.bz+ '",' +  moment().unix() +');';


    return sq;
  }
}


