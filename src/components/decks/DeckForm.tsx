import globalStyles from "@/assets/global-styles";
import DeckTitlebar from "@/src/components/decks/DeckTitlebar";
import { Deck } from "@/src/models/Deck";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CardList from "../CardList";

type DeckFormProps = {
  deck: Deck;
  saveDeckCallback: (name: string) => Promise<void>;
};

export default function DeckForm({ deck, saveDeckCallback }: DeckFormProps) {
  return (
    <SafeAreaView style={globalStyles.backgroundGradient}>
      <DeckTitlebar saveDeckCallback={saveDeckCallback} deck={deck} />

      {deck.id ? <CardList /> : <View style={{ flex: 1 }} />}
    </SafeAreaView>
  );
}
