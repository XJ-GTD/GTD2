import {ITbl} from "./itbl";

/**
 * create by on 2019/3/5
 */
export class SuTbl implements ITbl   {

  private sui: string;
  private subt: string;
  private subtsn: string;
  private sust: string;
  private sustsn: string;
  private suc: string;
  private sut: string;
  private sus: string;
  private sum: string;




  cT():string {

    let sq ='create table if not exists gtd_su(   sui varchar(50) PRIMARY KEY ,' +
      'subt VARCHAR(20)  ,subtsn VARCHAR(20)  ,sust VARCHAR(20)  ,sustsn VARCHAR(20)  ,' +
      'suc VARCHAR(20)  ,sut VARCHAR(20)  ,sus VARCHAR(20)  ,sum VARCHAR(20) );';

    return sq;
  }

  upT():string {
    let sq='';

    if(this.subt!=null && this.subt!=""){
      sq=sq+' and subt="' + this.subt +'"';
    }
    if(this.sust != null && this.sust != ""){
      sq = sq + ' and sust="' + this.sust +'"';
    }
    if(this.sut != null && this.sut != ""){
      sq = sq + ' and sut="' + this.sut +'"';
    }
    if(this.sus != null && this.sus != ""){
      sq = sq + ' and sus="' + this.sus +'"';
    }
    if (sq != null && sq != ""){
      sq = sq.substr(1);
    }
    sq ='update gtd_su set  '+ sq + ' where sui = "'+ this.sui +'";';
    return sq;
  }

  dT():string {
    let sq = 'delete from gtd_su where 1=1 ';
    if(this.sui != null && this.sui!=""){
      sq = sq + 'and  sui ="' + this.sui +'"';
    }
    sq = sq + ';'
    return sq;
  }

  sloT():string {
    let sq='select * from gtd_su where sui = "'+ this.sui +'";';
    return sq;
  }

  slT():string
  {
    let sq='select * from  gtd_su where  1=1 ';
    if(this.sui!=null && this.sui!=""){
      sq=sq+' and sui="' + this.sui +'"';
    }
    if(this.subt!=null && this.subt!=""){
      sq=sq+' and subt="' + this.subt +'"';
    }
    if(this.sust != null && this.sust != ""){
      sq = sq + ' and sust="' + this.sust +'"';
    }
    if(this.sut != null && this.sut != ""){
      sq = sq + ' and sut="' + this.sut +'"';
    }
    if(this.sus != null && this.sus != ""){
      sq = sq + ' and sus="' + this.sus +'"';
    }
    sq = sq +';';
    return sq;
  }

  drT():string {

    let sq ='drop table if exists gtd_su;';
    return sq;
  }

  inT():string {
    let sq ='insert into gtd_su ' +
      '(  sui ,subt ,subtsn ,sust ,sustsn ,suc ,sut ,sus ,sum) values("'+ this.sui+'","'+ this.subt+'",' +
      '"'+this.subtsn+ '","'+this.sust+ '","'+this.sustsn+ '","'+this.suc+ '",' +
      '"'+this.sut+ '","'+this.sus+ '","'+this.sum+ '");';

    return sq;
  }

  rpT():string {
    let sq ='replace into gtd_su ' +
      '(  sui ,subt ,subtsn ,sust ,sustsn ,suc ,sut ,sus ,sum) values("'+ this.sui+'","'+ this.subt+'",' +
      '"'+this.subtsn+ '","'+this.sust+ '","'+this.sustsn+ '","'+this.suc+ '",' +
      '"'+this.sut+ '","'+this.sus+ '","'+this.sum+ '");';

    return sq;
  }
}

