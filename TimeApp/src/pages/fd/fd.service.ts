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

@Injectable()
export class FdService {
  constructor(private personRes:PersonRestful,
              private blasev:BlaRestful,
              private util:UtilService,
              private sqlite:SqliteExec,
              private userConfig:UserConfig,) {
  }

  /**
   * 获取个人详情
   * @param {String} id
   * @returns {Promise<FsData>}
   */
  get(fd:FsData):Promise<FsData>{

    return new Promise<FsData>((resolve, reject)=>{
      let bTbl = new BTbl();
      bTbl.pwi = fd.pwi;
      //获取本地参与人信息
      this.sqlite.getOne(bTbl).then(data=>{
        Object.assign(fd,data);
        //rest 获取用户信息（头像地址）
        return this.personRes.get(fd.rc);
      }).then(data=>{
        //更新本地联系人信息
        Object.assign(bTbl,fd);
        if(data && data.code == 0 && data.data && data.data.phoneno == fd.rc){
          bTbl.rel = "1";   // 已注册
          bTbl.rn = data.data.nickname;
          fd.rn =  data.data.nickname;
          if(bTbl.rn && bTbl.rn != ''){
            bTbl.rnpy = this.util.chineseToPinYin(bTbl.rn);
            fd.rnpy = this.util.chineseToPinYin(bTbl.rn);
          }

          if(bTbl.hiu != data.data.avatar){
            bTbl.hiu = data.data.avatar;
            //rest 获取头像
            //TODO 判断URL是否一致 ，不一致更新头像 ，更新联系人信息 非注册用户不能拉入黑名单
            return this.personRes.getavatar(fd.rc);
          }
        }else{
          bTbl.rel = "0";   // 未注册用户
        }
      }).then(data=>{

         if(data && data.code == 0){
           fd.bhiu = data.data.base64;
           let bhTbl = new BhTbl();
           bhTbl.pwi = fd.pwi;
           this.sqlite.getOne(bhTbl).then(data=>{
             Object.assign(bhTbl,data);
             if(bhTbl.bhi == ''){
               bhTbl.bhi=this.util.getUuid();
               bhTbl.hiu = fd.bhiu;
               this.sqlite.save(bhTbl);
             }else {
               bhTbl.hiu = fd.bhiu;
               this.sqlite.update(bhTbl);
             }
           });
         }

      }).then(data=>{
        return this.sqlite.update(bTbl);  // 修改联系人表
      }).then(data=>{
        this.userConfig.RefreshOneBTbl(fd); //刷新群组表

        resolve(fd);
      }).catch(error=>{
        resolve(error);
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



