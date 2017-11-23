angular.module('resof')
.component('evaporadores', {
	templateUrl: `app/components/evaporadores.html`,
	bindings: {
		hero: '='
	},
	controller: function($http, $stateParams) {
		const type = $stateParams.type;
		const vm = this;
		switch (type) {
			case 'expansion_directa':
			  vm.img = 'app/media/expansion_directa.JPG';
			  vm.title = 'Expansión Directa';
			  break;
			case 'recirculado':
			  vm.img = 'app/media/recirculado.JPG';
			  vm.title = 'Recirculado';
			  vm.ajax = 'https://resof.herokuapp.com/api/recirculado';

			  $http({ method: 'GET',
				  url: vm.ajax
				}).then(res => {
					vm.listTable = res.data;
				});	  
			  break;
			case 'inundado':
			  vm.img = 'app/media/inundado.JPG';
			  vm.title = 'Inundado';
			  break;
			default:
			  vm.img = null;
			  vm.title = null;
			  break;
		}

		
	}
});