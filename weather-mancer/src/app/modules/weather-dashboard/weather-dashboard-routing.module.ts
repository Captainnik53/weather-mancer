import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WeatherSearchComponent } from './components/weather-search/weather-search.component';

const routes: Routes = [
  {
    path: '',
    component: WeatherSearchComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WeatherDashboardRoutingModule {}
