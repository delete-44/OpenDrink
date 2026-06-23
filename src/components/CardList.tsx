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
  SPACING_MD,
  SPACING_SM,
} from "@/src/constants/style-constants";
import { useCallback, useContext, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  StyleSheet,
  View,
} from "react-native";
import { CardContext } from "../context/CardContext";
import { CardPermittedFields } from "../repositories/CardRepository";
import Button from "./Button";
import StatusMessage from "./StatusMessage";

export default function CardList() {
  const [newCard, setNewCard] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { isLoading, cards, createCard, createManyCards, deleteCard } =
    useContext(CardContext);

  // Callback for adding multiple cards to the deck; currently
  // used for inserting the default deck from the empty screen;
  // longer term could be useful for downloading/importing decks
  const addCards = useCallback(
    async (newCards: CardPermittedFields[]) => {
      try {
        await createManyCards(newCards);
        setSuccessMessage("Deck loaded");
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
        setSuccessMessage("Card added");
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
      <View style={styles.cardListWrapper}>
        <FlatList
          style={styles.listWrapper}
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
            autocorrect
            ariaInvalid={errorMessage !== ""}
            multiline
            submitBehaviour="newline"
            onChange={(text) => {
              setSuccessMessage("");
              setErrorMessage("");

              setNewCard(text);
            }}
            statusMessage={
              errorMessage ? (
                <StatusMessage
                  type="warning"
                  message={errorMessage}
                  describes="Card Content"
                />
              ) : (
                <StatusMessage
                  type={"success"}
                  message={successMessage}
                  describes="Card Content"
                />
              )
            }
          />

          <Button
            type="highlight"
            accessibilityLabel="Add Card to Deck"
            additionalStyle={styles.addButton}
            onPress={() => addCard(newCard)}
          >
            <SVG icon={plus} width={24} height={24} />
          </Button>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  cardListWrapper: {
    padding: SPACING_MD,
    marginHorizontal: "auto",
    flex: 1,

    flexDirection: "column",
    alignItems: "center",
  },
  listWrapper: {
    paddingHorizontal: SPACING_SM,
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
    paddingTop: SPACING_SM,
  },
  addButton: {
    marginBottom: FORM_LABEL_HEIGHT,
    height: FORM_CONTROL_SIZE,
  },
});
