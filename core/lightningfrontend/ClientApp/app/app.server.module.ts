import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { AppModuleShared } from './app.shared.module';
import { AppComponent } from './components/app/app.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@NgModule({
    bootstrap: [AppComponent],
    imports: [
        ServerModule,
        AppModuleShared,
        FontAwesomeModule
    ]
})
export class AppModule {
}
