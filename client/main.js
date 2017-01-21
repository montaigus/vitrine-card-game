import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Accounts } from 'meteor/accounts-base';
import '../lib/rules.js';
import '../lib/cards.js';

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY'
});

import './card.js';
import './main.html';
