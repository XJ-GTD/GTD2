import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {IonicPage, NavController, ViewController, ModalController} from 'ionic-angular';
import * as moment from "moment";
import { InAppBrowser } from '@ionic-native/in-app-browser';
import {Friend} from "../../src/service/business/grouper.service";
import {PageY} from "../../src/data.mapping";
import {SsService} from "../../src/pages/ss/ss.service";
import {EmitService} from "../../src/service/util-service/emit.service";
import {Setting, UserConfig} from "../../src/service/config/user.config";
import {DataConfig} from "../../src/service/config/data.config";

/**
 * Generated class for the 项目跟进 通知共享 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-foshare',
  template:
  `
  <ion-header no-border>
    <ion-toolbar>
      <ion-buttons left>
        <button ion-button icon-only (click)="goBack()" color="danger">
          <img class="img-header-left" src="./assets/imgs/back.png">
        </button>
      </ion-buttons>
      <ion-title>通知</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content padding>
    <ion-grid>
      <ion-row>
        <ion-grid>
          <ion-row align-items-center justify-content-center>
            团队共享通知推送
          </ion-row>
          <ion-row align-items-center justify-content-center>
            <p></p>
          </ion-row>
        </ion-grid>
      </ion-row>
      <ion-row>
        <ion-list no-lines>
          <ion-list-header>GitHub</ion-list-header>
          <!-- 自己的项目跟进通知 -->
          <ion-item-sliding *ngFor="let sgithub of sgithubs">
            <ion-item>
              <h3><ion-icon name="git-network"></ion-icon> {{sgithub.ins.value.full_name}}</h3>
              <p>{{sgithub.ins.value.description}}</p>
              <div class="avatars" *ngIf="sgithub.share && sgithub.share.shares && sgithub.share.shares.length > 0">
                <div *ngFor="let share of sgithub.share.shares">
                  <ion-avatar>
                    <img [src]="share.bhiu">
                  </ion-avatar>
                </div>
              </div>
            </ion-item>
            <ion-item-options side="right">
              <button ion-button clear (click)="shareto(sgithub)" color="danger">
                <ion-icon ios="ios-add-circle-outline" md="ios-add-circle-outline"></ion-icon>
                添加
              </button>
              <button ion-button clear (click)="configure(sgithub)" color="danger">
                <ion-icon ios="ios-construct" md="ios-construct"></ion-icon>
                选项
              </button>
            </ion-item-options>
          </ion-item-sliding>
          <!-- 共享给自己的项目跟进通知 -->
          <ion-item-sliding *ngFor="let sgithubin of sgithubsin">
            <ion-item>
              <ion-avatar item-start>
                <img [src]="(sgithubin.from && sgithubin.from.froms && sgithubin.from.froms[0])? sgithubin.from.froms[0].bhiu : defaultavatar">
              </ion-avatar>
              <h3><ion-icon name="git-network"></ion-icon> {{sgithubin.ins.value.full_name}}</h3>
              <p>{{sgithubin.ins.value.description}}</p>
            </ion-item>
            <ion-item-options side="right">
              <button ion-button clear (click)="configure(sgithubin)" color="danger">
                <ion-icon ios="ios-construct" md="ios-construct"></ion-icon>
                选项
              </button>
            </ion-item-options>
          </ion-item-sliding>

          <ion-list-header>集成 | fir.im</ion-list-header>
          <!-- 自己的项目跟进通知 -->
          <ion-item-sliding *ngFor="let sfir of sfirs">
            <ion-item>
              <h3>
                <ion-thumbnail>
                  <img [src]="sfir.ins.value.icon">
                </ion-thumbnail>
                 　　{{sfir.ins.value.name}}
              </h3>
              <p>Platform: {{sfir.ins.value.platform}}</p>
              <div class="avatars" *ngIf="sfir.share && sfir.share.shares && sfir.share.shares.length > 0">
                <div *ngFor="let share of sfir.share.shares">
                  <ion-avatar>
                    <img [src]="share.bhiu">
                  </ion-avatar>
                </div>
              </div>
            </ion-item>
            <ion-item-options side="right">
              <button ion-button clear (click)="shareto(sfir)" color="danger">
                <ion-icon ios="ios-add-circle-outline" md="ios-add-circle-outline"></ion-icon>
                添加
              </button>
              <button ion-button clear (click)="configure(sfir)" color="danger">
                <ion-icon ios="ios-construct" md="ios-construct"></ion-icon>
                选项
              </button>
            </ion-item-options>
          </ion-item-sliding>
          <!-- 共享给自己的项目跟进通知 -->
          <ion-item-sliding *ngFor="let sfirin of sfirsin">
            <ion-item>
              <ion-avatar item-start>
                <img [src]="(sfirin.from && sfirin.from.froms && sfirin.from.froms[0])? sfirin.from.froms[0].bhiu : defaultavatar">
              </ion-avatar>
              <h3>
                <ion-thumbnail>
                  <img [src]="sfirin.ins.value.icon">
                </ion-thumbnail>
                 　　{{sfirin.ins.value.name}}
              </h3>
              <p>Platform: {{sfirin.ins.value.platform}}</p>
            </ion-item>
            <ion-item-options side="right">
              <button ion-button clear (click)="configure(sfirin)" color="danger">
                <ion-icon ios="ios-construct" md="ios-construct"></ion-icon>
                选项
              </button>
            </ion-item-options>
          </ion-item-sliding>
        </ion-list>
      </ion-row>
    </ion-grid>
  </ion-content>
  `
})
export class FoSharePage {
  defaultavatar: string;

  travisci: boolean = false;
  defaulttravisci: Setting;

  github: boolean = false;
  sgithub: Setting;
  sgithubsecret: Setting;

  sfirs: Array<any>;
  sgithubs: Array<any>;
  sfirsin: Array<any>;
  sgithubsin: Array<any>;

  smembers: Map<string, Array<Friend>>;

  secret: string = "";

  constructor(public modalController: ModalController,
              public navCtrl: NavController,
              public viewCtrl: ViewController,
              private iab: InAppBrowser,
              private ssService: SsService,
              private emitService: EmitService,
              private _renderer: Renderer2) {
    this.defaultavatar = DataConfig.HUIBASE64;

    this.emitService.register("mwxing.config.user.ytbl.refreshed", () => {
      this.refreshInstances();
    });

    //初始化实例
    this.refreshInstances();
  }

  refreshInstances() {

    //取得GITHUB安全令牌
    let memSecretDef = UserConfig.settins.get(DataConfig.SYS_FOGHSECRET);
    if (memSecretDef && memSecretDef.value) {
      this.secret = memSecretDef.value;
    }

    //FIR.IM实例
    let firInstances = UserConfig.getSettings(DataConfig.SYS_FOFIR_INS);
    //FIR.IM实例共享
    let firShareInstances = UserConfig.getSettings(DataConfig.SYS_FOFIR_INS_SHARE);
    //GITHUB实例
    let githubInstances = UserConfig.getSettings(DataConfig.SYS_FOGH_INS);
    //GITHUB实例共享
    let githubShareInstances = UserConfig.getSettings(DataConfig.SYS_FOGH_INS_SHARE);
    //被共享FIR.IM实例
    let firinInstances = UserConfig.getSettings(DataConfig.SYS_FOFIRIN_INS);
    //被共享FIR.IM实例共享人
    let firinFromInstances = UserConfig.getSettings(DataConfig.SYS_FOFIRIN_INS_FROM);
    //被共享GITHUB实例
    let githubinInstances = UserConfig.getSettings(DataConfig.SYS_FOGHIN_INS);
    //被共享GITHUB实例共享人
    let githubinFromInstances = UserConfig.getSettings(DataConfig.SYS_FOGHIN_INS_FROM);

    //加载实例
    let firs: Map<string, any> = new Map<string, any>();
    let githubs: Map<string, any> = new Map<string, any>();

    for (let f in firInstances) {
      let obj = firInstances[f];

      firs.set(obj.type, {
        ins: {
          id: obj.yi,
          type: obj.typeB,
          typename: obj.bname,
          key: obj.type,
          keyname: obj.name,
          value: JSON.parse(obj.value)
        },
        share: {}
      });
    }

    for (let sf of firShareInstances) {
      let exist = firs.get(sf.type);

      if (exist) {
        exist.share = {
          id: sf.yi,
          shares: UserConfig.getAvatars(JSON.parse(sf.value).share) || [],
          share: JSON.parse(sf.value).share || []
        };

        firs.set(sf.type, exist);
      }
    }

    for (let g in githubInstances) {
      let obj = githubInstances[g];

      githubs.set(obj.type, {
        ins: {
          id: obj.yi,
          type: obj.typeB,
          typename: obj.bname,
          key: obj.type,
          keyname: obj.name,
          value: JSON.parse(obj.value)
        },
        share: {}
      });
    }

    for (let sg of githubShareInstances) {
      let exist = githubs.get(sg.type);

      if (exist) {
        exist.share = {
          id: sg.yi,
          shares: UserConfig.getAvatars(JSON.parse(sg.value).share) || [],
          share: JSON.parse(sg.value).share || []
        };

        githubs.set(sg.type, exist);
      }
    }

    //加载被共享实例
    let firsin: Map<string, any> = new Map<string, any>();
    let githubsin: Map<string, any> = new Map<string, any>();

    for (let f in firinInstances) {
      let obj = firinInstances[f];

      firsin.set(obj.type, {
        ins: {
          id: obj.yi,
          type: obj.typeB,
          typename: obj.bname,
          key: obj.type,
          keyname: obj.name,
          value: JSON.parse(obj.value)
        },
        from: {}
      });
    }

    for (let ff of firinFromInstances) {
      let exist = firsin.get(ff.type);

      if (exist) {
        exist.from = {
          id: ff.yi,
          froms: UserConfig.getAvatars(JSON.parse(ff.value).from) || [],
          from: JSON.parse(ff.value).from || []
        };

        firsin.set(ff.type, exist);
      }
    }

    for (let g in githubinInstances) {
      let obj = githubinInstances[g];

      githubsin.set(obj.type, {
        ins: {
          id: obj.yi,
          type: obj.typeB,
          typename: obj.bname,
          key: obj.type,
          keyname: obj.name,
          value: JSON.parse(obj.value)
        },
        from: {}
      });
    }

    for (let gf of githubinFromInstances) {
      let exist = githubsin.get(gf.type);

      if (exist) {
        exist.from = {
          id: gf.yi,
          froms: UserConfig.getAvatars(JSON.parse(gf.value).from) || [],
          from: JSON.parse(gf.value).from || []
        };

        githubsin.set(gf.type, exist);
      }
    }

    this.sgithubs = Array.from(githubs.values());
    this.sfirs = Array.from(firs.values());
    this.sgithubsin = Array.from(githubsin.values());
    this.sfirsin = Array.from(firsin.values());

  }

  shareto(instance) {
    let preshare = instance.share || {};
    let modal = this.modalController.create(DataConfig.PAGE._FS4FO_PAGE, {selected: preshare.share || []});
    modal.onDidDismiss((data)=>{
      if (data && data.selected) {
        // 保存共享设置
        let sharedef: Setting = new Setting();

        if (preshare && preshare.id) {
          sharedef.yi = preshare.id;
        }

        sharedef.typeB = instance.ins.type + "_SHARE";
        sharedef.bname = instance.ins.typename;
        sharedef.name = instance.ins.keyname;
        sharedef.type = instance.ins.key;
        sharedef.value = "";

        // 存在已共享设置
        if (preshare && preshare.share) {
          // 比较移除共享用户, 设置禁用
          let moved = [];

          for (let pre of preshare.share) {
            if (data.selected.indexOf(pre) < 0) {
              moved.push(pre);
            }
          }

          this.save(sharedef, JSON.stringify({share: moved}), false);
        }

        this.save(sharedef, JSON.stringify({share: data.selected}));
      }
    });
    modal.present();
  }

  configure(instance) {
    let modal = this.modalController.create("", {target: instance});//DataConfig.PAGE._FOCONFIGURE_PAGE
    modal.onDidDismiss((data)=>{
      if (data && data.selected) {
        console.log("dddd");
      }
    });
    modal.present();
  }

  async save(setting, value, active: boolean = true) {
    let set:PageY = new PageY();
    set.yi = setting.yi;//偏好主键ID
    set.ytn = setting.bname; //偏好设置类型名称
    set.yt = setting.typeB; //偏好设置类型
    set.yn = setting.name;//偏好设置名称
    set.yk = setting.type ;//偏好设置key
    if (typeof value === "boolean")
      set.yv = (value) ? "1":"0";//偏好设置value
    else
      set.yv = value;//偏好设置value

    setting.value = set.yv;

    if (active) {
      await this.ssService.save(set);
    }

    if (set.yt == DataConfig.SYS_FOGH_INS_SHARE) {
      let share = JSON.parse(value);

      for (let shareto of share.share) {
        if (shareto == UserConfig.account.id) continue;

        await this.ssService.putFollowGitHubShare(
          shareto,
          setting.type,
          UserConfig.account.id,
          this.secret,
          moment().valueOf(),
          active
        );
      }
    } else if (set.yt == DataConfig.SYS_FOFIR_INS_SHARE) {
      let share = JSON.parse(value);

      for (let shareto of share.share) {
        if (shareto == UserConfig.account.id) continue;

        await this.ssService.putFollowFirIMShare(
          shareto,
          setting.type,
          UserConfig.account.id,
          moment().valueOf(),
          active
        );
      }
    }
  }

  goBack() {
    let data: Object = {setting: this.defaulttravisci};

    this.viewCtrl.dismiss(data);
  }
}
