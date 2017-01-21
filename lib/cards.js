



// initialization des export constantes
export const specialPowers = {
  
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
export const cardGenerator = (color, power) => {
  const specials = ['Valet', 'Dame', 'Roi', 'As', 'Joker'];

  const name = power <= 10 ? power : specials[power-11];

  return {
    color,
    power,
    name,
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

export const moveNumerousCards = (cards, from, to) => {
  if (typeof cards !== typeof []) return;
  const tempCards = cards.map(card => card);
  tempCards.map(card => moveCard(card, from, to));
}

export const moveCard = (cardToMove, from, to) => {
    
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
  
  // retirer cette carte de from
  from.splice(movingCard.index, 1);
  // mettre cette carte dans la liste to
  to.push(movingCard.value);
  
  return true;
}