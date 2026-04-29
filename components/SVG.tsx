import React from "react";
import { SvgXml } from "react-native-svg";

type SVGProps = {
  icon: string;
  width: number;
  height: number;
};

const SVG = ({ icon, width, height }: SVGProps) => {
  return <SvgXml xml={icon} width={width} height={height} />;
};
export default SVG;
