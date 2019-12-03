import { ElementRef, Directive, OnInit} from '@angular/core';

@Directive({
  selector: 'ion-scroll[scrollheightAuto],div[scrollheightAuto]'
})
export class ScrollheightDirective {

  constructor(public element: ElementRef) {
  }

  ngAfterViewInit(): void {
    this.element.nativeElement.style.height = "calc(100% - " +  this.element.nativeElement.offsetTop + "px - "  +  4 + "px)";

  }
}
