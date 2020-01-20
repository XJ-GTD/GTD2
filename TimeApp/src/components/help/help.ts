import {Component, ElementRef, Input, Renderer2, ViewChild} from '@angular/core';
import {IonicPage, TextInput} from 'ionic-angular';
import {Keyboard} from "@ionic-native/keyboard";

/**
 * Generated class for 输入框 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'HelpComponent',
  template: `
        <ion-card #help>
          <ion-card-header>
            <ion-card-title>
              冥王星语音向导
            </ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ul>
              <li>
                <p>创建你的事情</p>
                <ul>
                  <li>
                    创建活动
                  </li>
                  <li>
                    创建日历项
                  </li>
                  <li>
                    创建备忘
                  </li>
                </ul>
              </li>
              <li>
                <p>编辑你的事情</p>
                <ul>
                  <li>
                    时间是后天下午2点（时间）
                  </li>
                  <li>
                    主题是朋友聚餐（主题）
                  </li>
                  <li>
                    把它共享给小冥（共享参与人）
                  </li>
                  <li>
                    提醒小冥关注一下（@参与人）
                  </li>
                  <li>
                    地址是天安门广场（地址）
                  </li>
                  <li>
                    取消这个活动，备忘，日历项（删除）
                  </li>
                  <li>
                    设定提前10分钟的提醒（设置提醒）
                  </li>
                </ul>
              </li>
              <li>
                <p>查询你的事情</p>
                <ul>
                  <li>
                    查询我今天的安排
                  </li>
                  <li>
                    查询关于开会的活动
                  </li>
                  <li>
                    查询关于密码的备忘
                  </li>
                  <li>
                    什么时候是我的生日
                  </li>
                  <li>
                    查询明天开会的参与人
                  </li>
                  <li>
                    查询关于（活动主题）的活动
                  </li>
                  <li>
                    查询关于（日历项主题）的日历项
                  </li>
                  <li>
                    查询关于（关键字）的日历项
                  </li>
                </ul>
              </li>
            </ul>
          </ion-card-content>
        </ion-card>
  `
})
export class HelpComponent {
  helps:Array<string> = new Array<string>();
  @ViewChild("help") help: ElementRef;

  constructor(public elementRef:ElementRef) {
  }

  ngOnInit() {
      // this._renderer.setStyle(this.help.nativeElement, "min-height", (this.bScroll.wrapperHeight - 40) + "px");
      // this.bScroll.scrollToElement(this.help.nativeElement, 280, 0, 0);
  }

}



