import { Component, Output, EventEmitter } from "@angular/core";

@Component({
  selector: 'task-list',
  template: `
  <ion-grid class="h70">
    <ion-row class="h100" align-items-center>
      <p class="p15"></p>
      <ion-grid>
        <ion-row justify-content-center>
          <ng-container *ngFor="let task of tasklist">
          <ion-card [ngClass]="{'complete': task.cs == '1'}" (click)="gotoDetail(task)">
            <ion-card-content>
              <p>{{task.evn}}</p>
            </ion-card-content>

            <ion-row>
              <ion-col>
                <button ion-button icon-start clear small>
                  <ion-icon name="thumbs-up"></ion-icon>
                  <div>12天前</div>
                </button>
              </ion-col>
              <ion-col>
                <button ion-button clear small>
                  <div>{{task.evd}}</div>
                </button>
              </ion-col>
            </ion-row>
          </ion-card>
          </ng-container>
        </ion-row>
      </ion-grid>
      <p class="p15"></p>
      <p class="p15"></p>
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

  tasklist: Array<any> = new Array<any>();

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
}
