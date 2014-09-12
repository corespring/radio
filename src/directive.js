/* global angular */
(function() {
  'use strict';
  
  function Radio($rootScope) {

    var Radio = {
      CheckedEvent: 'radio.checked',
      check: function($element) {
        $element.attr('checked', 'checked');
        $element.find('.radio-toggle').addClass('checked');
      },
      uncheck: function($element) {
        $element.removeAttr('checked');
        $element.find('.radio-toggle').removeClass('checked');
      },
      isChecked: function($element) {
        return $element.attr('checked') === 'checked';
      },
      isEnabled: function($element) {
        return $element.attr('disabled') !== 'disabled';
      },
      shouldCheck: function($element) {
        return (this.isEnabled($element) && !(this.isChecked($element)));
      },
      enable: function($element) {
        $element.removeAttr('disabled');
        $element.find('.radio-toggle').removeClass('disabled');
      },
      disable: function($element) {
        $element.attr('disabled', 'disabled');
        $element.find('.radio-toggle').addClass('disabled');
      }
    };
    
    function link($scope, $element, $attr, ctrls) {
      
      function ngModelLink($scope, $element, $attr, $ctrl) {
        $element.click(function() {
          if (Radio.shouldCheck($element)) {
            Radio.check($element);
            $scope.$apply(function() {
              $ctrl.$setViewValue($attr.value);
            });
          }
        });

        $scope.$watch($attr.ngModel, function() {
          if (!angular.isDefined($ctrl.$viewValue) || $ctrl.$viewValue !== $attr.value) {
            Radio.uncheck($element);
          } else if ($ctrl.$viewValue === $attr.value) {
            Radio.check($element);
          }
        });
      }
      
      function doNative($scope, $element, $attr) {
        $element.click(function() {
          if (Radio.shouldCheck($element)) {
            $attr.$set('checked', 'checked');
          }
        });

        $scope.$on(Radio.CheckedEvent, function(event, value) {
          if ($element.attr('value') !== value) {
            Radio.uncheck($element);
          }
        });

        $attr.$observe('checked', function() {
          if (Radio.isChecked($element)) {
            Radio.check($element);
            $rootScope.$broadcast(Radio.CheckedEvent, $element.attr('value'));
          } else {
            Radio.uncheck(element);
          }
        });

        $attr.$observe('disabled', function() {
          if (Radio.isEnabled($element)) {
            Radio.enable($element);
          } else {
            Radio.disable($element);
          }
        });
      }
      
      if (Radio.isChecked($element)) {
        Radio.check($element);
      }
      if (!Radio.isEnabled($element)) {
        Radio.disable($element);
      }
      if (ctrls[0]) {
        ngModelLink($scope, $element, $attr, ctrls[0]);
      } else {
        doNative($scope, $element, $attr);
      }
    }

    return {
      replace: true,
      restrict: 'E',
      transclude: true,
      priority: 0,
      require: ['?ngModel'],
      link: link,
      template: [
        '<div class="radio-input">',
        '  <div class="radio-toggle" ng-class="{\'checked\': checked, \'disabled\': disabled}"/>',
        '  <span class="label-text" ng-transclude/>',
        '</div>'
      ].join('')
    }
  }

  angular.module('corespring.input', []).directive('radio', ['$rootScope', Radio]);
  
})();
