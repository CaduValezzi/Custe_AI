import { type PictureProps } from "./props";
import S from "./styles.module.scss";

export const Picture = ({ 
  src, 
  alt, 
  sizeHeight, 
  sizeWidth }: PictureProps) => {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img className={S.picture} src={src} alt={alt} style={{ height: sizeHeight, width: sizeWidth }} />
  );
};
