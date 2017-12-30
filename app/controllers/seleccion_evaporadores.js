angular.module('resof')
.controller('evap', ['$rootScope', evap]);

function evap($rootScope) {
  var that = this;
  that.tabs = [1];
  that.numberTab = 1;
  that.changeName = false;
  that.selectedTab = 0;
  that.tabName = '';
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
    that.selectedTab = num;
  };

  that.toogleName = () => {
    that.changeName = !that.changeName;
  };

  that.emitChangeTabName = () => {
    $rootScope.$broadcast('updateName', that.numberTab, that.tabName);
    document.getElementById(`sistema-${that.selectedTab}`).innerHTML = that.tabName;
  };

  that.saveExcel = () => {
    $rootScope.$broadcast('saveToExcel');
  };
};