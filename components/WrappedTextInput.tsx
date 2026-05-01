import globalStyles from "@/assets/global-styles";
import { FORM_LABEL_HEIGHT } from "@/src/constants/style-constants";
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
      <View style={style.textWrapper}>
        <Text style={globalStyles.label} nativeID={`${label}-label`}>
          {label}
        </Text>
      </View>

      <TextInput
        autoCorrect={false}
        aria-labelledby={`${label}-label`}
        style={globalStyles.textInput}
        value={value}
        onChangeText={onChange}
      />

      <View style={style.textWrapper}>
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
  textWrapper: {
    height: FORM_LABEL_HEIGHT,
    marginLeft: 5,
  },
});
