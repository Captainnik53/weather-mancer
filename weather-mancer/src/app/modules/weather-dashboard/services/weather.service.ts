/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, map, Observable } from 'rxjs';
import { config } from '../weather-app-config';
import {
  Coordinates,
  GeoCoordinatesApiResponseItem,
  WeatherDataResponse,
} from '../interfaces/weather.model';
import { Configuration, OpenAIApi } from 'openai';
@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private weatherApi = 'https://api.openweathermap.org/data/2.5/weather';
  private geoCoordinatesApi = 'https://api.openweathermap.org/geo/1.0/direct';

  readonly openAIConfiguration = new Configuration({
    apiKey: process.env['OPENAI_API_KEY'],
  });

  readonly openAIApi = new OpenAIApi(this.openAIConfiguration);

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

  getDataFromOpenAI(text: string): Observable<any> {
    return from(
      this.openAIApi.createCompletion({
        model: 'text-davinci-003',
        prompt: text,
        max_tokens: 256,
      })
    );
  }
}
