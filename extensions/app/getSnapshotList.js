getSnapshotList: function(callbackFn){
  var msg = {
      "method": "CreateSessionObject",
      "handle": 1,
      "params": [
          {
              "qBookmarkListDef": {
                  "qType": "snapshot",
                  "qData": {
                      "title": "/title",
                      "libraryTitle": "/libraryTitle",
                      "description": "/description",
                      "sourceObjectId": "/sourceObjectId",
                      "visualizationType": "/visualizationType",
                      "timestamp": "/timestamp",
                      "snapshotData": "/snapshotData",
                      "isClone": "/isClone"
                  }
              },
              "qInfo": {
                  "qId": "SnapshotList",
                  "qType": "SnapshotList"
              }
          }
      ],
      "jsonrpc": "2.0"
  };
  app.model.session.rpc(msg).then(function(response){
    getLayout.call(app, response.result.qReturn.qHandle, function(response){
      callbackFn.call(null, response.result.qLayout.qBookmarkList.qItems)
    });
  });
}
