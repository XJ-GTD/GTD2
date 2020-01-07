import {Component, Output, Input, EventEmitter} from "@angular/core";
import * as moment from "moment";

@Component({
  selector: 'task-list',
  template: `
    <ng-template [ngIf]="tasklist.length > 0"
                 [ngIfElse]="notask">
      
    <ion-grid class = "list-grid-content">
      <ion-row class="item-content item-content-backgroud" leftmargin toppaddingsamll bottompaddingsamll rightmargin *ngFor="let task of tasklist"
      (click)="gotoDetail(task)">
          <div class="line" leftmargin rightmargin>
            <div class="sn font-large">{{task.evn}}</div>
          </div>
          <div class="line font-normal" leftmargin rightmargin>
              <div class="st font-small">  {{(task.evd + ' ' + task.evt) | transfromdate:'withNow'}}</div>
              <div class="icon" end >
                <!--<ion-icon class="fal fa-minus-circle" (click)="erease($event, task)"></ion-icon>-->
                <button (click)="complete($event, task)">
                  <b>确认完成</b>
                </button>
              </div>
          </div>
      </ion-row>
    </ion-grid>
    </ng-template>
    <ng-template #notask>
      <div class="notask">
        <ion-icon class="fal fa-grin-beam"></ion-icon>
        <span>没有重要事项了哟～</span>
        <button (click)="create()">
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

  @Input()
  tasklist: Array<any> = new Array<any>();

  @Input()
  currentuser: string = "";
  @Input()
  friends: Array<any> = new Array<any>();
  @Input()
  plans: Array<any> = new Array<any>();

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

  create() {
    this.onCreateNew.emit(this);
  }

  complete(event: any, target: any) {
    event.stopPropagation();  // 阻止冒泡
    event.preventDefault(); // 忽略事件传递
    this.onComplete.emit(target);
  }
}
