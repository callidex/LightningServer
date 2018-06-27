import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './components/app/app.component';
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { HomeComponent } from './components/home/home.component';
import { DetectorMapComponent } from './components/detectormap/detectormap.component';

import { AgmCoreModule } from '@agm/core';
import { SignalComponent } from './components/signal/signal.component';
import { SignalCollectionComponent } from './components/signalcollection/signalcollection.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        HomeComponent,
        DetectorMapComponent,
        SignalComponent,
        SignalCollectionComponent
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        FontAwesomeModule,
        RouterModule.forRoot([
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },
            { path: 'detectors', component: DetectorMapComponent },
            { path: 'signals', component: SignalCollectionComponent },
            { path: '**', redirectTo: 'home' }
        ]),
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyAzHkF3OKTxPo-D8dB-P9iGhuBxSXcSs2Y'
        })
    ]
})
export class AppModuleShared {
}
