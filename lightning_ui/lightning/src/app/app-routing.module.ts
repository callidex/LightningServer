import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetectormapComponent } from './detectormap/detectormap.component';
import { HomeComponent } from './home/home.component';
import { StrikesComponent } from './strikes/strikes.component';


const routes: Routes = [
  { path: 'home', component: DetectormapComponent },
  { path: 'detectors', component: DetectormapComponent },
  { path: 'strikes', component: StrikesComponent },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/home',
    pathMatch: 'full'
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
