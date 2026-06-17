import { Image } from "expo-image";

export default function Logo() {
  return (
    <Image
      source={require("../../assets/images/decorative/deck.png")}
      alt=""
      role="img"
      style={{ width: 96, height: 96 }}
    />
  );
}
