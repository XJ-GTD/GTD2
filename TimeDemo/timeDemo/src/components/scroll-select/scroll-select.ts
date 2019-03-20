import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ElementRef, Events } from 'ionic-angular';

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
  options: array = [];
  @Input()
  value: any;
  @Output("changed")
  changedPropEvent = new EventEmitter();
  unsubscribe: () => void;
  slideWidth: number;
  index: number = 0;
  interval: any = null;
  lastScrollLeft: number = 0;

  constructor(public events: Events) {
    console.log('Hello ScrollSelectComponent Component');
    this.slideWidth = document.body.clientWidth;
    this.events.subscribe('_scrollBox:change', (target) => {
      this.optionChanged(target);
    });
  }

  ngOnInit() {
    const that = this;
    const ele = this._scrollBox.nativeElement;
    ele.addEventListener('scroll', (event) => {
      that.events.publish('_scrollBox:change', event.target.scrollLeft, Date.now());
    }, {passive: true}, false);
  }
  
  prev() {
    this.index = (this.index - 1) > 0 ? (this.index - 1) : 0;
    this.value = this.options[this.index].value;

    this.lastScrollLeft = this.index * this.slideWidth;
    this._scrollBox.nativeElement.scrollLeft = this.index * this.slideWidth;
  }
  
  next() {
    this.index = (this.index + 1) >= this.options.length ? this.index : (this.index + 1);
    this.value = this.options[this.index].value;

    this.lastScrollLeft = this.index * this.slideWidth;
    this._scrollBox.nativeElement.scrollLeft = this.index * this.slideWidth;
  }
  
  isFirst() {
    return (this.value === undefined || this.value == this.options[0].value);
  }
  
  isLast() {
    return (this.options === undefined || this.options.length === 0 || this.value === undefined || this.value == this.options[this.options.length - 1].value);
  }
  
  optionChanged(target) {
    if (this.interval === null) {
      this.interval = setInterval(() => {
        this.interval = null;

        if (this._scrollBox.nativeElement.scrollLeft !== this.lastScrollLeft) {

          console.log('change pos');
          let index = Math.floor(this._scrollBox.nativeElement.scrollLeft / this.slideWidth);

          if ((this._scrollBox.nativeElement.scrollLeft - (index * this.slideWidth)) >= (Math.floor(this.slideWidth / 2))) {
            index = (index + 1) >= this.options.length ? index : (index + 1);
          }
          
          this.index = index;
          this.value = this.options[index].value;
          
          this.lastScrollLeft = index * this.slideWidth;
          this._scrollBox.nativeElement.scrollLeft = index * this.slideWidth;
        }
      }, 1000);
    }
  }
}
