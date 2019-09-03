import { Component, Output, Input, EventEmitter } from "@angular/core";

@Component({
  selector: 'task-list',
  template: `
  <ion-grid>
    <ion-row class="h100" align-items-center>
      <ion-grid>
        <ion-row>
          <ng-container *ngFor="let task of tasklist">
          <ion-card [ngClass]="{'complete': task.cs == '1'}" (click)="gotoDetail(task)">
            <ion-card-content>
              <ion-checkbox color="dark" checked="false" (ionChange)="complete(task)"></ion-checkbox>
              <p>{{task.evn}}</p>
            </ion-card-content>

            <ion-row>
              <ion-col>
                <button ion-button icon-start clear small>
                  <ion-icon name="thumbs-up"></ion-icon>
                  <div>{{(task.evd + ' ' + task.evt) | formatedate:'withNow'}}</div>
                </button>
              </ion-col>
              <ion-col>
                <button ion-button clear small>
                  <div>{{task.ui | formatuser: currentuser: friends}}</div>
                </button>
              </ion-col>
            </ion-row>
          </ion-card>
          </ng-container>
        </ion-row>
      </ion-grid>
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
