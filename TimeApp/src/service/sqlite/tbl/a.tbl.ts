import {ITbl} from "./itbl";
import * as moment from "moment";

/**
 * create by on 2019/3/5
 */
export class ATbl implements ITbl {

  ai :string="";

  an :string="";

  am :string="";

  ae :string="";

  at :string="";

  aq :string="";

  wtt :Number=0;



  cT():string {

    let sq ='create table if not exists gtd_a(ai varchar(50) primary key,' +
      'an varchar(10),am varchar(11),ae varchar(20) ,at varchar(50) ,aq varchar(100),wtt integer);';

    return sq;
  }

  upT():string {
    let sq='';
    if(this.an!=null && this.an!=""){
      sq=sq+', an="' + this.an +'"';
    }
    if(this.am!=null && this.am!=""){
      sq=sq+', am="' + this.am +'"';
    }
    if(this.ae != null && this.ae!=""){
      sq = sq + ', ae="' + this.ae +'"';
    }
    if(this.aq != null && this.aq!=""){
      sq = sq + ', aq="' + this.aq +'"';
    }
    if (sq != null && sq != ""){
      sq = sq.substr(1);
    }
    sq ='update gtd_a set  ' + sq + ' where ai = "'+ this.ai +'";';
    return sq;
  }

  dT():string {
    let sq = 'delete from gtd_a where 1=1 ';
    if(this.ai != null && this.ai!=""){
      sq = sq + 'and  ai ="' + this.ai +'"';
    }
    sq = sq + ';';
    return sq;
  }

  sloT():string {
    let sq='select * from gtd_a;';
    return sq;
  }

  slT():string {
    let sq='select * from  gtd_a where  1=1 ';
    if(this.ai != null && this.ai!=""){
      sq = sq + ' and ai="' + this.ai +'"';
    }
    if(this.an!=null && this.an!=""){
      sq=sq+' and an="' + this.an +'"';
    }
    if(this.am!=null && this.am!=""){
      sq=sq+' and am="' + this.am +'"';
    }
    if(this.ae != null && this.ae!=""){
      sq = sq + ' and ae="' + this.ae +'"';
    }
    if(this.aq != null && this.aq!=""){
      sq = sq + ' and aq="' + this.aq +'"';
    }
    sq = sq + ';';
    return sq;
  }

  drT():string {

    let sq ='drop table if exists gtd_a;';
    return sq;
  }

  inT():string {
    let sq ='insert into gtd_a ' +
      '(ai,an,am,ae,at,aq,wtt) values("'+ this.ai+'","'+ this.an+'","'+this.am+ '"' +
      ',"'+this.ae+ '","'+this.at+ '","'+this.aq+ '",'+  moment().unix() +');';

    return sq;
  }

  rpT():string {
    let sq ='replace into gtd_a ' +
      '(ai,an,am,ae,at,aq,wtt) values("'+ this.ai+'","'+ this.an+'","'+this.am+ '"' +
      ',"'+this.ae+ '","'+this.at+ '","'+this.aq+ '",'+  moment().unix() +');';

    return sq;
  }
  clp(){
    this.ai = "";
    this.an = "";
    this.ae = "";
    this.at = "";
    this.aq = "";
    this.wtt = 0;
  };
}

