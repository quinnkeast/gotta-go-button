class Button {
  constructor(activePeriodSecs, ledGpio, pushGpio) {
    this.ledGpio = ledGpio;
    this.pushGpio = pushGpio;
    this.activePeriodSecs = activePeriodSecs;
    this.active = false;
    this.blinkInterval;
    
    this.pushGpio.watch((err) => {
      if (err) {
        throw err;
      }
      
      if (this.active) {
        return;
      }
      
      console.log('Big ass button pressed!!');
      this.startBlink();
      
    }.bind(this));
  }
  
  reset() {
    clearInterval(this.blinkInterval);
    this.active = false;
    console.log('Big ass button is done now.');
    this.ledGpio.writeSync(0);
  }
  
  startBlink() {
    this.active = true;
    console.log('Big ass button gonna blink now');
    let count = 0;
    this.blinkInterval = setInterval(function() {
      if (count <= this.activePeriodSecs) {
        this.ledGpio.writeSync(count % 2);
        count ++;
      }
      else {
        this.reset();
      }
    }.bind(this), 1000);
  }
}

module.exports = Button;