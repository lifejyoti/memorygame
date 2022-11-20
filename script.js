
const tabs = document.querySelectorAll('[data-tab-target]')
const tabContents = document.querySelectorAll('[data-tab-content]')

let matched = 0;
let cardOne, cardTwo;
let disableDeck = false;
let numOfCards = 8; // Default value
var images = [];
var intervalIdFadeOutOne = 0;
var intervalIdFadeOutTwo = 0;

var intervalIdFadeInOne = 0;
var intervalIdFadeInTwo = 0;

var totalScore = 0;
var clicks = 0;

tabs.forEach(tab => {
	tab.addEventListener('click', () => {
		const target = document.querySelector(tab.dataset.tabTarget)
		
		tabContents.forEach(tabContent => {
			tabContent.classList.remove('active')
		})
		tabs.forEach(tab => {
			tab.classList.remove('active')
		})
		tab.classList.add('active')
		target.classList.add('active')
	})
})

var madeRandomSelectioncall = false;

$(document).ready(function () {
		madeRandomSelectioncall = true;
  
		if (typeof localStorage["highScore"] !== 'undefined') {

			$("#high_score").text('High score:' + " " + localStorage["highScore"]);
	
		   } else {
	
			localStorage["highScore"] = 0;
			$("#high_score").text('High score:' + " " + "0");
	
		   }

		// Preloaded images
		for (let i = 0; i < 24; i++)
		{
			// i+1 : the card image starts from index 1. i.e. : card_1.png
			var imagePath = "images/card_" + (i + 1) + ".png";
			images[i] = new Image();
			images[i].src = imagePath;
		}		
		
		getRandomCards(numOfCards);
    });

function addOption(){
  
  //getting player name and setting into session
  const player_name = $("#player_name").val();
  sessionStorage.setItem("player_name", player_name);
	
  //get option value selected by player and pass into function to get that number of randomly selected cards
  numOfCards = document.getElementById('num_cards').value;
  console.log('addOption: numOfCards = ' + numOfCards);
  sessionStorage.setItem("numOfCards", numOfCards);
  getRandomCards();
}
function shuffleCard() {
	totalScore = 0;
	clicks = 0;
    matched = 0;
    disableDeck = false;
    cardOne = cardTwo = "";
	
	//$("#high_score").text('High score: ' + (totalScore > 0 ? totalScore : 0));
	highscore(totalScore);

	$("#correct").text('Correct: ' + (clicks > 0 ? Math.round((matched / clicks)) * 100 : 0) + '%');
	
	var arr = new Array(numOfCards);
	var reqNumOfImages = numOfCards / 2;
	
	// Fill the array and shuffle it
	for (let i = 0; i < numOfCards; i++)
	{
		arr[i] = (i % reqNumOfImages);
	}
	arr.sort(() => Math.random() > 0.5 ? 1 : -1);
	
	const cards = document.querySelectorAll('.memory-card');
	
	cards.forEach((card, i) => {
        card.classList.remove("flip");
        let imgTag = card.querySelector(".front-card");
        imgTag.src = images[arr[i]].src;
		imgTag.style.opacity = 1;
		console.log(imgTag);
        card.addEventListener("click", flipCard);
		card.style.visibility = 'visible';
    });
}

// Keeps track of two flipped cards and sent these for matching.
function flipCard() {
		if(cardOne !== this && !disableDeck) {
        this.classList.add("flip");
        if(!cardOne) {
			cardOne = this;
            return;
        }
        cardTwo = this;
        disableDeck = true;
        let cardOneFrontImg = cardOne.querySelector(".front-card");
        let cardTwoFrontImg = cardTwo.querySelector(".front-card");
		
		let cardOneBackImg = cardOne.querySelector(".back-card");
        let cardTwoBackImg = cardTwo.querySelector(".back-card");
		
        matchCards(cardOneFrontImg, cardTwoFrontImg, cardOneBackImg, cardTwoBackImg);
    }
}

function fadeOutOne(img, isMatched)
{
	var opacityVal = Number(window.getComputedStyle(img).getPropertyValue("opacity"));
	
	if (opacityVal > 0)
	{
		opacityVal = opacityVal - 0.1;
		img.style.opacity = opacityVal;
	}
	else
	{
		clearInterval(intervalIdFadeOutOne);
		if (isMatched)
		{
			console.log("fadeOutOne : hide");
			cardOne.style.visibility = 'hidden';
			disableDeck = false;
		}
		else
		{
			console.log("fadeOutOne");
			cardOne.classList.remove("flip");
		}
		cardOne = "";
	}
}

