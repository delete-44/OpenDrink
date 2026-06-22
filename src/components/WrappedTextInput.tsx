import globalStyles from "@/assets/global-styles";
import { circleAlert } from "@/assets/icons/circleAlert";
import {
  FORM_LABEL_HEIGHT,
  SPACING_SM,
  WARNING_COLOR,
} from "@/src/constants/style-constants";
import {
  StyleSheet,
  SubmitBehavior,
  Text,
  TextInput,
  View,
} from "react-native";
import SVG from "./SVG";

type WrappedTextInputProps = {
  label: string;
  value: string;
  errorMessage: string;
  submitBehaviour?: SubmitBehavior;
  autofocus?: boolean;
  multiline?: boolean;
  onChange: (text: string) => void;
  onSubmit?: () => void;
};

export default function WrappedTextInput({
  label,
  value,
  errorMessage,
  autofocus = false,
  multiline = false,
  submitBehaviour,
  onChange,
  onSubmit,
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
        multiline={multiline}
        numberOfLines={5}
        onSubmitEditing={onSubmit}
        submitBehavior={submitBehaviour}
      />

      <View style={style.textWrapper}>
        {errorMessage && (
          <>
            <SVG
              icon={circleAlert}
              color={WARNING_COLOR}
              width={18}
              height={18}
            />

            <Text
              style={globalStyles.textWarning}
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
    minHeight: FORM_LABEL_HEIGHT,
    gap: SPACING_SM,
    flexDirection: "row",
    alignItems: "center",
  },
});
