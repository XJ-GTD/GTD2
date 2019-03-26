import {ITbl} from "./itbl";
import * as moment from "moment";

/**
 * create by on 2019/3/5
 */
export class GTbl implements ITbl {

  gi: string="";
  gn: string="";
  gm: string="";
  gnpy: string="";
  wtt :Number=0;



  clp(){
    this.gi = "";
    this.gn = "";
    this.gm = "";
    this.gnpy = "";
    this.wtt = 0;
  };

  cT():string{

    let sq ='create table if not exists gtd_g(  gi varchar(50) primary key ,gn varchar(50)  ,' +
      'gm varchar(50),gnpy varchar(50),wtt integer);';

    return sq;
  }

  upT():string{
    let sq='';
    if(this.gn!=null && this.gn!=""){
      sq=sq+', gn="' + this.gn +'"';
    }
    if(this.gnpy!=null && this.gnpy!=""){
      sq=sq+', gnpy="' + this.gnpy +'"';
    }
    if(this.gm!=null && this.gm!=""){
      sq=sq+', gm="' + this.gm +'"';
    }
    if (sq != null && sq != ""){
      sq = sq.substr(1);
    }
    sq = 'update gtd_g set  '+sq + ' where gi = "'+ this.gi +'";';
    return sq;
  }

  dT():string{
    let sq = 'delete from gtd_g where 1=1 ';
    if(this.gi != null && this.gi!=""){
      sq = sq + 'and  gi ="' + this.gi +'"';
    }
    sq = sq + ';'
    return sq;
  }

  sloT():string{
    let sq='select * from gtd_g where gi = "'+ this.gi +'";';
    return sq;
  }

  slT():string{
    let sq='select * from  gtd_g where  1=1 ';
    if(this.gn!=null && this.gn!=""){
      sq=sq+' and gn="' + this.gn +'"';
    }
    if(this.gm!=null && this.gm!=""){
      sq=sq+' and gm="' + this.gm +'"';
    }
    if(this.gnpy!=null && this.gnpy!=""){
      sq=sq+' and gnpy="' + this.gnpy +'"';
    }
    sq = sq +';';
    return sq;
  }

  drT():string{

    let sq ='drop table if exists gtd_g;';
    return sq;
  }

  inT():string{
    let sq ='insert into gtd_g ' +
      '( gi ,gn ,gm,gnpy,wtt) values("'+ this.gi+'","'+ this.gn+'","'+this.gm+ '","'+this.gnpy+'",'+  moment().unix() +');';

    return sq;
  }

  rpT():string{
    let sq ='replace into gtd_g ' +
      '( gi ,gn ,gm,gnpy,wtt) values("'+ this.gi+'","'+ this.gn+'","'+this.gm+'","'+this.gnpy+ '",'+  moment().unix() +');';

    return sq;
  }

}

