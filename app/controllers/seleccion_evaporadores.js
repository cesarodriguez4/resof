angular.module('resof')
.controller('evap', [evap]);

function evap() {
  var that = this;
  that.tabs = [1];
  that.numberTab = 1;
  that.onNewTab = function() {
    that.numberTab +=1;
    that.tabs.push(that.numberTab);
  };
  that.deleteTab = function() {
    that.numberTab -=1;
    that.tabs.splice(-1,1);
  };
};