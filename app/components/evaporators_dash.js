angular.module('resof')
    .component('evaporadores', {
        templateUrl: `app/components/evaporadores.html`,
        bindings: {
            hero: '='
        },
        controller: function($http, $stateParams, $rootScope) {
            const {
                ipcRenderer
            } = require('electron');

            const type = $stateParams.type;
            const vm = this;
            const URL_SUCCION = 'https://resof.herokuapp.com/api/diametros/linea_de_succion';
            const URL_PUMP_DISCHARGE = 'https://resof.herokuapp.com/api/diametros/pump_discharge';
            const URL_GAS_CALIENTE = 'https://resof.herokuapp.com/api/diametros/gas_caliente';
            const FETCH_RECIR = 'https://resof.herokuapp.com/api/recirculado';
            const FETCH_INUNDADO = 'https://resof.herokuapp.com/api/inundado';
            const FETCH_EXPANSION_DIRECTA = 'https://resof.herokuapp.com/api/expansion_directa';
            const MODELS = ['Válvula Pilotada CK2 SW FLG, W/Piloto 110V', 'Válvula Pilotada S9 W/Pilot 110V'];



            vm.modelByTemp = () => {
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
            vm.tabs = [
                [1]
            ];
            vm.selectedTab = 0;

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

            function LineaDeSuccion(cargaTotal= vm.cargaTotal, numeroEvaporadores=vm.numeroEvaporadores) {
                const carga = cargaTotal / numeroEvaporadores;
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
                return getKeyByValue(valores, closest(cargas, carga));
            }

            function LineadeLiquido(cargaTotal= vm.cargaTotal, numeroEvaporadores=vm.numeroEvaporadores) {
                const carga = cargaTotal / numeroEvaporadores;
                return getKeyByValue(vm.pump_discharge, closest(vm.pump_values, carga));
            }

            function GasCaliente(cargaTotal= vm.cargaTotal, numeroEvaporadores=vm.numeroEvaporadores) {
                const carga = cargaTotal / numeroEvaporadores;
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
            vm.calcTam = (type, cargaTotal = vm.cargaTotal, numeroEvaporadores = vm.numeroEvaporadores) => {
                if (vm.cargaTotal && vm.numeroEvaporadores) {
                    if (vm.succion) {
                        switch (type) {
                            case 'Línea de Succión':
                                return LineaDeSuccion(cargaTotal, numeroEvaporadores);
                            case 'Línea de Líquido':
                                return LineadeLiquido(cargaTotal, numeroEvaporadores);
                            case 'Drenaje de Descongelamiento':
                                return LineadeLiquido(cargaTotal, numeroEvaporadores);
                            case 'Línea de Descongelamiento':
                                return LineadeLiquido(cargaTotal, numeroEvaporadores);
                            case 'Línea de Gas Caliente':
                                return GasCaliente(cargaTotal, numeroEvaporadores);
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

            $rootScope.$on('numTabs', (e, arg) => {
                if (arg.length > vm.tabs.length) {
                    vm.tabs.push([arg.length]);
                } else {
                    vm.tabs.pop();
                }
            });

            $rootScope.$on('selectTab', (e, arg) => {
                vm.selectedTab = arg - 1;
                if (vm.tabs[vm.selectedTab][1]) {
                    vm.des = vm.tabs[vm.selectedTab][1].descongelamiento;
                    vm.tempSel = Number(vm.tabs[vm.selectedTab][1].temperatura);
                    vm.cargaTotal = Number(vm.tabs[vm.selectedTab][1].carga);
                    vm.numeroEvaporadores = Number(vm.tabs[vm.selectedTab][1].evaporadores);
                }
            });

            $rootScope.$on('updateName', (e, tab, name) => {
                if (vm.tabs[vm.selectedTab][1]) {
                    vm.tabs[vm.selectedTab][1].nombre = name;
                }
            });

            vm.updateTab = () => {
                const descongelamiento = vm.des;
                const carga = document.getElementById('carga-termica').value;
                const evaporadores = document.getElementById('n-evaporadores').value;
                const temperatura = vm.tempSel;
                vm.tabs[vm.selectedTab][1] = {
                    descongelamiento,
                    carga,
                    evaporadores,
                    temperatura
                };
                $rootScope.$broadcast('updateTab', vm.tabs);
            };

            $rootScope.$on('saveToExcel', () => {
                //const workbook  = XLSX.utils.table_to_book(document.getElementById('excel-table'));
                //ipcRenderer.send('excel', workbook);
                vm.generateTable();
            });

            // Crear una funcion que 
            // crea una tabla sin filas
            // agrega las columnas de la tab 1 a la tab n
            // dividiendo carga termica entre evaporadores de esa tab se van rellenando los tama;os con ayuda de funcion
            // se envia tabla a saveToExcel.

            vm.generateTable = () => {
                // Creacion de tabla
                const table = document.createElement('table');
                // Creacion de encabezado
                const header = table.createTHead();
                const hrow = header.insertRow(0);
                const col0 = hrow.insertCell(0);
                const col1 = hrow.insertCell(1);
                const col2 = hrow.insertCell(2);
                const col3 = hrow.insertCell(3);
                const col4 = hrow.insertCell(4);
                // Contenido de encabezado
                col0.innerHTML = 'ABREV.';
                col1.innerHTML = 'NOMBRE';
                col2.innerHTML = 'UBICACIÓN';
                col3.innerHTML = 'TAMAÑO';
                col4.innerHTML = 'MODELO';
                let plus = 0;
                // Insertando filas
               console.log('general', vm.generalList);
               console.log('t',vm.tabs);

               const nuevo = vm.tabs.slice(0).reverse();
               for (let tabs of nuevo) {
                    console.log('tab', tabs)
                    const num_evaporadores = Number(tabs[1].evaporadores);
                    let cont_evaporadores = 1;
                    console.log('toto',num_evaporadores);
                    for (let e = num_evaporadores; e--;) {
                        console.log(e, plus, e+1+plus);
                        const num = tabs[0];
                        let cont_filas = 1;
                        const props = tabs[1];
                        for (let fila of vm.generalList) {
                            const row = table.insertRow(cont_filas);
                            row.insertCell(0).innerHTML = vm.generalList[cont_filas - 1].alias;
                            row.insertCell(1).innerHTML = `EV${e+1+plus}-${cont_filas}`;
                            row.insertCell(2).innerHTML = vm.generalList[cont_filas - 1].ubicacion;
                            row.insertCell(3).innerHTML = vm.calcTam(vm.generalList[cont_filas - 1].ubicacion,
                                Number(tabs[1].carga), Number(tabs[1].evaporadores));
                            row.insertCell(4).innerHTML = vm.generalList[cont_filas - 1].modelo;
                            cont_filas += 1;
                        }
                        cont_evaporadores += 1;
                        const blank = table.insertRow(cont_filas);
                        blank.insertCell(0).innerHTML = '';
                        blank.insertCell(1).innerHTML = '';
                        blank.insertCell(2).innerHTML = '';
                        blank.insertCell(3).innerHTML = '';
                        blank.insertCell(4).innerHTML = '';
                        cont_filas += 1;
                    }
                    plus += num_evaporadores;
                    console.log('sub mandamas', table);
                }


                console.log('la mandamas', table);
                const workbook = XLSX.utils.table_to_book(table);
                ipcRenderer.send('excel', workbook);
            };
        }
    });