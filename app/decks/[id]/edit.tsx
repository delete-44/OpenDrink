import globalStyles from "@/assets/global-styles";
import CardList from "@/components/CardList";
import DeckTitlebar from "@/components/decks/DeckTitlebar";
import { useDeckFromLayout } from "@/context/DeckLayoutContext";
import { StorageContext } from "@/context/StorageContext";
import { Deck } from "@/src/models/Deck";
import { useCallback, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Edit() {
  const { updateDeck } = useContext(StorageContext);
  const currentDeck = useDeckFromLayout();

  const saveDeck = useCallback(
    async (name: string) => {
      const newDeck = new Deck(name, currentDeck.cards, currentDeck.id);
      await updateDeck(currentDeck.id, newDeck);
    },
    [currentDeck, updateDeck],
  );

  return (
    <SafeAreaView style={globalStyles.backgroundGradient}>
      <DeckTitlebar deck={currentDeck} saveDeckCallback={saveDeck} />

      <CardList deck={currentDeck} />
    </SafeAreaView>
  );
}
