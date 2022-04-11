$(document).ready(function() {

	// reset button will reset the table
	$('#reset').click(function() {
    	$('li').remove();
    	$('.playerScore p').remove();
    	$('.score h1').remove();
    	$('.dealersCards').css("height", "96px");
    });

    // start button will reset the table and start the game
    $('#start').click(function() {
    	$('li').remove();
    	$('.playerScore p').remove();
    	$('.score h1').remove();
        playGame();
    });

    //Player hit
    $('#hit').click(function() {
		playerHand.hitMe("p");
		result = firstResultCheck();
		inputUserScore(result);
		if(isNumeric(result)){
			viewConsole();
		} else {
			hideConsole();
			return;
		}
    });

    //Player stand
    $('#stand').click(function() {
    	while(dealerHand.score() < 17){
    		countingDealersCards = 0;
    		dealerHand.hitMe("d");
    	}
		result = finalResultCheck();
		$('.dealersCards li').remove();
		revealDealerHand(dealerHand);
		inputUserScore(result);
		hideConsole();
		return;
    });
});

//Card face finder
function deckBuilder(suit, figure){
	suits = {1: "clubs", 2: "diamonds", 3: "hearts", 4: "spades"};
	figures = {1: "ace", 2: "2", 3: "3", 4: "4", 5: "5", 6: "6", 7: "7", 8: "8", 9: "9", 10: "10", 11: "jack", 12: "queen", 13: "king"};
	var c = figures[figure] + "_of_" + suits[suit] + ".svg";
	return c;
}

//Deck_constructor
class deck {
    constructor() {
        this.create = function () {
            var cardArray = [];
            var i = 1;
            var j = 1;
            for (i = 1; i < 14; i++) {
                for (j = 1; j < 5; j++) {
                    cardArray.push(new Card(j, i));
                }
            }
            return shuffle(shuffle(cardArray));
        };
    }
}

//check The Deck Constructor
function deckChecker(){
	var array = new deck();
	var array = array.create();
	for(i = 0; i < 52; i++){
	  console.log(array[i].getNumber() + " of suit "+array[i].getSuit());
	}
}

//Deck suffling
function shuffle(a) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
	return a;
}

//Card Constructor
class Card {
    constructor(suit, number) {
        var CardSuit = suit;
        var CardNumber = number;
        this.getSuit = function () {
            return CardSuit;
        };
        this.getNumber = function () {
            return CardNumber;
        };
        this.getValue = function () {
            if (number === 1) {
                return 11;
            } else if (number > 9) {
                return 10;
            } else {
                return number;
            }
        };
    }
}

function revealDealerHand(hand){
	var hand = hand.getHand();
	for(i=0;i<hand.length;i++){
		$('.dealersCards ul').prepend('<li><a href="#"><img src="cards/' + deckBuilder(hand[i].getSuit(), hand[i].getNumber()) + '" /></a></li>');
	}
}

// Deal function provides players with cards
var deal = function(whos){
	var newCard = gameDeck.pop();
	if(whos == "d"){
		countingDealersCards+= 1;
	}
	if(whos == "p"){
		$('.playersCards ul').prepend('<li><a href="#"><img src="cards/' + deckBuilder(newCard.getSuit(), newCard.getNumber()) + '" /></a></li>');
	} else if(whos == "d" && countingDealersCards < 2) {
		$('.dealersCards').css("height", "");
		$('.dealersCards ul').prepend('<li><a href="#"><img src="cards/' + deckBuilder(newCard.getSuit(), newCard.getNumber()) + '" /></a></li>');
	} else if(whos == "d" && countingDealersCards == 2){
		$('.dealersCards ul').prepend('<li><a href="#"><img src="cards/back.jpg" /></a></li>');
	}
	return newCard;
};

//Hand Object is keeping the score
function Hand(whos, howManyCards){
	var who = whos;
	var cardArray = [];
		for(i = 0; i < howManyCards; i++) {
    cardArray[i] = deal(who);
	}
	this.getHand = function() {
    return cardArray;
	};

	this.score = function(){
		var handSum = 0;
		var numofaces = 0;
		for(i=0;i<cardArray.length;i++){
			handSum += cardArray[i].getValue();
			if(cardArray[i].getNumber() === 1){
        		numofaces+=1;
        	}
        }
    	if(handSum > 21 && numofaces!=0){
    		for(i=0;i<numofaces;i++){
    			if(handSum > 21){
    				handSum-=10;
    			}
    		}
    	}
        return handSum;
	};
	this.printHand = function(){
		var string = "";
		for(i=0;i<cardArray.length;i++){
			string = string + cardArray[i].getNumber() + " of suit "+cardArray[i].getSuit()+", ";
		}
		return string;
	};
	this.hitMe = function(whos){
    cardArray.push(deal(whos));
	this.getHand();
	};
}

var finalResultCheck = function(){
	var pS = playerHand.score();
	var dS = dealerHand.score();
	if(pS > 21){
      	if( dS >21){
          	return "Tie";
      	}
      	else{
      	return "Bust";
      	}
  	}
  	else if(dS>21){
    	return "Player Win";
 	}
  	else if(pS>dS){
      	return "Player Win";
  	}
  	else if(pS===dS){
      	return "Tie";
  	}
  	else{
      	return "Dealer win";
  	}
 };

 var inputUserScore = function(input){
 	$('.playerScore p').remove();
	$('.playerScore').prepend("<p>" + input + "</p>");
 }

 var firstResultCheck = function(){
	pS = playerHand.score();
	dS = dealerHand.score();
	if(pS > 21){
      	if( dS >21){
          	return "Tie";
      	}
      	else{
      	return "Bust";
      	}
  	}
  	else if(dS>21){
    	return "Dealer Win";
 	}
 	else if(pS===21){
 		return "BlackJack";
 	}
  	else{
      	return pS;
  	}
 };

var phaseOne = function(){
	dealerHand = new Hand("d", 2);
	playerHand = new Hand("p", 2);
	result = firstResultCheck();

	inputUserScore(result);
	if(isNumeric(result)){
		viewConsole();
	} else {
		hideConsole();
		return;
	}
};

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

var viewConsole = function(){
	$('.hitOrStandButtons').css("visibility", "");
}

var hideConsole = function(){
	$('.hitOrStandButtons').css("visibility", "hidden");
}

var playGame = function(){
	var gdeck = new deck();
	countingDealersCards = 0;
	// global variable
	gameDeck = gdeck.create();
	phaseOne();
	//playerHand = playAsUser();
	//dealerHand = playAsDealer();

	//declareWinner(playerHand, dealerHand);
};