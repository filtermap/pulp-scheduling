import { SxProps } from "@mui/material";

const lineThroughSx: SxProps = {
  "&::-webkit-datetime-edit-fields-wrapper": {
    textDecoration: "line-through",
  },
  textDecoration: "line-through",
};

export default lineThroughSx;
