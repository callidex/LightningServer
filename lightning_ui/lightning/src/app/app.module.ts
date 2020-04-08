import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DetectormapComponent } from './detectormap/detectormap.component';
import { DetectorService } from './detector.service';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    DetectormapComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [DetectorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
