import { FC } from "react";
import { Box, Button } from "@mui/material";
import { ISizes } from "../../interfaces";

interface Props {
  selectedSize?: ISizes;
  sizes: ISizes[];
}

export const SizeSelector: FC<Props> = ({ selectedSize, sizes }) => {
  return (
    <Box>
      {sizes.map((size) => (
        <Button
          key={size}
          size="small"
          color={selectedSize === size ? "primary" : "info"}
        >
          {size}
        </Button>
      ))}
    </Box>
  );
};
