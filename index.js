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


// générateur de cartes
const cardGenerator = (color, power) => {
  const specials = ['Valet', 'Dame', 'Roi', 'As', 'Joker'];

  const name = power <= 10 ? power : specials[power-11];

  return {
    color,
    power,
    name
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
