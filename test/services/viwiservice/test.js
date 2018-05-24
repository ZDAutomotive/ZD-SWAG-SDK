const swag = require('../../../dist/bundle.cjs');
const vs = new swag.ViwiService({host:'192.168.178.24', port: 6088});

(async () => {
    try {
      let conn = await vs.connect();
      console.log(conn);
      const sub_data = require('subscription.json')
      let sub = await vs.subscribe(sub_data);
      console.log(sub);
      const unsub_data = require('unsubscription.json')
      let unsub = await vs.unsubscribe(unsub_data)
      console.log(unsub);
      const post_data = require('postmsg.json')
      let post = await vs.post(post_data)
      console.log(unsub);
    } catch (error) {
      console.log(error)
    }
  })();