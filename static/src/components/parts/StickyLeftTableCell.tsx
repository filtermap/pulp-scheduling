import { TableCell } from "@mui/material";
import { styled } from "@mui/material/styles";

const StickyLeftTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  left: 0,
  position: "sticky",
  zIndex: 1,
}));

export default StickyLeftTableCell;
