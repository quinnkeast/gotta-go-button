const axios = require("axios");
const Lame = require("node-lame").Lame;
const fs = require("fs");
const Speaker = require("speaker");
const dotenv = require("dotenv");

dotenv.config();

const twilio = require("twilio");

const {
  ACCOUNT_SID,
  AUTH_TOKEN,
  FROM_PHONE_NUMBER,
  Q_PHONE_NUMBER,
  J_PHONE_NUMBER,
  IFTTT_KEY,
} = process.env;

const client = new twilio(ACCOUNT_SID, AUTH_TOKEN);

const decoder = new Lame.Decoder({
  channels: 2,
  bitDepth: 16,
  sampleRate: 44100,
  bitRate: 128,
  mode: lame.STEREO
}).setFile('./tone.mp3');

const littleSpeaker = new Speaker();

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
      //this.sendMessage(Q_PHONE_NUMBER);
      //this.sendMessage(J_PHONE_NUMBER);
      //this.triggerHue();
      this.playSound();
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
    
    console.log('Big ass button gonna blink now');
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
        body: 'Gotta 💩',
      })
      .then(message => console.log(message.sid))
      .catch(err => console.error(err));
  }
  
  async triggerHue() {
    try {
      const res = await axios.post(`https://maker.ifttt.com/trigger/button_pressed/with/key/${IFTTT_KEY}`);
      console.log(`Status: ${res.status}`);
    } catch (err) {
      console.error(err);
    }
  }
  
  playSound() {
    console.log('playing sound');
    decoder.pipe(littleSpeaker);
  }
}

module.exports = Button;