import {
  Card,
  CardActionArea,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import type { NextPage } from "next";
import { ShopLayout } from "../../components/layout";

//import { initialData } from "../database/products";
import { ProductList } from "../../components/products/ProductList";
import { useProducts } from "../../hooks";
import { Loading } from "../../components/ui";

const KidsPage: NextPage = () => {
  const { products, isLoading } = useProducts("/products?gender=kid");

  return (
    <ShopLayout
      title="Teslo-Shop - Kids"
      pageDescription="Encuentra los mejores productos de Teslo para niños"
    >
      <Typography variant="h1" component="h1">
        Ninos
      </Typography>
      <Typography variant="h2" sx={{ mb: 1 }}>
        Todos los productos
      </Typography>

      {isLoading ? <Loading /> : <ProductList products={products} />}
    </ShopLayout>
  );
};

export default KidsPage;
