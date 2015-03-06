define(["js/qlik"], function(qlik){
	var extended = qlik;
  //app
  extended.openAppOriginal = qlik.openApp;
  extended.openApp = function (appId, config){
  	var app = extended.openAppOriginal(appId, config);
  	$.extend(app, {
      storytelling:{
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

        ,
        getSlideList: function(storyId, callbackFn){
          getObject.call(app, storyId, function(response){
            getLayout.call(app, response.result.qReturn.qHandle, function(story){
              callbackFn.call(null, story.result.qLayout[0].value.qChildList.qItems)
            });
          });
        }

        ,
        getSlideItemList: function(slideId, callbackFn){
          getObject.call(app, slideId, function(response){
            getLayout.call(app, response.result.qReturn.qHandle, function(slide){
              callbackFn.call(null, slide.result.qLayout[0].value.qChildList.qItems)
            });
          });
        }

      }

      ,
      getSlide: function(element, id, callbackFn){
      	require(["qvangular", "core.utils/deferred", "storytelling.models/slide-model", "storytelling.views/slide-item/slide-item"], function(qvangular, Deferred, SlideModel){
          if (typeof element === "string") {
              element = document.getElementById(element);
          }
       		$element = $(element);
          var $scope = qvangular.$rootScope.$new();
      		SlideModel.getLayout(id).then(function(SlideLayout){
      			var items = SlideLayout.qChildList.qItems;
      			$.each(items, function(index, item){
      				if(item.qData.dataPath)
      					item.qData.dataPath = item.qData.dataPath.replace('../', '/');
      			});
            $scope.slideItems = items;
      		});
          var html = '<div id="selectable" style="height: 100%;">';
      				html+= 		'<div id="{{slideItem.qInfo.qId}}" ';
      				html+=				 'style="border: none;" ';
      				html+=				 'class="qv-story-grid-object borderbox qv-story-{{slideItem.qData.visualization}}{{slideItem.qData.visualizationType ? \'-\' + slideItem.qData.visualizationType : \'\' }}" ';
      				html+=				 'ng-repeat="slideItem in slideItems" ';
      				html+=				 'ng-class="{\'item-active\': active, \'qv-story-shape\': slideItem.qData.visualization === \'shape\'}" ';
      				html+=				 'ng-style="{{slideItem.qData.position}}">';
      				html+=			'<qv-slide-item-section />';
      				html+=		'</div>';
      				html+= '</div>';
          $element.html(html);
          var $compile = qvangular.getService("$compile");
          $compile($element.contents())($scope);    
      	})
      }

      ,
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
            callbackFn.call(null, response.result.qLayout[0].value.qBookmarkList.qItems)
          });
        });
      }

    });
    return app;
  };

  return extended;

  function getObject(id, callbackFn){
    var msg = {
        "method": "GetObject",
        "handle": this.model.handle,
        "params": [
            id
        ],
        "jsonrpc": "2.0"
    }
    this.model.session.rpc(msg).then(function(response){
      callbackFn.call(null, response);
    });
  };

  function getLayout(handle, callbackFn){
    msg = {
      method: "GetLayout",
      handle: handle,
      params: [],
      delta: true,
      jsonrpc: "2.0"
    };
    //get the "Layout"
    this.model.session.rpc(msg).then(function(response){
      callbackFn.call(null, response);
    });
  };
});
