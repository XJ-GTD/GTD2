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
import {FsData} from "../../service/pagecom/pgbusi.service";
import {DataConfig} from "../../service/config/data.config";
import {BhTbl} from "../../service/sqlite/tbl/bh.tbl";

@Injectable()
export class FdService {
  constructor(private personRes:PersonRestful,private blasev:BlaRestful,
              private util:UtilService,

              private sqlite:SqliteExec) {
  }

  /**
   * 获取个人详情
   * @param {String} id
   * @returns {Promise<FsData>}
   */
  get(id:string):Promise<FsData>{

    return new Promise<FsData>((resolve, reject)=>{
      let fd:FsData = new FsData();
      let bTbl = new BTbl();
      bTbl.pwi = id;
      let sql = 'select gb.*,bh.hiu bhiu from gtd_b gb left join gtd_bh bh on bh.pwi = gb.ui ' +
        'where gb.pwi ="'+id+'"';
      //获取本地参与人信息
      this.sqlite.getExtList<FsData>(sql).then(data=>{
        if(data != null && data.length>0){
          Object.assign(bTbl,data[0]);
          Object.assign(fd,data[0]);

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
        //rest获取用户头像
        let personData:PersonInData = new PersonInData();
        personData.phoneno=bTbl.rc;
        return this.personRes.getavatar(personData);
      })
        .then(data=>{
        //更新/添加用户头像
        if(fd.bhiu == null || fd.bhiu ==''){
          fd.hiu=DataConfig.HUIBASE64;
        }else{
          fd.hiu=fd.bhiu;
        }

        let str:string = '';
        if(data && !data.code){
            str = data.data;
          fd.hiu = str;
          if(fd.bhiu == null || fd.bhiu ==''){
            let bh = new BhTbl();
            bh.bhi=this.util.getUuid();
            bh.pwi=fd.pwi;
            bh.hiu = str;
            return this.sqlite.save(bh);
          }else{
            let sql = 'update gtd_bh set hiu ="' + str + '" where pwi = "'+ fd.pwi +'";';
            return this.sqlite.execSql(sql);
          }
        }
      })
        .then(data=>{
        //restFul查询是否是黑名单
        return this.blasev.list();
      })
        .then(data=>{
        Object.assign(fd,bTbl);
        if(data.data && data.data.length>0){
          for(let bla of data.data){
            if(bla.mpn == bTbl.rc){
              fd.isbla = true; //是黑名单；
              break;
            }
          }
        }
        if(fd.bhiu == null || fd.bhiu ==''){
          fd.hiu=fd.bhiu;
        }else{
          fd.hiu=DataConfig.HUIBASE64;
        }
        resolve(fd);
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



