# extended-mashup-api

The intention of this project is to extend the existing Qlik Sense Mashup API by adding further functionality.
At present the following functionality is added -

1. storytelling
A new object that has been added to the 'app' object returned by qlik.openApp().
The storytelling object contains the following methods -
  - getStoryList(callbackFn)
    - returns a JSON array of Story objects to the given callback function.
  - getSlideList(storyId, callbackFn)
    - returns a JSON array of Slide objects for the specified storyId to the given callback function.
  - getSlideItemList(slideId, callbackFn)
    - returns a JSON array of SlideItem objects for the specified slideId to the given callback function.

Example Usage -

  app.storytelling.getStoryList(function(stories){
    console.log(stories);
  });

2. getSlide(element, slideId)
A new function has been added to the 'app' object return by qlik.openApp().
The getSlide function will render the slide specified (by slideId) into the given element (the element Id or a reference to the element are both accepted.
NOTE: At present the getSlide function does NOT support snapshot objects with highlighting. Highlighting is applied but no labels are present.

3. getSnapshotList(callbackFn)
A new function has been added to the 'app' object return by qlik.openApp().
This returns a JSON array of Sanpshot objects to the given callback function.

USAGE:
The extended version of the API is implemented in the same way as the standard Mashup API.
1. Copy the extended-mashup-api.js file into your project.
2. Ensure you have loaded the requireJS file into your page.
3. Configure the Require object as normal.
4. Instead of loading the 'js/qlik' file, load the 'extended-mashup-api.js' file from your project.
5. You can now use the returned object in the same way as the standard Mashup API but with additional functionality.

Example Usage -
```javascript
  var config = {
  	host: window.location.hostname,
  	prefix: "/",
  	port: window.location.port,
  	isSecure: window.location.protocol === "https:"
  };
  require.config( {
  	baseUrl: ( config.isSecure ? "https://" : "http://" ) + config.host + (config.port ? ":" + config.port: "") + config.prefix + "resources"
  } );

  require( ["./extended-mashup-api.js"], function ( qlik ) {
  	qlik.setOnError( function ( error ) {
  		alert( error.message );
  	} );

  	var app = qlik.openApp('Helpdesk Management', config);

  	app.model.waitForOpen.promise.then(function(){
  		app.storytelling.getStoryList(function(stories){
  			app.storytelling.getSlideList(stories[0].qInfo.qId, function(slides){
  				var storyElement = document.getElementById('story');
  				for (var i=0;i<slides.length;i++){
  					var e = document.createElement('div');
  					e.classList.add('slide');
  					e.style.width = "100%";
  					e.style.height = ((storyElement.clientWidth)/(16/9)) + "px";
  					storyElement.appendChild(e);
  					app.getSlide(e, slides[i].qInfo.qId);
  				}

  			})
  		})
  	});
  });
  ```
