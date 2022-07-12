import { FC } from "react";
import NextLink from "next/link";
import {
  Typography,
  Grid,
  CardContent,
  Card,
  Divider,
  Box,
  Link,
  Chip,
} from "@mui/material";
import { ShopLayout } from "../../components/layout/ShopLayout";
import { CartList, OrderSummary } from "../../components/cart";
import {
  CreditCardOffOutlined,
  CreditScoreOutlined,
} from "@mui/icons-material";

const OrderPage = () => {
  return (
    <ShopLayout
      title="Resumen de la orden 31231231"
      pageDescription="Resumen de la orden"
    >
      <Typography variant="h1" component="h1">
        Orden: 123123
      </Typography>
      {/* 
      <Chip
        sx={{ my: 2 }}
        label="Pendiente de pago"
        variant="outlined"
        color="error"
        icon={<CreditCardOffOutlined />}
      /> */}

      <Chip
        sx={{ my: 2 }}
        label="Pagada"
        variant="outlined"
        color="success"
        icon={<CreditScoreOutlined />}
      />

      <Grid container>
        <Grid item xs={12} sm={7}>
          <CartList />
        </Grid>
        <Grid item xs={12} sm={5}>
          {/* <CartSummary /> */}
          <Card className="cart-summary">
            <CardContent>
              <Typography variant="h2">Resumen (3 productos)</Typography>
              <Divider sx={{ my: 1 }} />

              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">
                  Direccion de entrega
                </Typography>
                <NextLink href="/checkout/address" passHref>
                  <Link underline="always">Editar</Link>
                </NextLink>
              </Box>

              <Typography>Ismael Barrios</Typography>
              <Typography>323 Algun lugar</Typography>
              <Typography>Stittsville, HYA 245</Typography>
              <Typography>Canada</Typography>
              <Typography>+1 23123123 </Typography>

              <Divider sx={{ my: 1 }} />

              <Box display="flex" justifyContent="end">
                <NextLink href="/cart" passHref>
                  <Link underline="always">Editar</Link>
                </NextLink>
              </Box>

              <OrderSummary />

              <Box sx={{ mt: 3 }}>
                {/* TODO: implement new payment */}
                <h1>Pagar</h1>

                <Chip
                  sx={{ my: 2 }}
                  label="Pagada"
                  variant="outlined"
                  color="success"
                  icon={<CreditScoreOutlined />}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default OrderPage;
