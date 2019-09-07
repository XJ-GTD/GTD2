import {Component, Output, Input, EventEmitter} from "@angular/core";

@Component({
  selector: 'task-list',
  template: `
    <ion-grid class = "list-contont">
      <ion-row class="list-todolist-content task-item" *ngFor="let task of tasklist"  [ngClass]="{'complete': task.cs == '1'}" (click)="gotoDetail(task)" >
          <div class="agendaline">
            <div class="agenda-icon"></div>
            <div class="agenda-sn">{{task.evn}}</div>
          </div>
          <div class="agendaline">
            <div class="agenda-icon">
              <ion-icon name="thumbs-up"></ion-icon>
            </div>
              <div class="agenda-st">{{(task.evd + ' ' + task.evt) | formatedate:'withNow'}}</div>
              <div  class="agenda-person">{{task.ui | formatuser: currentuser: friends}}</div>
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
