import { StyleSheet, Text, View } from "react-native";

import globalStyles from "@/assets/global-styles";
import { minus } from "@/assets/icons/minus";
import { SPACING_SM } from "@/src/constants/style-constants";
import Button from "./Button";
import SVG from "./SVG";

type RemovableListItemProps = {
  label: string;
  removeItemCb: () => void;
};

export default function RemovableListItem({
  label,
  removeItemCb,
}: RemovableListItemProps) {
  return (
    <View style={styles.listItemWrapper}>
      <Text selectable style={styles.listItemLabel}>
        {label}
      </Text>
      <Button accessibilityLabel={`Remove ${label}`} onPress={removeItemCb}>
        <SVG icon={minus} width={24} height={24} />
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  listItemWrapper: {
    flexDirection: "row",
    gap: SPACING_SM,
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: "100%",
    marginVertical: SPACING_SM,
  },
  listItemLabel: {
    ...globalStyles.textLg,
    flex: 1,
    paddingVertical: SPACING_SM,
  },
});
