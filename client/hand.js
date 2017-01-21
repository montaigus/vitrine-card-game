import { Templating } from 'meteor/templating';

// DEBUG
import { deckGenerator, distributeCards } from '../lib/rules';


import './hand.html';

Template.hand.onCreated(function() {
  this.autorun(() => {
    this.subscribe('users.current'); // données complète sur l'utilisateur courant
    
    // côté client: Meteor.userId() / Meteor.user()
    const currentUser = Meteor.user();
    
    let { hand = [] } = Meteor.user();
    
    // debug
    if(!hand.length) {
      const deck = deckGenerator();
      
      currentUser.hand = [];
      currentUser.openedWindow = [];
      currentUser.closedWindow = [];
      
      // test: distributeCards([array of users], current deck)
      const [ userWithCards ] = distributeCards([currentUser], deck);
      
      hand = userWithCards.hand;
    }
    
    this.hand = hand;
    
  });
})

Template.hand.helpers({
  playerHand() {
    // accède au this.hand dans un helper (voir au-dessus)
    return Template.instance().hand;
  }, 
})
