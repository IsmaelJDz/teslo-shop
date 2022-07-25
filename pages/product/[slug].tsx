import React from "react";
import {
  NextPage,
  GetServerSideProps,
  GetStaticProps,
  GetStaticPaths,
} from "next";
import { useRouter } from "next/router";
import { Box, Button, Chip, Grid, Typography } from "@mui/material";
import { ShopLayout } from "../../components/layout";
import { ProductSlide, SizeSelector } from "../../components/products";
import { ItemCounter } from "../../components/ui";
import { initialData } from "../../database/products";
import { useProducts } from "../../hooks";
import { IProduct } from "../../interfaces";
import { dbProducts } from "../../database";

//const product = initialData.products[0];

interface Props {
  product: IProduct;
}

export const ProductPage: NextPage<Props> = ({ product }) => {
  //const router = useRouter();

  // const { products: product, isLoading } = useProducts(
  //   `/products/${router.query.slug}`
  // );

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  // if (!product) {
  //   return <div>Product not found</div>;
  // }

  return (
    <ShopLayout title={product.title} pageDescription={product.description}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          <ProductSlide images={product.images} />
        </Grid>

        <Grid item xs={12} sm={5}>
          <Box display="flex" flexDirection="column">
            <Typography variant="h1" component="h1">
              {product.title}
            </Typography>
            <Typography variant="subtitle1" component="h2">
              ${`${product.price}`}
            </Typography>

            <Box sx={{ my: 2 }}>
              <Typography variant="subtitle2">Cantidad</Typography>
              <ItemCounter />
              <SizeSelector
                selectedSize={product.sizes[0]}
                sizes={product.sizes}
              />
            </Box>

            <Button color="secondary" className="circular-btn">
              Agregar al carrito
            </Button>

            {/* <Chip
              label="No hay disponibles"
              color="error"
              variant="outlined"
            ></Chip> */}

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2">Description</Typography>
              <Typography variant="body2">{product.description}</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

// export const getServerSideProps: GetServerSideProps = async ({ params }) => {
//   const { slug } = params as { slug: string };
//   const product = await dbProducts.getProducts(slug);

//   if (!product) {
//     return {
//       redirect: {
//         destination: "/",
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {
//       product,
//     },
//   };
// };

// export async function getServerSideProps<GetServerSideProps>({
//   slug,
// }: {
//   slug: string;
// }) {
//   //const { slug } = params as { slug: string };
//   //const { slug } = params;
//   //const { params! } = context;

//   const product = await dbProducts.getProducts(slug);

//   if (!product) {
//     return {
//       redirect: {
//         destination: "/",
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {
//       product,
//     },
//   };
// }

export const getStaticPaths: GetStaticPaths = async (ctx) => {
  const productSlugs = await dbProducts.getAllProductSlugs();

  return {
    paths: productSlugs.map(({ slug }) => ({
      params: { slug },
    })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug = "" } = params as { slug: string };
  const product = await dbProducts.getProducts(slug);

  if (!product) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24,
  };
};

export default ProductPage;
