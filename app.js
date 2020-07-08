"use strict";

// Keeps track of how many cards have been pulled from the deck
var numCardsPulled = 0;


// Player object
var player = {
        cards: [],
        score: 0,
        money: 100
    };


// Dealer object
var dealer = {
    cards: [],
    score: 0
};


document.getElementById("player-money").innerHTML = "Your money: $" + player.money;
document.getElementById("hit-button").disabled = true;
document.getElementById("stand-button").disabled = true;



// Deck object that creates deck array and has shuffle method
var deck = {
        deckArray: [],
        initialize: function () {
            var suitArray, rankArray, s, r;
            suitArray = ["Clubs", "Diamonds", "Hearts", "Spades"];
            rankArray = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];
            for (s = 0; s < suitArray.length; s += 1) {
                for (r = 0; r < rankArray.length; r += 1) {
                    this.deckArray[s * 13 + r] = {
                        rank: rankArray[r],
                        suit: suitArray[s]

                    };
                }
            }
        },
        shuffle: function () {
            var temp, i, d;
            for (i = 0; i < this.deckArray.length; i += 1) {
                rnd = Math.floor(Math.random() * this.deckArray.length);
                temp = this.deckArray[i];
                this.deckArray[i] = this.deckArray[d];
                this.deckArray[d] = temp;
            }
        }
    };

// Must be called to make and shuffle deck 
deck.initialize();
deck.shuffle();




// Decides if Ace value is 1 or 11 by seeing sum of hand
function getCardsValue(a) {
    var cardArray = [],
        sum = 0,
        i = 0,
        aceCount = 0;
    cardArray = a;
    for (i; i < cardArray.length; i += 1) {
        if (cardArray[i].rank === "J" || cardArray[i].rank === "Q" || cardArray[i].rank === "K") {
            sum += 10;
        } else if (cardArray[i].rank === "A") {
            sum += 11;
            aceCount += 1;
        } else {
            sum += cardArray[i].rank;
        }
    }
    while (aceCount > 0 && sum > 21) {
        sum -= 10;
        aceCount -= 1;
    }
    return sum;
}



//  Determines if the player should gain or lose money based on the end result of the game. 
//  It then either adds or subtracts the bet amount to the player’s money.
function bet(outcome) {
    var playerBet = document.getElementById("bet").valueAsNumber;
    if (outcome === "win") {
        player.money += playerBet;
    }
    if (outcome === "lose") {
        player.money -= playerBet;
    }
}



// Called at the end of every game and resets everything except the player's money
function resetGame() {
    numCardsPulled = 0;
    player.cards = [];
    dealer.cards = [];
    player.score = 0;
    dealer.score = 0;
    deck.initialize();
    deck.shuffle();
    document.getElementById("hit-button").disabled = true;
    document.getElementById("stand-button").disabled = true;
    document.getElementById("new-game-button").disabled = false;
}



// Function that checks who won
function endGame() {
    if (player.score === 21) {
        document.getElementById("message-board").innerHTML = "You win! You got blackjack!" + "<br>" + "click New Game to play again";
        bet("win");
        document.getElementById("player-money").innerHTML = "Your money: $" + player.money;
        resetGame();
    }
   else if (player.score > 21) {
        document.getElementById("message-board").innerHTML = "You went over 21! The dealer wins" + "<br>" + "click New Game to play again";
        bet("lose");
        document.getElementById("player-money").innerHTML = "Your money: $" + player.money;
        resetGame();
    }
    else if (dealer.score === 21) {
        document.getElementById("message-board").innerHTML = "You lost! Dealer got blackjack!" + "<br>" + "click New Game to play again";
        bet("lose");
        document.getElementById("player-money").innerHTML = "Your money: $" + player.money;
        resetGame();
    }
    else if (dealer.score > 21) {
        document.getElementById("message-board").innerHTML = "Dealer went over 21! You win!" + "<br>" + "click New Game to play again";
        bet("win");
        document.getElementById("player-money").innerHTML = "Your money: $" + player.money;
        resetGame();
    }
    else if (dealer.score >= 17 && player.score > dealer.score && player.score < 21) {
        document.getElementById("message-board").innerHTML = "You win! You beat the dealer." + "<br>" + "click New Game to play again";
        bet("win");
        document.getElementById("player-money").innerHTML = "Your money: $" + player.money;
        resetGame();
    }
    else if (dealer.score >= 17 && player.score < dealer.score && dealer.score < 21) {
        document.getElementById("message-board").innerHTML = "You lost! Dealer had the higher score." + "<br>" + "click New Game to play again";
        bet("lose");
        document.getElementById("player-money").innerHTML = "Your money: $" + player.money;
        resetGame();
    }
    else if (dealer.score >= 17 && player.score === dealer.score && dealer.score < 21) {
        document.getElementById("message-board").innerHTML = "You tied! " + "<br>" + "click New Game to play again";
        resetGame();
    }
    else if (player.money === 0) {
        document.getElementById("new-game-button").disabled = true;
        document.getElementById("hit-button").disabled = true;
        document.getElementById("stand-button").disabled = true;
        document.getElementById("message-board").innerHTML = "You lost!" + "<br>" + "You are out of money";
    }
}


// Outcome if dealer makes a draw
function dealerDraw() {
    
    dealer.cards.push(deck.deckArray[numCardsPulled]);
    dealer.score = getCardsValue(dealer.cards);
    // Learned this from video on JSON methods
    document.getElementById("dealer-cards").innerHTML = "Dealer Cards: " + JSON.stringify(dealer.cards);
    document.getElementById("dealer-score").innerHTML = "Dealer Score: " + dealer.score;
    numCardsPulled += 1;
}



// Resets all buttons
function newGame() {
    document.getElementById("new-game-button").disabled = false;
    document.getElementById("hit-button").disabled = false;
    document.getElementById("stand-button").disabled = false;
    document.getElementById("message-board").innerHTML = "";
    hit();
    hit();
    dealerDraw();
    endGame();
}



// Simulates drawing a card for the player
function hit() {
    player.cards.push(deck.deckArray[numCardsPulled]);
    player.score = getCardsValue(player.cards);
    document.getElementById("player-cards").innerHTML = "Player Cards: " + JSON.stringify(player.cards);
    document.getElementById("player-score").innerHTML = "Player Score: " + player.score;
    numCardsPulled += 1;
    if (numCardsPulled > 2) {
        endGame();
    }
}




// 
function check() {
    while (dealer.score < 17) {
        dealerDraw();
    }
    endGame();
}