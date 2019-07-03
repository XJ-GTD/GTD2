import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, ContentChildren, QueryList } from '@angular/core';
import { Events } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { ScrollSelectOptionComponent } from './scroll-select-option';

/**
 * Generated class for the ScrollSelectComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'scroll-select',
  template: `<div class="grid">
    <div class="row" align-items-center justify-content-between>
      <div *ngIf="type == 'scroll-with-button';">
        <button ion-button class="img-btn" (click)="prev()" clear [disabled]="isFirst()">
          <img class="slide-btn" src="./assets/imgs/page-prev.png">
        </button>
      </div>
      <div class="scroll-box" [ngClass]="{'scroll-with-button': type == 'scroll-with-button', 'scroll-without-button': type == 'scroll-without-button'}">
        <div class="scroll-box-content" id="scroll-box-content" #scrollBox>
          <div class="scroll-box-zoom-wrapper">
            <ng-content></ng-content>
          </div>
        </div>
        <div class="selected-circle" *ngIf="items > 1">
          <div></div>
        </div>
      </div>
      <div *ngIf="type == 'scroll-with-button';">
        <button ion-button class="img-btn" (click)="next()" clear [disabled]="isLast()">
          <img class="slide-btn" src="./assets/imgs/page-next.png">
        </button>
      </div>
    </div>
  </div>`
})
export class ScrollSelectComponent {

  @ViewChild('scrollBox', { read: ElementRef }) _scrollBox: ElementRef;
  @Input()
  type: string = 'scroll-with-button';  // 'scroll-with-button', 'scroll-without-button'
  @ContentChildren(ScrollSelectOptionComponent)
  options: QueryList<ScrollSelectOptionComponent>;
  @Input()
  value: any;
  @Input()
  items: number = 1;  //一个屏幕显示几个选项
  befores: Array<any> = [];
  afters: Array<any> = [];
  @Output("changed")
  changedPropEvent:EventEmitter<number> = new EventEmitter<number>();
  unsubscribe: () => void;
  slideWidth: number;
  index: number = 0;
  interval: any = null;
  lastScrollLeft: number = 0;
  guid: string = '';
  timer: any = null;
  t1: number;
  t2: number;
  autoscroll: boolean = false;

  constructor(public events: Events, public sanitizer: DomSanitizer) {
    console.log('Hello ScrollSelectComponent Component');
    this.guid = this.createGuid();
    this.slideWidth = document.body.clientWidth;
    this.events.subscribe('_scrollBox' + this.guid + ':change', (target) => {
      this.optionChanged(target);
    });
  }

  ngOnInit() {
  }

  ngAfterContentInit() {
    const that = this;
    const ele = this._scrollBox.nativeElement;
    console.log(this.value + ',' + this.items);

    if (this.items > 1) {
      this.befores = Array(Math.floor(this.items / 2)).fill("").map((x,i)=>i);
      this.afters = Array(Math.floor(this.items / 2)).fill("").map((x,i)=>i);
    }

    ele.addEventListener('scroll', (event) => {
      clearTimeout(this.timer);

      if (!this.autoscroll) {
        this.timer = setTimeout(this.isScrollEnd, 500, this);
        this.t1 = event.target.scrollLeft;
      }
      this.autoscroll = false;
    }, {passive: true}, false);

    let i = 0;
    for (let option in this.options.toArray()) {
      if (this.options.toArray()[option].value === this.value) {
        this.index = i;
        break;
      }
      i++;
    }
  }

  isScrollEnd(that) {
    that.t2 = that._scrollBox.nativeElement.scrollLeft;

    if (that.t1 == that.t2) {
      that.events.publish('_scrollBox' + that.guid + ':change', that.t1, Date.now());
    }
  }

  ngAfterViewInit() {
    this.lastScrollLeft = this.index * (this.slideWidth / this.items);
    this.autoscroll = true;
    this._scrollBox.nativeElement.scrollLeft = this.index * (this.slideWidth / this.items);
  }

  prev() {
    this.index = (this.index - 1) > 0 ? (this.index - 1) : 0;
    this.value = this.options.toArray()[this.index].value;

    this.lastScrollLeft = this.index * (this.slideWidth / this.items);
    this._scrollBox.nativeElement.scrollLeft = this.index * (this.slideWidth / this.items);
  }

  next() {
    this.index = (this.index + 1) >= this.options.length ? this.index : (this.index + 1);
    this.value = this.options.toArray()[this.index].value;

    this.lastScrollLeft = this.index * (this.slideWidth / this.items);
    this._scrollBox.nativeElement.scrollLeft = this.index * (this.slideWidth / this.items);
  }

  isFirst() {
    return (this.value === undefined || this.value == this.options.toArray()[0].value);
  }

  isLast() {
    return (this.options === undefined || this.options.length === 0 || this.value === undefined || this.value == this.options.toArray()[this.options.length - 1].value);
  }

  optionChanged(target) {
    if (this._scrollBox.nativeElement.scrollLeft !== this.lastScrollLeft) {
      let index = Math.floor(this._scrollBox.nativeElement.scrollLeft / (this.slideWidth / this.items));

      if ((this._scrollBox.nativeElement.scrollLeft - (index * (this.slideWidth / this.items))) >= (Math.floor((this.slideWidth / this.items) / 2))) {
        index = (index + 1) >= this.options.length ? index : (index + 1);
      }

      this.index = index;
      this.value = this.options.toArray()[index].value;

      this.lastScrollLeft = index * (this.slideWidth / this.items);
      this.autoscroll = true;
      this._scrollBox.nativeElement.scrollLeft = index * (this.slideWidth / this.items);
      setTimeout(()=> {
        this.changedPropEvent.emit(this.value);
      },500);
    }
  }

  assembleHTML(strHTML: any) {
    return this.sanitizer.bypassSecurityTrustHtml(strHTML);
  }

  createGuid() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	}
}
