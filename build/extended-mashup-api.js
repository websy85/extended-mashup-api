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
              callbackFn.call(null, response.result.qLayout.qAppObjectList.qItems)
            });
          });
        }

        ,
        getSlideList: function(storyId, callbackFn){
          getObject.call(app, storyId, function(response){
            getLayout.call(app, response.result.qReturn.qHandle, function(story){
              callbackFn.call(null, story.result.qLayout.qChildList.qItems)
            });
          });
        }

        ,
        getSlideItemList: function(slideId, callbackFn){
          getObject.call(app, slideId, function(response){
            getLayout.call(app, response.result.qReturn.qHandle, function(slide){
              callbackFn.call(null, slide.result.qLayout.qChildList.qItems)
            });
          });
        }

      }

      ,
      getSlide: function(element, id, callbackFn){
      	require(["assets/client/client"], function(){
      		require(["qvangular", "core.utils/deferred", "storytelling.views/slide-item/slide-item"], function(qvangular, Deferred){
      	    if (typeof element === "string") {
      	        element = document.getElementById(element);
      	    }
      	 		$element = $(element);
      	    var $scope = qvangular.$rootScope.$new();
      			getObject.call(app,id, function(response){
      				getLayout.call(app,response.result.qReturn.qHandle, function(response){
      					var items = response.result.qLayout.qChildList.qItems;
      					$.each(items, function(index, item){
      						if(item.qData.dataPath)
      							item.qData.dataPath = item.qData.dataPath.replace('../', '/');
      					});
      		      $scope.slideItems = items;
      				});
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
      		});
      	});
      }

      ,
  		getSlideManually: function(element, id){
  		  var fontConversion = [0,0.5,0.8,1,1.5,2,3,4]   //this array converts the font size numeric assigned to a text object (in storytelling) to a percentage
  		  if (typeof element === "string") {
  		      element = document.getElementById(element);
  		  }
  		  getObject.call(app,id, function(response){
  		    getLayout.call(app,response.result.qReturn.qHandle, function(response){
  		      var slideItems = response.result.qLayout.qChildList.qItems;
  		      var canvas = document.createElement('canvas');
  		        var context = canvas.getContext('2d');
  		        canvas.height = element.clientHeight;
  		        canvas.width = element.clientWidth;
  		        for(var s in slideItems){
  		          console.log(slideItems[s]);
  		          var sItem = slideItems[s].qData;
  		          var sHeightPerc = (parseFloat(sItem.position.height)/100);
  		          var sWidthPerc = (parseFloat(sItem.position.width)/100);
  		          var sTopPerc = (parseFloat(sItem.position.top)/100);
  		          var sLeftPerc = (parseFloat(sItem.position.left)/100);
  		          var h,w,x,y;
  		          h = element.clientHeight * sHeightPerc;
  		          w = element.clientWidth * sWidthPerc;
  		          x = element.clientWidth * sLeftPerc;
  		          y = element.clientHeight * sTopPerc;
  		          context.rect(x, y, w, h);
  		          console.log(x, y);
  		          //determine item type and render the appropriate visual
  		          switch(sItem.visualization){
  		            case"text":
  		              var text = sItem.style.text;
  		              var fontSize;
  		              var ratio;
  		              var fontWeight = "";
  		              var textX = x + (x*0.005);
  		              var textY = y + (y*0.005);
  		              //calculate the font weight
  		              if(text.indexOf("**")!= -1){
  		                fontWeight = "bold "
  		                text = text.replace(/[*]/g, "");
  		              }
  		              var lines = text.split(/\^\[/mg);
  		              //calculate the ratio
  		              if(sItem.visualizationType=="title"){
  		                ratio = 1.32;
  		                fontSize = 10;  //base font size
  		                //context.textBaseline = "middle";

  		                var testLine = text;
  		                var wExcPadding = w - (w*0.01);  //width of the element excluding 1% padding
  		                var hExcPadding = h - (h*0.01);  //height of the element excluding 1% padding
  		                hExcPadding = hExcPadding / lines.length; //adust the height check for multi-line titles
  		                context.font = fontWeight+fontSize+'px QlikView Sans';
  		                var metrics = context.measureText(testLine);
  		                while(fontSize > hExcPadding){
  		                  fontSize--;
  		                }
  		                if(metrics.width > wExcPadding){
  		                  while(metrics.width > wExcPadding){
  		                    fontSize--;
  		                    context.font = fontWeight+fontSize+'px QlikView Sans';
  		                    metrics = context.measureText(testLine);
  		                  }
  		                }
  		                else{
  		                  while(metrics.width < wExcPadding && fontSize < hExcPadding){
  		                    fontSize++;
  		                    context.font = fontWeight+fontSize+'px QlikView Sans';
  		                    metrics = context.measureText(testLine);
  		                  }
  		                }
  		              }
  		              else{
  		                ratio = element.clientHeight < 200 ? 8000 / element.clientHeight : 40;
  		                fontSize = element.clientHeight / ratio;
  		                fontSize = parseFloat( fontSize.toFixed( 2 ) );
  		                fontSize = fontSize < 2 ? 2 : fontSize;
  		              }
  		              context.fillStyle = sItem.style.color;

  		              //calculate font size


  		              for (var l = 0; l<lines.length;l++){
  		                var lineFontSize = fontSize;
  		                var line = lines[l];
  		                //for each line we need to determine the font size multiplier and justification
  		                var m = line.match(/\([0-9]\)/);
  		                if(m && m.length>0){
  		                  m = m[0].match(/[^\(^\)]/g)[0];
  		                  lineFontSize = fontSize * (fontConversion[m]);
  		                }
  		                line = line.replace(/\([0-9]\)/,"").replace(/\%\[/,"").replace(/\]/g,"");
  		                //need to add code here to evaluate justification
  		                //***************************
  		                //
  		                line = line.replace(/\((left|right|center)\)/g,"");
  		                context.font = fontWeight+lineFontSize+'px QlikView Sans';
  		                context.fillStyle = sItem.style.color;
  		                if(l==0){
  		                  textY += lineFontSize;
  		                }
  		                //check to see if we need to wrap the text
  		                var words = line.split(' ');
  		                var subline = '';
  		                for(var n = 0; n < words.length; n++) {
  		                  var testLine = subline + words[n] + ' ';
  		                  var metrics = context.measureText(testLine);
  		                  var testWidth = metrics.width;
  		                  if (testWidth > w && n > 0) {
  		                    context.fillText(subline, textX, textY);
  		                    subline = words[n] + ' ';
  		                    textY += lineFontSize;
  		                  }
  		                  else {
  		                    subline = testLine;
  		                  }
  		                }
  		                context.fillText(subline, textX, textY);
  		                textY += lineFontSize;
  		              }
  		              break;
  		            case "snapshot":
  		              var objectId = sItem.style.id;
  		              var eTemp = document.createElement('div');
  		              eTemp.style.height = h + 'px';
  		              eTemp.style.width = w + 'px';
  		              eTemp.style.zIndex = 100;
  		              eTemp.style.position = 'absolute';
  		              eTemp.style.top = y + 'px';
  		              eTemp.style.left = x + 'px';
  		              console.log(x, y);
  		              element.appendChild(eTemp);
  		              app.getSnapshot(eTemp, objectId);
  		              break;
  		            case "shape":
  		              console.log('shape');
  		              break;
  		          }

  		        }
  		        context.stroke();
  		        element.appendChild(canvas);
  		    });
  		  });
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
            callbackFn.call(null, response.result.qLayout.qBookmarkList.qItems)
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
      delta: false,
      jsonrpc: "2.0"
    };
    //get the "Layout"
    this.model.session.rpc(msg).then(function(response){
      callbackFn.call(null, response);
    });
  };
});
