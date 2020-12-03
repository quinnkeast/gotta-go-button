const dotenv = require("dotenv");
dotenv.config();

const twilio = require("twilio");

const {
  ACCOUNT_SID,
  AUTH_TOKEN,
  FROM_PHONE_NUMBER,
  TO_PHONE_NUMBER,
} = process.env;

const client = new twilio(ACCOUNT_SID, AUTH_TOKEN);

const sendMessage = client.messages
  .create({
    from: FROM_PHONE_NUMBER,
    to: TO_PHONE_NUMBER,
    body: 'Gotta 💩',
  })
  .then(message => console.log(message))
  .catch(err => console.error(err));
  
class Button {
  constructor(activePeriodSecs, ledGpio, pushGpio) {
    this.ledGpio = ledGpio;
    this.pushGpio = pushGpio;
    this.activePeriodSecs = activePeriodSecs;
    this.active = false;
    this.blinkInterval;
    
    this.pushGpio.watch(function(err) {
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
    this.ledGpio.writeSync(1);
  }
  
  startBlink() {
    this.active = true;
    sendMessage();
    console.log('Big ass button gonna blink now');
    buttonLedGpio.writeSync(1);
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