import globalStyles from "@/assets/global-styles";
import { ReactNode, useCallback, useMemo } from "react";
import { Pressable, ViewStyle } from "react-native";

type ButtonTypes = "default" | "plain" | "highlight" | "danger";

type ButtonProps = {
  type?: ButtonTypes;
  additionalStyle?: ViewStyle;
  accessibilityLabel?: string;

  onPress: () => void;
  children: ReactNode;

  testOnly_pressed?: boolean;
};

export default function Button({
  type = "default",
  additionalStyle,
  accessibilityLabel,
  onPress,
  children,

  testOnly_pressed = false,
}: ButtonProps) {
  const buttonStyles = useMemo((): ViewStyle => {
    switch (type) {
      case "plain":
        return globalStyles.buttonPlain;

      case "highlight":
        return globalStyles.buttonHighlight;

      case "danger":
        return globalStyles.buttonDanger;

      default:
        return globalStyles.button;
    }
  }, [type]);

  const pressedButtonStyles = useCallback((pressed: boolean): ViewStyle => {
    if (!pressed) {
      return {};
    }

    return globalStyles.buttonPressed;
  }, []);

  return (
    <Pressable
      style={({ pressed }) => {
        return [buttonStyles, pressedButtonStyles(pressed), additionalStyle];
      }}
      accessibilityLabel={accessibilityLabel}
      role="button"
      onPress={onPress}
      testOnly_pressed={testOnly_pressed}
    >
      {children}
    </Pressable>
  );
}
