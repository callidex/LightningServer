import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetectormapComponent } from './detectormap/detectormap.component';
import { AppComponent } from './app.component';


const routes: Routes = [
  { path: 'detectors', component: DetectormapComponent },
  {
    path: '',
    redirectTo: '/detectors',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/detectors',
    pathMatch: 'full'
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
