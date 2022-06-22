import { FC, useMemo, useState } from "react";
import NextLink from "next/link";
import {
  Box,
  Card,
  CardActionArea,
  CardMedia,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import { IProduct } from "../../interfaces";

interface Props {
  product: IProduct;
}

const ProductCart: FC<Props> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);

  const productImage = useMemo(() => {
    return isHovered ? product.images[1] : product.images[0];
  }, [isHovered, product.images]);

  return (
    <Grid
      item
      xs={12}
      sm={6}
      md={4}
      lg={3}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card>
        {/* <NextLink href={`/product/${product.slug}`} passHref prefetch={false}> */}
        <NextLink href={`/product/slug`} passHref prefetch={false}>
          <Link>
            <CardActionArea>
              <CardMedia
                component="img"
                image={`products/${productImage}`}
                className="fadeIn"
                alt={product.title}
              />
            </CardActionArea>
          </Link>
        </NextLink>
      </Card>

      <Box sx={{ mt: 1 }} className="fadeIn">
        <Typography fontWeight={700}> {product.title} </Typography>
        <Typography fontWeight={500}>$ {product.price} </Typography>
      </Box>
    </Grid>
  );
};

export default ProductCart;
