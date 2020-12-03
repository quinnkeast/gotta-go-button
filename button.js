class Button {
  constructor(ledGpio, pushGpio) {
    this.ledGpio = ledGpio;
    this.pushGpio = pushGpio;
    this.activeIntervalMs = activeIntervalSecs * 1000;
    this.activePeriodSecs = activePeriodSecs;
    this.active = false;
    
    this.pushGpio.watch(function (err, state) {
      if (err) throw err;
      
      if (this.active) {
        return;
      }
      
      console.log('Big ass button pressed!!');
      this.startBlink();
      
    }.bind(this));
  }
  
  reset() {
    this.active = false;
    console.log('Big ass button is done now.');
    this.ledGpio.writeSync(0);
  }
  
  startBlink() {
    this.active = true;
    console.log('Big ass button gonna blink now');
    let count = 0;
    while (count <= 5) {
      this.ledGpio.writeSync(count % 2);
      count++;
    } else {
      this.reset();
    }
  }
}

module.exports = Button;