const axios = require("axios");
const fs = require("fs");
const wav = require ("wav");
const dotenv = require("dotenv");

var Sound = require('aplay');

dotenv.config();

const twilio = require("twilio");

const soundFileName = "tone.wav";

const {
  ACCOUNT_SID,
  AUTH_TOKEN,
  FROM_PHONE_NUMBER,
  Q_PHONE_NUMBER,
  J_PHONE_NUMBER,
  IFTTT_KEY,
} = process.env;

const client = new twilio(ACCOUNT_SID, AUTH_TOKEN);

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
      
      this.sendMessage(Q_PHONE_NUMBER);
      this.sendMessage(J_PHONE_NUMBER);
      this.triggerHue();
      this.playSound(soundFileName);
      this.startBlink();
    }.bind(this));
  }
  
  reset() {
    clearInterval(this.blinkInterval);
    this.active = false;
    this.ledGpio.writeSync(1);
  }
  
  startBlink() {
    this.active = true;
    
    this.ledGpio.writeSync(1);
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
  
  sendMessage(person) {
    client.messages
      .create({
        from: FROM_PHONE_NUMBER,
        to: person,
        body: 'I wanna go out!',
      })
      .then(message => console.log(message.sid))
      .catch(err => console.error(err));
  }
  
  async triggerHue() {
    try {
      const res = await axios.post(`https://maker.ifttt.com/trigger/button_pressed/with/key/${IFTTT_KEY}`);
    } catch (err) {
      console.error(err);
    }
  }
  
  playSound(fileName) {
    new Sound().play(fileName);
  }
}

module.exports = Button;