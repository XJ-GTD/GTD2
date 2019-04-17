import {Contacts, Contact} from "@ionic-native/contacts";
import {Injectable} from "@angular/core";
import {UtilService} from "../util-service/util.service";
import {BTbl} from "../sqlite/tbl/b.tbl";
import {SqliteExec} from "../util-service/sqlite.exec";
import {DataConfig} from "../config/data.config";
import {PersonRestful} from "../restful/personsev";
import {UserConfig} from "../../service/config/user.config";
import {BhTbl} from "../sqlite/tbl/bh.tbl";
import {FsData} from "../../data.mapping";

/**
 * 本地联系人读取
 * 2019/1/16
 */
@Injectable()
export class ContactsService {

  static contactTel: Array<string> = new Array<string>();

  constructor(private contacts: Contacts, private utilService: UtilService, private userConfig: UserConfig,
              private sqlExce: SqliteExec, private personRestful: PersonRestful) {

  }


  /**
   * 所有联系人 未使用
   * @returns {Promise<any>}
   */
  getContacts(): Promise<Array<Contact>> {
    return new Promise<Array<Contact>>(async (resolve, reject) => {
      let contacts: Array<Contact> = new Array<Contact>();
      await this.contacts.find(['*'], {
        filter: '',
        multiple: true,
        desiredFields: ["displayName", "phoneNumbers", 'name']
      }).then(data => {
        for (let contact of data) {
          for (let i = 0; contact.phoneNumbers != null && i < contact.phoneNumbers.length; i++) {
            //去除手机号中的空格
            contact.phoneNumbers[i].value = contact.phoneNumbers[i].value.replace(/\s/g, '')
              .replace('-', '').replace('+86', '').replace('0086', '');
            if (!this.utilService.checkPhone(contact.phoneNumbers[i].value)) {
              break;
            }
          }
        }
        return data;
      })
    })

  }

  /**
   * 所有联系人 联系人导入使用
   * @returns {Promise<any>}
   */
  getContacts4Btbl(): Promise<Array<BTbl>> {
    return new Promise<Array<BTbl>>(async (resolve, reject) => {

      let btbls: Array<BTbl> = new Array<BTbl>();
      if (!this.utilService.isMobile()){
        resolve(btbls);
      }
      await this.contacts.find(['*'], {
        filter: '',
        multiple: true,
        desiredFields: ["displayName", "phoneNumbers", 'name']
      }).then(data => {
        console.log("===== 获取本地联系人：" + JSON.stringify(data));
        let contactPhones: Array<string> = new Array<string>();
        let contact:any;
        
        for (contact of data) {
          console.log("===== 本地联系人：" + JSON.stringify(contact));
          // XiaoMI 6X补丁
          if (contact._objectInstance) contact = contact._objectInstance;

          if (!contact.phoneNumbers) continue;
          // 可能存在没有姓名的联系人
          if (!contact.name) continue;
          
          for (let phone of contact.phoneNumbers) {
            //去除手机号中的空格
            let phonenumber = phone.value;
            let number="";

            phonenumber.match(/\d+/g).forEach(v=>{
              number = number + v;
            });
            
            number= number.replace(/\+86/g, '')
              .replace('0086', '')
              .replace(/\s/g,"");
            
            console.log("===== 电话号码：" + number);
            
            if (!this.utilService.checkPhone(number)) {
              continue;
            } else {
              if (contactPhones.indexOf(number) > -1) continue;
              
              let btbl: BTbl = new BTbl();

              //联系人别称
              btbl.ran = contact.name.formatted;
              //名称
              btbl.rn = contact.name.formatted;
              btbl.rc = number;
              contactPhones.push(number);
              btbls.push(btbl);
              console.log("===== 加入联系人清单：" + JSON.stringify(btbl));
            }
          }
        }

        console.log("===== 本地联系人处理结束 =====");
        resolve(btbls);
      })
    })
  }

