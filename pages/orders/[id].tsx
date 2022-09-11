// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
import { GetServerSideProps, NextPage } from "next";

import { PayPalButtons } from "@paypal/react-paypal-js";
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
import { getSession } from "next-auth/react";
import { dbOrders } from "../../database";
import { IOrder } from "../../interfaces";
import { tesloApi } from "../../api";
import { useRouter } from "next/router";
import { CircularProgress } from "@mui/material";
import { useState } from "react";

export type OrderResponseBody = {
  id: string;
  status:
    | "COMPLETED"
    | "SAVED"
    | "APPROVED"
    | "VOIDED"
    | "PAYER_ACTION_REQUIRED";
};

interface Props {
  order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {
  const router = useRouter();
  const [isPaying, setIsPaying] = useState<boolean>(false);

  const onOrderComplete = async (details: OrderResponseBody) => {
    if (details.status !== "COMPLETED") {
      return alert("Payment failed");
    }

    setIsPaying(true);

    try {
      const { data } = await tesloApi.post("/orders/pay", {
        transactionId: details.id,
        orderId: order._id,
      });

      router.reload();
    } catch (error) {
      setIsPaying(false);
      console.log(error);
    }
  };

  return (
    <ShopLayout
      title="Resumen de la orden"
      pageDescription="Resumen de la orden"
    >
      <Typography variant="h1" component="h1">
        Orden: {order._id}
      </Typography>

      {order.isPaid ? (
        <Chip
          sx={{ my: 2 }}
          label="Pagada"
          variant="outlined"
          color="success"
          icon={<CreditScoreOutlined />}
        />
      ) : (
        <Chip
          sx={{ my: 2 }}
          label="Pendiente de pago"
          variant="outlined"
          color="error"
          icon={<CreditCardOffOutlined />}
        />
      )}

      <Grid container className="fadeIn">
        <Grid item xs={12} sm={7}>
          <CartList products={order.orderItems} />
        </Grid>
        <Grid item xs={12} sm={5}>
          {/* <CartSummary /> */}
          <Card className="cart-summary">
            <CardContent>
              <Typography variant="h2">
                Resumen ({order.numberOfItems}{" "}
                {order.numberOfItems > 1 ? "productos" : "producto"})
              </Typography>
              <Divider sx={{ my: 1 }} />

              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">
                  Direccion de entrega
                </Typography>
              </Box>

              <Typography>
                {order.shippingAddress.firstName}{" "}
                {order.shippingAddress.lastName}{" "}
              </Typography>
              <Typography>
                {order.shippingAddress.address}{" "}
                {order.shippingAddress.address2
                  ? `, ${order.shippingAddress.address2}`
                  : ""}
              </Typography>
              <Typography>
                {order.shippingAddress.city}, {order.shippingAddress.zip}
              </Typography>
              <Typography> {order.shippingAddress.country} </Typography>
              <Typography> {order.shippingAddress.phone} </Typography>

              <Divider sx={{ my: 1 }} />

              <OrderSummary
                orderValues={{
                  numberOfItems: order.numberOfItems,
                  subTotal: order.subTotal,
                  total: order.total,
                  tax: order.tax,
                }}
              />

              <Box sx={{ mt: 3 }} display="flex" flexDirection="column">
                <Box
                  display="flex"
                  justifyContent="center"
                  className="fadeIn"
                  sx={{
                    display: isPaying ? "flex" : "none",
                  }}
                >
                  <CircularProgress />
                </Box>

                <Box
                  flexDirection="column"
                  sx={{ display: isPaying ? "none" : "flex", flex: 1 }}
                >
                  {order.isPaid ? (
                    <Chip
                      sx={{ my: 2 }}
                      label="Pagada"
                      variant="outlined"
                      color="success"
                      icon={<CreditScoreOutlined />}
                    />
                  ) : (
                    <PayPalButtons
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: {
                                value: order.total.toString(),
                              },
                            },
                          ],
                        });
                      }}
                      onApprove={(data, actions) => {
                        return actions
                          .order!.capture()
                          .then((details: OrderResponseBody) => {
                            onOrderComplete(details);
                            // console.log({ details });
                            //const name = details?.payer?.name?.given_name;
                            //alert(`Transaction completed by ${name}`);
                          });
                      }}
                    />
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default OrderPage;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const { id = "" } = query;

  const session: any = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?p=/orders/${id}`,
        permanent: false,
      },
    };
  }

  const order = await dbOrders.getOrderById(id.toString());

  if (!order) {
    return {
      redirect: {
        destination: "/orders/history",
        permanent: false,
      },
    };
  }

  if (order.user !== session.user._id) {
    return {
      redirect: {
        destination: "/orders/history",
        permanent: false,
      },
    };
  }

  return {
    props: {
      order,
    },
  };
};
