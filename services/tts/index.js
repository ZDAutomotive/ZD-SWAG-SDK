const axios = require("axios");

module.exports = class TTS {
  constructor(option) {
    this.option = option;
  }

  // data = {text, voice}
  new(data, cb) {
    axios
      .post(
        `http://${this.option.host}:${this.option.port}/tts/model`,
        data
      )
      .then(response => {
        cb(false, response.data);
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
        cb(false, response.data);
      })
      .catch(err => {
        cb(true, err);
      });
  }

  delete(id, cb) {
    axios
      .delete(`http://${this.option.host}:${this.option.port}/tts/model/${id}`)
      .then(response => {
        cb(false, response.data);
      })
      .catch(err => {
        cb(true, err);
      });
  }

  get(text, cb) {
    axios
      .get(`http://${this.option.host}:${this.option.port}/tts/model/${text}`)
      .then(response => {
        cb(false, response.data);
      })
      .catch(err => {
        cb(true, err);
      });
  }
};
