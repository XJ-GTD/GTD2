import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ColorSliderComponent } from './color-slider/color-slider';
@NgModule({
	declarations: [ColorSliderComponent],
	imports: [BrowserModule],
	exports: [ColorSliderComponent]
})
export class ComponentsModule {}
