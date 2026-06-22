import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import globalStyles from "@/assets/global-styles";
import { chevronDown } from "@/assets/icons/chevronDown";
import { pencil } from "@/assets/icons/pencil";
import { plus } from "@/assets/icons/plus";
import {
  CONTENT_BACKDROP,
  CONTENT_COLOR,
  SPACING_MD,
  SPACING_SM,
} from "@/src/constants/style-constants";
import { StorageContext } from "@/src/context/StorageContext";
import { router } from "expo-router";
import { useContext, useState } from "react";
import Button from "../Button";
import Logo from "../Logo";
import SVG from "../SVG";
import DeckSelectorModal from "./DeckSelectorModal";

export default function DeckSelector() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { selectedDeck, isLoading } = useContext(StorageContext);

  if (isLoading) {
    return (
      <ActivityIndicator color="#fff" accessibilityLabel="Loading Decks" />
    );
  }

  return (
    <>
      <View style={styles.deckSelectorWrapper}>
        <Logo />

        <Button
          type="plain"
          additionalStyle={styles.actionsContainer}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={globalStyles.textLg} numberOfLines={1}>
            {selectedDeck.name}
          </Text>

          <SVG
            icon={chevronDown}
            width={24}
            height={24}
            color={CONTENT_COLOR}
          />
        </Button>

        <View style={styles.actionsContainer}>
          <Button
            onPress={() =>
              router.navigate({
                pathname: "/decks/[id]/edit",
                params: { id: selectedDeck.id },
              })
            }
          >
            <SVG icon={pencil} width={24} height={24} />
            <Text style={globalStyles.buttonText}>Edit Deck</Text>
          </Button>

          <Button
            onPress={() => {
              router.navigate("/decks/new");
            }}
          >
            <SVG icon={plus} width={24} height={24} />
            <Text style={globalStyles.buttonText}>New Deck</Text>
          </Button>
        </View>
      </View>

      {isModalVisible && (
        <DeckSelectorModal
          isVisible={isModalVisible}
          setIsVisible={setIsModalVisible}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  deckSelectorWrapper: {
    padding: SPACING_MD,
    marginHorizontal: "auto",
    maxWidth: "75%",

    backgroundColor: CONTENT_BACKDROP,
    borderRadius: SPACING_SM,

    flexDirection: "column",
    alignItems: "center",
    gap: SPACING_SM,
  },
  actionsContainer: {
    flexDirection: "row",
    gap: SPACING_SM,
    justifyContent: "space-between",
    alignItems: "center",
  },
});
