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
        GetTable2();
        console.log("Se ha iniciado correctamente");
    };

    request.onerror = function(event) {
        console.log("ERROR!");
    };
}

function GetTable2(){
    let arrayValues2 = [];
    var objectStore = db.transaction("Table_2").objectStore("Table_2");
    objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            arrayValues2.push(cursor.value);
            cursor.continue();
        }
        else {
            console.log(arrayValues2);
            extract3(arrayValues2);
            console.log("   No more entries!");
        }  
    }; 
};

function extract3(arrayValues){
    document.getElementById('radioCandidatos').innerHTML = "";
    let etiquetas = [];
    for (i=0; i<arrayValues.length; i++){
        document.getElementById('radioCandidatos').innerHTML += `<label class="lab"><input name="candidato" value="${arrayValues[i]["candidato"]}" type="radio">${arrayValues[i]["candidato"]}</label><br>` ;
    }
};

function verificarRadios() {
    if (!document.querySelector('input[type="radio"][name="genero"]:checked') || !document.querySelector('input[type="radio"][name="candidato"]:checked') || !document.querySelector('input[type="radio"][name="edad"]:checked')){
        document.getElementById('msgLLenado').innerHTML = `* Se deben llenar todas las preguntas`;
    }else{
        document.getElementById('msgLLenado').innerHTML = ` `;
        var myModal = new bootstrap.Modal(document.getElementById('enviarEncuesta'), {
            keyboard: false
        });
        myModal.show();
        Add_Table3();
    };
};

function LimpiarInputsEncuesta() {
    var ele = document.getElementsByName("edad");
   for(var i=0;i<ele.length;i++){
    ele[i].checked = false;
   }

   var ele = document.getElementsByName("genero");
   for(var i=0;i<ele.length;i++){
    ele[i].checked = false;
   }

   var ele = document.getElementsByName("candidato");
   for(var i=0;i<ele.length;i++){
    ele[i].checked = false;
   }
    
}