  asyncPhoneContacts(): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      //异步获取联系人信息入库等操作
      this.getContacts4Btbl().then(async data => {
        let bsqls: Array<string> = new Array<string>();
        for (let b of data) {
          console.log("===== 本地联系人入参：" + JSON.stringify(b));

          if (!b.rn) continue;
          // TODO 效率低下
          let bt: BTbl = await this.sqlExce.getOne<BTbl>(b);
          
          if (bt == null) {
            bt = new BTbl();
            bt.pwi = this.utilService.getUuid();
            bt.ran = b.ran;
            bt.ranpy = this.utilService.chineseToPinYin(bt.ran);
            bt.hiu = "";
            bt.rn = b.rn;
            bt.rnpy = this.utilService.chineseToPinYin(bt.rn);
            bt.rc = b.rc;
            bt.rel = '0';
            bt.ui = '';
            bsqls.push(bt.inT());
            console.log("===== 本地联系人入库：" + JSON.stringify(bt));
          }
        }
        return await this.sqlExce.batExecSql(bsqls);
      }).then(data => {
        // 在同步服务器联系人之前先全部更新完成后刷新
        // 同步时间较长，会导致用户使用的时候选不到联系人
        this.userConfig.RefreshFriend();

        resolve(true);

      }).catch(error=>{
        resolve(false);
      })
    })
  }


  // getByDisplayName(name:string){
  //   return new Promise((resolve, reject)=>{
  //     // let bs = new BsModel();
  //     // this.contacts.find(['displayName'],{
  //     //   filter:name,
  //     //   multiple:true,
  //     //   desiredFields:["displayName","phoneNumbers","name"]
  //     // }).then(data=>{
  //     //   console.log("contacts data :: " + JSON.stringify(data));
  //     //   for(let contact of data){
  //     //     for(let i = 0;contact.phoneNumbers != null && i<contact.phoneNumbers.length;i++){
  //     //       //去除手机号中的空格
  //     //       contact.phoneNumbers[i].value = contact.phoneNumbers[i].value.replace(/\s/g,'');
  //     //
  //     //       // if(this.utilService.checkPhone(contact.phoneNumbers[i].value) != 3){
  //     //       //   break;
  //     //       // }
  //     //       // let ru = new RuModel();
  //     //       // ru.sdt = 3;
  //     //       // ru.ran = contact.displayName;
  //     //       // ru.rC = contact.phoneNumbers[i].value;
  //     //       // ru.rel = '0';
  //     //       // ContactsService.contactList.push(ru);
  //     //       // ContactsService.contactTel.push(contact.phoneNumbers[i].value);
  //     //     }
  //     //   }
  //     //   this.dddd();
  //     //   resolve(bs)
  //     // }).catch(reason => {
  //     //   reject(reason);
  //     // });
  //   })
  //
  // }


  // dddd(){
  //   //手机号排序
  //   for(let i = 0;i<ContactsService.contactTel.length;i++){
  //     for(let j = 0;j<ContactsService.contactTel.length-i;j++){
  //       if(ContactsService.contactTel[j] > ContactsService.contactTel[j+1]){
  //         let tmp = ContactsService.contactTel[j];
  //         ContactsService.contactTel[j] = ContactsService.contactTel[j+1];
  //         ContactsService.contactTel[j+1] = tmp;
  //         // let tmp2 = ContactsService.contactList[j];
  //         // ContactsService.contactList[j] = ContactsService.contactList[j+1];
  //         // ContactsService.contactList[j+1] = tmp2;
  //       }
  //     }
  //   }
  //
  //   let tellist = ContactsService.contactTel;
  //   console.log("手机号集 :: " + JSON.stringify(tellist));
  //   // this.pnRes.sus(tellist).then(data=>{
  //   //   console.log("查询结果 :: " + JSON.stringify(data));
  //   //   let list = data.data.playerList;
  //   //   for(let li of list){
  //   //     let tel = li.userName.substr(5,11);
  //   //     console.log(JSON.stringify(tel));
  //   //     for(let i = 0;i<ContactsService.contactList.length;i++){
  //   //       let tmp = ContactsService.contactList[i];
  //   //       if(li.accountMobile == tmp.rC){
  //   //         ContactsService.contactList[i].hiu = li.headImg;
  //   //         ContactsService.contactList[i].rN = li.userName;
  //   //         ContactsService.contactList[i].id = li.userId;
  //   //         ContactsService.contactList[i].rNpy = li.pyOfUserName;
  //   //         ContactsService.contactList[i].sdt = 0;
  //   //       }
  //   //     }
  //   //   }
  //   //   console.log("处理结果::" + JSON.stringify(ContactsService.contactList));
  //   // }).catch(reason => {
  //   //   console.log("查询结果 :: " + JSON.stringify(reason));
  //   // })
  //
  // }

  /**
   *
   * 更新单个联系人信息和头像
   * id: OpenId或者手机号
   *
   * @returns {Promise<FsData>}
   */
  async updateOneFs(id : string) {
    let bsqls: Array<string> = new Array<string>();
    let bt = new BTbl();
    let bh = new BhTbl();

    let userinfo = await this.personRestful.get(id);
    let hasAvatar : boolean = false;
    
    let exists : FsData = null;

    //获取本地参与人
    let sql = 'select gb.*, bh.bhi bhi, bh.hiu bhiu '
            + ' from gtd_b gb '
            + '       left join gtd_bh bh on bh.pwi = gb.pwi '
            + ' where gb.ui = "' + id + '"'
            + ' or gb.rc = "' + id + '";';
    // 能够适应使用ui和rc查询是否存在BTbl记录
    let data: Array<FsData> = await this.sqlExce.getExtList<FsData>(sql);
    
    if (data.length > 0) {
      exists = data[0];
    }
    
    if (exists) {
      Object.assign(bt, exists);
    } else {
      // 不存在联系人，本地联系人中不存在共享日程的发送人
      bt.pwi = this.utilService.getUuid();
      bt.hiu = "";
      bt.rel = '0';
    }
    
    if (userinfo && userinfo.data) {
      if (exists)
        bh.pwi = exists.pwi;
      else
        bh.pwi = bt.pwi;

      // 用户OpenId
      if (userinfo.data.openid && userinfo.data.openid != '') {
        bt.ui = userinfo.data.openid;
      }

      // 用户头像
      if (userinfo.data.avatarbase64 && userinfo.data.avatarbase64 != '') {
        bh.hiu = userinfo.data.avatarbase64;
        hasAvatar = true;
        bt.rel = '1'; // 注册用户
      } else {
        bh.hiu = DataConfig.HUIBASE64;
      }

      // 用户姓名
      if (userinfo.data.nickname && userinfo.data.nickname != '') {
        // 不存在本地联系人
        if (!exists) {
          bt.ran = userinfo.data.nickname;
          bt.ranpy = this.utilService.chineseToPinYin(userinfo.data.nickname);
        }
        
        bt.rn = userinfo.data.nickname;
        bt.rnpy = this.utilService.chineseToPinYin(userinfo.data.nickname);
      }

      // 用户手机号
      if (userinfo.data.phoneno && userinfo.data.phoneno != '') {
        bt.rc = userinfo.data.phoneno;
      }

      if (exists) {
        bsqls.push(bt.upT());
      } else {
        bsqls.push(bt.inT());
      }
      
      if (!exists || !exists.bhi || exists.bhi == null || exists.bhi == '') {
        // 注册用户需要加入头像表, 默认头像不入库
        if (hasAvatar) {
          bh.bhi = this.utilService.getUuid();
          // 新增BH数据
          bsqls.push(bh.inT());
        }
      } else {
        bh.bhi = exists.bhi;
        // 更新BH数据
        bsqls.push(bh.upT());
      }
    }

    await this.sqlExce.batExecSql(bsqls);

    // 全部更新完成后刷新
    this.userConfig.GetOneBTbl(bt.pwi);
    
    // 返回更新后参数
    if (!exists) {
      exists = new FsData();
    }

    exists.pwi      = bt.pwi;     //主键
    exists.ran      = bt.ran;     //联系人别称
    exists.ranpy    = bt.ranpy;   //联系人别称拼音
    exists.hiu      = bt.hiu;     // 联系人头像
    exists.rn       = bt.rn;      // 联系人名称
    exists.rnpy     = bt.rnpy;    //联系人名称拼音
    exists.rc       = bt.rc;      //联系人联系方式
    exists.rel      = bt.rel;     //系类型 1是个人，2是群，0未注册用户
    exists.ui       = bt.ui;      //数据归属人ID
    exists.bhi      = bh.bhi;     //头像表ID 用于判断是否有头像记录
    exists.bhiu     = bh.hiu;     //base64图片

    return exists;
  }
  
  /**
   *
   * 更新联系人信息和头像
   *
   * @returns {Promise<void>}
   */
  async updateFs() {

    let bsqls: Array<string> = new Array<string>();

    //获取本地参与人
    let sql = `select gb.*, bh.bhi bhi, bh.hiu bhiu
               from gtd_b gb
                      left join gtd_bh bh on bh.pwi = gb.pwi;`;

    let data: Array<FsData> = await this.sqlExce.getExtList<FsData>(sql);
    for (let fs of data) {
      let bt = new BTbl();
      Object.assign(bt, fs);

      let bh = new BhTbl();
      bh.pwi = fs.pwi;
      let hasAvatar : boolean = false;
      
      let condid = fs.rc;
      
      if (fs.ui && fs.ui != '') {
        condid = fs.ui;
      }
      
      let userinfo = await this.personRestful.get(condid);

      if (userinfo && userinfo.data) {
        if (userinfo.data.avatarbase64 && userinfo.data.avatarbase64 != '') {
          bh.hiu = userinfo.data.avatarbase64;
          hasAvatar = true;
          bt.rel = '1'; // 注册用户
        } else {
          bh.hiu = DataConfig.HUIBASE64;
        }

        if (userinfo.data.nickname && userinfo.data.nickname != '') {
          bt.rn = userinfo.data.nickname;
          bt.rnpy = this.utilService.chineseToPinYin(userinfo.data.nickname);
        }

        if (userinfo.data.phoneno && userinfo.data.phoneno != '') {
          bt.rc = userinfo.data.phoneno;
        }

        bsqls.push(bt.upT());
      }

      if (!fs.bhi || fs.bhi == null || fs.bhi == '') {
        // 注册用户需要加入头像表, 默认头像不入库
        if (hasAvatar) {
          bh.bhi = this.utilService.getUuid();
          // 新增BH数据
          bsqls.push(bh.inT());
        }
      } else {
        bh.bhi = fs.bhi;
        // 更新BH数据
        bsqls.push(bh.upT());
      }
    }

    await this.sqlExce.batExecSql(bsqls);

    // 全部更新完成后刷新
    this.userConfig.RefreshFriend();
  }

}