function fadeOutTwo(img, isMatched)
{
	var opacityVal = Number(window.getComputedStyle(img).getPropertyValue("opacity"));
	
	if (opacityVal > 0)
	{
		opacityVal = opacityVal - 0.1;
		img.style.opacity = opacityVal;
	}
	else
	{
		clearInterval(intervalIdFadeOutTwo);
		
		if (isMatched)
		{
			console.log("fadeOutTwo : hide");
			cardTwo.style.visibility = 'hidden';
			disableDeck = false;
		}
		else
		{
			console.log("fadeOutTwo");
			cardTwo.classList.remove("flip");
		}
		cardTwo = "";
	}
}

function fadeInOne(img1, img3)
{
	var opacityVal = Number(window.getComputedStyle(img1).getPropertyValue("opacity"));
	
	if (opacityVal < 1)
	{
		opacityVal = opacityVal + 0.1;
		img1.style.opacity = opacityVal;
	}
	else
	{
		clearInterval(intervalIdFadeInOne);
		img3.style.opacity = opacityVal;
		disableDeck = false;
	}
}

function fadeInTwo(img2, img4)
{
	var opacityVal = Number(window.getComputedStyle(img2).getPropertyValue("opacity"));
	
	if (opacityVal < 1)
	{
		opacityVal = opacityVal + 0.1;
		img2.style.opacity = opacityVal;
	}
	else
	{
		clearInterval(intervalIdFadeInTwo);
		img4.style.opacity = opacityVal;
		disableDeck = false;
	}
}

//Function for highscore
function highscore(currentscore){

	if (currentscore > localStorage["highScore"]) {
		localStorage["highScore"] = currentscore;
	   }
	  
	   if (typeof localStorage["highScore"] !== 'undefined') {

		$("#high_score").text('High score:' + " " + localStorage["highScore"]);

	   }


}

// Match the two cards and increase the macthed count
function matchCards(img1, img2, img3, img4) {
	clicks++;	
    if(img1.src === img2.src) {
        matched++;
		totalScore = totalScore + 20;
        if(matched == numOfCards / 2 ) {
            setTimeout(() => {
                return shuffleCard();
            }, 1000);
        }

        cardOne.removeEventListener("click", flipCard);
        cardTwo.removeEventListener("click", flipCard);
		intervalIdFadeOutOne = setInterval(fadeOutOne, 50, img1, true);
		intervalIdFadeOutTwo = setInterval(fadeOutTwo, 50, img2, true);
    }
	else
	{
		totalScore = totalScore - 10;
		img3.style.opacity = 0;
		img4.style.opacity = 0;
		setTimeout(() => {
			intervalIdFadeOutOne = setInterval(fadeOutOne, 50, img1, false);
			intervalIdFadeOutTwo = setInterval(fadeOutTwo, 50, img2, false);
		}, 2000);
		
		setTimeout(() => {
			intervalIdFadeInOne = setInterval(fadeInOne, 50, img1, img3);
			intervalIdFadeInTwo = setInterval(fadeInTwo, 50, img2, img4);
		}, 2600);
	}
	
	highscore(totalScore);
	//$("#high_score").text('High score: ' + totalScore);
	$("#correct").text('Correct: ' + Math.round((matched / clicks) * 100) + '%');
	
}

function getRandomCards() {
	console.log('getRandomCards: selected number of cards are = ' + numOfCards);
	
	console.log('getRandomCards: madeRandomSelectioncall = ' + madeRandomSelectioncall);
	if(madeRandomSelectioncall){
		console.log('Clearing content under div class memoery game.');
		document.querySelector(".memory-game").innerHTML = "";
	}
	
	//add the img tags in HTML with front(default blank) and back images.
	for (let i=0; i < numOfCards; i++) {
		document.querySelector(".memory-game").innerHTML += '<div class="memory-card"> <img class="front-card" src="images/blank.png"/> <img class="back-card" src="images/back.png"/> </div>';
	}
	shuffleCard();

	//to get session stored player_name
	let player_name = sessionStorage.getItem("player_name");
	console.log('Player Name = ' + player_name);
	
	$("#player").text('Player: ' + player_name);
}