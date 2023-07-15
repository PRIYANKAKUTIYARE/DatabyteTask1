class AudioController {
    constructor() {
        this.flipSound = new Audio('audio/mixkit-classic-click-1117.wav'); 
    }
    flip() {
        this.flipSound.play();
    }
}
class Matchingcards {
    constructor(totalTime, cards) {
        this.cardsArray = cards;
        this.totalTime = totalTime;
        this.timeRemaining = totalTime;
        this.timer = document.getElementById('time-remaining')
        this.ticker = document.getElementById('flips');
        this.audioController = new AudioController();
    }

    startGame() {
        this.totalClicks = 0;
        this.timeRemaining = this.totalTime;
        this.cardToCheck = null;
        this.matchedCards = [];
        this.busy = true;
        setTimeout(() => {
            // this.shuffleCards(this.cardsArray);
            this.countdown = this.startCountdown();
            this.busy = false;
        }, 500)
        this.hideCards();
        this.timer.innerText = this.timeRemaining;
        this.ticker.innerText = this.totalClicks;
    }
    startCountdown() {
        return setInterval(() => {
            this.timeRemaining--;
            this.timer.innerText = this.timeRemaining;
            if (this.timeRemaining === 0)
                this.gameOver();
        }, 1000);
    }
    gameOver() {
        clearInterval(this.countdown);
        document.getElementById('game-over-text').classList.add('visible');
    }
    victory() {
        clearInterval(this.countdown);
        document.getElementById('victory-text').classList.add('visible');
    }
    hideCards() {
        this.cardsArray.forEach(cardsset => {
            cardsset.classList.remove('visible');
            cardsset.classList.remove('matched');
        });
    }
    flipCard(cardsset) {
        if (this.canFlipCard(cardsset)) {
            this.audioController.flip();
            this.totalClicks++;
            this.ticker.innerText = this.totalClicks;
            cardsset.classList.add('visible');

            if (this.cardToCheck) {
                this.checkForCardMatch(cardsset);
            } else {
                this.cardToCheck = cardsset;
            }
        }
    }
    checkForCardMatch(cardsset) {
        if (this.getCardType(cardsset) === this.getCardType(this.cardToCheck))
            this.cardMatch(cardsset, this.cardToCheck);
        else
            this.cardMismatch(cardsset, this.cardToCheck);

        this.cardToCheck = null;
    }
    cardMatch(card1, card2) {
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        card1.classList.add('matched');
        card2.classList.add('matched');
        // this.audioController.match();
        if (this.matchedCards.length === this.cardsArray.length)
            this.victory();
    }
    cardMismatch(card1, card2) {
        this.busy = true;
        setTimeout(() => {
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false;
        }, 1000);
    }
    
    getCardType(cardsset) {
        return cardsset.getElementsByClassName('cardfrontFace')[0];
    }
    canFlipCard(cardsset) {
        return !this.busy && !this.matchedCards.includes(cardsset) && cardsset !== this.cardToCheck;
    }
}
if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

function ready() {
    let overlays = Array.from(document.getElementsByClassName('overlay-text'));
    let cards = Array.from(document.getElementsByClassName('cardsset'));
    let game = new Matchingcards(60, cards);

    overlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible');
            game.startGame();
        });
    });

    cards.forEach(cardsset => {
        cardsset.addEventListener('click', () => {      
            game.flipCard(cardsset);
        });
    });
}