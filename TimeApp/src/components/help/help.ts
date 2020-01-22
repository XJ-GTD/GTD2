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
                <p>创建</p>
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
              <!--<li>-->
                <!--<p>编辑你的事情</p>-->
                <!--<ul>-->
                  <!--<li>-->
                    <!--时间是后天下午2点（时间）-->
                  <!--</li>-->
                  <!--<li>-->
                    <!--主题是朋友聚餐（主题）-->
                  <!--</li>-->
                  <!--<li>-->
                    <!--把它共享给小冥（共享参与人）-->
                  <!--</li>-->
                  <!--<li>-->
                    <!--提醒小冥关注一下（@参与人）-->
                  <!--</li>-->
                  <!--<li>-->
                    <!--地址是天安门广场（地址）-->
                  <!--</li>-->
                  <!--<li>-->
                    <!--取消这个活动，备忘，日历项（删除）-->
                  <!--</li>-->
                  <!--<li>-->
                    <!--设定提前10分钟的提醒（设置提醒）-->
                  <!--</li>-->
                <!--</ul>-->
              <!--</li>-->
              <li>
                <p>查询</p>
                <ul>
                  <li>
                    我（今天）有什么安排
                  </li>
                  <li>
                    查询关于（开会）的活动
                  </li>
                  <li>
                    查询关于（密码）的备忘
                  </li>
                  <li>
                    什么时候是（我的生日）
                  </li>
                  <li>
                    查询（明天开会的）参与人
                  </li>                 
                </ul>
              </li>
              <li>
                <p>设置</p>
                <ul>
                  <li>
                    切换主题
                  </li>
                  <li>
                    开启语音播报
                  </li>
                  <li>
                    关闭语音播报
                  </li>
                </ul>
              </li>
              <li>
                <p>提醒</p>
               <ul>
                  <li>
                    提醒我（5分钟后）（回电话）
                  </li>
                  <li>
                    设一个（20分钟的）的闹钟
                  </li>
                  <li>
                   到计时（10分钟）
                  </li>
                  <li>
                   （5点钟）提醒我（准时下班）
                  </li>
                </ul>
              </li>

              <li>
                <p>其他</p>
                <ul>
                  <li>
                    今天上海天气怎么样
                  </li>
                  <li>
                    为什么（天空是蓝色的）
                  </li>
                  <li>
                    今天有什么财经新闻
                  </li>
                  <li>
                    讲一个笑话
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



