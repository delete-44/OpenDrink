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
import { Deck } from "@/src/models/Deck";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useContext, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Edit() {
  const [newCard, setNewCard] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [pageLoadError, setPageLoadError] = useState("");

  const { decks, saveDeck, isLoading } = useContext(StorageContext);
  const { idx } = useLocalSearchParams<{ idx: string }>();

  const currentDeck = useMemo(() => {
    if (isLoading) return undefined;

    const deckIdx = parseInt(idx);
    const loadedDeck = decks[deckIdx];

    if (!loadedDeck?.cards) {
      setPageLoadError("Failed to load Deck.");
    }

    return loadedDeck;
  }, [decks, idx, isLoading]);

  // Callback for adding multiple cards to the deck; currently
  // used for inserting the default deck from the empty screen;
  // longer term could be useful for downloading/importing decks
  const addCards = useCallback(
    (newCards: string[]) => {
      if (!currentDeck) return;

      const modifiedCards = [...currentDeck.cards, ...newCards];

      let modifiedDeck = new Deck(
        currentDeck.name,
        modifiedCards,
        currentDeck.id,
      );
      saveDeck(parseInt(idx), modifiedDeck);
    },
    [currentDeck, idx, saveDeck],
  );

  const addCard = useCallback(
    (newCard: string) => {
      if (!currentDeck) return;

      if (!newCard.trim()) {
        setErrorMessage("Card cannot be empty");

        return;
      }

      const modifiedCards = [...currentDeck.cards, newCard.trim()];

      let modifiedDeck = new Deck(
        currentDeck.name,
        modifiedCards,
        currentDeck.id,
      );
      saveDeck(parseInt(idx), modifiedDeck);

      setNewCard("");
    },
    [currentDeck, idx, saveDeck],
  );

  const removeCardAt = useCallback(
    (cardIndex: number) => {
      if (!currentDeck) return;

      const modifiedCards = currentDeck.cards.filter(
        (_, idx) => idx !== cardIndex,
      );

      let modifiedDeck = new Deck(
        currentDeck.name,
        modifiedCards,
        currentDeck.id,
      );
      saveDeck(parseInt(idx), modifiedDeck);
    },
    [currentDeck, idx, saveDeck],
  );

  if (isLoading) {
    return <LoadingScreen label="Loading Deck" />;
  }

  if (pageLoadError || !currentDeck) {
    return <ErrorScreen message={pageLoadError} />;
  }

  return (
    <SafeAreaView style={globalStyles.backgroundGradient}>
      <View style={styles.listContainer}>
        <Text style={globalStyles.textLg}>{currentDeck.name}</Text>

        <FlatList
          data={currentDeck.cards}
          renderItem={({ item, index }) => (
            <RemovableListItem
              label={item}
              idx={index}
              removeItemAt={removeCardAt}
            />
          )}
          ListEmptyComponent={<CardListEmptyState addCards={addCards} />}
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
