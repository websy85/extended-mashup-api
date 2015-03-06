getStoryList: function(callbackFn){
  var msg = {
      "method": "CreateSessionObject",
      "handle": app.model.handle,
      "params": [
          {
              "qAppObjectListDef": {
                  "qType": "story",
                  "qData": {
                      "title": "/qMetaDef/title",
                      "description": "/qMetaDef/description",
                      "thumbnail": "/thumbnail",
                      "rank": "/rank"
                  }
              },
              "qInfo": {
                  "qId": "StoryList",
                  "qType": "StoryList"
              }
          }
      ],
      "jsonrpc": "2.0"
  };
  app.model.session.rpc(msg).then(function(response){
    getLayout.call(app, response.result.qReturn.qHandle, function(response){
      callbackFn.call(null, response.result.qLayout[0].value.qAppObjectList.qItems)
    });
  });
}
