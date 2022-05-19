
let db;
let varJson;
let arrayValues1 = [];
let arrayValues2 = [];
let arrayValues3 = [];
let arrayValues1Keys=[];
let arrayValues2Keys=[];
let arrayValues3Keys=[];
let arrayValues4Keys=[];
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
        GetAllTables();
        console.log("Se ha iniciado correctamente");
    };

    request.onerror = function(event) {
        console.log("ERROR!");
    };
}


function Add_Table1(){
    var transaction = db.transaction(["Table_1"], "readwrite");
    transaction.oncomplete = function(event) {
        console.log("All done!");
    };
    transaction.onerror = function(event) {
        console.error("Error");
    };
    var objectStore = transaction.objectStore("Table_1");
    
    varJson = {fechaInicial: document.getElementById('fechaInicio').value , fechaFinal:document.getElementById('fechaFinal').value};

    var request = objectStore.add(varJson);
    request.onsuccess = function(event){
    };

}

function Add_Table2(){
    
    var transaction = db.transaction(["Table_2"], "readwrite");
    transaction.oncomplete = function(event) {
        console.log("All done!");
    };
    transaction.onerror = function(event) {
        console.error("Error");
    };
    var objectStore = transaction.objectStore("Table_2");
    
    varJson = {candidato:document.getElementById('candidato').value};

    var request = objectStore.add(varJson);
    request.onsuccess = function(event){
    };
}

function Add_Table3(){

    /////////////
    //para própposito de generar mes aleatorio dentro del rango.
    LoadDB();
    fIni = arrayValues1[0].fechaInicial;
    fFin = arrayValues1[0].fechaFinal;

    mesI = fIni.split("-")[1];
    mesF = fFin.split("-")[1];


    ///////////


    // Obtiene el valor de la primer pregunta de la encuesta: Edad
    valorEdad = document.querySelector('input[type="radio"][name="edad"]:checked');
    //-------------------------------------------------------------
    
    // Obtiene el valor de la segunda pregunta de la encuesta: Género
    valorGenero = document.querySelector('input[type="radio"][name="genero"]:checked');
    //-------------------------------------------------------------
    
    // Obtiene el valor de la tercera pregunta de la encuesta: Candidato
    valorCandidato = document.querySelector('input[type="radio"][name="candidato"]:checked');
    //-------------------------------------------------------------

    var transaction = db.transaction(["Table_3"], "readwrite");
    transaction.oncomplete = function(event) {
        console.log("All done!");
    };
    transaction.onerror = function(event) {
        console.error("Error");
    };
    var objectStore = transaction.objectStore("Table_3");
    
    varJson = {
        edad:valorEdad.value,
        genero:valorGenero.value,
        candidato:valorCandidato.value,
        mes: ((new Date).getMonth()+1)
        //en caso de Prueba con meses aleatorios, descomentar la siguiente línea.
        //mes: aleatorio(formatearMes(mesI),formatearMes(mesF))
    }

    var request = objectStore.add(varJson);
    request.onsuccess = function(event){
    };

};


function verificarCampos(){
    if(document.getElementById('usuario-admin').value != " " && document.getElementById('contraseña-admin').value != " "){
        document.getElementById("botón-acceder").disabled = false;
    }
};

function login(){

    bin_user = 0;
    bin_pass = 0;
    if(document.getElementById('usuario-admin').value == "admin"){
        bin_user = 1;
    }
    if( document.getElementById('contraseña-admin').value == "admin"){
        bin_pass = 1;
    }
    
    if (bin_user == 1 && bin_pass ==1){
        
        accessAdmin();
        document.getElementById('usuario-admin').value = "";
        document.getElementById('contraseña-admin').value = "";

        $('#ingreseCuenta').modal('hide');

        var myModal = new bootstrap.Modal(document.getElementById('ingresarFecha'), {
            keyboard: false
        });
        myModal.show();
        
    }else{

        if(bin_user == 1 && bin_pass==0){
            document.getElementById('msg').innerHTML = `* Contraseña incorrecta.`;
            document.getElementById('contraseña-admin').value = "";
            document.getElementById("botón-acceder").disabled = true;
        }else if(bin_user == 0 && bin_pass==1){
            document.getElementById('msg').innerHTML = `* Usuario incorrecto.`;
            document.getElementById('usuario-admin').value = "";
        }else{
            document.getElementById('msg').innerHTML = `* Usuario y contraseña incorrectas.`;
            document.getElementById('usuario-admin').value = "";
            document.getElementById('contraseña-admin').value = "";
        }
    }
};

