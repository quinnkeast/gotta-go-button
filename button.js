class Button {
  constructor(activeIntervalSecs, activePeriodSecs, ledGpio, pushGpio) {
    this.ledGpio = ledGpio;
    this.pushGpio = pushGpio;
    this.activeIntervalMs = activeIntervalSecs * 1000;
    this.activePeriodSecs = activePeriodSecs;
    this.active = false;
    this.blinkInterval;
    this.setTimer();
    
    this.pushGpio.watch(function (err, state) {
      if (err) throw err;
      
      if (!this.active) return;
      
      this.resetTimer();
    }.bind(this));
  }
  
  setTimer() {
    setTimeout(function() {
      this.startBlink();
    }.bind(this), this.activeIntervalMs);
  }
  
  resetTimer() {
    clearInterval(this.blinkInterval);
    this.active = false;
    console.log('Big ass button is not active!');
    this.ledGpio.writeSync(0);
    this.setTimer();
  }
  
  startBlink() {
    this.active = true;
    console.log('Big ass button is active!');
    let count = 0;
    this.blinkInterval = setInterval(function() {
      if (count <= this.activePeriodSecs) {
        this.ledGpio.writeSync(count % 2);
        count++;
      }
      else {
        this.resetTimer();
      }
    }.bind(this), 1000);
  }
}

module.exports = Button;