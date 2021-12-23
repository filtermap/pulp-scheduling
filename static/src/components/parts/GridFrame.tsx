import { styled } from "@mui/material/styles";
import React from "react";

const GridFrame = React.memo(
  styled("div")(({ theme }) => ({
    padding: theme.spacing(1),
  }))
);

export default GridFrame;
