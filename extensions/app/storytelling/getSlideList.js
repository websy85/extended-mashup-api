getSlideList: function(storyId, callbackFn){
  getObject.call(app, storyId, function(response){
    getLayout.call(app, response.result.qReturn.qHandle, function(story){
      callbackFn.call(null, story.result.qLayout[0].value.qChildList.qItems)
    });
  });
}
