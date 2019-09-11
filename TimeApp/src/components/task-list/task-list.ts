import {Component, Output, Input, EventEmitter} from "@angular/core";
import * as moment from "moment";

@Component({
  selector: 'task-list',
  template: `
    <ion-grid class = "list-contont">
      <ion-row class="list-todolist-content task-item" *ngFor="let task of tasklist"  [ngClass]="{'complete': task.cs == '1'}" (click)="gotoDetail(task)" >
          <div class="agendaline">
            <div class="agenda-sn">{{task.evn}}</div>
            <div class="agenda-tool">
              <ion-icon class="fa fa-eraser">移除</ion-icon>
            </div>
          </div>
          <div class="agendaline">
            
            <div class="agenda-warp">
              <div class="agenda-icon">
                <ion-icon class="{{(task.evd + ' ' + task.evt) | formatedate:'withNowcss'}}"></ion-icon>
              </div>
              <div class="agenda-st">{{(task.evd + ' ' + task.evt) | formatedate:'withNow'}}</div>
              <div  class="agenda-person">---来自小酒仙{{task.ui | formatuser: currentuser: friends}}</div>
            </div>
            <div class="agenda-tool">
              <ion-icon class="fa fa-check">完成</ion-icon>
            </div>
          </div>
      </ion-row>
    </ion-grid>
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

  complete(target: any) {
    this.onComplete.emit(target);
  }
}
