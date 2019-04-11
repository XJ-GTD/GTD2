import {Injectable} from "@angular/core";
import {PersonInData, PersonRestful} from "../../service/restful/personsev";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {BTbl} from "../../service/sqlite/tbl/b.tbl";
import {UtilService} from "../../service/util-service/util.service";
import {BlaReq, BlaRestful} from "../../service/restful/blasev";
import {BsModel} from "../../service/restful/out/bs.model";
import {FsData} from "../../service/pagecom/pgbusi.service";
import {DataConfig} from "../../service/config/data.config";
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
  get(id:string):Promise<FsData>{

    return new Promise<FsData>((resolve, reject)=>{
      let fd:FsData = new FsData();
      let bTbl = new BTbl();
      let sql = 'select gb.*,bh.hiu bhiu from gtd_b gb left join gtd_bh bh on bh.pwi = gb.ui where gb.pwi ="'+id+'"';
      //获取本地参与人信息
      this.sqlite.getExtList<FsData>(sql).then(data=>{
        if(data != null && data.length>0){
          Object.assign(fd,data[0]);
          //rest 获取头像
          return this.personRes.getavatar(fd.rc);
        }
      }).then(data=>{
        let str:string = '';
        if(data && data.code == 0){
          str = data.data.base64;
          fd.bhiu = str;
          if(fd.bhiu == null || fd.bhiu == ''){
            let bh = new BhTbl();
            bh.bhi=this.util.getUuid();
            bh.pwi=fd.pwi;
            bh.hiu = str;
            this.sqlite.save(bh);
          }else{
            let sql = 'update gtd_bh set hiu ="' + str + '" where pwi = "'+ fd.pwi +'";';
            this.sqlite.execSql(sql);
          }
        }

        if(fd.bhiu != null && fd.bhiu !=''){
          fd.hiu = fd.bhiu;
          this.userConfig.RefreshGTbl();
        }else{
          fd.hiu=DataConfig.HUIBASE64;
        }

        resolve(fd);
      }).catch(error=>{
        resolve(error);
      })

      /*let fd:FsData = new FsData();
      let bTbl = new BTbl();
      let sql = 'select gb.*,bh.hiu bhiu from gtd_b gb left join gtd_bh bh on bh.pwi = gb.ui where gb.pwi ="'+id+'"';
      //获取本地参与人信息
      this.sqlite.getExtList<FsData>(sql).then(data=>{
        if(data != null && data.length>0){
          Object.assign(fd,data[0]);
          //rest获取用户信息（包括头像）
          //return this.personRes.get(fd.rc);
        }
      }).then(data=>{
        //更新本地联系人信息
        // Object.assign(bTbl,fd);
        // if(data && data.code == 0 && data.data && data.data.phoneno == fd.rc){
        //   //bTbl.hiu = data.data.avatar;
        //   //bTbl.rc = data.data.phoneno;
        //   bTbl.rel = "1";   // 已注册
        //   bTbl.rn = data.data.nickname;
        //   fd.rn =  data.data.nickname;
        //   if(bTbl.rn && bTbl.rn != null && bTbl.rn != ''){
        //     bTbl.rnpy = this.util.chineseToPinYin(bTbl.rn);
        //     fd.rnpy = this.util.chineseToPinYin(bTbl.rn);
        //   }
        // }else{
        //   bTbl.rel = "0";   // 未注册用户
        // }
        // return this.sqlite.replaceT(bTbl)
      }).then(data=>{
        //rest获取用户头像
        this.personRes.getavatar(fd.rc).then(data=>{
          let str:string = '';
          if(data && data.code == 0){
            str = data.data.base64;
            fd.bhiu = str;
            if(fd.bhiu == null || fd.bhiu == ''){
              let bh = new BhTbl();
              bh.bhi=this.util.getUuid();
              bh.pwi=fd.pwi;
              bh.hiu = str;
              this.sqlite.save(bh);
            }else{
              let sql = 'update gtd_bh set hiu ="' + str + '" where pwi = "'+ fd.pwi +'";';
              this.sqlite.execSql(sql);
            }
          }
        })
      }).then(data=>{
        if(fd.bhiu != null && fd.bhiu !=''){
          fd.hiu = fd.bhiu;
          console.log("update")
        }else{
          fd.hiu=DataConfig.HUIBASE64;
        }
        //console.log("======== FdService参与人详情:"+JSON.stringify(fd));
        resolve(fd);
      }).catch(error=>{
        resolve(fd);
      })*/
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



