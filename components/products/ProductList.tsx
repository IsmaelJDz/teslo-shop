import { FC, useId } from "react";
import { Grid } from "@mui/material";
import { IProduct } from "../../interfaces";
import ProductCart from "./ProductCart";

interface Props {
  products: IProduct[];
}

export const ProductList: FC<Props> = ({ products }) => {
  const id = useId();

  return (
    <Grid container spacing={4}>
      {products.map((product) => (
        <ProductCart product={product} key={id} />
      ))}
    </Grid>
  );
};
