function changeContent(clickedButton, contentID)
{
    let buttons = document.querySelectorAll(".tabs button");
    let contents = document.querySelectorAll(".content");

    buttons.forEach((button) => {
        button.disabled = false;
    });

    contents.forEach((elem) => {
        elem.style.display = "none";
    })
    
    if(contentID == "play") document.querySelector(".mosca").style.display = "none";
    else document.querySelector(".mosca").style.display = "block";

    document.getElementById(contentID).style.display = "block";
    clickedButton.disabled = true;
}

//Reajustar tamaño de texto en función del tamaño de containerBack
window.onload = function() {
  let cont = document.querySelectorAll('.containerBack');
  

  //Función que ajusta el texto
  function ajustarTexto() {

    cont.forEach(function (contenedor) {

        let text = contenedor.querySelectorAll('p');
        let scale = Math.min((contenedor.clientWidth/text.clientWidth));
        text.forEach(function (elem){
        elem.style.fontSize = Math.round(scale);
        });
    });
  }

  //recoger evento lanzado
  let observer = new ResizeObserver(() => {
    ajustarTexto();
  });

  //lanzar evento si containerBack cambia de tamañoSS
  observer.observe(cont[0]);
}

let moscaAudio = new Audio('assets/audiosWeb/mosca.mp3');
function moveFly(mosca)
{
  moscaAudio.load();
  moscaAudio.play();

  let width = window.innerWidth;
  let height = window.innerHeight;
  let tam = mosca.getBoundingClientRect();

  mosca.style.left = `${Math.random()* (width - tam.width)}px`;
  mosca.style.top = `${Math.random()* (height - tam.height)}px`;
}