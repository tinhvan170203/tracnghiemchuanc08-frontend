import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import AutoAwesomeMotionIcon from "@mui/icons-material/AutoAwesomeMotion";
import CancelIcon from "@mui/icons-material/Cancel";
import { Box, Button, Grid, IconButton, LinearProgress, styled, Typography } from "@mui/material";
import { InputField } from "../../../components/form-control/InputField";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import  {RadioField}  from "../../../components/form-control/RadioField";
import { SelectFieldNoneAll } from "../../../components/form-control/SelectFieldNoneAll";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CancelButton = styled(IconButton)({
  position: "absolute",
  right: "16px",
  top: "4px"
})

const schema = yup
  .object({
    text: yup
      .string()
      .required("Lỗi: Vui lòng nhập tên Công an đơn vị, địa phương"),
    thutu: yup
      .number()
      .required("Lỗi: Vui lòng nhập số thứ tự"),
    domain: yup
      .string()
      .required("Lỗi: Vui lòng nhập domain"),
  })
  .required();

export default function DialogAdd({
  open,
  onCloseDialogAdd,
  onSubmit
}) {
  const form = useForm({
    defaultValues:  {
      text: "Công an",
      domain: "/public/sumary/toan-quoc",
      thutu: 1
    },
    resolver: yupResolver(schema),
  });

  const handleFormSubmit = async (values) => {
    if (onSubmit) {
      await onSubmit(values);
      form.reset();
    }
  };

  const { isSubmitting } = form.formState;

  return (
    <>
      <Dialog
        maxWidth="lg"
        fullWidth={true}
        disableEscapeKeyDown={true}
        onClose={(event, reason) => {
          // bỏ click ở nền đen mà mất dialog
          if (reason !== "backdropClick") {
            onCloseDialogAdd(event, reason);
          }
        }}
        open={open}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle
          style={{
            display: "flex",
            borderBottom: "1px solid #ccc",
            margin: "0 12px",
          }}
        >
          <AutoAwesomeMotionIcon style={{ color: "#333", fontSize: "32px" }} />
          <span>Thêm mới domain địa phương hệ thống</span>
          <CancelButton onClick={() => onCloseDialogAdd()}>
            <CancelIcon style={{color: "#d32b2b"}}/>
          </CancelButton>
        </DialogTitle>
        <DialogContent>
          <Box>
            {isSubmitting ? <LinearProgress /> : ""}
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              style={{ width: "100%" }}
            >
              <Grid
                container
                spacing={1}
                style={{ alignItems: "center", justifyContent: "center" }}
              >
                <Grid item xs={12} md={12} lg={12}>
                  <InputField
                    name="text"
                    form={form}
                    label="Tên Công an đơn vị *"
                    type="text"
                    disabled={false}
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  <InputField
                    name="domain"
                    form={form}
                    label="Domain chính *"
                    type="text"
                    disabled={false}
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  <InputField
                    name="thutu"
                    form={form}
                    label="Thứ tự *"
                    type="number"
                    disabled={false}
                  />
                </Grid>
              </Grid>
              <DialogActions>
                <Button
                  color="primary"
                  variant="contained"
                  disabled={isSubmitting}
                  type="submit"
                  style={{ margin: "4px auto" }}
                >
                  <AddIcon />
                  <span>Xác nhận thêm mới</span>
                </Button>
              </DialogActions>
            </form>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}

