import globalStyles from "@/assets/global-styles";
import { check } from "@/assets/icons/check";
import { circleAlert } from "@/assets/icons/circleAlert";
import { Text } from "react-native";
import { SUCCESS_COLOR, WARNING_COLOR } from "../constants/style-constants";
import { StatusMessageProps } from "../types";
import SVG from "./SVG";

export default function StatusMessage({
  type,
  message,
  describes,
}: StatusMessageProps) {
  if (!message) {
    return null;
  }

  switch (type) {
    case "success":
      return (
        <>
          <SVG icon={check} color={SUCCESS_COLOR} width={18} height={18} />

          <Text
            style={globalStyles.textSuccess}
            role="alert"
            accessibilityLiveRegion="polite"
            nativeID={`${describes}-status`}
          >
            {message}
          </Text>
        </>
      );

    default:
      return (
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
            nativeID={`${describes}-status`}
          >
            {message}
          </Text>
        </>
      );
  }
}
