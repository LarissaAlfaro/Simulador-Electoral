LoadDB();

function LoadDB(){
    let request = indexedDB.open("DB_Simulador", 1);
    request.onupgradeneeded = function (event) {
        var db = event.target.result;
        var obj1 = db.createObjectStore("Table_1", { autoIncrement : true });
        var obj2 = db.createObjectStore("Table_2", { autoIncrement : true });
        var obj3 = db.createObjectStore("Table_3", { autoIncrement : true });
    };
    
    request.onsuccess = function(event) {
        db = event.target.result;
        GetAllTables();
        console.log("Se ha iniciado correctamente");
    };

    request.onerror = function(event) {
        console.log("ERROR!");
    };
}

let arrayValues2 = [];
let arrayValues3 = [];

function GetAllTables(){
    var objectStore = db.transaction("Table_2").objectStore("Table_2");
    objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            arrayValues2.push(cursor.value);
            cursor.continue();
        }
        else {
            extract2(arrayValues2);
            console.log("   No more entries!");
        }  
    };

    var objectStore = db.transaction("Table_3").objectStore("Table_3");
    objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            arrayValues3.push(cursor.value);
            cursor.continue();
        }
        else {
            extract3(arrayValues3);
            console.log("   No more entries!");
        }  
    };
};

let etiquetas = [];
function extract2(arrayValues){
    for (i=0; i<arrayValues.length; i++){
        etiquetas.push(arrayValues[i]["candidato"]);
    }
}

function extract3(arrayValues){
    let values = [];
    for (i=0; i<arrayValues.length; i++){
        values.push(arrayValues[i]["candidato"]);
    };
    calculate(values);
    
}

function calculate(array){
    let data =[];
    let countCandidate1 = 0;
    let countCandidate2 = 0;
    let countCandidate3 = 0;
    let countCandidate4 = 0;

    for(i=0; i<array.length;i++){
        
        if(array[i]==arrayValues2[0]["candidato"]){
            countCandidate1 = countCandidate1 +1;
        }else if(array[i]==arrayValues2[1]["candidato"]){
            countCandidate2 = countCandidate2 +1;
        }else if(array[i]==arrayValues2[2]["candidato"]){
            countCandidate3 = countCandidate3 +1;
        }else if(array[i]==arrayValues2[3]["candidato"]){
            countCandidate4 = countCandidate4 +1;
        };
        
    };

    data1 = (countCandidate1/array.length)*100;
    data2 = (countCandidate2/array.length)*100;
    data3 = (countCandidate3/array.length)*100;
    data4 = (countCandidate4/array.length)*100;
    
    data.push(data1);
    data.push(data2);
    data.push(data3);
    data.push(data4);

    createGraphic(data);
}

function createGraphic(data){
    console.log(data);
    console.log(etiquetas);
    // Obtener una referencia al elemento canvas del DOM
    const $grafica = document.querySelector("#grafica");
    // Las etiquetas son las que van en el eje X. 
    // Podemos tener varios conjuntos de datos. Comencemos con uno
    const datosEncuestas = {
        label: "Proyecciones candidato",
        data: data, // La data es un arreglo que debe tener la misma cantidad de valores que la cantidad de etiquetas
        backgroundColor: 'rgb(33, 155, 167)', // Color de fondo
        borderColor: 'rgb(33, 155, 167)', // Color del borde
        borderWidth: 1,// Ancho del borde
    };
    new Chart($grafica, {
        type: 'bar',// Tipo de gráfica
        data: {
            labels: etiquetas,
            datasets: [
                datosEncuestas,
                // Aquí más datos...
            ]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }],
            },
        }
    });
};