import Add from "@mui/icons-material/Add";
import Fab, { FabProps } from "@mui/material/Fab";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { useTranslation } from "react-i18next";

// React Fab component - MUI
// https://mui.com/components/floating-action-button/

const CorneredFab = React.memo(
  styled(Fab)(({ theme }) => ({
    position: "fixed",
    right: theme.spacing(2),
    top: `calc(${theme.mixins.toolbar.minHeight}px + ${theme.spacing(2)})`,
  }))
);

const AddWithMargin = React.memo(
  styled(Add)(({ theme }) => ({
    marginRight: theme.spacing(1),
  }))
);

type FloatingAddButtonProps = FabProps;

// eslint-disable-next-line react/display-name
const FloatingAddButton = React.memo(
  (props: FloatingAddButtonProps): JSX.Element => {
    const { t } = useTranslation();
    return (
      <CorneredFab
        variant="extended"
        color="primary"
        aria-label="add"
        {...props}
      >
        <AddWithMargin />
        {t("追加")}
      </CorneredFab>
    );
  }
);

export default FloatingAddButton;
