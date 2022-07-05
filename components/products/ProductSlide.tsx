import { FC, useId } from "react";
import { Slide } from "react-slideshow-image";

import "react-slideshow-image/dist/styles.css";
import styles from "./ProductSlide.module.css";

interface Props {
  images: string[];
}

export const ProductSlide: FC<Props> = ({ images }) => {
  const id = useId();

  return (
    <Slide easing="ease" duration={7000} indicators>
      {images.map((image, index) => {
        const url = `/products/${image}`;
        return (
          <div key={id} className={styles["each-slide"]}>
            <div
              style={{
                backgroundImage: `url(${url})`,
                backgroundSize: "cover",
              }}
            ></div>
          </div>
        );
      })}
    </Slide>
  );
};
