import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetectormapComponent } from './detectormap/detectormap.component';


const routes: Routes = [
  { path: 'detectors', component: DetectormapComponent },
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
