//Alles aanspreken uit HTML
const startScherm = document.querySelector("#startScherm");
const spelScherm = document.querySelector("#spelScherm");
const tussenScherm = document.querySelector("#tussenScherm");
const gameOverScherm = document.querySelector("#gameOverScherm");
const gewonnenScherm = document.querySelector("#gewonnenScherm");

const startKnop = document.querySelector("#startKnop");
const terugNaarStartKnop = document.querySelector("#terugNaarStartKnop");
const opnieuwSpelenKnop = document.querySelector("#opnieuwSpelenKnop");

const levelWaarde = document.querySelector("#levelWaarde");
const opdrachtTekst = document.querySelector("#opdrachtTekst");
const scoreWaarde = document.querySelector("#scoreWaarde");
const timerVulling = document.querySelector("#timerVulling");

const tussenTitel = document.querySelector("#tussenTitel");
const behaaldLevel = document.querySelector("#behaaldLevel");
const gameOverScore = document.querySelector("#gameOverScore");
const gewonnenScore = document.querySelector("#gewonnenScore");

const fruitKnoppen = document.querySelectorAll(".fruit-knop");

//Opties van het spel
const echteFruiten = ["appel", "banaan", "druiven", "aardbei"];
const nepFruiten = ["kiwi", "framboos", "peer", "appelsien"];
const acties = ["klik", "enter", "spatie", "omhoog"];

let level = 1;
let score = 0;
let opdrachtInLevel = 0;
let huidigFruit = "";
let huidigeActie = "";
let isNepfruit = false;
let spelBezig = false;
let opdrachtKlaar = false;
let timer;
let tijd = 4;

//Scherm per scherm tonen
function toonScherm(naam) {
  startScherm.classList.add("verberg");
  spelScherm.classList.add("verberg");
  tussenScherm.classList.add("verberg");
  gameOverScherm.classList.add("verberg");
  gewonnenScherm.classList.add("verberg");

  if (naam === "start") startScherm.classList.remove("verberg");
  if (naam === "spel") spelScherm.classList.remove("verberg");
  if (naam === "tussen") tussenScherm.classList.remove("verberg");
  if (naam === "gameover") gameOverScherm.classList.remove("verberg");
  if (naam === "gewonnen") gewonnenScherm.classList.remove("verberg");
}

//Random kiezer
function randomItem(lijst) {
  return lijst[Math.floor(Math.random() * lijst.length)];
}

//Level & score
function updateInfo() {
  levelWaarde.textContent = level;
  scoreWaarde.textContent = score;
}

//Timer per level
function geefTijd() {
  if (level === 1) return 4;
  if (level === 2) return 3;
  return 2.2;
}

//Zorgt dat knoppen werken
function resetFruit() {
  fruitKnoppen.forEach(function (knop) {
    knop.classList.remove("doelwit");
    knop.classList.remove("succes");
  });
}

//Opdracht maker
function maakOpdracht() {
  isNepfruit = Math.random() < 0.2;

  if (isNepfruit) {
    huidigFruit = randomItem(nepFruiten);
  } else {
    huidigFruit = randomItem(echteFruiten);
  }

  huidigeActie = randomItem(acties);

  if (huidigeActie === "klik") opdrachtTekst.textContent = "Klik op de " + huidigFruit;
  if (huidigeActie === "enter") opdrachtTekst.textContent = "Druk op enter voor de " + huidigFruit;
  if (huidigeActie === "spatie") opdrachtTekst.textContent = "Druk op spatie voor de " + huidigFruit;
  if (huidigeActie === "omhoog") opdrachtTekst.textContent = "Druk op pijltje omhoog voor de " + huidigFruit;

  resetFruit();

  if (isNepfruit === false) {
    fruitKnoppen.forEach(function (knop) {
      if (knop.dataset.fruit === huidigFruit) {
        knop.classList.add("doelwit");
      }
    });
  }
}

//Timer stop
function stopTimer() {
  clearInterval(timer);
}

//Timer start
function startTimer() {
  stopTimer();
  tijd = geefTijd();
  timerVulling.style.width = "100%";

  timer = setInterval(function () {
    tijd = tijd - 0.1;

    if (tijd < 0) {
      tijd = 0;
    }

    let breedte = (tijd / geefTijd()) * 100;
    timerVulling.style.width = breedte + "%";

    if (tijd <= 0) {
      stopTimer();

      if (opdrachtKlaar === false) {
        if (isNepfruit === true) {
          juist();
        } else {
          gameOver();
        }
      }
    }
  }, 100);
}

//Nieuw level start
function nieuweRonde() {
  opdrachtKlaar = false;
  maakOpdracht();
  startTimer();
}

//Antwoord juist
function juist() {
  if (opdrachtKlaar) return;

  opdrachtKlaar = true;
  stopTimer();
  score++;
  opdrachtInLevel++;
  updateInfo();

  fruitKnoppen.forEach(function (knop) {
    if (knop.dataset.fruit === huidigFruit) {
      knop.classList.add("succes");
    }
  });

  if (opdrachtInLevel === 5) {
    if (level === 3) {
      setTimeout(gewonnen, 700);
    } else {
      setTimeout(tussen, 700);
    }
  } else {
    setTimeout(nieuweRonde, 600);
  }
}

//Tussenscherm levels
function tussen() {
  toonScherm("tussen");
  tussenTitel.textContent = "Level " + level + " gehaald!";

  setTimeout(function () {
    level++;
    opdrachtInLevel = 0;
    updateInfo();
    toonScherm("spel");
    nieuweRonde();
  }, 1400);
}

//Game over
function gameOver() {
  spelBezig = false;
  stopTimer();
  behaaldLevel.textContent = level;
  gameOverScore.textContent = score;
  toonScherm("gameover");
}

//Gewonnen
function gewonnen() {
  spelBezig = false;
  stopTimer();
  gewonnenScore.textContent = score;
  toonScherm("gewonnen");
}

//Start spel opnieuw
function startSpel() {
  level = 1;
  score = 0;
  opdrachtInLevel = 0;
  huidigFruit = "";
  huidigeActie = "";
  isNepfruit = false;
  spelBezig = true;
  opdrachtKlaar = false;

  resetFruit();
  stopTimer();
  updateInfo();
  toonScherm("spel");
  nieuweRonde();
}

//Fruit klik juist of fout
fruitKnoppen.forEach(function (knop) {
  knop.addEventListener("click", function () {
    if (!spelBezig || opdrachtKlaar) return;

    if (isNepfruit === true || huidigeActie !== "klik") {
      gameOver();
      return;
    }

    if (knop.dataset.fruit === huidigFruit) {
      juist();
    } else {
      gameOver();
    }
  });
});

//fruit knop juist of fout
document.addEventListener("keydown", function (event) {
  if (!spelBezig || opdrachtKlaar) return;

  if (event.code !== "Enter" && event.code !== "Space" && event.code !== "ArrowUp") {
    return;
  }

  event.preventDefault();

  if (isNepfruit === true) {
    gameOver();
    return;
  }

  if (event.code === "Enter" && huidigeActie === "enter") juist();
  else if (event.code === "Space" && huidigeActie === "spatie") juist();
  else if (event.code === "ArrowUp" && huidigeActie === "omhoog") juist();
  else gameOver();
});

//Functie van knoppen
startKnop.addEventListener("click", startSpel);
terugNaarStartKnop.addEventListener("click", function () {
  toonScherm("start");
});
opnieuwSpelenKnop.addEventListener("click", function () {
  toonScherm("start");
});

//startscherm bij openen site
toonScherm("start");