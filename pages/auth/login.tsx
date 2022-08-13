import { useState, useContext, useEffect } from "react";
import NextLink from "next/link";
import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { AuthLayout } from "../../components/layout";
import { validations } from "../../utils";
import { tesloApi } from "../../api";
import axios from "axios";
import { ErrorOutline } from "@mui/icons-material";
import { AuthContext } from "../../context";
import { useRouter } from "next/router";
import { signIn, getSession, getProviders } from "next-auth/react";
import { GetServerSideProps } from "next";

type Props = {};

type InputsForm = {
  email: string;
  password: string;
};

export default function LoginPage({}: Props) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InputsForm>();
  const [showError, setShowError] = useState(false);
  const { loginUser } = useContext(AuthContext);

  const [providers, setProviders] = useState<any>({});

  const onLoginUser = async (data: InputsForm) => {
    //const { email, password } = data;
    setShowError(false);

    await signIn("credentials", {
      email: data.email,
      password: data.password,
    });

    // const isValidLogin = await loginUser(email, password);

    // if (!isValidLogin) {
    //   setShowError(true);
    //   setTimeout(() => {
    //     setShowError(false);
    //   }, 3000);
    //   return;
    // }

    // const destination = router.query.p?.toString() || "/";
    // router.replace(destination);
  };

  useEffect(() => {
    getProviders().then((prov) => {
      setProviders(prov);
    });
  }, []);

  return (
    <AuthLayout title="Ingresar">
      <form onSubmit={handleSubmit(onLoginUser)} noValidate>
        <Box sx={{ width: 350, padding: "10px 20px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h1" component="h1">
                Iniciar sesión
              </Typography>
              {/* {showError && (
                <Chip
                  label="User not found"
                  color="error"
                  icon={<ErrorOutline />}
                  className="fadeIn"
                />
              )} */}
              <Chip
                label="User not found"
                color="error"
                icon={<ErrorOutline />}
                className="fadeIn"
                sx={{ display: showError ? "flex" : "none" }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                type={"email"}
                label="Correo"
                variant="filled"
                fullWidth
                {...register("email", {
                  required: "This field is required",
                  validate: validations.isEmail,
                  //validate: (val)=> validations.isEmail(val),
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Contrasena"
                type="password"
                variant="filled"
                fullWidth
                {...register("password", {
                  required: "This field is required",
                  minLength: {
                    value: 5,
                    message: "Password must be at least 5 characters",
                  },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                color="secondary"
                className="circular-btn"
                size="large"
                fullWidth
                disabled={isSubmitting}
              >
                Ingresar
              </Button>
            </Grid>

            <Grid item xs={12} display="flex" justifyContent="end">
              <NextLink
                href={
                  router.query.p
                    ? `/auth/register?p=${router.query.p}`
                    : "/auth/register"
                }
                passHref
              >
                <Link underline="always">No tienes cuenta?</Link>
              </NextLink>
            </Grid>

            <Grid item xs={12} display="flex" flexDirection="column">
              <Divider sx={{ width: "100%", mb: 2 }} />
              {Object.values(providers).map((provider: any) => {
                if (provider.id === "credentials")
                  return <div key="credentials"></div>;

                return (
                  <Button
                    key={provider.id}
                    variant="outlined"
                    fullWidth
                    color="primary"
                    sx={{
                      mb: 1,
                    }}
                    onClick={() => signIn(provider.id)}
                  >
                    {provider.name}
                  </Button>
                );
              })}
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const session = await getSession({ req });

  const { p = "/" } = query;

  if (session) {
    return {
      redirect: {
        destination: p.toString(),
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
