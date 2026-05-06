import globalStyles from "@/assets/global-styles";
import { cross } from "@/assets/icons/cross";
import {
  BACKGROUND_COLOR,
  BACKGROUND_COLOR_HIGHLIGHT,
  CONTENT_COLOR,
  DECORATION_COLOR,
  SPACING_LG,
  SPACING_SM,
} from "@/src/constants/style-constants";
import { PropsWithChildren } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import SVG from "./SVG";

type Props = PropsWithChildren<{
  title: string;
  isVisible: boolean;
  onClose: () => void;
}>;

export default function ModalContainer({
  title,
  isVisible,
  children,
  onClose,
}: Props) {
  return (
    <Modal animationType="fade" transparent={true} visible={isVisible}>
      <View style={styles.modalContent}>
        <View style={styles.titleContainer}>
          <Text style={globalStyles.textMd}>{title}</Text>
          <Pressable
            onPress={onClose}
            role="button"
            accessibilityLabel="Close Modal"
            style={globalStyles.buttonPlain}
          >
            <SVG icon={cross} width={22} height={22} color={CONTENT_COLOR} />
          </Pressable>
        </View>

        <View style={styles.modalBody}>{children}</View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    maxHeight: "50%",
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: SPACING_SM,
    borderColor: DECORATION_COLOR,
    borderWidth: 5,
    top: 180,
    marginInline: SPACING_LG * 2,
  },
  titleContainer: {
    padding: SPACING_SM,
    backgroundColor: BACKGROUND_COLOR_HIGHLIGHT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomColor: DECORATION_COLOR,
    borderBottomWidth: 5,
  },
  modalBody: {
    padding: SPACING_SM,
  },
});
