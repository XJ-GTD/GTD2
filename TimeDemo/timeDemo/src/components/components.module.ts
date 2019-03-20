import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ColorSliderComponent } from './color-slider/color-slider';
import { ScrollSelectComponent } from './scroll-select/scroll-select';
import { ScrollRangePickerComponent } from './scroll-range-picker/scroll-range-picker';
import { WaveTimePickerComponent } from './wave-time-picker/wave-time-picker';
@NgModule({
	declarations: [ColorSliderComponent,
    ScrollSelectComponent,
    ScrollRangePickerComponent,
    WaveTimePickerComponent],
	imports: [BrowserModule],
	exports: [ColorSliderComponent,
    ScrollSelectComponent,
    ScrollRangePickerComponent,
    WaveTimePickerComponent]
})
export class ComponentsModule {}
