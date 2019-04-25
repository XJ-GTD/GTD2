
import {ITbl} from "./itbl";
import * as moment from "moment";

/**
 * create by on 2019/3/5
 */
export class SpTbl  implements ITbl {

  spi: string="";
  si: string="";
  spn: string="";
  sd: string="";
  st: string="";
  ed: string="";
  et: string="";
  ji: string="";
  bz: string="";
  sta: string="";
  tx: string ="";
  wtt:Number=0;
  itx:Number=0;

  cT():string {

    let sq =' create table if not exists gtd_sp(spi varchar(50) primary key ,si varchar(50)  ,' +
      'spn varchar(50)  ,sd varchar(20)' +
      '  ,st varchar(20)  ,ed varchar(20)  ,et varchar(20)  ,ji varchar(50)  ,bz varchar(50)  ,' +
      'sta varchar(4),tx varchar(4),wtt integer,itx integer);';

    return sq;
  }

  upT():string {
    let sq='';
    if(this.si!=null && this.si!=""){
      sq=sq+', si="' + this.si +'"';
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
    if(this.bz != null ){
      sq = sq + ', bz="' + this.bz +'"';
    }
    if(this.sta != null && this.sta!=""){
      sq = sq + ', sta="' + this.sta +'"';
    }
    if(this.tx != null && this.tx!=""){
      sq = sq + ', tx="' + this.tx +'"';
    }
    if(this.itx != null){
      sq = sq + ', itx=' + this.itx;
    }
    if (sq != null && sq != ""){
      sq = sq.substr(1);
    }
    sq = 'update gtd_sp set  '+sq + ' where spi = "'+ this.spi +'";';
    return sq;
  }

  dT():string {
    let sq = 'delete from gtd_sp where 1=1 ';
    if(this.spi != null && this.spi!=""){
      sq = sq + 'and  spi ="' + this.spi +'"';
    }
    if(this.si != null && this.si!=""){
      sq = sq + 'and  si ="' + this.si +'"';
    }
    if(this.ji != null && this.ji!=""){
      sq = sq + 'and  ji ="' + this.ji +'"';
    }
    sq = sq + ';'
    return sq;
  }

  sloT():string {
    let sq='select * from gtd_sp where spi = "'+ this.spi +'";';
    return sq;
  }

  slT():string {
    let sq='select * from  gtd_sp where  1=1 ';
    if(this.si!=null && this.si!=""){
      sq=sq+' and si="' + this.si +'"';
    }
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
    if(this.bz != null && this.bz!=""){
      sq = sq + ' and bz="' + this.bz +'"';
    }
    if(this.sta != null && this.sta!=""){
      sq = sq + ' and sta="' + this.sta +'"';
    }
    if(this.spi != null && this.spi!=""){
      sq = sq + ' and spi="' + this.spi +'"';
    }
    if(this.tx != null && this.tx!=""){
      sq = sq + ' and tx="' + this.tx +'"';
    }
    sq = sq +';';
    return sq;
  }

  drT():string {

    let sq ='drop table if exists gtd_sp;';
    return sq;
  }

  inT():string {
    let sq ='insert into gtd_sp ' +
      '( spi ,si ,spn ,sd ,st ,ed ,et ,ji ,bz ,sta,tx,wtt,itx) values("'+ this.spi+'","'+ this.si+'","'+this.spn+ '"' +
      ',"'+this.sd+ '","'+this.st+ '","'+this.ed+ '","'+this.et+ '","'+this.ji+ '","'+this.bz+ '",' +
      '"'+this.sta+ '","'+this.tx+ '",'+  moment().unix() +','+this.itx+');';

    return sq;
  }

  rpT():string {
    let sq ='replace into gtd_sp ' +
      '( spi ,si ,spn ,sd ,st ,ed ,et ,ji ,bz ,sta,tx,wtt,itx) values("'+ this.spi+'","'+ this.si+'","'+this.spn+ '"' +
      ',"'+this.sd+ '","'+this.st+ '","'+this.ed+ '","'+this.et+ '","'+this.ji+ '","'+this.bz+ '",' +
      '"'+this.sta+ '","'+this.tx+'",'+  moment().unix()+','+this.itx+');';

    return sq;
  }
}


