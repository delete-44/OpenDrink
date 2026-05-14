import { TDeckData } from "../models/Deck";

const DEFAULT_DECK = {
  name: "Default",
  cards: [
    // Basics
    "You drink",
    "You drink",
    "You drink",
    "You drink",
    "You drink",
    "Everybody drink once",
    "Everybody drink twice",
    "Everybody drink three times",
    "Finish your drink",

    // Nice ones
    "Take a selfie with the group!",
    "Say something nice about each other player",
    "Decide who is best-dressed. That person drinks",
    "Decide which player has the nicest smile. They drink",
    "Decide which player has the nicest eyes. They drink",

    // Ring of fire rules:
    "Ace: Waterfall;\n\nEverybody start drinking at the same time. Going clockwise around the room, you cannot stop drinking until the player before you stops",
    "2: You;\n\nYou pick somebody to drink",
    "3: Me;\n\nYou drink",
    "4: Female & nonbinary players drink",
    "5: Thumbmaster;\n\nYou are now the Thumbmaster. At any point, you can put your thumb on the table. The last player to also put their thumb on the table drinks",
    "6: Male & nonbinary players drink",
    "7: Heaven;\n\nYou are now the Heavenmaster. At any point you can raise your hand. The last player to also raise their hand drinks",
    "8: Mate;\n\nChoose another player. Whenever either of you drinks, the other must as well",
    "9: Rhyme;\n\nChoose a word. Going clockwise around the room, everybody says a word that rhymes with the starting word. Hesitate or fail to think of a rhyme, you drink",
    "10: Categories;\n\nChoose a category. Going clockwise around the room, everybody says a word that fits within this category. Hesitate or fail to think of a word, drink",
    "Jack:\n\nMake a rule",
    "Queen: Questionmaster;\n\nYou are now the Questionmaster. At any point, if any other player answers a question you ask, they drink",
    "King: Dirty drink;\n\nAll players pour some of their drink into a glass. You drink it",

    // Preset categories
    "Category: Cars;\n\nGoing clockwise around the room, everybody says a word that fits within this category. Hesitate or fail to think of a word, drink. You start",
    "Category: Planets;\n\nGoing clockwise around the room, everybody says a word that fits within this category. Hesitate or fail to think of a word, drink. You start",
    "Category: Airplanes;\n\nGoing clockwise around the room, everybody says a word that fits within this category. Hesitate or fail to think of a word, drink. You start",
    "Category: US States;\n\nGoing clockwise around the room, everybody says a word that fits within this category. Hesitate or fail to think of a word, drink. You start",
    "Category: Countries in Europe;\n\nGoing clockwise around the room, everybody says a word that fits within this category. Hesitate or fail to think of a word, drink. You start",
    "Category: Animals;\n\nGoing clockwise around the room, everybody says a word that fits within this category. Hesitate or fail to think of a word, drink. You start",
    "Category: Liquors;\n\nGoing clockwise around the room, everybody says a word that fits within this category. Hesitate or fail to think of a word, drink. You start",
    "Category: Colours;\n\nGoing clockwise around the room, everybody says a word that fits within this category. Hesitate or fail to think of a word, drink. You start",

    // Challenges
    "Give out a drink for every pressup you can do in 15 seconds",
    "Reveal your last web search or drink",
    "Say the alphabet backwards. Fail & drink",
    "Arm wrestle another player. Loser drinks",
    "Take a drink from the player on your left and from the player on your right",
    "Choose another player; take one sip from each others drinks",
    "Tell everyone who you think is the most attractive in the room or take a drink",
    "Flip a coin. Heads; you drink. Tails; everybody else drinks",
    "Make eye contact with another player and drink. If you break eye contact, finish it",
    "Act out a scene from a movie. The first person to guess it correctly picks someone to drink",
    "Race another player of your choice to finish a drink",
    "Rock-paper-scissors with another player; loser drinks",
    "Choose which two players look the most alike. They both drink",

    // Generics
    "Drink for every letter in your name",
    "Drink for every coffee you've had today",
    "Drink if you are wearing a belt",
    "Drink for every tattoo you have",
    "Everybody who is taller than you drinks",
    "Everybody with smaller hands than you drinks",
    "Drink for every other player you are attracted to",
    "Double or nothing; if you drank in the last round, you can give out double the drinks you had",
    "Take a shot with the player you've known for the longest",
    "First person to finish their drink can invent a rule",
    "The player opposite you drinks",
    "The person nearest to you drinks",
  ],
} as TDeckData;

export default DEFAULT_DECK;
