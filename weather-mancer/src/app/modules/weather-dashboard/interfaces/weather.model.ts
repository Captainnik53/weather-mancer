interface Coordinates {
  lat: number;
  lon: number;
}

interface GeoCoordinatesApiResponseItem {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state: string;
}
[];

interface WeatherDataResponse {
  coord: Coordinates;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level: number;
    grnd_level: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

interface messageItem {
  messageFrom: string;
  message: string;
}

export {
  Coordinates,
  GeoCoordinatesApiResponseItem,
  WeatherDataResponse,
  messageItem,
};
