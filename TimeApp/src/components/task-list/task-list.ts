import {Component, Output, Input, EventEmitter} from "@angular/core";
import * as moment from "moment";

@Component({
  selector: 'task-list',
  template: `
    <ng-template [ngIf]="tasklist.length > 0"
                 [ngIfElse]="notask">

    <ion-grid class = "list-grid-content">
      <ion-row class="item-content item-content-backgroud" leftmargin toppaddingsamll bottompaddingsamll rightmargin *ngFor="let task of tasklist"
        [ngClass]="{'complete': task.cs == '1'}" (click)="gotoDetail(task)"
        [ngStyle]="{
          'border-left': (!task.ji || task.ji == '')? '0' : ('0.6rem solid ' + (task.ji | formatplan: 'color': plans))
        }">
          <div class="line font-normal" leftmargin rightmargin
            [ngStyle]="{
              'margin-left': (!task.ji || task.ji == '')? '1rem' : '0.4rem'
            }">
            <div class="sn towline">{{task.evn}}</div>
            <div class="icon" end >
              <ion-icon class="fal fa-minus-circle" (click)="erease($event, task)"></ion-icon>
              <ion-icon class="fal fa-check-circle"  (click)="complete($event, task)"></ion-icon>
            </div>
          </div>
          <div class="line font-normal" leftmargin rightmargin
            [ngStyle]="{
              'margin-left': (!task.ji || task.ji == '')? '1rem' : '0.4rem'
            }">
            <div class="icon font-small" >
              <ion-icon class="{{(task.evd + ' ' + task.evt) | transfromdate :'withNowcss'}}"></ion-icon>
            </div>
              <div class="st font-small">  {{(task.evd + ' ' + task.evt) | transfromdate:'withNow'}}</div>

              <div *ngIf="currentuser != task.ui && task.ui != ''" class="person font-small" end>-{{task.ui | formatuser: currentuser: friends}}</div>
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
