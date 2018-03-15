const swag = require('./dist/bundle.cjs');
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
const demoScript = {
  'headInfo': {
    'version': 'v1',
    'timeUnit': 'ms',
    'platform': 'MIB2+',
    'vehicle': 'D5',
    'retryCounts': 0,
    'scriptType': 'startup',
    'type': 'script-startup',
    'traceSplitTime': 300
  },
  'globalAssertions': [{
    'keyword': 'SCREEN1',
    'storeTimeKey': 't1'
  }, {
    'keyword': 'SCREEN2',
    'storeTimeKey': 't2'
  }],
  'scripts': [{
    'delay': 2,
    'action': {
      'command': 'fetchScreenShotsToFolder',
      'type': 'screenshot',
      'args': {
        'folderName': 'LastScreenShots'
      }
    }
  }, {
    'delay': 3,
    'action': {
      'command': 'startTiming',
      'type': 'control',
      'args': {}
    }
  }, {
    'delay': 1,
    'action': {
      'command': 'tap',
      'type': 'keypanel',
      'args': {
        'canid': 402190963,
        'coordinateCombi': {
          'x': 322,
          'y': 225
        }
      }
    }
  }, {
  //   'delay': 3,
  //   'action': {
  //     'command': 'triggerRVC',
  //     'type': 'keypanel',
  //     'args': {
  //       'canid': 402190963
  //     }
  //   }
  // }, {
    'delay': 3,
    'action': {
      'command': 'wait',
      'type': 'wait',
      'args': {}
    }
  }, {
    'delay': 1,
    'action': {
      'command': 'drag',
      'type': 'keypanel',
      'args': {
        'canid': 402190963,
        'duration': 2,
        'coordinateCombi': [{
          'x': 322,
          'y': 225
        }, {
          'x': 340,
          'y': 0
        }]
      }
    }
  }, {
    'delay': 3,
    'action': {
      'command': 'takeScreenShot',
      'type': 'keypanel',
      'args': {
        'canid': 402190963
      }
    }
  }, {
    'delay': 0,
    'action': {
      'command': 'fetchScreenShotsToFolder',
      'type': 'screenshot',
      'args': {
        'folderName': 'ScrShot1'
      }
    }
  }, {
    'delay': 0,
    'action': {
      'command': 'assertScreenID',
      'type': 'screenshot',
      'args': {
        'screenID': 1234,
        'timeout': 5
      }
    }
  }, {
    'delay': 3,
    'action': {
      'command': 'triggerMFL',
      'type': 'keypanel',
      'args': {
        'canid': 402190963,
        'buttonName': 'PTT'
      }
    }
  }, {
    'delay': 3,
    'action': {
      'command': 'triggerKeypanel',
      'type': 'keypanel',
      'args': {
        'canid': 402190963,
        'buttonName': 'SK_SW'
      }
    }
  }, {
    'delay': 0,
    'action': {
      'command': 'GEMset',
      'type': 'GEM',
      'args': {
        'key': 'backend',
        'value': 'pre_shadow'
      }
    }
  }, {
    'delay': 1,
    'action': {
      'command': 'fetchScreenShotsToFolder',
      'type': 'screenshot',
      'args': {
        'folderName': 'LastScreenShots'
      }
    }
  }, {
    'delay': 1,
    'action': {
      'command': 'tap',
      'type': 'keypanel',
      'args': {
        'canid': 402190963,
        'coordinateCombi': [{
          'x': 322,
          'y': 225
        }]
      }
    }
  }, {
    'delay': 3,
    'action': {
      'command': 'triggerRVC',
      'type': 'keypanel',
      'args': {
        'canid': 402190963
      }
    }
  }, {
    'delay': 3,
    'action': {
      'command': 'wait',
      'type': 'wait',
      'args': {}
    }
  }, {
    'delay': 1,
    'action': {
      'command': 'drag',
      'type': 'keypanel',
      'args': {
        'canid': 402190963,
        'duration': 2,
        'coordinateCombi': [{
          'x': 322,
          'y': 225
        }, {
          'x': 340,
          'y': 0
        }]
      }
    }
  }, {
    'delay': 3,
    'action': {
      'command': 'takeScreenShot',
      'type': 'keypanel',
      'args': {
        'canid': 402190963
      }
    }
  }, {
    'delay': 0,
    'action': {
      'command': 'fetchScreenShotsToFolder',
      'type': 'screenshot',
      'args': {
        'folderName': 'ScrShot1'
      }
    }
  }, {
    'delay': 0,
    'action': {
      'command': 'assertScreenID',
      'type': 'screenshot',
      'args': {
        'screenID': 1234,
        'timeout': 5
      }
    }
  }, {
    'delay': 3,
    'action': {
      'command': 'triggerMFL',
      'type': 'keypanel',
      'args': {
        'canid': 402190963,
        'buttonName': 'PTT'
      }
    }
  }, {
    'delay': 3,
    'action': {
      'command': 'triggerKeypanel',
      'type': 'keypanel',
      'args': {
        'canid': 402190963,
        'buttonName': 'SK_SW'
      }
    }
  }, {
    'delay': 0,
    'action': {
      'command': 'GEMset',
      'type': 'GEM',
      'args': {
       'key': 'backend',
       'value': 'pre_shadow'
     }
    }
  }]
};

(async () => {
  try {
    let conn = await ts.connect();
    console.log(conn);
    let testcases = await ts.getTestCaseList();
    console.log(testcases);
    let loadTestcaseRes = await ts.loadTestCase(demoScript, 'aaa');
    console.log(loadTestcaseRes);
    testcases = await ts.getTestCaseList();
    console.log(testcases);
    // let deleteAllRes = await ts.deleteAllTestCases();
    // console.log(deleteAllRes);
    testcases = await ts.getTestCaseList();
    console.log(testcases);
    let start = await ts.start();
    console.log(start);
  } catch (error) {
    console.log(error);
    console.log(error.response.data);
  }
})();