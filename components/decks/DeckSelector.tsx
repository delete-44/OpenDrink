import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import globalStyles from "@/assets/global-styles";
import { chevronDown } from "@/assets/icons/chevronDown";
import { pencil } from "@/assets/icons/pencil";
import { plus } from "@/assets/icons/plus";
import { StorageContext } from "@/context/StorageContext";
import {
  CONTENT_BACKDROP,
  CONTENT_COLOR,
  SPACING_MD,
  SPACING_SM,
} from "@/src/constants/style-constants";
import { router } from "expo-router";
import { useContext, useState } from "react";
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

        <Pressable
          style={[globalStyles.buttonPlain, styles.actionsContainer]}
          role="button"
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
        </Pressable>

        <View style={styles.actionsContainer}>
          <Pressable
            role="button"
            style={globalStyles.button}
            onPress={() =>
              router.navigate({
                pathname: "/decks/[id]/edit",
                params: { id: selectedDeck.id },
              })
            }
          >
            <SVG icon={pencil} width={24} height={24} />
            <Text style={globalStyles.buttonText}>Edit Deck</Text>
          </Pressable>

          <Pressable
            role="button"
            style={globalStyles.button}
            onPress={() => {
              router.navigate("/decks/new");
            }}
          >
            <SVG icon={plus} width={24} height={24} />
            <Text style={globalStyles.buttonText}>New Deck</Text>
          </Pressable>
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
    marginInline: "auto",
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
