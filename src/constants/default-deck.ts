import { CardPermittedFields } from "../repositories/CardRepository";
import { TDeckData } from "../types";

export const DEFAULT_CARDS = [
  // Basics
  { content: "You drink" },
  { content: "You drink" },
  { content: "You drink" },
  { content: "You drink" },
  { content: "You drink" },
  { content: "Choose somebody else to drink" },
  { content: "Choose somebody else to drink" },
  { content: "Choose somebody else to drink" },
  { content: "Everybody drink once" },
  { content: "Everybody drink twice" },
  { content: "Everybody drink three times" },
  { content: "Finish your drink" },
  { content: "The player opposite you drinks" },
  { content: "The person nearest to you drinks" },
  { content: "Everybody except you drinks" },
  { content: "Everybody with the same drink as you drinks" },
  { content: "Everybody with a different drink to you drinks" },
  { content: "Everybody pass their drinks to the left and have a drink" },
  { content: "Pick another player and take a drink from their drink" },
  { content: "Drink something you haven't drunk today" },

  // Nice ones
  { content: "Take a selfie with the group!" },
  { content: "Say something nice about each other player" },
  { content: "Share something you like about yourself" },
  { content: "Everybody must compliment you, or drink" },
  { content: "Tell the group about something nice you did recently" },
  { content: "Tell the group about something you are looking forward to" },
  { content: "Decide who is best-dressed. That person drinks" },
  { content: "Decide which player has the nicest smile. They drink" },
  { content: "Decide which player has the nicest eyes. They drink" },
  { content: "Hug every person in the room, or drink" },

  // Ring of fire rules
  {
    content:
      "Ace: Waterfall;\n\nEverybody start drinking at the same time. Going clockwise around the room, you cannot stop drinking until the player before you stops",
  },
  { content: "2: You;\n\nYou pick somebody to drink" },
  { content: "3: Me;\n\nYou drink" },
  { content: "4: Female & nonbinary players drink" },
  {
    content:
      "5: Thumbmaster;\n\nYou are now the Thumbmaster. At any point, you can put your thumb on the table. The last player to also put their thumb on the table drinks",
  },
  { content: "6: Male & nonbinary players drink" },
  {
    content:
      "7: Heaven;\n\nYou are now the Heavenmaster. At any point you can raise your hand. The last player to also raise their hand drinks",
  },
  {
    content:
      "8: Mate;\n\nChoose another player. Whenever either of you drinks, the other must as well",
  },
  {
    content:
      "9: Rhyme;\n\nChoose a word. Going clockwise around the room, everybody says a word that rhymes with the starting word. Hesitate or fail to think of a rhyme, you drink",
  },
  {
    content:
      "10: Categories;\n\nChoose a category. Going clockwise around the room, everybody says a word that fits within this category. Hesitate or fail to think of a word, drink",
  },
  { content: "Jack:\n\nMake a rule" },
  {
    content:
      "Queen: Questionmaster;\n\nYou are now the Questionmaster. At any point, if any other player answers a question you ask, they drink",
  },
  {
    content:
      "King: Dirty drink;\n\nAll players pour some of their drink into a glass. You drink it",
  },

  // Preset categories
  {
    content:
      "Category: Cars;\n\nGoing clockwise around the room, everybody says a word that fits within this category. Hesitate or fail to think of a word, drink. You start",
  },
  {
    content:
      "Category: Planets;\n\nGoing clockwise around the room, everybody says a word that fits within this category. Hesitate or fail to think of a word, drink. You start",
  },
  {
    content:
      "Category: Airplanes;\n\nGoing clockwise around the room, everybody says a word that fits within this category. Hesitate or fail to think of a word, drink. You start",
  },
  {
    content:
      "Category: US States;\n\nGoing clockwise around the room, everybody says a word that fits within this category. Hesitate or fail to think of a word, drink. You start",
  },
  {
    content:
      "Category: Countries in Europe;\n\nGoing clockwise around the room, everybody says a word that fits within this category. Hesitate or fail to think of a word, drink. You start",
  },
  {
    content:
      "Category: Animals;\n\nGoing clockwise around the room, everybody says a word that fits within this category. Hesitate or fail to think of a word, drink. You start",
  },
  {
    content:
      "Category: Liquors;\n\nGoing clockwise around the room, everybody says a word that fits within this category. Hesitate or fail to think of a word, drink. You start",
  },
  {
    content:
      "Category: Colours;\n\nGoing clockwise around the room, everybody says a word that fits within this category. Hesitate or fail to think of a word, drink. You start",
  },
  {
    content:
      "Category: Train Stations;\n\nGoing clockwise around the room, everybody says a word that fits within this category. Hesitate or fail to think of a word, drink. You start",
  },
  {
    content:
      "Category: Counties;\n\nGoing clockwise around the room, everybody says a word that fits within this category. Hesitate or fail to think of a word, drink. You start",
  },
  {
    content:
      "Category: Human Organs;\n\nGoing clockwise around the room, everybody says a word that fits within this category. Hesitate or fail to think of a word, drink. You start",
  },
  {
    content:
      "Category: Fruits;\n\nGoing clockwise around the room, everybody says a word that fits within this category. Hesitate or fail to think of a word, drink. You start",
  },
  {
    content:
      "Category: Vegetables;\n\nGoing clockwise around the room, everybody says a word that fits within this category. Hesitate or fail to think of a word, drink. You start",
  },
  {
    content:
      "Category: Cuts of meat;\n\nGoing clockwise around the room, everybody says a word that fits within this category. Hesitate or fail to think of a word, drink. You start",
  },
  {
    content:
      "Category: Players in this game;\n\nGoing clockwise around the room, everybody says a word that fits within this category. Hesitate or fail to think of a word, drink. You start",
  },

  // Challenges
  { content: "Give out a drink for every pressup you can do in 15 seconds" },
  { content: "Reveal your last web search or drink" },
  { content: "Say the alphabet backwards. Fail & drink" },
  { content: "Say your guilty pleasure or drink" },
  {
    content:
      "Share your ideal pizza toppings. Everybody who would eat it, drinks",
  },
  {
    content: "Show everybody the last five photos on your phone or drink twice",
  },
  {
    content:
      "Pick a word to ban for the rest of the game. Anybody who says this word drinks",
  },
  {
    content:
      "Take a drink from the player on your left and from the player on your right",
  },
  { content: "Choose another player; take one sip from each others drinks" },
  {
    content:
      "Tell everyone who you think is the most attractive in the room or take a drink",
  },
  {
    content:
      "Make eye contact with another player and drink. If you break eye contact, finish it",
  },
  {
    content:
      "Act out a scene from a movie. The first person to guess it correctly picks someone to drink",
  },
  {
    content:
      "Act out an animal. The first person to guess it correctly picks someone to drink",
  },
  { content: "Choose which two players look the most alike. They both drink" },
  {
    content:
      "Tell a joke. If anybody laughs, they drink.\n\nIf nobody laughs, finish your drink",
  },
  {
    content:
      "Invent a new walk and demonstrate it to the group.\n\nAlso drink!",
  },
  {
    content:
      "Conduct a photoshoot, with the player to your left as your model.\n\nIf you are happy with their performance, they can give out 5 drinks. Otherwise, they finish their drink",
  },
  {
    content:
      "Choose a new name for the player opposite you. Every time somebody forgets to use this, they drink",
  },
  {
    content: "Read your last sent message aloud. Otherwise take a drink",
  },
  { content: "Take a drink without using your hands" },
  { content: "Give another player a 30 second foot massage or take a drink" },
  {
    content: "Give another player a 30 second shoulder massage or take a drink",
  },
  { content: "Give another player a 30 second back massage or take a drink" },
  { content: "Last person to clap their hands drinks" },
  { content: "Last person to touch the floor drinks" },
  { content: "Last person to stand up drinks" },
  { content: "Last person to touch the table drinks" },
  { content: "Last person to touch a wall drinks" },
  { content: "Last person to touch you drinks" },
  { content: "Last person to raise their drink drinks" },
  { content: "Last person to touch their toes drinks" },
  { content: "Last person to put a finger on their nose drinks" },
  { content: "The next person to make eye contact with you drinks" },
  { content: "Take of three items of clothing or take three drinks" },
  { content: "Call someone you like and ask them out, or finish your drink" },
  { content: "Do whatever the player on your left says. Else, drink" },
  { content: "Do whatever the player on your right says. Else, drink" },
  {
    content:
      "Without looking, guess what time it is now. Drink if you aren't within 5 minutes",
  },
  {
    content:
      "Give the player opposite you an order. If they don't fulfil it, they drink",
  },
  { content: "Do the worm or drink twice" },
  {
    content:
      "Give your phone to the player to your left and let them text a contact of their choice. Or finish your drink",
  },
  {
    content:
      "Until your next turn, you are not allowed to laugh. Every time you laugh, you drink",
  },
  {
    content:
      "Close your eyes and let the other players give you a secret drink. If you guess it correctly, everybody else drinks",
  },
  {
    content:
      "Close your eyes and try to guess who another player is just by touching them. If you guess it correctly, everybody else drinks",
  },
  { content: "Demonstrate how you would flirt with someone or take a drink" },
  {
    content:
      "Imitate another player. The first person to correctly guess who it is picks someone to drink",
  },
  {
    content:
      "Pick someone and guess the colour of their underwear. If you get it right, they drink. Otherwise, you drink",
  },

  // Personal trivia
  { content: "Drink for every letter in your first name" },
  { content: "Drink for every letter in your last name" },
  {
    content:
      "Drink for every letter in your middle name(s).\n\nIf you have no middle name, give out three drinks",
  },
  { content: "Drink for every coffee you've had today" },
  { content: "Drink if you are wearing black" },
  { content: "Drink if you are wearing blue" },
  { content: "Drink if you are wearing a belt" },
  { content: "Drink for every tattoo you have" },
  { content: "Drink for every bone you've broken" },
  { content: "Drink for every piercing you have" },
  { content: "Drink for every instrument you can play" },
  { content: "The player with the most cash on them drinks" },
  { content: "Drink for every pet you have" },
  { content: "Dog owners drink" },
  { content: "Cat owners drink" },
  { content: "Reptile owners drink" },
  { content: "Bird owners drink" },
  { content: "Everybody who is taller than you drinks" },
  { content: "Everybody who is shorter than you drinks" },
  { content: "Everybody who is younger than you drinks" },
  { content: "Everybody who is wearing makeup drinks" },
  { content: "Everybody in a relationship drinks" },
  { content: "Everybody single drinks" },
  { content: "Everybody who is older than you drinks" },
  { content: "Everybody with smaller hands than you drinks" },
  { content: "Drink for every other player you are attracted to" },
  { content: "Take a shot with the player you've known for the longest" },
  { content: "Smokers drink" },
  { content: "Everybody with facial hair drinks" },
  { content: "The person most recently on a boat drinks" },
  { content: "The person most recently on a plane drinks" },
  { content: "The person most recently in a car drinks" },
  { content: "The person most recently on a bus drinks" },
  { content: "The person most recently on a train drinks" },
  { content: "The person most recently to ride a bicycle drinks" },
  { content: "The person most recently used the bathroom drinks" },
  { content: "The person most recently showered gives out two drinks" },
  { content: "The owner of the device you are playing on drinks" },
  { content: "The person to have most recently posted on social media drinks" },
  { content: "If you're older than 25, drink" },
  { content: "If you're younger than 25, drink" },
  { content: "If you've ever kissed one of the other players, drink" },
  {
    content:
      "Anybody on their phone right now drinks\n\n(Including the person reading this!)",
  },
  { content: "The player with the lowest phone battery drinks" },
  {
    content: "Oldest player drinks",
  },
  {
    content: "Everybody with a drivers license drinks",
  },
  {
    content: "Everybody with dyed hair drinks",
  },
  {
    content:
      "Tell another player a lie and a truth. If they figure out which is which correctly, they give out a drink",
  },
  { content: "Drink if you have a dating app on your phone" },
  { content: "If your best friend is playing, you must both drink" },
  { content: "Share a secret with the person on your left or drink twice" },

  // Votes
  {
    content:
      "Everybody vote on the person who is most likely to get arrested. That person drinks",
  },
  {
    content:
      "Everybody vote on the person who is most likely to get in a fight. That person drinks",
  },
  {
    content:
      "Everybody vote on the person who is most likely to win a fight. That person drinks",
  },
  {
    content:
      "Everybody vote on the person who is most likely to be in bed by 9. That person drinks",
  },
  {
    content:
      "Everybody vote on the person who is most likely to get a promotion in the next year. That person drinks",
  },
  {
    content:
      "Everybody vote on the person who is most likely to get kissed tonight. That person drinks",
  },
  {
    content:
      "Everybody vote on the person who is most likely to get shushed in a library. That person drinks",
  },
  {
    content:
      "Everybody vote on the person who is most likely to wake up hungover. That person drinks",
  },
  {
    content:
      "Everybody vote on the person who is most likely to become famous. That person drinks",
  },
  {
    content:
      "Everybody vote on the person who is most likely to get pulled over. That person drinks",
  },
  {
    content:
      "Everybody vote on the person with the worst music taste. That person drinks",
  },
  {
    content:
      "Everybody vote on the person who is most likely to spend money on something stupid. That person drinks",
  },
  {
    content:
      "Everybody vote on the person who is most likely to argue with a stranger. That person drinks",
  },
  {
    content:
      "Everybody vote on the person who they want to drink. That person drinks",
  },
  {
    content:
      "Everybody vote on who they think the smartest player is. That person drinks",
  },
  {
    content:
      "Everybody vote on the person who they think is the most sober. That person drinks",
  },
  {
    content:
      "Everybody vote on the person who is the worst at holding their booze. That person drinks",
  },
  {
    content:
      "Everybody vote on the person who is most likely to be thorwn out of a bar. That person drinks",
  },

  // Games
  {
    content:
      "Drink as many sips as you want. You can then give out double this number",
  },
  {
    content:
      "Drink as many sips as you want. You can then give out double this number",
  },
  {
    content:
      "Drink as many sips as you want. You can then give out double this number",
  },
  {
    content:
      "Double or nothing; if you drank in the last round, you can give out double the drinks you had",
  },
  {
    content:
      "Double or nothing; if you drank in the last round, you can give out double the drinks you had",
  },
  {
    content:
      "Anybody who drank in the last round gets to pick someone to drink",
  },

  {
    content:
      "Double or nothing; if you drank in the last round, you can give out double the drinks you had",
  },
  {
    content:
      "Zip/Zap\n\nStarting with you, pass the motion around the group - Zip to go left, Zap to go right. The first person to break the chain drinks.",
  },
  { content: "Flip a coin. Heads; you drink. Tails; everybody else drinks" },
  { content: "Race another player of your choice to finish a drink" },
  { content: "Rock-paper-scissors with another player; loser drinks" },
  { content: "Thumb war another player; loser drinks" },
  { content: "Arm wrestle another player. Loser drinks" },
  {
    content:
      "On the count of three, everybody says a colour from the rainbow. Whoever says the same as you drinks",
  },
  {
    content:
      "On the count of three, everybody says a number from 1-5 inclusive. Whoever says the same as you drinks",
  },
  {
    content:
      "On the count of three, everybody holds up a thumbs-up or thumbs-down. Whoever has the same as you drinks",
  },
  { content: "First person to finish their drink can invent a rule" },
  {
    content:
      "Ask a trivia question to a player of your choice. If they get it wrong, they drink",
  },
  {
    content:
      "Have a staring contest with a player of your choice; loser drinks",
  },
  { content: "Spin a bottle. Whoever it lands on drinks" },
  {
    content:
      "Play a round of truth or dare, starting with you and going clockwise around the room",
  },
  {
    content:
      "Play a round of never have I ever, starting with you and going clockwise around the room",
  },

  // Catchup mechanics
  { content: "The player with the weakest drink, drinks" },
  { content: "The most sober player drinks" },
  { content: "The most sober player finishes their drink" },
  { content: "The most tipsy player gets to give out 5 drinks" },
] as CardPermittedFields[];

const DEFAULT_DECK = {
  name: "Default",
} as TDeckData;

export default DEFAULT_DECK;
