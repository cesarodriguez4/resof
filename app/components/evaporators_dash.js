angular.module('resof')
    .component('evaporadores', {
        templateUrl: `app/components/evaporadores.html`,
        bindings: {
            hero: '='
        },
        controller: function($http, $stateParams) {
            const type = $stateParams.type;
            const vm = this;
            const URL_SUCCION = 'https://resof.herokuapp.com/api/diametros/linea_de_succion';

            function closest(arr, target) {
                if (!(arr) || arr.length == 0)
                    return null;
                if (arr.length == 1)
                    return arr[0];

                for (var i = 1; i < arr.length; i++) {
                    // As soon as a number bigger than target is found, return the previous or current
                    // number depending on which has smaller difference to the target.
                    if (arr[i] > target) {
                        var p = arr[i - 1];
                        var c = arr[i]
                        return Math.abs(p - target) < Math.abs(c - target) ? p : c;
                    }
                }
                // No number in array is bigger so return the last.
                return arr[arr.length - 1];
            }
            function getKeyByValue(object, value) {
              return Object.keys(object).find(key => object[key] === value);
            }

            function LineaDeSuccion() {
                const carga = vm.cargaTotal / vm.numeroEvaporadores;
                vm.succion.map(i => {
                    if (i.temperatura == vm.tempSel) {
                        delete i.id;
                        delete i.presion;
                        delete i.temperatura;
                        delete i.$$hashKey;

                        console.log(i);
                        const cargas = Object.keys(i).map(function(key) {
                            return i[key];
                        });
                        console.log(getKeyByValue(i, closest(cargas, carga)));
                        return getKeyByValue(i, closest(cargas, carga));
                    }
                });
                return '2"';
            }
            switch (type) {
                case 'expansion_directa':
                    vm.img = 'app/media/expansion_directa.JPG';
                    vm.title = 'Expansión Directa';
                    break;
                case 'recirculado':
                    vm.img = 'app/media/recirculado.JPG';
                    vm.title = 'Recirculado';
                    vm.ajaxRecir = 'https://resof.herokuapp.com/api/recirculado';
                    vm.getDiam = 'https://resof.herokuapp.com/api/diametros/linea_de_liquido';
                    // 0. Crear servicios que traigan diametros
                    // 1. Traer todos los datos (linea de liquido, gas caliente, succion, drenaje) y almacenarlos en variables
                    // 2. para cada entrada analizamos cual tipo es (linea liquido, caliente...) y le pasamos una
                    // funcion con el tipo, los datos y la temperatura o carga termica
                    // Esa funcion devuelve el diametro que corresponda.
                    $http({
                        method: 'GET',
                        url: vm.ajaxRecir
                    }).then(res => {
                        vm.listTable = res.data;
                    });
                    $http({
                        method: 'GET',
                        url: URL_SUCCION
                    }).then(res => {
                        vm.succion = res.data;
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
            vm.calcTam = type => {
                if (vm.succion) {
                    switch (type) {
                        case 'Línea de Succión':
                            return LineaDeSuccion();
                        default:
                            return console.warn('No mode selected');
                    }
                } else {
                    return 'No hay datos';
                }

            }
        }
    });