function GetAllTables(){
    arrayValues1=[];
    arrayValues2=[];
    arrayValues3=[];
    arrayValues1Keys=[];
    arrayValues2Keys=[];
    arrayValues3Keys=[];
    arrayValues4Keys=[];

    var objectStore = db.transaction("Table_2").objectStore("Table_2");
    objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            cursor.continue();
            arrayValues2.push(cursor.value);
            arrayValues2Keys.push(cursor.key);
        }
    }

    var objectStore = db.transaction("Table_1").objectStore("Table_1");
    objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            cursor.continue();
            arrayValues1.push(cursor.value);
            arrayValues1Keys.push(cursor.key);
        }
    }

    var objectStore = db.transaction("Table_3").objectStore("Table_3");
    objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            arrayValues3.push(cursor.value);
            arrayValues3Keys.push(cursor.key);
            cursor.continue();
        }
    }

    var objectStore = db.transaction("Table_4").objectStore("Table_4");
    objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            arrayValues4Keys.push(cursor.key);
            cursor.continue();
        }
    }
}

function accessAdmin(){
    LoadDB();
    console.log(arrayValues1Keys.length);
    if(arrayValues1Keys.length != 0){
        document.getElementById("text").innerHTML=` ¡Ya existe un proceso de votación, si desea ingresar un nuevo proceso, se borrará automáticamente el anterior! `;
        
        document.getElementById("cuerpo-modal-fechas").hidden = true;
        document.getElementById("botón-fecha").innerHTML=`<button class="btn btn-primary button-acceder-admin" style="margin-top: 10px; position: relative; right: 165px;" data-bs-target="#seleccionarCandidatos" onclick="habilitarAgregarProceso(); eraseDataDB();">Nuevo proceso</button>`;
        document.getElementById("botón-fecha").style.borderTopColor = "white"

        document.getElementById("text").style.color = "red";
        console.log("Hay datos en el sistema aún");
    };
};

function eraseDataDB(){
    LoadDB();
    //Elimina la base de datos de la tabla 1
    var request = "";
    console.log(arrayValues1Keys);
    console.log(arrayValues3Keys);

    //Elimina la base de datos de la tabla 1
    var request = "";
    for(var i=0; i<arrayValues1Keys.length; i++){
        request = db.transaction(["Table_1"], "readwrite")
        .objectStore("Table_1")
        .delete(arrayValues1Keys[i]);
    }
    request.onsuccess = function(event) {
        // alert("¡Se ha eliminado con éxito!");
    };
    //----------------------------------------

    //Elimina la base de datos de la tabla 2
    var request = "";
    for(var i=0; i<arrayValues2Keys.length; i++){
        request = db.transaction(["Table_2"], "readwrite")
        .objectStore("Table_2")
        .delete(arrayValues2Keys[i]);
    }
    request.onsuccess = function(event) {
        // alert("¡Se ha eliminado con éxito!");
    };
    //----------------------------------------

    //Elimina la base de datos de la tabla 3
    var request = "";
    for(var i=0; i<arrayValues3Keys.length; i++){
        request = db.transaction(["Table_3"], "readwrite")
        .objectStore("Table_3")
        .delete(arrayValues3Keys[i]);
    }
    request.onsuccess = function(event) {
        // alert("¡Se ha eliminado con éxito!");
    };
    //----------------------------------------

    //Elimina la base de datos de la tabla 4
    var request = "";
    for(var i=0; i<arrayValues4Keys.length; i++){
        request = db.transaction(["Table_4"], "readwrite")
        .objectStore("Table_4")
        .delete(arrayValues4Keys[i]);
    }
    request.onsuccess = function(event) {
        // alert("¡Se ha eliminado con éxito!");
    };
    //----------------------------------------


}

