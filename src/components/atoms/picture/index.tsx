import { ReactNode } from "react";
import { PictureProps } from "./props";

export const Picture = ({ src, alt }: PictureProps): ReactNode => {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  );
};
