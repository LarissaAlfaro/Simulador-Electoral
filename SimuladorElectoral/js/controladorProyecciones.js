let arrayValues2 = [];
let arrayValues4 = [];
LoadDB();

function LoadDB(){
    let request = indexedDB.open("DB_Simulador", 1);
    request.onupgradeneeded = function (event) {
        var db = event.target.result;
        var obj1 = db.createObjectStore("Table_1", { autoIncrement : true });
        var obj2 = db.createObjectStore("Table_2", { autoIncrement : true });
        var obj3 = db.createObjectStore("Table_3", { autoIncrement : true });
        var obj4 = db.createObjectStore("Table_4", { autoIncrement : true });
    };
    
    request.onsuccess = function(event) {
        db = event.target.result;
        GetTables();
        console.log("Se ha iniciado correctamente");
    };

    request.onerror = function(event) {
        console.log("ERROR!");
    };
};

function GetTables(){
    arrayValues2 = [];
    var objectStore = db.transaction("Table_2").objectStore("Table_2");
    objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            cursor.continue();
            arrayValues2.push(cursor.value);
        }
        else {
            //createGraphicP(arrayValues4);
            console.log("No more entries!");
        }; 
    };

    arrayValues4 = [];
    var objectStore = db.transaction("Table_4").objectStore("Table_4");
    objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor){
            arrayValues4.push(cursor.value);
            cursor.continue();
        }
        else {
            //createGraphicP(arrayValues4);
            console.log("No more entries!");
        }; 
    }; 

    let arrayValues3 = [];
    var objectStore = db.transaction("Table_3").objectStore("Table_3");
    objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor){
            arrayValues3.push(cursor.value);
            cursor.continue();
        }
        else {
            if(arrayValues3.length==0){
                var myModal = new bootstrap.Modal(document.getElementById('msgTendencias'), {
                    keyboard: false
                });
                myModal.show();
            }else{
                createGraphicP(arrayValues3, arrayValues4);
            }
            console.log("No more entries!");
        }; 
    }; 
};


