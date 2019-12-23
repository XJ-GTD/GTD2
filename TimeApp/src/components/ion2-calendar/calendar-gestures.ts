import {
  Platform,
  DomController,
  GestureController, GESTURE_ITEM_SWIPE, SlideGesture, SlideData
} from "ionic-angular";
import {GESTURE_PRIORITY_SLIDING_ITEM} from "ionic-angular/gestures/gesture-controller";
import {CalendarComponent} from "../../components/ion2-calendar";
import {pointerCoord} from "ionic-angular/util/dom";
import {clamp} from "ionic-angular/util/util";

export class CalendarGesture extends SlideGesture {
 //  constructor(plt: Platform, private calendarComponent: CalendarComponent, gestureCtrl: GestureController, domCtrl: DomController)
 //  {
 //    super(plt, calendarComponent.cardContent.getNativeElement(), {
 //      direction: 'x',
 //      threshold: 5,
 //      zone: false,
 //      passive: true,
 //      domController: domCtrl,
 //      gesture: gestureCtrl.createGesture({
 //        name: GESTURE_ITEM_SWIPE,
 //        priority: GESTURE_PRIORITY_SLIDING_ITEM,
 //        disableScroll: true
 //      })});
 //  }
 //
 // onDragMove(ev) {
 //    var slide = this.slide;
 //    var coord = pointerCoord(ev);
 //    var newPos = coord[this.direction];
 //    var newTimestamp = Date.now();
 //    var velocity = (!this.plt.isRTL ? (slide.pos - newPos) : (newPos - slide.pos)) / (newTimestamp - slide.timestamp);
 //    slide.pos = newPos;
 //    slide.timestamp = newTimestamp;
 //    slide.distance = clamp(slide.min, (!this.plt.isRTL ? slide.pointerStartPos - newPos : newPos - slide.pointerStartPos) + slide.elementStartPos, slide.max);
 //    slide.velocity = velocity;
 //    slide.delta = (this.plt.isRTL ? slide.pointerStartPos - newPos : newPos - slide.pointerStartPos);
 //    this.onSlide(slide, ev);
 //  };
 //
 //  onSlideStart(_slide?: SlideData, _ev?: any): void{
 //    // this.calendarComponent.calendarAnimation.nextMonthStart();
 //    // console.log("onSlideStart=====" );
 //
 //  }
 //
 //  onSlide(_slide?: SlideData, _ev?: any): void{
 //    // var z = (this.menu.isRightSide !== this.plt.isRTL ? slide.min : slide.max);
 //     var stepValue = (_slide.distance / 200);
 //    this.calendarComponent.calendarAnimation.colseProgess(stepValue);
 //
 //  }
 //  onSlideEnd(_slide?: SlideData, _ev?: any): void{
 //    var currentStepValue = (_slide.distance / 200);
 //    var velocity = _slide.velocity;
 //    let shouldComplete:boolean = currentStepValue > 0.5 || _slide.delta > 20;
 //    this.calendarComponent.calendarAnimation.colseEnd(shouldComplete, currentStepValue, velocity,()=>{
 //      if (shouldComplete)
 //        this.calendarComponent.changestat();
 //    });
 //
 //  }
}
