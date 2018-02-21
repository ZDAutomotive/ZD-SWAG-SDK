const TTSClient = require("./index.js");
const option = require("../../config/config.json");

const tts = new TTSClient(option);

// tts.new(
//   { text: "chicken2", voice: Buffer.from("8327549832751230578917", "hex").toString('base64') },
//   (failed, result) => {
//     console.dir(result, { depth: null });
//   }
// );

tts.get("chicken2", (failed, result) => {
  result.forEach(element => {
    console.log(element);
  });
});
