import { Pressable, StyleSheet, Text } from "react-native";

import globalStyles from "@/assets/global-styles";
import { arrowRight } from "@/assets/icons/arrowRight";
import {
  CONTENT_COLOR,
  SPACING_MD,
  SPACING_SM,
} from "@/src/constants/style-constants";
import SVG from "./SVG";

type PressableListItemProps = {
  label: string;
  idx: number;
  onPressItem: (idx: number) => void;
};

export default function PressableListItem({
  label,
  idx,
  onPressItem,
}: PressableListItemProps) {
  return (
    <Pressable
      style={styles.listItemWrapper}
      role="button"
      accessibilityLabel={`Select ${label}`}
      onPress={() => onPressItem(idx)}
    >
      <Text style={styles.listItemLabel}>{label}</Text>

      <SVG icon={arrowRight} width={24} height={24} color={CONTENT_COLOR} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  listItemWrapper: {
    flexDirection: "row",
    gap: SPACING_MD,
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginVertical: SPACING_SM,
    paddingRight: SPACING_SM,
  },
  listItemLabel: {
    ...globalStyles.textLg,
    flex: 1,
    paddingVertical: SPACING_SM,
  },
});
