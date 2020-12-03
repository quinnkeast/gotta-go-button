const dotenv = require("dotenv");
const GPIO = require("onoff").Gpio;
const Button = require("./button.js");

dotenv.config();

const buttonPushGpio = new GPIO(3, "in", "falling", {debounceTimeout: 10});
const buttonLedGpio = new GPIO(4, "out");

const button = new Button(5, 5, buttonLedGpio, buttonPushGpio);

function exit() {
  buttonLedGpio.unexport();
  buttonPushGpio.unexport();
  process.exit();
}

console.log("Big ass button is on!");

process.on("SIGINT", exit);
