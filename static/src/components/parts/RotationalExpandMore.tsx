import ExpandMore from "@mui/icons-material/ExpandMore";
import { SvgIconProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import * as React from "react";

// React Card component - MUI
// https://mui.com/components/cards/#complex-interaction

interface RotationalExpandMoreProps extends SvgIconProps {
  expanded: boolean;
}

const RotationalExpandMore = React.memo(
  styled((props: RotationalExpandMoreProps) => {
    const { expanded, ...other } = props;
    return <ExpandMore {...other} />;
  })(({ theme, expanded }) => ({
    transform: !expanded ? "rotate(0deg)" : "rotate(180deg)",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  }))
);

export default RotationalExpandMore;
