import React from "react";
import Head from "next/head";
import { Box } from "@mui/material";

type Props = {
  title: string;
  children: React.ReactNode | React.ReactNode[];
};

export function AuthLayout({ title, children }: Props) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <main>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="calc(100vh - 200px)"
        >
          {children}
        </Box>
      </main>
    </>
  );
}
