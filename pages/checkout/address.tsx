import React, { useContext } from "react";
import { GetServerSideProps } from "next";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { ShopLayout } from "../../components/layout/ShopLayout";
import { useForm } from "react-hook-form";
import { jwt, countries } from "../../utils";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { CartContext } from "../../context";

type Props = {};
type FormData = {
  firstName: string;
  lastName: string;
  address: string;
  address2?: string;
  zip: string;
  city: string;
  country: string;
  phone: string;
};

const getAddressFromCookies = (): FormData => {
  return {
    firstName: Cookies.get("firstName") || "",
    lastName: Cookies.get("lastName") || "",
    address: Cookies.get("address") || "",
    address2: Cookies.get("address2") || "",
    zip: Cookies.get("zip") || "",
    city: Cookies.get("city") || "",
    country: Cookies.get("country") || "",
    phone: Cookies.get("phone") || "",
  };
};

export default function Address({}: Props) {
  const router = useRouter();
  const { updateAddress, shippingAddress } = useContext(CartContext);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    // defaultValues: {
    //   firstName: "",
    //   lastName: "",
    //   address: "",
    //   address2: "",
    //   zip: "",
    //   city: "",
    //   country: countries[0].code,
    //   phone: "",
    // },
    defaultValues: getAddressFromCookies(),
  });

  const onSubmitAddress = (data: FormData) => {
    updateAddress(data);
    router.push("/checkout/summary");
  };

  // if (!shippingAddress) {
  //   return <></>;
  // }

  // if (typeof window === "undefined") {
  //   return <></>;
  // }

  return (
    <ShopLayout
      title="Direccion"
      pageDescription="Confirmar direccion del destino"
    >
      <Typography variant="h1" component="h1">
        Direccion
      </Typography>

      <form onSubmit={handleSubmit(onSubmitAddress)} noValidate>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nombre"
              variant="filled"
              fullWidth
              {...register("firstName", {
                required: "This field is required",
              })}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Apellido"
              variant="filled"
              fullWidth
              {...register("lastName", {
                required: "This field is required",
              })}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Direccion"
              variant="filled"
              fullWidth
              {...register("address", {
                required: "This field is required",
              })}
              error={!!errors.address}
              helperText={errors.address?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Direccion 2 (opcional)"
              variant="filled"
              fullWidth
              {...register("address2")}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Codigo Postal"
              variant="filled"
              fullWidth
              {...register("zip", {
                required: "This field is required",
              })}
              error={!!errors.zip}
              helperText={errors.zip?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Ciudad"
              variant="filled"
              fullWidth
              {...register("city", {
                required: "This field is required",
              })}
              error={!!errors.city}
              helperText={errors.city?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              {/* <InputLabel htmlFor="country">Pais</InputLabel> */}
              <TextField
                select
                variant="filled"
                label="Pais"
                defaultValue={Cookies.get("country")}
                {...register("country", {
                  required: "This field is required",
                })}
                error={!!errors.country}
                helperText={errors.country?.message}
              >
                <MenuItem value="">Seleccione un pais</MenuItem>
                {/* <MenuItem value={1}>Argentina</MenuItem>
              <MenuItem value={2}>Brasil</MenuItem>
              <MenuItem value={3}>Chile</MenuItem> */}
                {countries.map((country) => (
                  <MenuItem key={country.code} value={country.code}>
                    {country.name}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Telefono"
              variant="filled"
              fullWidth
              {...register("phone", {
                required: "This field is required",
              })}
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 5 }} display="flex" justifyContent="center">
          <Button
            color="secondary"
            type="submit"
            className="circular-btn"
            size="large"
          >
            Revisar Pedido
          </Button>
        </Box>
      </form>
    </ShopLayout>
  );
}

// check page in SSR
// export const getServerSideProps: GetServerSideProps = async ({ req }) => {
//   const { token = "" } = req.cookies;
//   let userId = "";
//   let isValidToken = false;

//   try {
//     await jwt.isValidToken(token);
//     isValidToken = true;
//   } catch (error) {
//     isValidToken = false;
//   }

//   if (!isValidToken) {
//     return {
//       redirect: {
//         destination: "/auth/login?p=/checkout/address",
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {},
//   };
// };
