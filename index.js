// initialization des constantes
const colors = ['♠', '♥', '♦', '♣'];

let powers = [];
let players = [];
let globalCards = {
  deck: [],
  game: [],
  waste: [],
};

let lesJoueurs = [];

// Sens de jeu : 1 ou -1
let playingDirection = 1;

for(let i = 0; i <= 12; i++) {
  powers[i] = i+2;
}

const specialPowers = {
  
  8: {
    specialPower() {
      // TODO passe le tour du joueur suivant
    }
  },
    
  9: {
    specialPower() {
      // change de sens de jeu
      playingDirection = playingDirection*-1;
    }
  },
    
  10: {
    specialPower() {
      moveNumerousCards(globalCards.game, globalCards.game, globalCards.waste);
      // TODO rejouer
    }
  },
    
  15: {
    specialPower() {
      // TODO donne la valeur de la carte du choix dans la vitrine cachée
      // TODO passe le tour
    }
  },
    
}

// générateur de cartes
const cardGenerator = (color, power) => {
  const specials = ['Valet', 'Dame', 'Roi', 'As', 'Joker'];

  const name = power <= 10 ? power : specials[power-11];

  return {
    color,
    power,
    name,
    // playableTest(previousCard) {
    //   const specialCard = specialPowers[power];
    //   
    //   // si la carte courante à un pouvoir special ET a une fonction de playableTest
    //   if(specialCard && specialCard.playableTest) {
    //     const playableTestResult = specialCard.playableTest(previousCard);
    //     
    //     if (!playableTestResult.continueTest) {
    //       return playableTestResult.value;
    //     }
    //   }
    //   // logique de base de comparaison des cartes
    //   
    // },
    applySpecialPower() {
      const specialCard = specialPowers[power];
      
      // the card is a special card
      if (specialCard && specialCard.specialPower) {
        return specialCard.specialPower();
      }
      // no special power
      return false;
    },
    equals(otherCard) {
      return this.color === otherCard.color && this.power === otherCard.power;
    },
    powerEquals(otherCard) {
      return this.power ===otherCard.power;
    }
  };
};

// générateur de joueur  
const playerGenerator = (name) => {
  return {
    name,
    cards: {
      hand: [],
      openedWindow: [],
      closedWindow: [],
    },
    playing: false,
  }
}

// générateur de deck
const deckGenerator = () => {

  let deckGenerated = [];

  // map sur chaque couleur pour créer ses cartes
  colors.map(color => {
    // map sur chaque pouvoir pour cette couleur
    const completePart = powers.map(power => {
      return deckGenerated.push(cardGenerator(color, power));
    });
  });

  // ajouter les jokers
  deckGenerated.push(cardGenerator('🤡', 15));
  deckGenerated.push(cardGenerator('🤡', 15));

  return deckGenerated;
};

const moveNumerousCards = (cards, from, to) => {
  if (typeof cards !== typeof []) return;
  const tempCards = cards.map(card => card);
  tempCards.map(card => moveCard(card, from, to));
}

const moveCard = (cardToMove, from, to) => {
    
  // infos de la carte
  const movingCard = {
    index: from.findIndex(card => card.equals(cardToMove)),
    value: from.find(card => card.equals(cardToMove)),
  };
  
  // carte introuvable
  if (movingCard.value === -1) {
    console.error('Carte non trouvée!!');
    
    return;
  }
  
  console.log(movingCard);
  
  // retirer cette carte de from
  from.splice(movingCard.index, 1);
  // mettre cette carte dans la liste to
  to.push(movingCard.value);
  
  return true;
}

// mélange du deck
globalCards.deck = deckGenerator().sort(() => 0.5 - Math.random());

// DEBUG

players = [playerGenerator('Roméo'), playerGenerator('Xavier')];


// initialisation du jeu
const distributeCards = () => {
  if (players.length === 0) {
    console.warn('No player initialized!');
    
    return;
  }
  
  console.table('new players', players);
  
  const initializedPlayers = players.map(player => {
    
    // distribue les vitrines et la main
    for (let i =1; i<=3; i++) {          
      // main
      moveCard(globalCards.deck[0], globalCards.deck, player.cards.hand);
      // vitrine ouverte
      moveCard(globalCards.deck[0], globalCards.deck, player.cards.openedWindow);
      // vitrine fermée
      moveCard(globalCards.deck[0], globalCards.deck, player.cards.closedWindow);
    }
    
    return player;
  });
  
  console.log('initializedPlayers', initializedPlayers);

  const quiCommence = initializedPlayers[Math.floor(Math.random()*initializedPlayers.length)];
  
  quiCommence.playing = true;
  
  lesJoueurs = initializedPlayers;

  playATurn(lesJoueurs.find(joueur => joueur.playing));
}

const playCards = (player, cards) => {

  // Test si les cartes sont toutes les mêmes
  if (cards.find(card => !card.powerEquals(cards[0]))) {
    console.error('Vous avez sélectionné des cartes différentes');
    return;
  }

  const currentGameCard = globalCards.game[globalCards.length];

  if (!testAvailableCard(cards[0])) {
    console.warn('Il n\'est pas possible de jouer ça');
    return;
  }

  cards.map(card => moveCard(card, player.cards.hand, globalCards.game));

  cards[0].applySpecialPower();


  while (globalCards.deck.length !== 0 && player.cards.hand.length < 3) {
    moveCard(globalCards.deck[0], globalCards.deck, player.cards.hand);
  }

}

