import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import globalStyles from "@/assets/global-styles";
import { plus } from "@/assets/icons/plus";
import HorizontalDivider from "@/src/components/HorizontalDivider";
import RemovableListItem from "@/src/components/RemovableListItem";
import CardListEmptyState from "@/src/components/status/CardListEmptyState";
import SVG from "@/src/components/SVG";
import WrappedTextInput from "@/src/components/WrappedTextInput";
import {
  BACKGROUND_COLOR_HIGHLIGHT,
  DECORATION_COLOR,
  FORM_CONTROL_SIZE,
  FORM_LABEL_HEIGHT,
  SPACING_LG,
  SPACING_SM,
} from "@/src/constants/style-constants";
import { useCallback, useContext, useState } from "react";
import { CardContext } from "../context/CardContext";
import { CardPermittedFields } from "../repositories/CardRepository";

export default function CardList() {
  const [newCard, setNewCard] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { isLoading, cards, createCard, createManyCards, deleteCard } =
    useContext(CardContext);

  // Callback for adding multiple cards to the deck; currently
  // used for inserting the default deck from the empty screen;
  // longer term could be useful for downloading/importing decks
  const addCards = useCallback(
    async (newCards: CardPermittedFields[]) => {
      try {
        await createManyCards(newCards);
      } catch (e: any) {
        setErrorMessage(e.message);
      }
    },
    [createManyCards],
  );

  const addCard = useCallback(
    async (content: string) => {
      try {
        await createCard({ content });
        setNewCard("");
      } catch (e: any) {
        setErrorMessage(e.message);
      }
    },
    [createCard],
  );

  const removeCard = useCallback(
    async (cardId: number) => {
      try {
        await deleteCard(cardId);
        setNewCard("");
      } catch (e: any) {
        setErrorMessage(e.message);
      }
    },
    [deleteCard],
  );

  return (
    <>
      <View style={styles.listContainer}>
        <FlatList
          data={cards}
          renderItem={({ item }) => (
            <RemovableListItem
              label={item.content}
              removeItemCb={() => removeCard(item.id)}
            />
          )}
          ListEmptyComponent={
            isLoading ? (
              <ActivityIndicator
                color="#fff"
                accessibilityLabel="Loading Cards"
              />
            ) : (
              <CardListEmptyState addCards={addCards} />
            )
          }
          ItemSeparatorComponent={HorizontalDivider}
        />
      </View>

      <KeyboardAvoidingView behavior="padding">
        <View style={styles.inputWrapper} role="form">
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
            accessibilityLabel="Add Card to Deck"
            style={styles.addButton}
            onPress={() => addCard(newCard)}
          >
            <SVG icon={plus} width={24} height={24} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: SPACING_LG,
    paddingVertical: SPACING_LG,
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
    paddingHorizontal: SPACING_LG,
    paddingBottom: SPACING_SM,
    paddingTop: SPACING_SM + FORM_LABEL_HEIGHT,
  },
  addButton: {
    ...globalStyles.buttonHighlight,
    marginBottom: FORM_LABEL_HEIGHT,
    height: FORM_CONTROL_SIZE,
  },
});
