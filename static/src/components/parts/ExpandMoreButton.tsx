import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import * as React from "react";

import RotationalExpandMore from "./RotationalExpandMore";

// React Card component - MUI
// https://mui.com/components/cards/#complex-interaction

interface ExpandMoreButtonProps extends IconButtonProps {
  expanded: boolean;
}

const ExpandMoreButton = (props: ExpandMoreButtonProps): JSX.Element => {
  const { expanded, ...other } = props;
  return (
    <IconButton {...other}>
      <RotationalExpandMore expanded={expanded} />
    </IconButton>
  );
};

export default ExpandMoreButton;
