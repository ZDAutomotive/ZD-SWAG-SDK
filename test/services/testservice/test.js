const swag = require('../../../dist/bundle.cjs');
const demoScript = require('./first-test-tc.json')
// let mu = new swag.AudiMainUnit({});
// mu.connect().then(async () => {
//   try{
//     let res = await mu.resetWithPersistence();
//     console.log(res);
//   } catch (e) {
//     console.log(e);
//   }

// })

let ts = new swag.TestService({});

(async () => {
  try {
    let conn = await ts.connect();
    console.log(conn);
    let testcases = await ts.getTestCaseList();
    console.log(testcases);
    try {
      let stopRes = await ts.stop();
      console.log(stopRes);
    } catch (error) {
      console.log(error.stack)
      console.log(error.response.data);
    }
    let setConfigRes = await ts.setBenchConfig({softwareVersion:'R1234'})
    console.log(setConfigRes);
    let getConfigRes = await ts.getBenchConfig();
    console.log(getConfigRes);
    // let deleteAllRes = await ts.deleteAllTestCases();
    // console.log(deleteAllRes);
    let loadTestcaseRes = await ts.loadTestCase(demoScript, 'aaa');
    console.log(loadTestcaseRes);
    testcases = await ts.getTestCaseList();
    console.log(testcases);
    let start = await ts.start();
    console.log(start);
  } catch (error) {
    console.log(error.stack);
    console.log(error.response.data);
  }
})();