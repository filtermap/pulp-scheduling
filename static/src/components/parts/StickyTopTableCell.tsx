import { TableCell } from "@mui/material";
import { styled } from "@mui/material/styles";

const StickyTopTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  position: "sticky",
  top: 0,
  zIndex: 1,
}));

export default StickyTopTableCell;
