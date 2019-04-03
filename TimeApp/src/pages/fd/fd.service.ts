import {Injectable} from "@angular/core";
import {PageBlData} from "../bl/bl.service";
import { PersonInData, PersonRestful} from "../../service/restful/personsev";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {UTbl} from "../../service/sqlite/tbl/u.tbl";
import {BTbl} from "../../service/sqlite/tbl/b.tbl";
import {UtilService} from "../../service/util-service/util.service";
import {BlaReq, BlaRestful} from "../../service/restful/blasev";
import {BsModel} from "../../service/restful/out/bs.model";
import {ViewController} from "ionic-angular";

@Injectable()
export class FdService {
  constructor(private personRes:PersonRestful,private blasev:BlaRestful,
              private util:UtilService,

              private sqlite:SqliteExec) {
  }

  /**
   * 获取个人详情
   * @param {String} id
   * @returns {Promise<FdData>}
   */
  get(id:string):Promise<FdData>{

    return new Promise<FdData>((resolve, reject)=>{
      let fd:FdData = new FdData();
      let bTbl = new BTbl();
      bTbl.pwi = id;
      //获取本地参与人信息
      this.sqlite.getOne(bTbl).then(data=>{
        if(data != null){
          Object.assign(bTbl,data);
          Object.assign(fd,data);
          //rest获取用户信息（包括头像）
          let personData:PersonInData = new PersonInData();
          personData.phoneno=bTbl.rc;
          return  this.personRes.get(personData);
        }
      }).then(data=>{
        //更新本地用户信息
        if(data && data.code == 0){
          bTbl.hiu = data.data.avatar;
          bTbl.rn = data.data.nickname;
          if(bTbl.rn && bTbl.rn != null && bTbl.rn != ''){
            bTbl.rnpy = this.util.chineseToPinYin(bTbl.rn);
          }
          bTbl.rc = data.data.phoneno;
          return this.sqlite.replaceT(bTbl)
        }
      }).then(data=>{
        //restFul查询是否是黑名单
        return this.blasev.list();
      }).then(data=>{
        Object.assign(fd,bTbl);
        if(data.data.length>0){
          for(let bla of data.data){
            if(bla.mpn == bTbl.rc){
              fd.isbla = true; //是黑名单；
              break;
            }
          }
        }
        resolve(fd);
      })
    })

  }

  //restFul 加入黑名单
  putBlack(fd:FdData):Promise<BsModel<FdData>>{
    return new Promise<BsModel<FdData>>((resolve, reject)=>{
      let bla = new BlaReq();
       if(fd && fd.rc){
         bla.ai=fd.ui;
         bla.mpn= fd.rc;
         bla.n= fd.rn;
         //bla.a= fd.hiu;
         bla.s='';
         bla.bd= '';
       }
       let bs = new BsModel<FdData>();
      this.blasev.add(bla).then(data=>{
        bs.code = data.code;
        bs.message = data.message;
        resolve(bs);
      }).catch(e=>{
        bs.code = -99;
        bs.message = e.message;
        resolve(bs);
      })
    })
  }

  /**
   * restFul 移除入黑名单
   * @param {string} mpn 手机号
   * @returns {Promise<BsModel<BlaReq>>}
   */
  removeBlack(mpn:string):Promise<BsModel<any>>{
    return new Promise<BsModel<any>>((resolve, reject)=>{
      let bla = new BlaReq();
      let bs = new BsModel<any>();
      bla.mpn = mpn;
      this.blasev.remove(bla).then(data=>{
        bs = data;
        resolve(bs);
      })
    })

  }
}

export class FdData {
  pwi: string="";
  ran: string="";
  ranpy: string="";
  ri: string="";
  hiu: string="";
  rn: string="";
  rnpy: string="";
  rc: string="";
  rf: string="";
  ot: string="";
  rel: string="";
  ui: string="";
  isbla:boolean=false; //默认非黑名单
}


