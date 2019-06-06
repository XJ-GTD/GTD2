
import {ITbl} from "./itbl";
import * as moment from "moment";

/**
 * create by on 2019/4/16
 */
export class MoTbl  implements ITbl {

  moi: string="";
  si:string="";
  ji: string="";
  mon: string="";
  sd: string="";
  st: string="";
  ed: string="";
  et: string="";
  wtt:Number=0;

  cT():string {

    let sq =' create table if not exists gtd_mo(moi varchar(50) primary key ,' +
      'si varchar(50)  ,ji varchar(50)  ,mon varchar(50)  ,sd varchar(20)' +
      ' ,st varchar(20)  ,ed varchar(20)  ,et varchar(20), ' +
      'wtt integer);';

    return sq;
  }

  upT():string {
    let sq='';
    if(this.moi!=null && this.moi!=""){
      sq=sq+', moi="' + this.moi +'"';
    }
    if(this.mon!=null && this.mon!=""){
      sq=sq+', mon="' + this.mon +'"';
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
    if (sq != null && sq != ""){
      sq = sq.substr(1);
    }
    sq = 'update gtd_mo set  '+sq + ' where moi = "'+ this.moi +'";';
    return sq;
  }

  dT():string {
    let sq = 'delete from gtd_mo where 1=1 ';
    if(this.moi != null && this.moi!=""){
      sq = sq + 'and  moi ="' + this.moi +'"';
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
    let sq='select * from gtd_mo where moi = "'+ this.moi +'";';
    return sq;
  }

  slT():string {
    let sq='select * from  gtd_mo where  1=1 ';

    if(this.mon!=null && this.mon!=""){
      sq=sq+' and mon="' + this.mon +'"';
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
    if(this.moi != null && this.moi!=""){
      sq = sq + ' and moi="' + this.moi +'"';
    }
    sq = sq +';';
    return sq;
  }

  drT():string {

    let sq ='drop table if exists gtd_mo;';
    return sq;
  }

  inT():string {
    let sq ='insert into gtd_mo ' +
      '( moi ,si , ji ,mon ,sd ,st ,ed ,et ,px ,bz ,wtt) values("'+ this.moi+'","'+ this.si+'","'+ this.ji+'","'+this.mon+ '"' +
      ',"'+this.sd+ '","'+this.st+ '","'+this.ed+ '","'+this.et+ '",' +  moment().unix() +');';

    return sq;
  }

  rpT():string {
    let sq ='replace into gtd_mo ' +
      '( moi ,si ,ji ,mon ,sd ,st ,ed ,et ,wtt) values("'+ this.moi+'","'+ this.si+'","'+ this.ji+'","'+this.mon+ '"' +
      ',"'+this.sd+ '","'+this.st+ '","'+this.ed+ '","'+this.et+ '",' +  moment().unix() +');';


    return sq;
  }
}
