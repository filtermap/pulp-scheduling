import { DialogActions } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";

const FlexStartDialogActions = React.memo(
  styled(DialogActions)({
    justifyContent: "flex-start",
  })
);

export default FlexStartDialogActions;
