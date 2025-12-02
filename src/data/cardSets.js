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

import barn_owl from "/assets/cardsets/birds/barn_owl.svg";
import blackbird from "/assets/cardsets/birds/blackbird.svg";
import cockerel from "/assets/cardsets/birds/cockerel.svg";
import cormorant from "/assets/cardsets/birds/cormorant.svg";
import goose from "/assets/cardsets/birds/goose.svg";
import kingfisher from "/assets/cardsets/birds/kingfisher.svg";
import mallard from "/assets/cardsets/birds/mallard.svg";
import red_kite from "/assets/cardsets/birds/red_kite.svg";
import robin from "/assets/cardsets/birds/robin.svg";
import sea_gull from "/assets/cardsets/birds/sea_gull.svg";

import christmas_tree from "/assets/cardsets/christmas/christmas_tree_1F384.svg";
import church from "/assets/cardsets/christmas/church_26EA.svg";
import donkey from "/assets/cardsets/christmas/donkey_1FACF.svg";
import mother_feeding_baby from "/assets/cardsets/christmas/mother_feeding_baby_1F931.svg";
import party_face from "/assets/cardsets/christmas/party_face_1F973.svg";
import santa_claus from "/assets/cardsets/christmas/santa_claus_1F385.svg";
import snowman from "/assets/cardsets/christmas/snowman_2603.svg";
import star from "/assets/cardsets/christmas/star_2B50.svg";
import turkey from "/assets/cardsets/christmas/turkey_1F983.svg";
import wrapped_gift from "/assets/cardsets/christmas/wrapped_gift_1F381.svg";

// Define card sets
const cardSets = [
  {
    id: "0",
    nameKey: "emojis",
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
    nameKey: "hallowe'en",
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
    id: "2",
    nameKey: "christmas",
    image: christmas_tree,
    Cards: [
      { cardName: "christmas_tree", cardImage: christmas_tree },
      { cardName: "church", cardImage: church },
      { cardName: "donkey", cardImage: donkey },
      { cardName: "mother_feeding_baby", cardImage: mother_feeding_baby },
      { cardName: "party_face", cardImage: party_face },
      { cardName: "santa_claus", cardImage: santa_claus },
      { cardName: "snowman", cardImage: snowman },
      { cardName: "star", cardImage: star },
      { cardName: "turkey", cardImage: turkey },
      { cardName: "wrapped_gift", cardImage: wrapped_gift }
    ]
  }, 
   {
    id: "3",
    nameKey: "birds",
    image: red_kite,
    Cards: [
      { cardName: "barn_owl", cardImage: barn_owl },
      { cardName: "blackbird", cardImage: blackbird },
      { cardName: "cockerel", cardImage: cockerel },
      { cardName: "cormorant", cardImage: cormorant },
      { cardName: "goose", cardImage: goose },
      { cardName: "kingfisher", cardImage: kingfisher },
      { cardName: "mallard", cardImage: mallard },
      { cardName: "red_kite", cardImage: red_kite },
      { cardName: "robin", cardImage: robin },
      { cardName: "sea_gull", cardImage: sea_gull }
    ]
  }
];

export default cardSets;
