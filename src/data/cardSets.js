// src/data/cardSets.js

// Import all card images

import balloon from "/assets/cardsets/emojis/balloon_1F388.svg";
import cake from "/assets/cardsets/emojis/cake_1F382.svg";
import cat from "/assets/cardsets/emojis/cat_1F431.svg";
import dog from "/assets/cardsets/emojis/dog_1F436.svg";
import dragon from "/assets/cardsets/emojis/dragon_1F409.svg";
import octopus from "/assets/cardsets/emojis/octopus_1F419.svg";
import pheonix from "/assets/cardsets/emojis/pheonix_1F426-200D-1F525.svg";
import rofl from "/assets/cardsets/emojis/rofl_1F923.svg";
import smiley from "/assets/cardsets/emojis/smiley_1F60A.svg";
import unicorn from "/assets/cardsets/emojis/unicorn_1F984.svg";

import carina from "/assets/cardsets/constellations/Carina.svg";
import cassiopeia from "/assets/cardsets/constellations/Cassiopeia.svg";
import centaurus from "/assets/cardsets/constellations/Centaurus.svg";
import crux from "/assets/cardsets/constellations/Crux.svg";
import cygnus from "/assets/cardsets/constellations/Cygnus.svg";
import leo from "/assets/cardsets/constellations/Leo.svg";
import orion from "/assets/cardsets/constellations/Orion.svg";
import scorpius from "/assets/cardsets/constellations/Scorpius.svg";
import ursaMajor from "/assets/cardsets/constellations/UrsaMajor.svg";
import ursaMinor from "/assets/cardsets/constellations/UrsaMinor.svg";

import apple from "/assets/cardsets/halloween/apple_1F34F.svg";
import bat from "/assets/cardsets/halloween/bat_1F987.svg";
import blackCat from "/assets/cardsets/halloween/black_cat_1F408.svg";
import broom from "/assets/cardsets/halloween/broom_1F9F9.svg"
import ghost from "/assets/cardsets/halloween/ghost_1F47B.svg";
import jackO from "/assets/cardsets/halloween/jack_o_lantern_1F383.svg";
import skull from "/assets/cardsets/halloween/skull_1F480.svg";
import spiderWeb from "/assets/cardsets/halloween/spider_web_1F578.svg";
import vampire from "/assets/cardsets/halloween/vampire_1F9DB.svg";
import womanZombie from "/assets/cardsets/halloween/woman_zombie_1F9DF.svg";

import Brighella from "/assets/cardsets/commedia_dell_arte/Brighella.svg";
import Capitano_Spavento from "/assets/cardsets/commedia_dell_arte/Capitano_Spavento.svg";
import Columbine from "/assets/cardsets/commedia_dell_arte/Columbine.svg";
import Coviello from "/assets/cardsets/commedia_dell_arte/Coviello.svg";
import Dr_Balanzone from "/assets/cardsets/commedia_dell_arte/Dr_Balanzone.svg";
import Harlequin from "/assets/cardsets/commedia_dell_arte/Harlequin.svg";
import Isabella from '/assets/cardsets/commedia_dell_arte/Isabella.svg';
import Pantalone from "/assets/cardsets/commedia_dell_arte/Pantalone.svg";
import Pulcinella from "/assets/cardsets/commedia_dell_arte/Pulcinella.svg";
import Scaramuccia from "/assets/cardsets/commedia_dell_arte/Scaramuccia.svg";

import bug from "/assets/cardsets/online_security/noun-bug-8066790.svg";
import cookie from "/assets/cardsets/online_security/noun-cookie-183404.svg";
import dictionary from "/assets/cardsets/online_security/noun-dictionary-7725641.svg";
import encryption from "/assets/cardsets/online_security/noun-encryption-8102780.svg";
import firewall from "/assets/cardsets/online_security/noun-firewall-6330441.svg";
import https from "/assets/cardsets/online_security/noun-https-2146882.svg";
import message_encryption from "/assets/cardsets/online_security/noun-message-encryption-4451055.svg";
import phishing from "/assets/cardsets/online_security/noun-phishing-8128817.svg";
import trojan_horse from "/assets/cardsets/online_security/noun-trojan-horse-6887412.svg"
import two_factor_authentication from "/assets/cardsets/online_security/noun-two-factor-authentication-7759990.svg";