function habilitarAgregarProceso(){
        document.getElementById("cuerpo-modal-fechas").hidden = false;
        document.getElementById("botón-fecha").innerHTML=`<button class="btn btn-primary button-acceder-admin" style="margin-top: 10px; position: relative; right: 195px;" data-bs-target="#seleccionarCandidatos" data-bs-toggle="modal" data-bs-dismiss="modal" onclick="Add_Table1(); enviarFecha()" id="enviarFechaProceso" disabled=true>Enviar</button>`;

        document.getElementById("cuerpo-modal-fechas").innerHTML=`
        <div class="inputs-datos-texto" style="margin-top: 20px">Ingrese la fecha de inicio del proceso de votación</div>
        <div class="input-group mb-3 inputs-divs">     
            <input type="date" id="fechaInicio" class="form-control inputs-datos" placeholder="Ingrese el nombre del candidato" aria-label="Username" aria-describedby="basic-addon1" style="margin-top: 10px;" onchange="verificarFecha();" onkeyup="verifFecha();">
        </div>
        <div class="inputs-datos-texto">Ingrese la fecha de fin del proceso de votación</div>
        <div class="input-group mb-3 inputs-divs">     
            <input type="date" id="fechaFinal" class="form-control inputs-datos" placeholder="Ingrese el nombre del candidato" aria-label="Username" aria-describedby="basic-addon1" style="margin-top: 10px;" onchange="verificarFecha();" onkeyup="verifFecha();">
        </div>
        <div id="mensajeCompararFechas" style="color:red">
        </div> `;
        
        document.getElementById("text").innerHTML=`<h5 class="modal-title" id="exampleModalToggleLabel2"  style="color: black">Ingrese las fechas de inicio y final del nuevo proceso de Votación </h5>`
}



function enviarFecha() {
    alert("Se ha enviado el dato con éxito.");
    document.getElementById('fechaInicio').value = "";
    document.getElementById('fechaFinal').value = "";
    document.getElementById("can-usuarios").innerHTML=` 0 `;
};

function enviarCandidato() {
    LoadDB();
    document.getElementById('candidato').value = "";
    
    alert("Se ha enviado el dato con éxito.");

    if (arrayValues2.length+1>=2){
        document.getElementById("cerrarCand").disabled=false;
    }

    if (arrayValues2.length+1>=4){
        document.getElementById("candidato").disabled=true;
        document.getElementById("enviarCand").disabled=true;
    }

    document.getElementById("can-usuarios").innerHTML=` ${arrayValues2.length+1} `;
}

function verificarFecha(){
    //console.log(document.getElementById("fechaInicio").value);
    //console.log(document.getElementById("fechaFinal").value);


    if ((document.getElementById("fechaInicio").value == "" && document.getElementById("fechaFinal").value == "") || (document.getElementById("fechaInicio").value != "" && document.getElementById("fechaFinal").value == "") || (document.getElementById("fechaInicio").value == "" && document.getElementById("fechaFinal").value != "")){
        document.getElementById("enviarFechaProceso").disabled = true;
    }

    else {
        if ((document.getElementById("fechaInicio").value != "" && document.getElementById("fechaFinal").value != "" ) && (document.getElementById('fechaInicio').value>=document.getElementById('fechaFinal').value)){
            document.getElementById("mensajeCompararFechas").innerHTML=`Esta fecha debe ser mayor a la fecha inicial.`; 
            document.getElementById("enviarFechaProceso").disabled = true;
        }
        else {
                document.getElementById("mensajeCompararFechas").innerHTML=``;
                document.getElementById("enviarFechaProceso").disabled = false;
        }
    } 
}


function verifFecha() {
    console.log(document.getElementById("fechaInicio").value)
    console.log(document.getElementById("fechaFinal").value)


    if ((document.getElementById("fechaInicio").value == "" && document.getElementById("fechaFinal").value == "") || (document.getElementById("fechaInicio").value != "" && document.getElementById("fechaFinal").value == "") || (document.getElementById("fechaInicio").value == "" && document.getElementById("fechaFinal").value != "")){
        document.getElementById("enviarFechaProceso").disabled = true;
    }

    else {
        if ((document.getElementById("fechaInicio").value != "" && document.getElementById("fechaFinal").value != "" ) && (document.getElementById('fechaInicio').value>=document.getElementById('fechaFinal').value)){
            document.getElementById("mensajeCompararFechas").innerHTML=`Esta fecha debe ser mayor a la fecha inicial.`; 
            document.getElementById("enviarFechaProceso").disabled = true;
        }
        else {
                document.getElementById("mensajeCompararFechas").innerHTML=``;
                document.getElementById("enviarFechaProceso").disabled = false;
        }
    } 
};

