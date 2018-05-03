const swag = require('../../../dist/bundle.cjs');
const sdsScript = require('./Benz_Demo_Testcase_Home.json')
// let mu = new swag.AudiMainUnit({});
// mu.connect().then(async () => {
//   try{
//     let res = await mu.resetWithPersistence();
//     console.log(res);
//   } catch (e) {
//     console.log(e);
//   }

// })

let ts = new swag.TestService({
  host: 'localhost',
  port: 7001
});

(async () => {
  try {
    let conn = await ts.connect();
    console.log(conn);
    // let stop = await ts.stop();
    // console.log(stop);
    let testcases = await ts.getTestCaseList();
    console.log(testcases);
    // try {
    //   let stopRes = await ts.stop();
    //   console.log(stopRes);
    // } catch (error) {
    //   console.log(error.stack)
    //   console.log(error.response.data);
    // }
    // let deleteAllRes = await ts.deleteAllTestCases();
    // console.log(deleteAllRes);
    let loadTestcaseRes = await ts.loadTestCaseData([sdsScript], 'aaa');
    console.log(loadTestcaseRes);
    testcases = await ts.getTestCaseList();
    console.log(testcases);
    let start = await ts.start();
    console.log(start);
  } catch (error) {
    console.log(error);
    console.log(error.stack);
    console.log(error.response.data);
  }
})();