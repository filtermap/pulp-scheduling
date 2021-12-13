import * as React from "react";
import { styled } from "@mui/material/styles";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import ExpandMore from "@mui/icons-material/ExpandMore";

// React Card component - MUI
// https://mui.com/components/cards/#complex-interaction

interface ExpandMoreProps extends IconButtonProps {
  expanded: boolean;
}

const ExpandMoreButton = styled((props: ExpandMoreProps) => {
  const { expanded, ...other } = props;
  return (
    <IconButton {...other}>
      <ExpandMore />
    </IconButton>
  );
})(({ theme, expanded }) => ({
  transform: !expanded ? "rotate(0deg)" : "rotate(180deg)",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default ExpandMoreButton;
