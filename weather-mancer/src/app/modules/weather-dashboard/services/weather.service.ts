/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, of, switchMap } from 'rxjs';
import { config } from '../weather-app-config';
import {
  Coordinates,
  GeoCoordinatesApiResponseItem,
  WeatherDataResponse,
} from '../interfaces/weather.model';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private weatherApi = 'https://api.openweathermap.org/data/2.5/weather';
  private geoCoordinatesApi = 'https://api.openweathermap.org/geo/1.0/direct';

  constructor(private httpClient: HttpClient) {}

  getWeatherData(geoCoordinates: Coordinates): Observable<WeatherDataResponse> {
    const url = `${this.weatherApi}?lat=${geoCoordinates.lat}&lon=${geoCoordinates.lon}&appid=${config.apiKey}&units=metric`;
    return this.httpClient.get<WeatherDataResponse>(url).pipe(
      map((response: WeatherDataResponse) => {
        return response;
      })
    );
  }

  getGeoCoordinates(
    cityName: string
  ): Observable<GeoCoordinatesApiResponseItem[]> {
    const url = `${this.geoCoordinatesApi}?q=${cityName}&limit=${1}&appid=${
      config.apiKey
    }`;
    return this.httpClient.get<GeoCoordinatesApiResponseItem[]>(url).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getDataFromOpenAI(text: string[]): Observable<any> {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + (environment as any).chatGPTApiKey,
    });
    const requestBody = {
      model: 'gpt-3.5-turbo',
      messages: text,
    };
    return this.httpClient
      .post('https://api.openai.com/v1/chat/completions', requestBody, {
        headers: reqHeader,
      })
      .pipe(
        switchMap((response) => {
          return of(response);
        })
      );
  }
}
