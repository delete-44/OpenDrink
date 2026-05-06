import globalStyles from "@/assets/global-styles";
import { cross } from "@/assets/icons/cross";
import {
  BACKGROUND_COLOR,
  BACKGROUND_COLOR_HIGHLIGHT,
  CONTENT_BACKDROP,
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
    <Modal
      animationType="fade"
      transparent
      visible={isVisible}
      onRequestClose={onClose}
      navigationBarTranslucent
      statusBarTranslucent
    >
      {/* Backdrop to allow user to click out of the modal to close it */}
      <Pressable
        style={[StyleSheet.absoluteFill, { backgroundColor: CONTENT_BACKDROP }]}
        onPress={() => onClose()}
        accessibilityLabel="Close Modal"
        role="button"
      />

      <View style={styles.modalWrapper}>
        <View
          style={styles.modalContent}
          pointerEvents="box-none"
          accessibilityViewIsModal
        >
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
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    maxHeight: "50%",
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: SPACING_SM,
    borderColor: DECORATION_COLOR,
    borderWidth: 5,
    marginInline: SPACING_LG * 2,
    overflow: "hidden",
  },
  titleContainer: {
    paddingLeft: SPACING_SM, // Only pad at start - button has padding already
    backgroundColor: BACKGROUND_COLOR_HIGHLIGHT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomColor: DECORATION_COLOR,
    borderBottomWidth: 5,
  },
  modalBody: {
    padding: SPACING_SM,
    flex: 1,
  },
});
