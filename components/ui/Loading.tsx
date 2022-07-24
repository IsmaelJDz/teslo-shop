import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

type Props = {};

export function Loading({}: Props) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="calc(100vh - 200px)"
    >
      <Typography sx={{ mb: 3 }} variant="h2" fontWeight={200} fontSize={20}>
        Loading...
      </Typography>
      <CircularProgress tabIndex={2} />
    </Box>
  );
}
