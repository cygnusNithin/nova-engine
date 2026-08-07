class TimeManager {
  constructor() {
    this.time = 12;
    this.speed = 1;
  }

  update(delta) {
    this.time += delta * this.speed;

    if (this.time >= 24) {
      this.time = 0;
    }
  }
}

export default new TimeManager();
