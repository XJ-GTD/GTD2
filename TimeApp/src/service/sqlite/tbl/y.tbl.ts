import {ITbl} from "./itbl";

/**
 * create by on 2019/3/5
 */
export class YTbl implements ITbl {

  yi: string="";
  yt: string="";
  ytn: string="";
  yn: string="";
  yk: string="";
  yv: string="";

  cT(): string {

    let sq = 'create table if not exists gtd_y(  yi varchar(50) primary key ,yt varchar(20)  ,' +
      'ytn varchar(20)  ,yn varchar(20)  ,yk varchar(20)  ,yv varchar(400)   );';

    return sq;
  }

  upT(): string {
    let sq = '';
    if (this.yt != null && this.yt!="") {
      sq = sq + ', yt="' + this.yt + '"';
    }
    if (this.ytn != null && this.ytn!="") {
      sq = sq + ', ytn="' + this.ytn + '"';
    }
    if (this.yn != null && this.yn!="") {
      sq = sq + ', yn="' + this.yn + '"';
    }
    if (this.yk != null && this.yk!="") {
      sq = sq + ', yk="' + this.yk + '"';
    }
    if (this.yv != null && this.yv!="") {
      sq = sq + ', yv="' + this.yv + '"';
    }
    if (sq != null && sq != ""){
      sq = sq.substr(1);
    }
    sq = 'update gtd_y set  ' + sq + ' where yi = "' + this.yi + '";';
    return sq;
  }

  dT(): string {
    let sq = 'delete from gtd_y where 1=1 ';
    if(this.yi != null && this.yi!=""){
      sq = sq + 'and  yi ="' + this.yi +'"';
    }
    sq = sq + ';'
    return sq;
  }

  sloT(): string {
    let sq = 'select * from gtd_y where yi = "' + this.yi + '";';
    return sq;
  }

  slT(): string {
    let sq = 'select * from  gtd_y where  1=1 ';
    if (this.yt != null && this.yt!="") {
      sq = sq + ' and yt="' + this.yt + '"';
    }
    if (this.ytn != null && this.ytn!="") {
      sq = sq + ' and ytn="' + this.ytn + '"';
    }
    if (this.yn != null && this.yn!="") {
      sq = sq + ' and yn="' + this.yn + '"';
    }
    if (this.yk != null && this.yk!="") {
      sq = sq + ' and yk="' + this.yk + '"';
    }
    if (this.yv != null && this.yv!="") {
      sq = sq + ' and yv="' + this.yv + '"';
    }
    sq = sq +';'
    return sq;
  }

  drT(): string {

    let sq = 'drop table if exists gtd_y;';
    return sq;
  }

  inT(): string {

    let sq = 'insert into gtd_y ' +
      '(  yi ,yt ,ytn ,yn ,yk ,yv) values("' + this.yi + '","' + this.yt + '","' + this.ytn + '"' +
      ',"' + this.yn + '","' + this.yk + '","' + this.yv + '");';

    return sq;
  }

  rpT(): string {

    let sq = 'replace into gtd_y ' +
      '(  yi ,yt ,ytn ,yn ,yk ,yv) values("' + this.yi + '","' + this.yt + '","' + this.ytn + '"' +
      ',"' + this.yn + '","' + this.yk + '","' + this.yv + '");';

    return sq;
  }

  clp() {
    this.yi="";
    this.yt="";
    this.ytn="";
    this.yn="";
    this.yk="";
    this.yv="";
  }
}

