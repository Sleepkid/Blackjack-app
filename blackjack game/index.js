import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase,
         ref,
         set,
         update,
         onValue,} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";



        const firebaseConfig = {
            databaseURL:"https://blackjack-game-62774-default-rtdb.firebaseio.com/"
        }

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)
const referenceInDB = ref(database, "Blackjack")

let player = {
    name : "sleepkid",
    chips : 500
}
let cards = []
let sum = 0
let  hasBlackJack = false
let isAlive = false
let message = " "
let  messageEl= document.querySelector("#message-el")
let sumEl = document.querySelector("#sum-el")
let  cardsEl = document.querySelector("#cards-el")
let playerEl = document.querySelector("#player-el")


playerEl.textContent = `${player.name}: $${player.chips}`



function getRandomCard(){
 let randomNumer = Math.floor( Math.random() * 13 ) + 1
if (randomNumer > 10){
    return 10
   }else if (randomNumer === 1){
    return 11
   }else {
    return randomNumer
   }
}  
    function STARTGAME(){
         isAlive = true
         hasBlackJack = false
        let firstcard =  getRandomCard()
        let secondcard =  getRandomCard()
       cards =[firstcard , secondcard]
       sum = firstcard + secondcard
       saveGameState()
    renderGAME()
}

 function renderGAME(){
    cardsEl.textContent =  "Cards:" 
 for(let i = 0; i< cards.length; i ++){
    cardsEl.textContent += cards[i] + ", "
}
    sumEl.textContent ="sum:"  +  sum 
    if (sum <= 20 ){
        message = "Do you want to draw a new card? "
   }else if (sum === 21){
      message = " You've got Blackjack! "
       hasBlackJack = true
    }else {
      message = "You're out of the game! "
       isAlive = false
    }
    messageEl.textContent = message
    saveGameState()
 }



   function NEWCARD(){
    if (isAlive === true && hasBlackJack === false){
        let card = getRandomCard()
        sum += card
        cards.push(card)
        renderGAME()
    }

 }

 function saveGameState() {
    set(referenceInDB, {
        player: player,
        cards: cards,
        sum: sum,
        hasBlackJack: hasBlackJack,
        isAlive: isAlive,
        message: message
    })
        .then(() => {
            console.log("Game state saved successfully!");
        })
        .catch((error) => {
            console.error("Error saving game state:", error);
        });
}

onValue(referenceInDB, (snapshot) => {
    const data = snapshot.val();
    if (data) {
        console.log("Real-time update from Firebase:", data);
    }
});

window.STARTGAME = STARTGAME;
window.NEWCARD = NEWCARD;
 