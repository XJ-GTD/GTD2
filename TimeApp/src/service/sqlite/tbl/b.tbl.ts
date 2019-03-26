/**
 * create by on 2019/3/5
 */
import {ITbl} from "./itbl";
import * as moment from "moment";


export class BTbl implements ITbl{
  pwi: string="";
  ran: string="";
  ranpy: string="";
  hiu: string="";
  rn: string="";
  rnpy: string="";
  rc: string="";
  rel: string="";
  ui: string="";
  wtt: number=0;




  clp(){
    this.pwi = "";
    this.ran = "";
    this.ranpy = "";
    this.hiu = "";
    this.rn = "";
    this.rnpy = "";
    this.rc = "";
    this.rel = "";
    this.ui = "";
    this.wtt =0;
  };

  cT():string {

    let sq =' create table if not exists gtd_b( pwi varchar(50) primary key ,ran varchar(50)  ,' +
      'ranpy varchar(20)  ,hiu varchar(200)  ,rn varchar(20)  ,' +
      'rnpy varchar(20)  ,rc varchar(20)    ,rel varchar(4)  ,' +
      'ui varchar(50),wtt integer );';

    return sq;
  }

  upT():string {
    let sq='';
    if(this.ran!=null && this.ran!=""){
      sq=sq+', ran="' + this.ran +'"';
    }
    if(this.ranpy!=null && this.ranpy!=""){
      sq=sq+', ranpy="' + this.ranpy +'"';
    }

    if(this.hiu != null && this.hiu!=""){
      sq = sq + ', hiu="' + this.hiu +'"';
    }
    if(this.rn != null && this.rn!=""){
      sq = sq + ', rn="' + this.rn +'"';
    }
    if(this.rnpy != null && this.rnpy!=""){
      sq = sq + ', rnpy="' + this.rnpy +'"';
    }
    if(this.rc != null && this.rc!=""){
      sq = sq + ', rc="' + this.rc +'"';
    }

    if(this.rel != null && this.rel!=""){
      sq = sq + ', rel="' + this.rel +'"';
    }
    if(this.ui != null && this.ui!=""){
      sq = sq + ', ui="' + this.ui +'"';
    }
    if (sq != null && sq != ""){
      sq = sq.substr(1);
    }
    sq ='update gtd_b set ' + sq + ' where pwi = "'+ this.pwi +'";';
    return sq;
  }

  dT():string {
    let sq = 'delete from gtd_b where pwi = "' + this.pwi +'";';
    return sq;
  }

  sloT():string {
    let sq='select * from gtd_b where 1=1 ';
    if(this.pwi != null && this.pwi!=""){
      sq = sq + 'and  pwi ="' + this.pwi +'"';
    }
    sq = sq + ';';
    return sq;
  }

  slT():string {
    let sq='select * from  gtd_b where  1=1 ';
    if(this.ran!=null && this.ran!=""){
      sq=sq+' and ran="' + this.ran +'"';
    }
    if(this.ranpy!=null && this.ranpy!=""){
      sq=sq+' and ranpy="' + this.ranpy +'"';
    }

    if(this.hiu != null && this.hiu!=""){
      sq = sq + ' and hiu="' + this.hiu +'"';
    }
    if(this.rn != null && this.rn!=""){
      sq = sq + ' and rn="' + this.rn +'"';
    }
    if(this.rnpy != null && this.rnpy!=""){
      sq = sq + ' and rnpy="' + this.rnpy +'"';
    }
    if(this.rc != null && this.rc!=""){
      sq = sq + ' and rc like "' + this.rc +'%"';
    }
    if(this.rel != null && this.rel!=""){
      sq = sq + ' and rel="' + this.rel +'"';
    }
    if(this.ui != null && this.ui!=""){
      sq = sq + ' and ui="' + this.ui +'"';
    }
    sq = sq +';';
    return sq;
  }

  drT():string {

    let sq ='drop table if exists gtd_b;';
    return sq;
  }

  inT():string {
    let sq ='insert into gtd_b ' +
      '(  pwi ,ran ,ranpy  ,hiu ,rn ,rnpy ,rc   ,rel ,ui,wtt) values("'+ this.pwi+'",' +
      '"'+ this.ran+'","'+this.ranpy+ '"' +
      ',"'+this.hiu+ '","'+this.rn+ '","'+this.rnpy+ '","'+this.rc+ '",' +
      '"'+this.rel+ '","'+this.ui+ '",'+  moment().unix() + ');';

    return sq;
  }

  rpT():string {
    let sq ='replace into gtd_b ' +
      '(  pwi ,ran ,ranpy  ,hiu ,rn ,rnpy ,rc   ,rel ,ui,wtt) values("'+ this.pwi+'",' +
      '"'+ this.ran+'","'+this.ranpy+ '"' +
      ',"'+this.hiu+ '","'+this.rn+ '","'+this.rnpy+ '","'+this.rc+ '",' +
      '"'+this.rel+ '","'+this.ui+ '",'+  moment().unix() + ');';

    return sq;
  }

}



