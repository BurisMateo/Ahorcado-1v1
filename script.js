document.addEventListener('DOMContentLoaded', () => {

    const mostrarPalabra = document.querySelector('.mostrarPalabra');
    const teclado = document.querySelector('.teclado');
    let ahorcado = document.querySelector('.ahorcado-image');

    let palabra = [];
    let palabraElegida = [];
    let intentosRestantes = 6;

    const modal = document.getElementById('modalReglas');
    const btnEntendido = document.getElementById('btnEntendido');

    // 1. Verificamos si ya se mostró en ESTA sesión
    if (sessionStorage.getItem('reglasMostradas') === 'true') {
        modal.style.display = 'none'; // Si ya se mostró, lo ocultamos
    } else {
        modal.style.display = 'flex'; // Si es la primera vez en la pestaña, lo mostramos
    }

    // Función para cerrar el cartel
    btnEntendido.addEventListener('click', () => {
        modal.style.display = 'none';
        sessionStorage.setItem('reglasMostradas', 'true');
    });

    function iniciarJuego() {
        actualizarMostrarPalabra([]);
        establecerPalabra();
    }

    function actualizarMostrarPalabra(palabraActual) {
        mostrarPalabra.textContent = palabraActual.join(' ');
    }

    function establecerPalabra() {
        
        // Crear teclado
        const letras = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
        teclado.innerHTML = '';
        for (let letra of letras) {
            const boton = document.createElement('button');
            boton.textContent = letra;
            boton.addEventListener('click', () => {palabra.push(letra); actualizarMostrarPalabra(palabra)});
            teclado.appendChild(boton);
       }
        // Botón de borrar
        const botonBorrar = document.createElement('button');
        botonBorrar.textContent = '<';
        botonBorrar.style.backgroundColor = '#f44336';
        botonBorrar.addEventListener('click', () => {palabra.pop(); actualizarMostrarPalabra(palabra)});
        teclado.appendChild(botonBorrar);

        // Botón de confirmar
        const botonConfirmar = document.createElement('button');
        botonConfirmar.textContent = 'OK';
        botonConfirmar.style.backgroundColor = '#4CAF50';
        botonConfirmar.addEventListener('click', () => {comenzarAdivinanza()})
        teclado.appendChild(botonConfirmar);

        //Botón de reglas
        const botonReglas = document.createElement('button');
        botonReglas.textContent = '?';
        botonReglas.style.backgroundColor = '#2196F3';
        botonReglas.addEventListener('click', () => {modal.style.display = 'flex';});
        teclado.appendChild(botonReglas);
    }


    function comenzarAdivinanza() {
        if(palabra.length === 0){
            alert('Por favor, ingresa una palabra válida.');
            return;
        }
        if(palabra.length < 4 || palabra.length > 12){
            alert('La palabra debe tener entre 4 y 12 letras.');
            return;
        }
        //Guardar la palabra elegida
        palabraElegida = [...palabra]

        //Reemplazamos la palabra mostraeda por guiones
        for (let i = 0; i < palabraElegida.length; i++) {
            palabra[i] = '_';
        }
        
        actualizarAhorcado();
        actualizarMostrarPalabra(palabra);
        console.log('Palabra elegida:', palabraElegida);
        //Crear teclado para adivinar
        const letras = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
        teclado.innerHTML = '';
        for (let letra of letras) {
            const boton = document.createElement('button');
            boton.textContent = letra;
            boton.addEventListener('click', () => {manejarIntento(letra)});
            teclado.appendChild(boton);
       }
    }

    function manejarIntento(letra) {
        if (palabraElegida.includes(letra)) {
            // Letra correcta
            for (let i = 0; i < palabraElegida.length; i++) {
                if (palabraElegida[i] === letra) {
                    palabra[i] = letra;
                }
            }
            actualizarTeclado(letra, true);
            actualizarMostrarPalabra(palabra);
            if (!palabra.includes('_')) {
                intentosRestantes = 6;
                gameOver(true);
            }
        }else{
            // Letra incorrecta
            actualizarTeclado(letra, false);
            intentosRestantes--;
            actualizarAhorcado();
            if(intentosRestantes === 0){
                intentosRestantes = 6
                gameOver(false);
            }

        }
    }

    function actualizarTeclado(letra, esCorrecta) {
        
        //Buscar el boton y cambiar su color
        if(esCorrecta){
            const botones = teclado.querySelectorAll('button');
            botones.forEach(boton => {
                if(boton.textContent === letra){
                    boton.style.backgroundColor = '#4CAF50';
                    boton.style.color = '#000';
                    boton.disabled = true;
                }
            });
        }else{
            const botones = teclado.querySelectorAll('button');
            botones.forEach(boton => {
                if(boton.textContent === letra){
                    boton.style.backgroundColor = '#f44336';
                    boton.style.color = '#000';
                    boton.disabled = true;
                }
            });
        }
    }

    function actualizarAhorcado() {
        ahorcado.src = `./src/Ahorcado${intentosRestantes}.png`;
    }

    function gameOver(esVictoria) {
        teclado.innerHTML = '';
        if(esVictoria){
            ahorcado.src = `./src/AhorcadoWin.png`;
            mostrarPalabra.innerHTML = '¡Felicidades! Ganaste.<br>La palabra era: ' + palabraElegida.join('');
        }else{
            ahorcado.src = `./src/AhorcadoGameOver.png`;
            mostrarPalabra.innerHTML = 'Juego Terminado.<br>La palabra era: ' + palabraElegida.join('');
        }
        const reiniciarBtn = document.createElement('button');
        reiniciarBtn.textContent = 'Reiniciar';
        reiniciarBtn.style.backgroundColor = '#4CAF50';
        reiniciarBtn.style.marginTop = '20px';
        reiniciarBtn.style.width = '150px';
        reiniciarBtn.addEventListener('click', () => {location.reload()});
        teclado.appendChild(reiniciarBtn);

    }

    iniciarJuego();
})
