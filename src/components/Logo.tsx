import { Image } from "expo-image";

export default function Logo() {
  return (
    <Image
      source={require("../../assets/images/decorative/deck.png")}
      style={{ width: 96, height: 96 }}
      testID="logo"
    />
  );
}
