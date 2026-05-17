import { Picture } from "@/components/atoms/picture";
import HeroImage from "../../../../public/images/pexels-weekendplayer-186461.jpg";

export const HeroTemplate = () => {
  return (
    <>
      <div className="hero__section">
        <div className="hero__container" >
          <Picture src={HeroImage.src} sizeHeight="100vh" sizeWidth="100vw"/>
        </div>
      </div>
    </>
  )
}; 