function createGraphicP(encuestas,meses){
    estasEncuestas = encuestas
    estosMeses = meses[0];
    
    //console.log(encuestas);
    //console.log(meses);
    const $grafica = document.querySelector("#grafica");

    arreglo1=[], arreglo2=[], arreglo3=[], arreglo4=[], arreglo5=[], arreglo6=[], arreglo7=[], arreglo8=[], arreglo9=[], arreglo10=[], arreglo11=[], arreglo12=[];
    for (i=0; i<estasEncuestas.length; i++) {
        if (obtenerMes(estasEncuestas[i].mes) == "Enero") {arreglo1.push(estasEncuestas[i])}
        if (obtenerMes(estasEncuestas[i].mes) == "Febrero") {arreglo2.push(estasEncuestas[i])}
        if (obtenerMes(estasEncuestas[i].mes) == "Marzo") {arreglo3.push(estasEncuestas[i])}
        if (obtenerMes(estasEncuestas[i].mes) == "Abril") {arreglo4.push(estasEncuestas[i])}
        if (obtenerMes(estasEncuestas[i].mes) == "Mayo") {arreglo5.push(estasEncuestas[i])}
        if (obtenerMes(estasEncuestas[i].mes) == "Junio") {arreglo6.push(estasEncuestas[i])}
        if (obtenerMes(estasEncuestas[i].mes) == "Julio") {arreglo7.push(estasEncuestas[i])}
        if (obtenerMes(estasEncuestas[i].mes) == "Agosto") {arreglo8.push(estasEncuestas[i])}
        if (obtenerMes(estasEncuestas[i].mes) == "Septiembre") {arreglo9.push(estasEncuestas[i])}
        if (obtenerMes(estasEncuestas[i].mes) == "Octubre") {arreglo10.push(estasEncuestas[i])}
        if (obtenerMes(estasEncuestas[i].mes) == "Noviembre") {arreglo11.push(estasEncuestas[i])}
        if (obtenerMes(estasEncuestas[i].mes) == "Diciembre") {arreglo12.push(estasEncuestas[i])}
    }

    mesesAño = [arreglo1,arreglo2,arreglo3,arreglo4, arreglo5, arreglo6, arreglo7, arreglo8, arreglo9, arreglo10, arreglo11, arreglo12]

    cantCandidatos = arrayValues2.length;

    resultados1 = Array(cantCandidatos).fill(0), resultados2 = Array(cantCandidatos).fill(0), resultados3 = Array(cantCandidatos).fill(0), resultados4 = Array(cantCandidatos).fill(0), resultados5 = Array(cantCandidatos).fill(0), resultados6 = Array(cantCandidatos).fill(0), resultados7 = Array(cantCandidatos).fill(0), resultados8 = Array(cantCandidatos).fill(0), resultados9 = Array(cantCandidatos).fill(0), 
    resultados10 = Array(cantCandidatos).fill(0), resultados11 = Array(cantCandidatos).fill(0), resultados12 = Array(cantCandidatos).fill(0);

    datosFinales = [resultados1, resultados2, resultados3, resultados4, resultados5, resultados6, resultados7, resultados8, resultados9, resultados10, resultados11, resultados12];

    for(i=0;i<mesesAño.length;i++){
        console.log("imprimiendo i=", i)
        for(j=0;j<mesesAño[i].length;j++){
            console.log("imprimiendo j=", mesesAño[i][j])
            for(t=0;t<arrayValues2.length;t++){
                console.log("tercer ciclo")
                if(mesesAño[i][j].candidato==arrayValues2[t].candidato){
                    console.log("entra al if")
                    datosFinales[i][t]+= 1;
                }
            }
        }
    }

    mesesNumericos = obtenerNumMes(estosMeses);
    console.log("primer mes", mesesNumericos[0]);
    console.log("último mes", mesesNumericos[mesesNumericos.length-1]);
    primerMes = mesesNumericos[0];
    ultimoMes = mesesNumericos[mesesNumericos.length-1]
    cantidadDeMeses = ultimoMes - primerMes + 1;
    console.log("cantidad de meses" , cantidadDeMeses);


    datosAGraficar = new Array(arrayValues2.length);

    for (i=0; i < datosAGraficar.length; i++) {
        datosAGraficar[i] = new Array(cantidadDeMeses);
    }

    for (i=primerMes-1; i<ultimoMes; i++) {
        for(j=0;j<datosFinales[i].length;j++){
            datosAGraficar[j][i] = datosFinales[i][j];
        }
    }

    datosListos = new Array(arrayValues2.length);

    for (i=0; i < datosListos.length; i++) {
        datosListos[i] = new Array(cantidadDeMeses);
    }
  
    for (i=0; i<datosAGraficar.length; i++) {
        count=0;
        for(j=0;j<datosAGraficar[0].length;j++){
            
            if (datosAGraficar[i][j]!=undefined){
                datosListos[i][count] = datosAGraficar[i][j];
                count = count+1;
            }
        }
    }


    switch (arrayValues2.length) {
        case 2:
            var candidato1 = {
                label: `${arrayValues2[0]['candidato']}`,
                data: datosListos[0],
                backgroundColor: '#FF0000',
                borderColor: '#000000',
                yAxisID: "y-axis-density"
            };

            var candidato2 = {
                label: `${arrayValues2[1]['candidato']}`,
                data: datosListos[1],
                backgroundColor: '#4400ff',
                borderColor: '#000000',
                yAxisID: "y-axis-density"
            };

            var Data = {
                labels: meses[meses.length-1],
                datasets: [candidato1, candidato2]
            };

          break;
        case 3:
            var candidato1 = {
                label: `${arrayValues2[0]['candidato']}`,
                data: datosListos[0],
                backgroundColor: '#FF0000',
                borderColor: '#000000',
                yAxisID: "y-axis-density"
            };

            var candidato2 = {
                label: `${arrayValues2[1]['candidato']}`,
                data: datosListos[1],
                backgroundColor: '#4400ff',
                borderColor: '#000000',
                yAxisID: "y-axis-density"
            };

            var candidato3 = {
                label: `${arrayValues2[2]['candidato']}`,
                data: datosListos[2],
                backgroundColor: '#fbff00',
                borderColor: '#000000',
                yAxisID: "y-axis-density"
            };

            var Data = {
                labels: meses[meses.length-1],
                datasets: [candidato1, candidato2, candidato3]
            };
          
          break;
        case 4:
            var candidato1 = {
                label: `${arrayValues2[0]['candidato']}`,
                data: datosListos[0],
                backgroundColor: '#FF0000',
                borderColor: '#000000',
                yAxisID: "y-axis-density"
            };

            var candidato2 = {
                label: `${arrayValues2[1]['candidato']}`,
                data: datosListos[1],
                backgroundColor: '#4400ff',
                borderColor: '#000000',
                yAxisID: "y-axis-density"
            };

            var candidato3 = {
                label: `${arrayValues2[2]['candidato']}`,
                data: datosListos[2],
                backgroundColor: '#fbff00',
                borderColor: '#000000',
                yAxisID: "y-axis-density"
            };

            var candidato4 = {
                label: `${arrayValues2[3]['candidato']}`,
                data: datosListos[3],
                backgroundColor: '#00ff15',
                borderColor: '#000000',
                yAxisID: "y-axis-density"
            };

            var Data = {
                labels: meses[meses.length-1],
                datasets: [candidato1, candidato2, candidato3, candidato4]
            };
          break;  
      }
    
    var chartOptions = {
        scales: {
        xAxes: [{
            barPercentage: 1,
            categoryPercentage: 0.6
        }],
        yAxes: [{
            id: "y-axis-density"
        }]
        }
    };
    
    var barChart = new Chart($grafica, {
        type: 'bar',
        data: Data,
        options: chartOptions
    });
}


