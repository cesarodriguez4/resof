angular.module('resof')
.component('evaporadores', {
	templateUrl: `app/components/evaporadores.html`,
	bindings: {
		hero: '='
	},
	controller: function($stateParams) {
		const type = $stateParams.type;
		switch (type) {
			case 'expansion_directa':
			  this.img = 'app/media/expansion_directa.JPG';
			  this.title = 'Expansión Directa';
			  break;
			case 'recirculado':
			  this.img = 'app/media/recirculado.JPG';
			  this.title = 'Recirculado';
			  break;
			case 'inundado':
			  this.img = 'app/media/inundado.JPG';
			  this.title = 'Inundado';
			  break;
			default:
			  this.img = null;
			  this.title = null;
			  break;
		}

	}
});