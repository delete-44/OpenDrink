import { StyleSheet, TextStyle, ViewStyle } from "react-native";
import {
  ACCENT_COLOR,
  BACKGROUND_COLOR,
  BACKGROUND_COLOR_HIGHLIGHT,
  CONTENT_COLOR,
  DANGER_COLOR,
  DECORATION_COLOR,
  FONT_SIZE_HERO,
  FONT_SIZE_LG,
  FONT_SIZE_MD,
  FONT_SIZE_SM,
  FORM_CONTROL_SIZE,
  SPACING_SM,
  WARNING_COLOR,
} from "../src/constants/style-constants";

const baseBackground = {
  backgroundColor: BACKGROUND_COLOR, // fallback if experimental bgImage fails
  flex: 1,
  justifyContent: "center",
} as ViewStyle;

const baseText = {
  color: CONTENT_COLOR,
  fontFamily: "JockeyOne",
} as TextStyle;

const baseButton = {
  backgroundColor: CONTENT_COLOR,
  borderWidth: 5,
  borderColor: DECORATION_COLOR,
  borderRadius: SPACING_SM,
  minWidth: FORM_CONTROL_SIZE,
  minHeight: FORM_CONTROL_SIZE,
  justifyContent: "center",
  alignItems: "center",
  padding: SPACING_SM,
} as ViewStyle;

export default StyleSheet.create({
  backgroundPlain: {
    ...baseBackground,
  },
  backgroundGradient: {
    ...baseBackground,
    experimental_backgroundImage: `linear-gradient(347deg,${BACKGROUND_COLOR_HIGHLIGHT} 47%, ${BACKGROUND_COLOR} 47%)`,
  },
  textHero: {
    ...baseText,
    fontSize: FONT_SIZE_HERO,
  },
  textLg: {
    ...baseText,
    fontSize: FONT_SIZE_LG,
  },
  textMd: {
    ...baseText,
    fontSize: FONT_SIZE_MD,
  },
  label: {
    ...baseText,
    fontSize: FONT_SIZE_SM,
  },
  textWarning: {
    ...baseText,
    fontSize: FONT_SIZE_SM,
    color: WARNING_COLOR,
  },
  textInput: {
    fontFamily: "JockeyOne",
    backgroundColor: CONTENT_COLOR,
    borderWidth: 5,
    borderColor: DECORATION_COLOR,
    borderRadius: SPACING_SM,
    padding: SPACING_SM,
    fontSize: FONT_SIZE_MD,
    minHeight: FORM_CONTROL_SIZE,
  },
  formGroup: {
    flexDirection: "column",
    flex: 1,
  },
  buttonHighlight: {
    ...baseButton,
    backgroundColor: ACCENT_COLOR,
  },
  buttonDanger: {
    ...baseButton,
    backgroundColor: DANGER_COLOR,
  },
  buttonPlain: {
    ...baseButton,
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  button: {
    ...baseButton,
  },
  buttonText: {
    fontFamily: "JockeyOne",
    fontSize: FONT_SIZE_SM,
    color: DECORATION_COLOR,
    textAlign: "center",
  },
});
