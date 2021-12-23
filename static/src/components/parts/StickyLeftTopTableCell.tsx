import { TableCell } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";

const StickyLeftTopTableCell = React.memo(
  styled(TableCell)(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    left: 0,
    position: "sticky",
    top: 0,
    zIndex: 2,
  }))
);

export default StickyLeftTopTableCell;