function verificarProceso () {
    LoadDB();
    if(arrayValues1.length == 0){
        document.getElementById("texto-confirmación2").innerHTML=` No existe un proceso de votación. Contáctese con los administradores para mayor información.`;
        document.getElementById("texto-confirmación2").style.color = "red";
        
        document.getElementById("botones-encuestas").innerHTML = `<div class="modal-body" style="color: black; text-align: center;" id="cuerpo-modal-subprocesos">
        <button class="btn btn-primary button-acceder-admin" id="sinSubprocesos" style="margin-top: 10px;" data-bs-dismiss="modal" aria-label="Close">Ok</button>
        </div>`
    }
    else {
        document.getElementById("botones-encuestas").innerHTML = " ";
        document.getElementById("texto-confirmación2").innerHTML=`<div id="texto-confirmación">
        <h5 class="modal-title" id="exampleModalToggleLabel" style="color: black; font-weight: bolder; font-size: 18px;">Seleccione el subproceso de votación disponible</h5>
        </div>`;}

       renderizarMeses();
}


function renderizarMeses(){
    mesesEncuesta = [];
    fInicio = arrayValues1[0].fechaInicial;
    fFinal = arrayValues1[0].fechaFinal;

    mesInicio = fInicio.split("-")[1];
    mesFin = fFinal.split("-")[1];

    for (i=mesInicio; i<=mesFin; i++){
        mesesEncuesta.push(obtenerMes(i));
    }   

    fechaActual= new Date()
    console.log("fechaActual", fechaActual);
    mesActual = fechaActual.getMonth()+1;
    mesLength = mesActual.toString().length;
    console.log("Longitud numero " , mesLength);
    if ( mesLength == 1) {
        mesActual="0"+mesActual;
    }
    console.log("mes Acutal " + mesActual);
    console.log("tipo del mes " +typeof(mesActual));
    mesActualN = obtenerMes(mesActual);
    console.log("nombre del mes actual" + mesActualN);

    Add_Table4(mesesEncuesta);
    
    for (i=0; i<mesesEncuesta.length; i++){
        console.log(mesesEncuesta[i]);
        if (mesActualN != mesesEncuesta[i]) {
            document.getElementById("botones-encuestas").innerHTML += `
            <button class="btn btn-primary button-acceder-admin" id="P${i+1}" style="margin-top: 10px; margin-left:auto; margin-right:auto; display:block; width: 110px;" value="${mesesEncuesta[i]}" disabled=true>${mesesEncuesta[i]}</button>`
        }

        else {
            document.getElementById("botones-encuestas").innerHTML += `
            <a href="encuesta.html" style="text-decoration:none"><button class="btn btn-primary button-acceder-admin" id="P${i+1}" style="margin-top: 10px; margin-left:auto; margin-right:auto; display:block; width: 110px;" value="${mesesEncuesta[i]}">${mesesEncuesta[i]}</button></a>`
        }  
    }
}

function Add_Table4(meses){
    
    var transaction = db.transaction(["Table_4"], "readwrite");
    transaction.oncomplete = function(event) {
        console.log("All done!");
    };
    transaction.onerror = function(event) {
        console.error("Error");
    };
    var objectStore = transaction.objectStore("Table_4");
    
    varJson = meses;

    var request = objectStore.add(varJson);
    request.onsuccess = function(event){
        console.log("Los meses se han agregado con éxito");
    };
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


//Función para hacer pruebas con meses Aleatorios
/*function aleatorio(minimo,maximo){
    return Math.floor(Math.random() * ((maximo+1)-minimo)+minimo);
}
*/

/*Función para hacer pruebas, para formatear meses en forma de "07".
function formatearMes(mesStr) {
    mesL = mesStr.toString().length;
    console.log("Longitud numero " , mesL);
    if ( (mesL == 2) && (mesStr.toString().charAt(0)=="0")) {
        console.log("hola")
        mesStr=mesStr.toString().charAt(1);
    }

    mesStr = parseInt(mesStr)
    return mesStr;
}
*/