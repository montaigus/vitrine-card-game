import { Template } from 'meteor/templating'

// note: on utilise directement le symbole ici
// import { colors } from '../lib/rules.js';

import './card.html';

export const generateDomCard = (color, power) => {

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


  return cardHTML;
}

Template.card.helpers({
    showCard() {
        return generateDomCard(this.color, this.power);
    },
});
