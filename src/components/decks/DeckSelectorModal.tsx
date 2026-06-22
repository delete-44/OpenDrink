import { SPACING_SM, SPACING_XS } from "@/src/constants/style-constants";
import { StorageContext } from "@/src/context/StorageContext";
import { useContext } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import HorizontalDivider from "../HorizontalDivider";
import ModalContainer from "../ModalContainer";
import PressableListItem from "../PressableListItem";

type DeckSelectorModalProps = {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
};

export default function DeckSelectorModal({
  isVisible,
  setIsVisible,
}: DeckSelectorModalProps) {
  const { saveSelectedDeckIdx, decks } = useContext(StorageContext);

  return (
    <ModalContainer
      title="Select Deck"
      isVisible={isVisible}
      onClose={() => setIsVisible(false)}
    >
      <View style={styles.modalBody}>
        <FlatList
          style={styles.listWrapper}
          data={decks}
          keyExtractor={(item) => `${item.id}`}
          renderItem={({ item, index }) => (
            <PressableListItem
              label={item.name}
              idx={index}
              onPressItem={async (idx: number) => {
                await saveSelectedDeckIdx(idx);
                setIsVisible(false);
              }}
            />
          )}
          ItemSeparatorComponent={HorizontalDivider}
        />
      </View>
    </ModalContainer>
  );
}

const styles = StyleSheet.create({
  modalBody: {
    paddingVertical: SPACING_SM,
    paddingHorizontal: SPACING_XS,
    flex: 1, // To prevent long lists from overflowing out of the modal body
  },
  listWrapper: {
    paddingHorizontal: SPACING_XS,
  },
});
