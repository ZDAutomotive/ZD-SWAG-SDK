const TTSClient = require("./index.js");
const option = require("./config.json");

const tts = new TTSClient(option);

tts.new(
  {
    text: "chicken2",
    voice: Buffer.from("8327549832751230578917", "hex")
  },
  (failed, result) => {
    console.log("NEW");
    console.dir(result, { depth: null });
  }
);

tts.get("chicken2", (failed, result) => {
  if (!failed) {
    console.log("GET");
    result.forEach(element => {
      console.log(element);
      tts.update(
        element.id,
        {
          text: "chicken2",
          voice: Buffer.from("100860", "hex")
        },
        (error, result) => {
          console.log(result);
        }
      );
    });
  } else {
    console.log(result);
  }
});
