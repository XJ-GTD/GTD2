import {Injectable} from "@angular/core";
import {PersonRestful} from "../../service/restful/personsev";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {BTbl} from "../../service/sqlite/tbl/b.tbl";
import {UtilService} from "../../service/util-service/util.service";
import {BlaReq, BlaRestful} from "../../service/restful/blasev";
import {BsModel} from "../../service/restful/out/bs.model";
import {FsData} from "../../service/pagecom/pgbusi.service";
import {BhTbl} from "../../service/sqlite/tbl/bh.tbl";
import {UserConfig} from "../../service/config/user.config";
import {ContactsService} from "../../service/cordova/contacts.service";

@Injectable()
export class FdService {
  constructor(private personRes:PersonRestful,
              private blasev:BlaRestful,
              private util:UtilService,
              private sqlite:SqliteExec,
              private userConfig:UserConfig,
              private contact:ContactsService) {
  }

  /**
   * 获取个人详情
   * @param {String} id
   * @returns {Promise<FsData>}
   */
  get(fd:FsData):Promise<FsData>{
    return new Promise<FsData>((resolve, reject)=>{
      this.contact.updateOneFs(fd.rc).then(data=>{
        resolve(data);
      })
    })
  }

  getBlack(phoneno:string):Promise<boolean> {

    return new Promise((resolve, reject)=>{
      let isBlack:boolean = false;
      //restFul查询是否是黑名单
      this.blasev.list().then(data=>{
        if(data.data && data.data.length>0){
          for(let bla of data.data){
            if(bla.mpn == phoneno){
              isBlack = true; //是黑名单；
              break;
            }
          }
        }
        resolve(isBlack);
      }).catch(error=>{
        resolve(isBlack);
      })
    })
  }

  //restFul 加入黑名单
  putBlack(fd:FsData):Promise<BsModel<FsData>>{
    return new Promise<BsModel<FsData>>((resolve, reject)=>{
      let bla = new BlaReq();
       if(fd && fd.rc){
         bla.ai=fd.ui;
         bla.mpn= fd.rc;
         bla.n= fd.rn;
         //bla.a= fd.hiu;
         bla.s='';
         bla.bd= '';
       }
       let bs = new BsModel<FsData>();
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



