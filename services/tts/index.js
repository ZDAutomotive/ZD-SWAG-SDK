const axios = require("axios");

module.exports = class TTS {
  constructor(option) {
    this.option = option;
    this.name = option.name || 'tts'
    this.host = option.host || 'localhost'
  }

  // data = {text, voice}
  new(data, cb) {
    axios
      .post(`http://${this.host}/api/${this.name}/tts/model`, {
        text: data.text,
        voice: data.voice.toString("base64")
      })
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
      .put(`http://${this.host}/api/${this.name}/tts/model/${id}`, {
        text: data.text,
        voice: data.voice.toString("base64")
      })
      .then(response => {
        cb(false, response.data);
      })
      .catch(err => {
        cb(true, err);
      });
  }

  delete(id, cb) {
    axios
      .delete(`http://${this.host}/api/${this.name}/tts/model/${id}`)
      .then(response => {
        cb(false, response.data);
      })
      .catch(err => {
        cb(true, err);
      });
  }

  get(text, cb) {
    axios
      .get(`http://${this.host}/api/${this.name}/tts/model/${text}`)
      .then(response => {
        cb(false, response.data);
      })
      .catch(err => {
        cb(true, err);
      });
  }
};
