import {
  FlatList,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import globalStyles from "@/assets/global-styles";
import { plus } from "@/assets/icons/plus";
import HorizontalDivider from "@/components/HorizontalDivider";
import RemovableListItem from "@/components/RemovableListItem";
import CardListEmptyState from "@/components/status/CardListEmptyState";
import ErrorScreen from "@/components/status/ErrorScreen";
import LoadingScreen from "@/components/status/LoadingScreen";
import SVG from "@/components/SVG";
import WrappedTextInput from "@/components/WrappedTextInput";
import { StorageContext } from "@/context/StorageContext";
import {
  BACKGROUND_COLOR_HIGHLIGHT,
  DECORATION_COLOR,
  FORM_CONTROL_SIZE,
  FORM_LABEL_HEIGHT,
  SPACING_MD,
  SPACING_SM,
} from "@/src/constants/style-constants";
import { TDeck } from "@/src/types";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Edit() {
  const [newCard, setNewCard] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [deck, setDeck] = useState<TDeck>();
  const [pageLoadError, setPageLoadError] = useState("");

  const { decks, saveDeck, isLoading } = useContext(StorageContext);
  const { idx } = useLocalSearchParams<{ idx: string }>();

  const addCard = useCallback(
    (newCard: string) => {
      if (!deck) return;

      if (!newCard.trim()) {
        setErrorMessage("Card cannot be empty");

        return;
      }

      const newCards = [...deck.cards, newCard.trim()];

      saveDeck(parseInt(idx), {
        name: deck.name,
        cards: newCards,
      });

      setNewCard("");
    },
    [deck, idx, saveDeck],
  );

  const removeCardAt = useCallback(
    (cardIndex: number) => {
      if (!deck) return;

      const newCards = deck.cards.filter((_, idx) => idx !== cardIndex);

      saveDeck(parseInt(idx), {
        name: deck.name,
        cards: newCards,
      });
    },
    [deck, idx, saveDeck],
  );

  useEffect(() => {
    if (isLoading) return;

    const deckIdx = parseInt(idx);
    const currentDeck = decks[deckIdx];

    if (!currentDeck || !currentDeck?.cards) {
      setPageLoadError("Failed to load Deck.");
    }

    setDeck(currentDeck);
  }, [decks, idx, isLoading]);

  if (isLoading) {
    return <LoadingScreen label="Loading Deck" />;
  }

  if (pageLoadError || !deck) {
    return <ErrorScreen message={pageLoadError} />;
  }

  return (
    <SafeAreaView style={globalStyles.backgroundGradient}>
      <View style={styles.listContainer}>
        <Text style={globalStyles.textLg}>{deck.name}</Text>

        <FlatList
          data={deck.cards}
          renderItem={({ item, index }) => (
            <RemovableListItem
              label={item}
              idx={index}
              removeItemAt={removeCardAt}
            />
          )}
          ListEmptyComponent={CardListEmptyState}
          ItemSeparatorComponent={HorizontalDivider}
        />
      </View>

      <KeyboardAvoidingView behavior="padding">
        <View style={styles.inputWrapper}>
          <WrappedTextInput
            label="Card Content"
            value={newCard}
            errorMessage={errorMessage}
            onChange={(text) => {
              setErrorMessage("");
              setNewCard(text);
            }}
          />

          <Pressable
            role="button"
            accessibilityLabel="Add Card"
            style={styles.addButton}
            onPress={() => addCard(newCard)}
          >
            <SVG icon={plus} width={24} height={24} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    maxWidth: "90%",
    paddingHorizontal: SPACING_MD,
    paddingVertical: SPACING_SM,
    marginInline: "auto",
    flex: 1,

    flexDirection: "column",
    alignItems: "center",
  },
  inputWrapper: {
    gap: SPACING_SM,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",

    borderTopWidth: 5,
    borderTopColor: DECORATION_COLOR,
    backgroundColor: BACKGROUND_COLOR_HIGHLIGHT,
    padding: SPACING_SM,
    paddingTop: SPACING_SM + FORM_LABEL_HEIGHT,
  },
  addButton: {
    ...globalStyles.buttonHighlight,
    marginBottom: FORM_LABEL_HEIGHT,
    height: FORM_CONTROL_SIZE,
  },
});
