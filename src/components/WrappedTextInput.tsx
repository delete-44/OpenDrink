import globalStyles from "@/assets/global-styles";
import { FORM_LABEL_HEIGHT, SPACING_SM } from "@/src/constants/style-constants";
import { ReactElement } from "react";
import {
  StyleSheet,
  SubmitBehavior,
  Text,
  TextInput,
  View,
} from "react-native";
import { StatusMessageProps } from "../types";

type WrappedTextInputProps = {
  label: string;
  value: string;
  submitBehaviour?: SubmitBehavior;
  autocorrect?: boolean;
  autofocus?: boolean;
  multiline?: boolean;
  ariaInvalid?: boolean;
  onChange: (text: string) => void;
  onSubmit?: () => void;
  statusMessage?: ReactElement<StatusMessageProps>;
};

export default function WrappedTextInput({
  label,
  value,
  autocorrect = false,
  autofocus = false,
  multiline = false,
  ariaInvalid = false,
  submitBehaviour,
  onChange,
  onSubmit,
  statusMessage,
}: WrappedTextInputProps) {
  return (
    <View style={globalStyles.formGroup}>
      <View style={style.textWrapper}>
        <Text style={globalStyles.label} nativeID={`${label}-label`}>
          {label}
        </Text>
      </View>

      <TextInput
        autoCorrect={autocorrect}
        aria-labelledby={`${label}-label`}
        aria-invalid={ariaInvalid}
        aria-describedby={statusMessage ? `${label}-status` : undefined}
        style={globalStyles.textInput}
        value={value}
        onChangeText={onChange}
        autoFocus={autofocus}
        multiline={multiline}
        numberOfLines={5}
        onSubmitEditing={onSubmit}
        submitBehavior={submitBehaviour}
      />

      {/* Space for the message is kept even if the message is undefined, with a fixed height, to avoid UI jumps */}
      <View style={style.textWrapper}>{statusMessage}</View>
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
