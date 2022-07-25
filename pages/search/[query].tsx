// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
import { GetServerSideProps } from "next";
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
import { dbProducts } from "../../database";
import { IProduct } from "../../interfaces";

interface Props {
  products: IProduct[];
}

const SearchPage: NextPage<Props> = ({ products }) => {
  //const { products, isLoading } = useProducts("/search/cybertruck");

  return (
    <ShopLayout
      title="Teslo-Shop - Search"
      pageDescription="Encuentra los mejores productos de Teslo aqui"
    >
      <Typography variant="h1" component="h1">
        Buscar producto
      </Typography>
      <Typography variant="h2" sx={{ mb: 1 }}>
        ABC -- 123
      </Typography>

      <ProductList products={products} />

      {/* {isLoading ? <Loading /> : <ProductList products={products} />} */}
    </ShopLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { query = "" } = params as { query: string };

  if (query.length === 0) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }

  let products = await dbProducts.getProductsByTerm(query);

  //TODO: return other products

  return {
    props: {
      products,
    },
  };
};

export default SearchPage;
