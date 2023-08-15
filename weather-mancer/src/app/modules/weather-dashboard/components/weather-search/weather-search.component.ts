/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, take } from 'rxjs';
import {
  Coordinates,
  messageItem,
  WeatherDataResponse,
} from '../../interfaces/weather.model';
import { WeatherService } from '../../services/weather.service';

@Component({
  selector: 'weather-mancer-weather-search',
  templateUrl: './weather-search.component.html',
  styleUrls: ['./weather-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeatherSearchComponent implements OnInit {
  public city = new FormControl('');

  public chatPrompt = new FormControl('');

  private weatherImageBaseURL = 'assets/weather_icons/svg/';

  public weatherImageURL = 'assets/weather_icons/svg/clear-day.svg';

  public weatherDetails!: WeatherDataResponse;

  public messageList: messageItem[] = [];

  public fetchingBotResponse = false;

  public isChatWindowOpen = false;

  public messageForOpenAIModel: any[] = [];

  @ViewChild('scrollBar') private myScrollContainer!: ElementRef;

  constructor(
    private weatherService: WeatherService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.messageList.push({
      messageFrom: 'bot',
      message: "Welcome! I'm your personal weather bot.",
    });
    this.messageList.push({
      messageFrom: 'bot',
      message:
        "Ask me anything about the weather and I'll provide real-time updates for any city you're curious about.",
    });

    this.city.valueChanges.pipe(debounceTime(400)).subscribe((cityValue) => {
      if (cityValue) {
        this.getGeoCoordinatesForCity(cityValue);
      }
    });
  }

  private getGeoCoordinatesForCity(cityValue: string) {
    this.weatherService
      .getGeoCoordinates(cityValue)
      .pipe(take(1))
      .subscribe((response) => {
        const geoCoordinates: Coordinates = {
          lat: response[0].lat,
          lon: response[0].lon,
        };
        this.getWeatherData(geoCoordinates);
      });
  }

  private getWeatherData(geoCoordinates: Coordinates) {
    this.weatherService
      .getWeatherData(geoCoordinates)
      .pipe(take(1))
      .subscribe((response) => {
        this.weatherDetails = response;
        this.prepapreWeatherDetailsForDisplay();
        this.prepareWeatherImageURL();
      });
  }

  private prepapreWeatherDetailsForDisplay() {
    this.weatherDetails.weather[0].description = this.convertToTitleCase(
      this.weatherDetails.weather[0].description
    );
    this.weatherDetails.main.temp = Math.round(this.weatherDetails.main.temp);
    this.weatherDetails.main.temp_min = Math.round(
      this.weatherDetails.main.temp_min
    );
    this.weatherDetails.main.temp_max = Math.round(
      this.weatherDetails.main.temp_max
    );

    this.weatherDetails.wind.speed = Math.round(this.weatherDetails.wind.speed);

    this.weatherDetails.visibility = Math.round(
      this.weatherDetails.visibility / 1000
    );
    this.changeDetectorRef.detectChanges();
  }

  private prepareWeatherImageURL() {
    this.weatherImageURL = '';
    // Thunderstorm
    if (
      this.weatherDetails.weather[0].id === 200 ||
      this.weatherDetails.weather[0].id === 201 ||
      this.weatherDetails.weather[0].id === 230 ||
      this.weatherDetails.weather[0].id === 231
    ) {
      if (this.weatherDetails.weather[0].icon === '11d') {
        this.weatherImageURL = 'thunderstorms-day-rain.svg';
      } else if (this.weatherDetails.weather[0].icon === '11n') {
        this.weatherImageURL = 'thunderstorms-night-rain.svg';
      }
    } else if (
      this.weatherDetails.weather[0].id === 202 ||
      this.weatherDetails.weather[0].id === 232
    ) {
      if (this.weatherDetails.weather[0].icon === '11d') {
        this.weatherImageURL = 'thunderstorms-day-extreme-rain.svg';
      } else if (this.weatherDetails.weather[0].icon === '11n') {
        this.weatherImageURL = 'thunderstorms-night-extreme-rain.svg';
      }
    } else if (
      this.weatherDetails.weather[0].id === 210 ||
      this.weatherDetails.weather[0].id === 211
    ) {
      if (this.weatherDetails.weather[0].icon === '11d') {
        this.weatherImageURL = 'thunderstorms-day.svg';
      } else if (this.weatherDetails.weather[0].icon === '11n') {
        this.weatherImageURL = 'thunderstorms-night.svg';
      }
    } else if (
      this.weatherDetails.weather[0].id === 212 ||
      this.weatherDetails.weather[0].id === 221
    ) {
      if (this.weatherDetails.weather[0].icon === '11d') {
        this.weatherImageURL = 'thunderstorms-day-overcast.svg';
      } else if (this.weatherDetails.weather[0].icon === '11n') {
        this.weatherImageURL = 'thunderstorms-night-overcast.svg';
      }
    }

    // Drizzle with rain
    else if (this.weatherDetails.weather[0].id === 300) {
      if (this.weatherDetails.weather[0].icon === '09d') {
        this.weatherImageURL = 'partly-cloudy-day-drizzle.svg';
      } else if (this.weatherDetails.weather[0].icon === '09n') {
        this.weatherImageURL = 'partly-cloudy-night-drizzle.svg';
      }
    } else if (this.weatherDetails.weather[0].id === 301) {
      if (this.weatherDetails.weather[0].icon === '09d') {
        this.weatherImageURL = 'overcast-day-drizzle.svg';
      } else if (this.weatherDetails.weather[0].icon === '09n') {
        this.weatherImageURL = 'overcast-night-drizzle.svg';
      }
    } else if (this.weatherDetails.weather[0].id === 302) {
      if (this.weatherDetails.weather[0].icon === '09d') {
        this.weatherImageURL = 'extreme-day-drizzle.svg';
      } else if (this.weatherDetails.weather[0].icon === '09n') {
        this.weatherImageURL = 'extreme-night-drizzle.svg';
      }
    } else if (
      this.weatherDetails.weather[0].id === 311 ||
      this.weatherDetails.weather[0].id === 313 ||
      this.weatherDetails.weather[0].id === 321
    ) {
      if (this.weatherDetails.weather[0].icon === '09d') {
        this.weatherImageURL = 'partly-cloudy-day-rain.svg';
      } else if (this.weatherDetails.weather[0].icon === '09n') {
        this.weatherImageURL = 'partly-cloudy-night-rain.svg';
      }
    } else if (
      this.weatherDetails.weather[0].id === 312 ||
      this.weatherDetails.weather[0].id === 314
    ) {
      if (this.weatherDetails.weather[0].icon === '09d') {
        this.weatherImageURL = 'extreme-day-rain.svg';
      } else if (this.weatherDetails.weather[0].icon === '09n') {
        this.weatherImageURL = 'extreme-night-rain.svg';
      }
    }

    // Rain
    else if (
      this.weatherDetails.weather[0].id === 500 ||
      this.weatherDetails.weather[0].id === 520
    ) {
      if (this.weatherDetails.weather[0].icon === '10d') {
        this.weatherImageURL = 'partly-cloudy-day-rain.svg';
      } else if (this.weatherDetails.weather[0].icon === '10n') {
        this.weatherImageURL = 'partly-cloudy-night-rain.svg';
      }
    } else if (
      this.weatherDetails.weather[0].id === 501 ||
      this.weatherDetails.weather[0].id === 521
    ) {
      if (this.weatherDetails.weather[0].icon === '10d') {
        this.weatherImageURL = 'overcast-day-rain.svg';
      } else if (this.weatherDetails.weather[0].icon === '10n') {
        this.weatherImageURL = 'overcast-night-rain.svg';
      }
    } else if (
      this.weatherDetails.weather[0].id === 502 ||
      this.weatherDetails.weather[0].id === 503 ||
      this.weatherDetails.weather[0].id === 504 ||
      this.weatherDetails.weather[0].id === 522 ||
      this.weatherDetails.weather[0].id === 531
    ) {
      if (this.weatherDetails.weather[0].icon === '10d') {
        this.weatherImageURL = 'extreme-day-rain.svg';
      } else if (this.weatherDetails.weather[0].icon === '10n') {
        this.weatherImageURL = 'extreme-night-rain.svg';
      }
    } else if (this.weatherDetails.weather[0].id === 511) {
      if (this.weatherDetails.weather[0].icon === '10d') {
        this.weatherImageURL = 'extreme-day-snow.svg';
      } else if (this.weatherDetails.weather[0].icon === '10n') {
        this.weatherImageURL = 'extreme-night-snow.svg';
      }
    }

    //   Snow
    else if (
      this.weatherDetails.weather[0].id === 600 ||
      this.weatherDetails.weather[0].id == 601
    ) {
      if (this.weatherDetails.weather[0].icon === '13d') {
        this.weatherImageURL = 'partly-cloudy-day-snow.svg';
      } else if (this.weatherDetails.weather[0].icon === '13n') {
        this.weatherImageURL = 'partly-cloudy-night-snow.svg';
      }
    } else if (
      this.weatherDetails.weather[0].id === 615 ||
      this.weatherDetails.weather[0].id === 616 ||
      this.weatherDetails.weather[0].id === 620 ||
      this.weatherDetails.weather[0].id === 621 ||
      this.weatherDetails.weather[0].id === 622
    ) {
      if (this.weatherDetails.weather[0].icon === '13d') {
        this.weatherImageURL = 'overcast-day-snow.svg';
      } else if (this.weatherDetails.weather[0].icon === '13n') {
        this.weatherImageURL = 'overcast-night-snow.svg';
      }
    } else if (this.weatherDetails.weather[0].id === 602) {
      if (this.weatherDetails.weather[0].icon === '13d') {
        this.weatherImageURL = 'extreme-day-snow.svg';
      } else if (this.weatherDetails.weather[0].icon === '13n') {
        this.weatherImageURL = 'overcast-night-snow.svg';
      }
    } else if (this.weatherDetails.weather[0].id === 611) {
      if (this.weatherDetails.weather[0].icon === '13d') {
        this.weatherImageURL = 'partly-cloudy-day-sleet.svg';
      } else if (this.weatherDetails.weather[0].icon === '13n') {
        this.weatherImageURL = 'partly-cloudy-night-sleet.svg';
      }
    } else if (this.weatherDetails.weather[0].id === 612) {
      if (this.weatherDetails.weather[0].icon === '13d') {
        this.weatherImageURL = 'overcast-day-sleet.svg';
      } else if (this.weatherDetails.weather[0].icon === '13n') {
        this.weatherImageURL = 'overcast-night-sleet.svg';
      }
    } else if (this.weatherDetails.weather[0].id === 613) {
      if (this.weatherDetails.weather[0].icon === '13d') {
        this.weatherImageURL = 'extreme-day-sleet.svg';
      } else if (this.weatherDetails.weather[0].icon === '13n') {
        this.weatherImageURL = 'overcast-night-sleet.svg';
      }
    }

    // Atmoshere
    else if (this.weatherDetails.weather[0].id === 701) {
      this.weatherImageURL = 'mist.svg';
    } else if (
      this.weatherDetails.weather[0].id === 711 ||
      this.weatherDetails.weather[0].id === 762 ||
      this.weatherDetails.weather[0].id === 771
    ) {
      if (this.weatherDetails.weather[0].icon === '50d') {
        this.weatherImageURL = 'extreme-day-smoke.svg';
      } else if (this.weatherDetails.weather[0].icon === '50n') {
        this.weatherImageURL = 'extreme-night-smoke.svg';
      }
    } else if (this.weatherDetails.weather[0].id === 721) {
      if (this.weatherDetails.weather[0].icon === '50d') {
        this.weatherImageURL = 'haze-day.svg';
      } else if (this.weatherDetails.weather[0].icon === '50n') {
        this.weatherImageURL = 'haze-night.svg';
      }
    } else if (
      this.weatherDetails.weather[0].id === 731 ||
      this.weatherDetails.weather[0].id === 751 ||
      this.weatherDetails.weather[0].id === 761
    ) {
      if (this.weatherDetails.weather[0].icon === '50d') {
        this.weatherImageURL = 'dust-day.svg';
      } else if (this.weatherDetails.weather[0].icon === '50n') {
        this.weatherImageURL = 'dust-night.svg';
      }
    } else if (this.weatherDetails.weather[0].id === 741) {
      if (this.weatherDetails.weather[0].icon === '50d') {
        this.weatherImageURL = 'fog-day.svg';
      } else if (this.weatherDetails.weather[0].icon === '50n') {
        this.weatherImageURL = 'fog-night.svg';
      }
    } else if (this.weatherDetails.weather[0].id === 781) {
      this.weatherImageURL = 'tornado.svg';
    }

    //   Clear sky
    else if (this.weatherDetails.weather[0].id === 800) {
      if (this.weatherDetails.weather[0].icon === '01d') {
        this.weatherImageURL = 'clear-day.svg';
      } else if (this.weatherDetails.weather[0].icon === '01n') {
        this.weatherImageURL = 'clear-night.svg';
      }
    }

    //   Clouds
    else if (
      this.weatherDetails.weather[0].id === 801 ||
      this.weatherDetails.weather[0].id === 802 ||
      this.weatherDetails.weather[0].id === 803
    ) {
      if (
        this.weatherDetails.weather[0].icon === '02d' ||
        this.weatherDetails.weather[0].icon === '03d' ||
        this.weatherDetails.weather[0].icon === '04d'
      ) {
        this.weatherImageURL = 'partly-cloudy-day.svg';
      } else if (
        this.weatherDetails.weather[0].icon === '02n' ||
        this.weatherDetails.weather[0].icon === '03n' ||
        this.weatherDetails.weather[0].icon === '04n'
      ) {
        this.weatherImageURL = 'partly-cloudy-night.svg';
      }
    } else if (this.weatherDetails.weather[0].id === 804) {
      if (this.weatherDetails.weather[0].icon === '04d') {
        this.weatherImageURL = 'overcast-day.svg';
      } else if (this.weatherDetails.weather[0].icon === '04n') {
        this.weatherImageURL = 'overcast-night.svg';
      }
    }

    if (this.weatherImageURL) {
      this.weatherImageURL = this.weatherImageBaseURL + this.weatherImageURL;
    } else {
      this.weatherImageURL = this.weatherImageBaseURL + 'clear-day.svg';
    }
    this.changeDetectorRef.detectChanges();
  }

  public convertToTitleCase(inputString: string) {
    return inputString.charAt(0).toUpperCase() + inputString.slice(1);
  }

  public submitPrompt() {
    const message = this.chatPrompt.value;

    if (message) {
      this.messageList.push({
        messageFrom: 'user',
        message: message,
      });
      this.chatPrompt.setValue('');
      this.changeDetectorRef.detectChanges();
      this.fetchingBotResponse = true;
      this.changeDetectorRef.detectChanges();
      this.scrollToBottom();
      if (!this.messageForOpenAIModel.length) {
        this.messageForOpenAIModel.push({
          role: 'system',
          content:
            'You are a good weather bot assistant that provide information related to real-time weather updates or weather forecast or weather warnings or rain or snow related information to the user in single response. It should also provide temperature, humidity, wind speed, precipitation, etc. related information too if asked by user. Your name is weather mancer',
        });
      }
      this.messageForOpenAIModel.push({
        role: 'user',
        content: message,
      });
      this.weatherService
        .getDataFromOpenAI(this.messageForOpenAIModel)
        .pipe(take(1))
        .subscribe((response) => {
          if (response?.choices?.length) {
            const messageFromChatBot = response?.choices[0]?.message?.content;
            this.messageList.push({
              messageFrom: 'bot',
              message: messageFromChatBot,
            });
            this.messageForOpenAIModel.push({
              role: 'assistant',
              content: messageFromChatBot,
            });
            this.chatPrompt.setValue('');
            this.fetchingBotResponse = false;
            this.changeDetectorRef.detectChanges();
            this.scrollToBottom();
          }
        });
    }
  }

  scrollToBottom(): void {
    if (this.myScrollContainer) {
      this.myScrollContainer.nativeElement.scrollTop =
        this.myScrollContainer.nativeElement.scrollHeight;
      this.changeDetectorRef.detectChanges();
    }
  }

  public toggleWeatherBot() {
    this.isChatWindowOpen = !this.isChatWindowOpen;
    this.changeDetectorRef.detectChanges();
  }
}
