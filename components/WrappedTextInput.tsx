import globalStyles from "@/assets/global-styles";
import { ERROR_MESSAGE_HEIGHT } from "@/assets/style-constants";
import { StyleSheet, Text, TextInput, View } from "react-native";

type WrappedTextInputProps = {
  label: string;
  value: string;
  errorMessage: string;
  onChange: (text: string) => void;
};

export default function WrappedTextInput({
  label,
  value,
  errorMessage,
  onChange,
}: WrappedTextInputProps) {
  return (
    <View style={globalStyles.formGroup}>
      <Text style={globalStyles.label} nativeID={`${label}-label`}>
        {label}
      </Text>

      <TextInput
        autoCorrect={false}
        aria-labelledby={`${label}-label`}
        style={globalStyles.textInput}
        value={value}
        onChangeText={onChange}
      />

      <View style={style.errorMessageWrapper}>
        {errorMessage && (
          <Text style={globalStyles.textDanger} role="alert">
            {errorMessage}
          </Text>
        )}
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  errorMessageWrapper: {
    height: ERROR_MESSAGE_HEIGHT,
    marginLeft: 5,
  },
});
