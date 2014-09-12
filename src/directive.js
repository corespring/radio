/* global angular */
(function() {
  'use strict';
  
  function Radio($rootScope) {

    var Radio = {
      CheckedEvent: 'radio.checked',
      setCheckedView: function($element) {
        $element.attr('checked', 'checked');
        $element.find('.radio-toggle').addClass('checked');
      },
      setUncheckedView: function($element) {
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
      setEnabledView: function($element) {
        $element.removeAttr('disabled');
        $element.find('.radio-toggle').removeClass('disabled');
      },
      setDisabledView: function($element) {
        $element.attr('disabled', 'disabled');
        $element.find('.radio-toggle').addClass('disabled');
      }
    };
    
    function link($scope, $element, $attr, ctrls) {
      
      function ngModelLink($scope, $element, $attr, $ctrl) {
        $element.click(function() {
          if (Radio.shouldCheck($element)) {
            Radio.setCheckedView($element);
            $scope.$apply(function() {
              $ctrl.$setViewValue($attr.value);
            });
          }
        });

        $scope.$watch($attr.ngModel, function() {
          if (!angular.isDefined($ctrl.$viewValue) || $ctrl.$viewValue !== $attr.value) {
            Radio.setUncheckedView($element);
          } else if ($ctrl.$viewValue === $attr.value) {
            Radio.setCheckedView($element);
          }
        });
      }
      
      function simulateNativeRadio($scope, $element, $attr) {
        $element.click(function() {
          if (Radio.shouldCheck($element)) {
            $attr.$set('checked', 'checked');
          }
        });

        $scope.$on(Radio.CheckedEvent, function(event, value) {
          if ($element.attr('value') !== value) {
            Radio.setUncheckedView($element);
          }
        });

        $attr.$observe('checked', function() {
          if (Radio.isChecked($element)) {
            Radio.setCheckedView($element);
            $rootScope.$broadcast(Radio.CheckedEvent, $element.attr('value'));
          } else {
            Radio.uncheck(element);
          }
        });

        $attr.$observe('disabled', function() {
          if (Radio.isEnabled($element)) {
            Radio.setEnabledView($element);
          } else {
            Radio.setDisabledView($element);
          }
        });
      }
      
      if (Radio.isChecked($element)) {
        Radio.setCheckedView($element);
      }
      if (!Radio.isEnabled($element)) {
        Radio.setDisabledView($element);
      }
      if (ctrls[0]) {
        ngModelLink($scope, $element, $attr, ctrls[0]);
      } else {
        simulateNativeRadio($scope, $element, $attr);
      }
    }

    return {
      replace: true,
      restrict: 'AE',
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
