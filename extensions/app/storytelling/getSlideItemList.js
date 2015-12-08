getSlideItemList: function(slideId, callbackFn){
  getObject.call(app, slideId, function(response){
    getLayout.call(app, response.result.qReturn.qHandle, function(slide){
      callbackFn.call(null, slide.result.qLayout.qChildList.qItems)
    });
  });
}
