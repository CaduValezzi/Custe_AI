import { type PictureProps } from "./props";

export const Picture = ({ 
  className,
  src, 
  alt }: PictureProps) => {
  return (
    <img className={className} src={src} alt={alt} />
  );
};
