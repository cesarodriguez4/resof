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
            const URL_PUMP_DISCHARGE = 'https://resof.herokuapp.com/api/diametros/pump_discharge';
            const URL_GAS_CALIENTE = 'https://resof.herokuapp.com/api/diametros/gas_caliente';
            vm.pump_values = [];
            vm.gas_values = [];

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
                console.log('respuesta', arr[arr.length - 1])
                // No number in array is bigger so return the last.
                return arr[arr.length - 1];
            }

            function getKeyByValue(object, value) {
                return Object.keys(object).find(key => object[key] === value);
            }

            function LineaDeSuccion() {
                const carga = vm.cargaTotal / vm.numeroEvaporadores;
                const i = vm.succion.find(i => i.temperatura == vm.tempSel);

                if (i === undefined) {
                    throw Error("can't find what I want in the array");
                } else {
                    delete i.id;
                }

                const cargas = Object.keys(i).map(function(key) {
                    return i[key];
                });
                return getKeyByValue(i, closest(cargas, carga));
            }

            function LineadeLiquido() {
                const carga = vm.cargaTotal / vm.numeroEvaporadores;
                return getKeyByValue(vm.pump_discharge, closest(vm.pump_values, carga));
            }

            function GasCaliente() {
                const carga = vm.cargaTotal / vm.numeroEvaporadores;
                return getKeyByValue(vm.gas, closest(vm.gas_values, carga));
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
                        url: URL_PUMP_DISCHARGE
                    }).then(res => {
                        vm.pump_discharge = res.data;
                        delete vm.pump_discharge.id;
                        delete vm.pump_discharge.service;
                        for (let i in res.data) {
                            vm.pump_values.push(res.data[i]);
                        }
                    });

                    $http({
                        method: 'GET',
                        url: URL_GAS_CALIENTE
                    }).then(res => {
                        vm.gas = res.data;
                        delete vm.gas.id;
                        delete vm.gas.service;
                        for (let i in res.data) {
                            vm.gas_values.push(res.data[i]);
                        }
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
                        case 'Línea de Liquido':
                            return LineadeLiquido();
                        case 'Drenaje de Descongelamiento':
                            return LineadeLiquido();
                        case 'Línea de Gas Caliente':
                            return GasCaliente();
                        default:
                            return console.warn('No mode selected');
                    }
                } else {
                    return 'Selecciona una temperatura';
                }
            }
        }
    });