function obtenerNumMes (ArregloMeses) {
    mesesNumeros = [] 
    for (i=0; i<ArregloMeses.length; i++) {
        if (ArregloMeses[i]=="Enero") {mesesNumeros[i]=1}
        if (ArregloMeses[i]=="Febrero") {mesesNumeros[i]=2}
        if (ArregloMeses[i]=="Marzo") {mesesNumeros[i]=3}
        if (ArregloMeses[i]=="Abril") {mesesNumeros[i]=4}
        if (ArregloMeses[i]=="Mayo") {mesesNumeros[i]=5}
        if (ArregloMeses[i]=="Junio") {mesesNumeros[i]=6}
        if (ArregloMeses[i]=="Julio") {mesesNumeros[i]=7}
        if (ArregloMeses[i]=="Agosto") {mesesNumeros[i]=8}
        if (ArregloMeses[i]=="Septiembre") {mesesNumeros[i]=9}
        if (ArregloMeses[i]=="Octubre") {mesesNumeros[i]=10}
        if (ArregloMeses[i]=="Noviembre") {mesesNumeros[i]=11}
        if (ArregloMeses[i]=="Diciembre") {mesesNumeros[i]=12}
    }

    return mesesNumeros;
}


function obtenerMes (mesNúmero) {
    mesN = " ";
    if ((mesNúmero == "01") || (mesNúmero == "1")) {mesN="Enero"};
    if ((mesNúmero == "02") || (mesNúmero == "2")) {mesN="Febrero"};
    if ((mesNúmero == "03") || (mesNúmero == "3")) {mesN="Marzo"};
    if ((mesNúmero == "04") || (mesNúmero == "4")) {mesN="Abril"};
    if ((mesNúmero == "05") || (mesNúmero == "5")) {mesN="Mayo"};
    if ((mesNúmero == "06") || (mesNúmero == "6")) {mesN="Junio"};
    if ((mesNúmero == "07") || (mesNúmero == "7")) {mesN="Julio"};
    if ((mesNúmero == "08") || (mesNúmero == "8")) {mesN="Agosto"};
    if ((mesNúmero == "09") || (mesNúmero == "9")) {mesN="Septiembre"};
    if (mesNúmero == "10") {mesN="Octubre"};
    if (mesNúmero == "11") {mesN="Noviembre"};
    if (mesNúmero == "12") {mesN="Diciembre"};
    
    return mesN;
}