const testAvailableCard = (card) => {
  if (globalCards.game.length === 0) return true;
  const currentGameCard = globalCards.game[globalCards.game.length-1]
  // Test du 2
  if (card.power === 2 || card.power === 15) return true;
  // Test du 7
  if (currentGameCard.power === 7 && card.power > 7) return false;
  // Test normal
  if (card.power < currentGameCard.power) return false;

  return true;
}

const generateDomCard = (color, power) => {
  let cardElement = document.createElement("div");

  let cardHTML = '<div class="card" data-power="' + power + '" data-color=' + color + '><div class="corner top"><span class="number">' + power + '</span><span>' + color + '</span></div>'
  if (power === 2 || (power >3 && power <= 10)) cardHTML += '<span class="suit top_left">' + color + '</span>';
  if (power === 2 || (power >3 && power <= 10)) cardHTML += '<span class="suit top_right">' + color + '</span>';  
  if (power === 9 || power === 10) cardHTML += '<span class="suit middle_top_left">' + color + '</span>';  
  if (power === 9 || power === 10) cardHTML += '<span class="suit middle_top_right">' + color + '</span>';
  if (power === 3 || power === 5 || power === 9) cardHTML += '<span class="suit middle_center">' + color + '</span>';
  if (power === 6 || power === 7 || power === 8) cardHTML += '<span class="suit middle_left">' + color + '</span>'
  if (power === 6 || power === 7 || power === 8) cardHTML += '<span class="suit middle_right">' + color + '</span>'
  if (power === 9 || power === 10) cardHTML += '<span class="suit middle_bottom_left">' + color + '</span>';
  if (power === 9 || power === 10) cardHTML += '<span class="suit middle_bottom_right">' + color + '</span>';
  if (power === 2 || (power >3 && power <= 10)) cardHTML += '<span class="suit bottom_left">' + color + '</span>';
  if (power === 2 || (power >3 && power <= 10)) cardHTML += '<span class="suit bottom_right">' + color + '</span>'; 
  if (power === 7 || power === 8 || power === 10) cardHTML += '<span class="suit middle_top_center">' + color + '</span>'; 
  if (power === 7 || power === 8 || power === 10) cardHTML += '<span class="suit middle_bottom_center">' + color + '</span>'; 
  if (power === 3) cardHTML += '<span class="suit bottom_center">' + color + '</span>';
  if (power === 3) cardHTML += '<span class="suit top_center">' + color + '</span>';
  cardHTML += '<div class="corner bottom"><span class="number">' + power + '</span><span>' + color + '</span></div></div>';

cardElement.innerHTML = cardHTML;
        return cardElement;
}



const putDomCard = (color, power) => {
  const domCard = generateDomCard(color, power);
  const carpet = document.getElementById('deck');
  carpet.prepend(domCard);
}

const nextTurn = () => {
  playingPlayer = lesJoueurs.find(joueur => joueur.playing);
  if (playingPlayer) playATurn(playingPlayer);
}

const playATurn = (player) => {

  alert(player.name + ' : à vous de jouer !');

  if(!player.cards.hand.find(card => testAvailableCard(card))) {
    alert('Vous ne pouvez jouer aucune carte');
    moveNumerousCards(globalCards.game, globalCards.game, player.cards.hand)
    return;
  }

  let msg = 'Voici vos cartes : '; 
  player.cards.hand.map(card => msg += card.power + ' de ' + card.color + ', ')
  /*msg += player.cards.hand[0].power + ' de ' + player.cards.hand[0].color;
  msg += ', ';
  msg += player.cards.hand[1].power + ' de ' + player.cards.hand[1].color;
  msg += ', ';
  msg += player.cards.hand[2].power + ' de ' + player.cards.hand[2].color;*/
  msg += '. Lesquelles prennez vous ? on note le numéro -1, séparés par /';

  const cardsText = prompt(msg);
  if (!cardsText) return;

  const cardsArray = cardsText.split('/');

  if (cardsArray.find(number => parseInt(number) > player.cards.hand.length || parseInt(number) < 0)) {
    alert('Vous n\'avez pas rentré un nombre correct');
    return;
  }

  const cards = cardsArray.map(card => player.cards.hand[parseInt(card)]);
  if (!cards) return;

  playCards(player, cards);

}

// --------------------------------------------
// Event Handlers
// --------------------------------------------



const boutonCommencer = document.querySelector('button[id="clickme"]');
boutonCommencer.addEventListener('click', distributeCards);

//Bouton ajouter joueur
const boutonAddPlayer = document.querySelector('button[id="addPlayer"]');
boutonAddPlayer.addEventListener('click', () => {
  const playerName = window.prompt('Entrez votre nom de joueur', '');
  if (playerName !== null) players.push(playerGenerator(playerName));
});

const boutonServir = document.querySelector('button[id="serveCard"]');
boutonServir.addEventListener('click', () => {
  if (confirm('T\'en veux ? J\'en ai !')) {
    let power = prompt('Quel puissance ?');
    power = parseInt(power);
    if (power > 1 && power < 16) putDomCard('♠', power);
  }
})

const boutonTurn = document.querySelector('button[id="nextTurn"]');
boutonTurn.addEventListener('click', nextTurn);
