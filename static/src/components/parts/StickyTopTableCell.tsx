import { TableCell } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";

const StickyTopTableCell = React.memo(
  styled(TableCell)(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    position: "sticky",
    top: 0,
  }))
);

export default StickyTopTableCell;
