angular.module('resof')
.component('evaporadores', {
	template: `
	<div class="row sel-evap-directiva">
		<div class="col-5 p-4">
			<img class="sel-evap-img" src="{{$ctrl.img}}">
			<h2 class="text-center">{{$ctrl.title}}</h2>
		</div>
		<div class="col-7">
			<h2>Datos a procesar:</h2>
			<div class="row">
				<div class="col-3">Descongelamiento: <select class="form-control"><option>Gas Caliente</option></select></div>
				<div class="col-3">Temperatura: [F] <input class="form-control" type="number" name=""/></div>
				<div class="col-3">Carga Termica Total <input class="form-control" type="number" name=""/></div>
				<div class="col-3">N Evaporadores<input class="form-control" type="number" name=""/></div>
			</div>
			<div class="row">
				<table class="table">
					<thead>
						<tr>
							<th scope="col">Cargar Termica Evaporadores(TR)</th>
							<th scope="col"><input class="form-control" type="number" name=""/></th>
							<th scope="col">Valvulas</th>
						</tr>
						<tr>
							<th scope="col">ABREVIATURA</th>
							<th scope="col">NOMBRE</th>
							<th scope="col">UBICACIÓN</th>
							<th scope="col">TAMAÑO</th>
							<th scope="col">MODELO</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<th scope="row">1</th>
							<td>Mark</td>
							<td>Otto</td>
							<td>@mdo</td>
						</tr>
						<tr>
							<th scope="row">2</th>
							<td>Jacob</td>
							<td>Thornton</td>
							<td>@fat</td>
						</tr>
						<tr>
							<th scope="row">3</th>
							<td>Larry</td>
							<td>the Bird</td>
							<td>@twitter</td>
						</tr>
					</tbody>
				</table></div>
			</div>
		</div>
	`,
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