const axios = require('axios')

const instance = axios.create({
    baseURL: 'http://192.168.178.110:8080/api',
    timeout: 3500,
  });
axios.get('http://192.168.178.110:8080/api/eth-trace/esoheaderbuffer/21002/').then(res => console.log(res.data))
// instance.get('/eth-trace/esoheaderbuffer/21002/').then(res => {
//     console.log(res.data)
// }).catch(e => {
//     console.log(e)
// })