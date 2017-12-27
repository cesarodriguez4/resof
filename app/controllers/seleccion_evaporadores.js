angular.module('resof')
.controller('evap', ['$rootScope', evap]);

function evap($rootScope) {
  var that = this;
  that.tabs = [1];
  that.numberTab = 1;
  that.onNewTab = function() {
    that.numberTab +=1;
    that.tabs.push(that.numberTab);
    $rootScope.$broadcast('numTabs', that.tabs);
  };
  that.deleteTab = function() {
    that.numberTab -=1;
    that.tabs.splice(-1,1);
    $rootScope.$broadcast('numTabs', that.tabs);
  };

  that.selectTab = num => {
    $rootScope.$broadcast('selectTab', num);
  };
};