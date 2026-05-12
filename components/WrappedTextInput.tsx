import globalStyles from "@/assets/global-styles";
import { circleAlert } from "@/assets/icons/circleAlert";
import {
  DANGER_COLOR,
  FORM_LABEL_HEIGHT,
  SPACING_SM,
} from "@/src/constants/style-constants";
import { StyleSheet, Text, TextInput, View } from "react-native";
import SVG from "./SVG";

type WrappedTextInputProps = {
  label: string;
  value: string;
  errorMessage: string;
  autofocus?: boolean;
  onChange: (text: string) => void;
};

export default function WrappedTextInput({
  label,
  value,
  errorMessage,
  autofocus = false,
  onChange,
}: WrappedTextInputProps) {
  return (
    <View style={globalStyles.formGroup}>
      <View style={style.textWrapper}>
        <Text style={globalStyles.label} nativeID={`${label}-label`}>
          {label}
        </Text>
      </View>

      <TextInput
        autoCorrect={false}
        aria-labelledby={`${label}-label`}
        aria-invalid={errorMessage !== ""}
        aria-describedby={errorMessage ? `${label}-error` : undefined}
        style={globalStyles.textInput}
        value={value}
        onChangeText={onChange}
        autoFocus={autofocus}
      />

      <View style={style.textWrapper}>
        {errorMessage && (
          <>
            <SVG
              icon={circleAlert}
              color={DANGER_COLOR}
              width={18}
              height={18}
            />

            <Text
              style={globalStyles.textDanger}
              role="alert"
              accessibilityLiveRegion="polite"
              nativeID={`${label}-error`}
            >
              {errorMessage}
            </Text>
          </>
        )}
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  textWrapper: {
    height: FORM_LABEL_HEIGHT,
    marginLeft: 5,
    gap: SPACING_SM,
    flexDirection: "row",
    alignItems: "center",
  },
});
