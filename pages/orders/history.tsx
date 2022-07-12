import NextLink from "next/link";
import { Grid, Typography, Chip, Link } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { ShopLayout } from "../../components/layout/ShopLayout";

type Props = {};

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "ID",
    width: 100,
  },
  {
    field: "fullName",
    headerName: "Full Name",
    width: 300,
  },
  {
    field: "paid",
    headerName: "Paid",
    description: "Paid",
    width: 200,
    renderCell: (params: GridValueGetterParams) => {
      return params.row.paid ? (
        <Chip label="Paid" color="success" variant="outlined" />
      ) : (
        <Chip label="Not Paid" color="error" variant="outlined" />
      );
    },
  },
  {
    field: "order",
    headerName: "See order",
    width: 200,
    sortable: false,
    renderCell: (params: GridValueGetterParams) => {
      return (
        <NextLink href={`/orders/${params.row.id}`} passHref>
          <Link underline="always">Ver order</Link>
        </NextLink>
      );
    },
  },
];

const rows = [
  {
    id: 1,
    paid: true,
    fullName: "John Doe",
  },
  {
    id: 2,
    paid: false,
    fullName: "Jane Doe",
  },
  {
    id: 3,
    paid: true,
    fullName: "Nick Doe",
  },
  {
    id: 4,
    paid: false,
    fullName: "Jack Doe",
  },
  {
    id: 5,
    paid: true,
    fullName: "Jill Doe",
  },
];

export default function History({}: Props) {
  return (
    <ShopLayout
      title="Historial de ordenes"
      pageDescription="Historial de ordenes"
    >
      <Typography variant="h1" component="h1">
        Historial de ordenes
      </Typography>

      <Grid>
        <Grid item xs={12} sx={{ height: 650, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>
    </ShopLayout>
  );
}
