// initialization des constantes
const colors = ['♠', '♥', '♦', '♣'];
let powers = [];
let players = [];
let globalPlaces = {
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
    places: {
      hand: [],
      openedWindow: [],
      closeedWindow: [],
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

// init deck
const completeDeck = deckGenerator();
// mélange du deck
let gameDeck = completeDeck.sort(() => 0.5 - Math.random());

// initialisation du jeu
const distributeCards = () => {
  if (players.length === 0) {
    console.warn('No player initialized!');
    
    return;
  }
  
  const initializedPlayers = players.map(player => {
    // distribue les vitrines et la main
    for (let i =1; i<=3; i++) {    
      player.hand.push(completeDeck.pop());
      player.vitrineOuverte.push(completeDeck.pop());
      player.vitrineFermee.push(completeDeck.pop());
    }
    
    return player;
  });
  
  console.table(initializedPlayers);

  const quiCommence = initializedPlayers[Math.floor(Math.random()*initializedPlayers.length)];
  console.log(quiCommence);
  
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
