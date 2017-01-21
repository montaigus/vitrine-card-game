import { Meteor } from 'meteor/meteor';
import { playerGenerator } from '../lib/rules.js';
import '../lib/cards.js';

// extend the user when created
Accounts.onCreateUser(user => {
  const gameData = playerGenerator(user.username);
  
  return {
    ...user,
    ...gameData,
  };
});


Meteor.publish('users.current', function() {
  // id de l'utilisateur connecté côté serveur: this.userId
  return Meteor.users.find({_id: this.userId}, {fields: {password: 0}});
});
