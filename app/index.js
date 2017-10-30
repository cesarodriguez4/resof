angular.module('resof', ['ui.router'])
.config(($stateProvider,$urlRouterProvider) => {
	$urlRouterProvider.otherwise("/");
	$stateProvider.state({
		name: 'home',
		url: '/',
		templateUrl: 'app/view/home.html'
	});
	$stateProvider.state({
		name: 'seleccion_evaporadores',
		url: '/evap',
		templateUrl: 'app/view/seleccion_evaporadores.html'
	});
});