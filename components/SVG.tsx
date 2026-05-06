import { DECORATION_COLOR } from "@/src/constants/style-constants";
import React from "react";
import { SvgXml } from "react-native-svg";

type SVGProps = {
  icon: string;
  width: number;
  height: number;
  color?: string;
};

const SVG = ({ icon, width, height, color = DECORATION_COLOR }: SVGProps) => {
  return <SvgXml xml={icon} width={width} height={height} color={color} />;
};
export default SVG;