// Define card sets
const cardSets = [
  {
    id: "0",
    name: "Emojis",
    image: smiley,
    Cards: [
      { cardName: "balloon", cardImage: balloon },
      { cardName: "cake", cardImage: cake },
      { cardName: "cat", cardImage: cat },
      { cardName: "dog", cardImage: dog },
      { cardName: "dragon", cardImage: dragon },
      { cardName: "octopus", cardImage: octopus },
      { cardName: "pheonix", cardImage: pheonix },
      { cardName: "rofl", cardImage: rofl },
      { cardName: "smiley", cardImage: smiley },
      { cardName: "unicorn", cardImage: unicorn },
    ],
  },
  {
    id: "1",
    name: "Constellations",
    image: carina,
    Cards: [
      { cardName: "carina", cardImage: carina },
      { cardName: "cassiopeia", cardImage: cassiopeia },
      { cardName: "centaurus", cardImage: centaurus },
      { cardName: "crux", cardImage: crux },
      { cardName: "cygnus", cardImage: cygnus },
      { cardName: "leo", cardImage: leo },
      { cardName: "orion", cardImage: orion },
      { cardName: "scorpius", cardImage: scorpius },
      { cardName: "ursaMajor", cardImage: ursaMajor },
      { cardName: "ursaMinor", cardImage: ursaMinor }
    ],
  },
  {
    id: "2",
    name: "Hallowe'en",
    image: jackO,
    Cards: [
      { cardName: "apple", cardImage: apple },
      { cardName: "bat", cardImage: bat },
      { cardName: "black cat", cardImage: blackCat },
      { cardName: "broom", cardImage: broom },
      { cardName: "ghost", cardImage: ghost },
      { cardName: "jack o'lantern", cardImage: jackO },
      { cardName: "skull", cardImage: skull },
      { cardName: "spider's web", cardImage: spiderWeb },
      { cardName: "vampire", cardImage: vampire },
      { cardName: "woman zombie", cardImage: womanZombie }
    ]
  },
  {
    id: "3",
    name: "Commedia dell'arte",
    image: Harlequin,
    Cards: [
      { cardName: "brighella", cardImage: Brighella },
      { cardName: "capitano_spavento", cardImage: Capitano_Spavento },
      { cardName: "columbine", cardImage: Columbine },
      { carnName: "coviello", cardImage: Coviello },
      { cardName: "dr_balanzone", cardImage: Dr_Balanzone },
      { cardName: "harlequin", cardImage: Harlequin },
      { cardName: "isabella", cardImage: Isabella },
      { cardName: "pantalone", cardImage: Pantalone },
      { cardName: "pulcinella", cardImage: Pulcinella },
      { cardName: "scaramuccia", cardImage: Scaramuccia }
    ]
  },
  {
    id: "4",
    name: "Online Security",
    image: cookie,
    Cards: [
      { cardName: "bug", cardImage: bug },
      { cardName: "cookie", cardImage: cookie },
      { cardName: "dictionary", cardImage: dictionary },
      { cardName: "encryption", cardImage: encryption },
      { cardName: "firewall", cardImage: firewall },
      { cardName: "https", cardImage: https },
      { cardName: "message-encryption", cardImage: message_encryption },
      { cardName: "phishing", cardImage: phishing },
      { cardName: "trojan-horse", cardImage: trojan_horse },
      { cardName: "two-factor-authentication", cardImage: two_factor_authentication }
    ]
  }
];

export default cardSets;
