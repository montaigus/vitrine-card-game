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

for(let i = 0; i <= 13; i++) {
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
      // TODO changement de sens du tour
    }
  },
    
  10: {
    specialPower() {
      moveCard(globalCards.game, globalCards.game, globalCards.waste);
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

const moveCard = (cardToMove, from, to) => {
  
  // comment trouver la carte
  const cardSelector = card => card.color === cardToMove.color && card.power === cardToMove.power;
  
  // infos de la carte
  const movingCard = {
    index: from.findIndex(cardSelector),
    value: from.find(cardSelector),
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
}

const playCard = (player, cards) => {

  // Test si les cartes sont toutes les mêmes
  if (cards.filter(card => card.equals(cards[0])) !== cards.length) {
    console.error('Vous avez sélectionné des cartes différentes');
    return;
  }

  const currentGameCard = globalCards.game[globalCards.length];

  if (!testAvailableCard(card[0])) {
    console.warn('Il n\'est pas possible de jouer ça');
    return;
  }

  cards.map(card => moveCard(card, player.card.hand, globalCards.game));

  cards[0].applySpecialPower();

  if (globalCards.deck.length !== 0 && player.card.hand.length < 3) {
    moveCard(globalCards.deck[0], globalCards.deck, player.cards.hand);
  }

}

const testAvailableCard = (card) => {
  const currentGameCard = globalCards.game[globalCards.length]
  // Test du 2
  if (card.power === 2 || card.power === 15) return true;
  // Test du 7
  if (currentGameCard.power === 7 && card.power > 7) return false;
  // Test normal
  if (card.power < currentGameCard.power) return false;

  return true;
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
