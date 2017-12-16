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
            const FETCH_RECIR = 'https://resof.herokuapp.com/api/recirculado';
            const FETCH_INUNDADO = 'https://resof.herokuapp.com/api/inundado';
            const FETCH_EXPANSION_DIRECTA = 'https://resof.herokuapp.com/api/expansion_directa';
            const MODELS = ['Válvula Pilotada S9 W/Pilot 110V', 'Válvula Pilotada CK2 SW FLG, W/Piloto 110V'];

            vm.modelByTemp = () => 
            {
              if (vm.tempSel >= -10) {
                return MODELS[0];
              } else {
                return MODELS[1];
              }  
            } 

            vm.loadingTable = true;
            vm.pump_values = [];
            vm.gas_values = [];
            vm.wgasList = [];
            vm.descongelamiento = ['Gas Caliente', 'Eléctrico', 'Agua'];

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

            function closest(arr, target) {
                console.log('arrlength', arr.length);
                console.log('arr', arr, 'target', target);
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
                console.log('obye', object, 'veiliu', value);
                return Object.keys(object).find(key => object[key] === value);
            }

            function LineaDeSuccion() {
                const carga = vm.cargaTotal / vm.numeroEvaporadores;
                const valores = {};
                const i = vm.succion.find(i => i.temperatura == vm.tempSel);

                if (i === undefined) {
                    throw Error("can't find what I want in the array");
                } else {
                    for (let key in i) {
                        if (key === 'temperatura' || key === 'presion' || key === 'id' || key === '$$hashKey') {

                        } else {
                            valores[key] = i[key];
                        }
                    }
                }
                const cargas = Object.keys(valores).map(function(key) {
                    return valores[key];
                });
                console.log(valores);
                return getKeyByValue(valores, closest(cargas, carga));
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
                    $http({
                        method: 'GET',
                        url: FETCH_EXPANSION_DIRECTA
                    }).then(res => {
                        vm.loadingTable = false;
                        vm.listTable = res.data;
                        vm.generalList = res.data;
                        let listWithoutGas = res.data;
                        listWithoutGas.map(x => {
                            if (x.ubicacion !== 'Línea de Gas Caliente') {
                                vm.wgasList.push(x);
                            }
                        });
                    });
                    break;
                case 'recirculado':
                    vm.img = 'app/media/recirculado.JPG';
                    vm.title = 'Recirculado';
                    $http({
                        method: 'GET',
                        url: FETCH_RECIR
                    }).then(res => {
                        vm.loadingTable = false;
                        vm.listTable = res.data;
                        vm.generalList = res.data;
                        let listWithoutGas = res.data;
                        listWithoutGas.map(x => {
                            if (x.ubicacion !== 'Línea de Gas Caliente') {
                                vm.wgasList.push(x);
                            }
                        });
                    });
                    break;
                case 'inundado':
                    vm.img = 'app/media/inundado.JPG';
                    vm.title = 'Inundado';
                    $http({
                        method: 'GET',
                        url: FETCH_INUNDADO
                    }).then(res => {
                        vm.loadingTable = false;
                        vm.listTable = res.data;
                        vm.generalList = res.data;
                        let listWithoutGas = res.data;
                        listWithoutGas.map(x => {
                            if (x.ubicacion !== 'Línea de Gas Caliente') {
                                vm.wgasList.push(x);
                            }
                        });
                    });
                    break;
                default:
                    vm.img = null;
                    vm.title = null;
                    break;
            }
            vm.calcTam = type => {
                if (vm.cargaTotal && vm.numeroEvaporadores) {
                    if (vm.succion) {
                        switch (type) {
                            case 'Línea de Succión':
                                return LineaDeSuccion();
                            case 'Línea de Líquido':
                                return LineadeLiquido();
                            case 'Drenaje de Descongelamiento':
                                return LineadeLiquido();
                            case 'Línea de Descongelamiento':
                                return LineadeLiquido();
                            case 'Línea de Gas Caliente':
                                return GasCaliente();
                            default:
                                return console.warn('No mode selected');
                        }
                    } else {
                        return 'Selecciona una temperatura';
                    }
                } else {
                    return " ";
                }
            }

            vm.cambiaDescongelamiento = () => {
                if (vm.des == 'Gas Caliente') {
                    vm.generalList = vm.listTable;
                } else {
                    vm.generalList = vm.wgasList;
                }
            }
        }
    });