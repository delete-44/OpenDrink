import { StyleSheet, TextStyle, ViewStyle } from "react-native";
import {
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
  HIGHLIGHT_COLOR,
  SPACING_MD,
  SPACING_SM,
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
    marginLeft: 5, // To account for the chunky borders
  },
  textDanger: {
    ...baseText,
    fontSize: FONT_SIZE_SM,
    color: DANGER_COLOR,
  },
  textInput: {
    fontFamily: "JockeyOne",
    flex: 1,
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
    fontFamily: "JockeyOne",
    fontSize: FONT_SIZE_SM,
    color: DECORATION_COLOR,
    textAlign: "center",
  },
});
