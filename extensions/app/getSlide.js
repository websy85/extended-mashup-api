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
