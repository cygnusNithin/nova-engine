class WeatherManager {
  constructor() {
    this.weather = "Sunny";
  }

  set(weather) {
    this.weather = weather;
  }

  get() {
    return this.weather;
  }
}

export default new WeatherManager();
