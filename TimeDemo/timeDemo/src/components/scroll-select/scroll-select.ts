import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ElementRef, Events } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * Generated class for the ScrollSelectComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'scroll-select',
  templateUrl: 'scroll-select.html'
})
export class ScrollSelectComponent {

  @ViewChild('scrollBox', { read: ElementRef }) _scrollBox: ElementRef;
  @Input()
  type: string = 'scroll-with-button';  // 'scroll-with-button', 'scroll-without-button'
  @Input()
  options: Array = [];
  @Input()
  value: any;
  @Input()
  items: number = 1;
  befores: Array = [];
  afters: Array = [];
  @Output("changed")
  changedPropEvent = new EventEmitter();
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
    const that = this;
    const ele = this._scrollBox.nativeElement;
    console.log(this.value + ',' + this.items);

    if (this.items > 1) {
      this.befores = Array(Math.floor(this.items / 2)).fill().map((x,i)=>i);
      this.afters = Array(Math.floor(this.items / 2)).fill().map((x,i)=>i);
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
    for (let option in this.options) {
      if (this.options[option].value === this.value) {
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
    this.value = this.options[this.index].value;

    this.lastScrollLeft = this.index * (this.slideWidth / this.items);
    this._scrollBox.nativeElement.scrollLeft = this.index * (this.slideWidth / this.items);
  }
  
  next() {
    this.index = (this.index + 1) >= this.options.length ? this.index : (this.index + 1);
    this.value = this.options[this.index].value;

    this.lastScrollLeft = this.index * (this.slideWidth / this.items);
    this._scrollBox.nativeElement.scrollLeft = this.index * (this.slideWidth / this.items);
  }
  
  isFirst() {
    return (this.value === undefined || this.value == this.options[0].value);
  }
  
  isLast() {
    return (this.options === undefined || this.options.length === 0 || this.value === undefined || this.value == this.options[this.options.length - 1].value);
  }
  
  optionChanged(target) {
    if (this._scrollBox.nativeElement.scrollLeft !== this.lastScrollLeft) {

      console.log('change pos');
      let index = Math.floor(this._scrollBox.nativeElement.scrollLeft / (this.slideWidth / this.items));

      if ((this._scrollBox.nativeElement.scrollLeft - (index * (this.slideWidth / this.items))) >= (Math.floor((this.slideWidth / this.items) / 2))) {
        index = (index + 1) >= this.options.length ? index : (index + 1);
      }
      
      this.index = index;
      this.value = this.options[index].value;
      
      this.lastScrollLeft = index * (this.slideWidth / this.items);
      this.autoscroll = true;
      this._scrollBox.nativeElement.scrollLeft = index * (this.slideWidth / this.items);
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
