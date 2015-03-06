extended.openAppOriginal = qlik.openApp;
extended.openApp = function (appId, config){
	var app = extended.openAppOriginal(appId, config);
	$.extend(app, {
    include "getSlide.js"
  });
};
