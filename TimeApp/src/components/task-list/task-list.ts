import {Component, Output, Input, EventEmitter} from "@angular/core";
import * as moment from "moment";

@Component({
  selector: 'task-list',
  template: `
    <ng-template [ngIf]="tasklist.length > 0"
                 [ngIfElse]="notask">
    <ion-grid class = "list-contont">
      <ion-row class="list-todolist-content task-item" *ngFor="let task of tasklist"  [ngClass]="{'complete': task.cs == '1'}" (click)="gotoDetail(task)" >
          <div class="agendaline">
            <div class="agenda-sn">{{task.evn}}</div>
            <div class="agenda-tool" (click)="erease($event, task)">
              <ion-icon class="fa fa-eraser">移除</ion-icon>
            </div>
          </div>
          <div class="agendaline">

            <div class="agenda-warp">
              <div class="agenda-icon">
                <ion-icon class="{{(task.evd + ' ' + task.evt) | formatedate:'withNowcss'}}"></ion-icon>
              </div>
              <div class="agenda-st">{{(task.evd + ' ' + task.evt) | formatedate:'withNow'}}</div>
            </div>
            <div class="agenda-tool" (click)="complete($event, task)">
              <ion-icon class="fa fa-check">完成</ion-icon>
            </div>
          </div>
        <div class="agendaline">

          <div class="agenda-warp">
            <div  class="agenda-person">---来自小酒仙{{task.ui | formatuser: currentuser: friends}}</div>
          </div>
        </div>
      </ion-row>
    </ion-grid>
    </ng-template>
    <ng-template #notask>
      <div class="notask">
        <ion-icon class="fa fa-calendar-minus-o"></ion-icon>
        <span>没有重要事项了哟～</span>
        <button>
          创建活动
        </button>
      </div>
    </ng-template>
  `
})
export class TaskListComponent {

  @Output()
  private onStartLoad: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  private onCardClick: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  private onCreateNew: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  private onErease: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  private onComplete: EventEmitter<any> = new EventEmitter<any>();

  tasklist: Array<any> = new Array<any>();

  @Input()
  currentuser: string = "";
  @Input()
  friends: Array<any> = new Array<any>();

  constructor() {
  }

  ngOnInit() {
    this.onStartLoad.emit(this);
  }

  gotoDetail(task: any) {
    this.onCardClick.emit({target: this, value: task});
  }

  gotoNew() {
    this.onCreateNew.emit(this);
  }

  refresh() {
    this.onStartLoad.emit(this);
  }

  erease(event: any, target: any) {
    event.stopPropagation();  // 阻止冒泡
    event.preventDefault();   // 忽略事件传递
    this.onErease.emit(target);
  }

  complete(event: any, target: any) {
    event.stopPropagation();  // 阻止冒泡
    event.preventDefault(); // 忽略事件传递
    this.onComplete.emit(target);
  }
}
