angular.module('resof')
.controller('evap', ['$rootScope', evap]);

function evap($rootScope) {
  const {ipcRenderer} = require('electron');
  var domtoimage = require('dom-to-image'); 
  var that = this;
  that.tabs = [1];
  that.numberTab = 1;
  that.changeName = false;
  that.selectedTab = 0;
  that.tabName = '';
  that.excelDisabled = true;
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

  that.buildPDF = () => {
    const node = document.getElementById('excel-table');
    domtoimage.toBlob(node)
    .then(blob => {
      ipcRenderer.send('pdf', blob);
    });
  };

  $rootScope.$on('updateTab', (e,tabs) => {
    if (tabs[0][1].carga && tabs[0][1].evaporadores) {
      that.excelDisabled = false;
    } else {
      that.excelDisabled = true;
    }
  });
};