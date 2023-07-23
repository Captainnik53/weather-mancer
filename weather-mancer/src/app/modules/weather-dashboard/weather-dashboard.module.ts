import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { WeatherDashboardRoutingModule } from './weather-dashboard-routing.module';
import { WeatherSearchComponent } from './components/weather-search/weather-search.component';

@NgModule({
  declarations: [WeatherSearchComponent],
  imports: [
    CommonModule,
    WeatherDashboardRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
})
export class WeatherDashboardModule {}
