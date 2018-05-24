const swag = require('../../../dist/bundle.cjs');
const vs = new swag.ViwiService({host:'127.0.0.1', port: 6022});

//const vs = new swag.ViwiService({host:'192.168.178.24', port: 6088});

(async () => {
    try {
      let conn = await vs.connect();
      console.log(conn);
      let parser = await vs.parse();
      console.log(parser);
       const sub_data = require('./subscription.json')
       let sub = await vs.subscribe(sub_data);
       console.log(sub);
       const unsub_data = require('./unsubscription.json')
       let unsub = await vs.unsubscribe(unsub_data)
       console.log(unsub);
       const post_data = require('./postmsg.json')
       let post = await vs.post(post_data)
       console.log(post);
    } catch (error) {
      console.log(error)
    }
  })();