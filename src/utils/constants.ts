export const TAROT_DECK = [
  // Major Arcana
  { value: "fool", label: "The Fool" },
  { value: "magician", label: "The Magician" },
  { value: "high_priestess", label: "The High Priestess" },
  { value: "emperess", label: "The Empress" },
  { value: "emperor", label: "The Emperor" },
  { value: "hierophant", label: "The Hierophant" },
  { value: "lovers", label: "The Lovers" },
  { value: "chariot", label: "The Chariot" },
  { value: "strength", label: "Strength" },
  { value: "hermit", label: "The Hermit" },
  { value: "wheel_of_fortune", label: "Wheel of Fortune" },
  { value: "justice", label: "Justice" },
  { value: "hanged_man", label: "The Hanged Man" },
  { value: "death", label: "XIII Arcane" },
  { value: "temperance", label: "Temperance" },
  { value: "devil", label: "The Devil" },
  { value: "tower", label: "The Tower" },
  { value: "star", label: "The Star" },
  { value: "moon", label: "The Moon" },
  { value: "sun", label: "The Sun" },
  { value: "judgement", label: "Judgement" },
  { value: "world", label: "The World" },
  // Minor Arcana
  ...["Cups", "Pentacles", "Swords", "Wands"].flatMap((suit, i) =>
    Array.from({ length: 14 }, (_, j) => {
      let cardName;
      switch (j) {
        case 0:
          cardName = "Ace";
          break;
        case 10:
          cardName = "Page";
          break;
        case 11:
          cardName = "Knight";
          break;
        case 12:
          cardName = "Queen";
          break;
        case 13:
          cardName = "King";
          break;
        default:
          cardName = (j + 1).toString();
      }
      return {
        value: `${cardName.toLowerCase()}_of_${suit.toLowerCase()}`,
        label: `${cardName} of ${suit}`,
      };
    })
  ),
];
