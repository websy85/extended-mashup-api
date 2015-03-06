getSlide: function(element, id){
				require(["qvangular", "core.utils/deferred", "storytelling.models/slide-model", "storytelling.views/slide-item/slide-item"], function(qvangular, Deferred, SlideModel){
						var dfd;
	          dfd = new Deferred();
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

	            qvangular.$apply($scope);
	            return $scope;
				})
			}
