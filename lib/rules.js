import { cardGenerator, moveCard } from './cards.js';

export let powers = [];
// export let players = [];
export const colors = ['♠', '♥', '♦', '♣'];
export let globalCards = {
  deck: [],
  game: [],
  waste: [],
};

// export let lesJoueurs = [];

// Sens de jeu : 1 ou -1
export let playingDirection = 1;


for(let i = 0; i <= 12; i++) {
  powers[i] = i+2;
}

export const distributeCards = (players, deck) => {
  if (players.length === 0) {
    console.warn('No player initialized!');
    
    return;
  }
  
  const initializedPlayers = players.map(player => {
    
    // distribue les vitrines et la main
    for (let i =1; i<=3; i++) {          
      // main
      moveCard(deck[0], deck, player.hand);
      // vitrine ouverte
      moveCard(deck[0], deck, player.openedWindow);
      // vitrine fermée
      moveCard(deck[0], deck, player.closedWindow);
    }
    
    return player;
  });
  
  const quiCommence = initializedPlayers[Math.floor(Math.random()*initializedPlayers.length)];
  
  quiCommence.playing = true;
  
  // change this
  // lesJoueurs = initializedPlayers;

  // playATurn(lesJoueurs.find(joueur => joueur.playing));
  return initializedPlayers;
}

export const playCards = (player, cards) => {

  // Test si les cartes sont toutes les mêmes
  if (find(card => !card.powerEquals(cards[0]))) {
    console.error('Vous avez sélectionné des cartes différentes');
    return;
  }

  const currentGameCard = globalCards.game[globalCards.length];

  if (!testAvailableCard(cards[0])) {
    console.warn('Il n\'est pas possible de jouer ça');
    return;
  }

  map(card => moveCard(card, player.hand, globalCards.game));

  cards[0].applySpecialPower();


  while (globalCards.deck.length !== 0 && player.hand.length < 3) {
    moveCard(globalCards.deck[0], globalCards.deck, player.hand);
  }

}

export const testAvailableCard = (card) => {
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


export const nextTurn = () => {
  // playingPlayer = lesJoueurs.find(joueur => joueur.playing);
  if (playingPlayer) playATurn(playingPlayer);
}

export const playATurn = (player) => {

  alert(player.name + ' : à vous de jouer !');

  if(!player.hand.find(card => testAvailableCard(card))) {
    alert('Vous ne pouvez jouer aucune carte');
    moveNumerousCards(globalCards.game, globalCards.game, player.hand)
    return;
  }

  let msg = 'Voici vos cartes : '; 
  player.hand.map(card => msg += card.power + ' de ' + card.color + ', ')
  /*msg += player.hand[0].power + ' de ' + player.hand[0].color;
  msg += ', ';
  msg += player.hand[1].power + ' de ' + player.hand[1].color;
  msg += ', ';
  msg += player.hand[2].power + ' de ' + player.hand[2].color;*/
  msg += '. Lesquelles prennez vous ? on note le numéro -1, séparés par /';

  const cardsText = prompt(msg);
  if (!cardsText) return;

  const cardsArray = cardsText.split('/');

  if (cardsArray.find(number => parseInt(number) > player.hand.length || parseInt(number) < 0)) {
    alert('Vous n\'avez pas rentré un nombre correct');
    return;
  }

  const cards = cardsArray.map(card => player.hand[parseInt(card)]);
  if (!cards) return;

  playCards(player, cards);

}




// générateur de joueur  
export const playerGenerator = (name) => {
  return {
    name,
    hand: [],
    openedWindow: [],
    closedWindow: [],
    playing: false,
  }
}

// générateur de deck
export const deckGenerator = () => {

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
  
  // mélange du deck
  const shuffledDeck = deckGenerated.sort(() => 0.5 - Math.random());
  
  return shuffledDeck;
};



// players = [playerGenerator('Roméo'), playerGenerator('Xavier')];
