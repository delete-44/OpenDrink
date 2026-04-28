import { StyleSheet } from "react-native";
import {
  BACKGROUND_COLOR,
  CONTENT_COLOR,
  DANGER_COLOR,
  DECORATION_COLOR,
  FONT_SIZE_LG,
  FONT_SIZE_MD,
  FONT_SIZE_SM,
  HIGHLIGHT_COLOR,
  SPACING_MD,
  SPACING_SM,
} from "./style-constants";

const baseButton = {
  backgroundColor: CONTENT_COLOR,
  borderWidth: 5,
  borderColor: DECORATION_COLOR,
  borderRadius: SPACING_SM,
};

export default StyleSheet.create({
  rootBg: {
    backgroundColor: BACKGROUND_COLOR,
    flex: 1,
  },
  textLg: {
    fontSize: FONT_SIZE_LG,
    color: CONTENT_COLOR,
  },
  textMd: {
    fontSize: FONT_SIZE_MD,
    color: CONTENT_COLOR,
    flex: 1,
  },
  label: {
    fontSize: FONT_SIZE_SM,
    color: CONTENT_COLOR,
  },
  textDanger: {
    fontSize: FONT_SIZE_SM,
    color: DANGER_COLOR,
  },
  textInput: {
    flex: 1,
    backgroundColor: CONTENT_COLOR,
    borderWidth: 5,
    borderColor: DECORATION_COLOR,
    borderRadius: SPACING_SM,
    padding: SPACING_SM,
    fontSize: 16,
    minHeight: 32,
  },
  formGroup: {
    flexDirection: "column",
    flex: 1,
  },
  buttonHighlight: {
    ...baseButton,
    padding: SPACING_SM,
    backgroundColor: HIGHLIGHT_COLOR,
  },
  buttonSm: {
    ...baseButton,
    padding: SPACING_SM,
  },
  button: {
    ...baseButton,
    padding: SPACING_MD,
  },
  buttonText: {
    fontSize: 20,
    color: DECORATION_COLOR,
  },
});
