const axios = require("axios");

module.exports = class TTS {
  constructor(option) {
    console.log(option);
    this.option = option;
  }

  // data = {text, voice}
  new(data, cb) {
    console.log("data", data);
    axios
      .post(
        `http://${this.option.host}:${this.option.port}/tts/model/new`,
        data
      )
      .then(response => {
        cb(false, response.data.result);
      })
      .catch(err => {
        cb(true, err);
      });
  }

  // data = {text, voice}
  update(id, data, cb) {
    axios
      .put(
        `http://${this.option.host}:${this.option.port}/tts/model/${id}`,
        data
      )
      .then(response => {
        cb(false, response.data.result);
      })
      .catch(err => {
        cb(true, err);
      });
  }

  delete(id, cb) {
    axios
      .delete(`http://${this.option.host}:${this.option.port}/tts/model/${id}`)
      .then(response => {
        cb(false, response.data.result);
      })
      .catch(err => {
        cb(true, err);
      });
  }

  get(text, cb) {
    axios
      .get(`http://${this.option.host}:${this.option.port}/tts/model/${text}`)
      .then(response => {
        // response.data.forEach(element => {
        //   element.voice = element.voice.data.toString("base64");
        // });
        cb(false, response.data.result);
      })
      .catch(err => {
        cb(true, err);
      });
  }
};
