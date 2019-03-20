import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ColorSliderComponent } from './color-slider/color-slider';
import { ScrollSelectComponent } from './scroll-select/scroll-select';
import { ScrollRangePickerComponent } from './scroll-range-picker/scroll-range-picker';
@NgModule({
	declarations: [ColorSliderComponent,
    ScrollSelectComponent,
    ScrollRangePickerComponent],
	imports: [BrowserModule],
	exports: [ColorSliderComponent,
    ScrollSelectComponent,
    ScrollRangePickerComponent]
})
export class ComponentsModule {}
