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
import { useEffect } from "react";

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
    capham: yup
      .string()
      .required("Lỗi: Vui lòng nhập tên cấp bậc hàm"),
    thutu: yup
      .number()
      .required("Lỗi: Vui lòng nhập thứ tự")
      .min(1, "Thứ tự phải lớn hơn 1"),
    nienhanlenham: yup
      .number()
      .required("Lỗi: Vui lòng nhập niên hạn lên cấp bậc hàm tiếp theo")
  })
  .required();

export default function DialogEditBacHam({
  open,
  item,
  onCloseDialogEdit,
  onSubmit
}) {
  const form = useForm({
    defaultValues:  {
      capham: "",
      nienhanlenham: 1,
      thutu: 1,
    },
    resolver: yupResolver(schema),
  });

  const setValue = form.setValue;

  useEffect(() => {
    if(item){
        setValue("capham",item.capham,{ shouldValidate: true });
        setValue("thutu",item.thutu,{ shouldValidate: true });
        setValue("nienhanlenham",item.nienhanlenham,{ shouldValidate: true });
    }
  }, [item]);

  const handleFormSubmit = async (values) => {
    if (onSubmit) {
      const data = {...values,id_edit: item._id}
      await onSubmit(data);
      onCloseDialogEdit()
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
            onCloseDialogEdit(event, reason);
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
          <span>Chỉnh sửa cấp bậc hàm</span>
          <CancelButton onClick={() => onCloseDialogEdit()}>
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
                <Grid item xs={12} md={6} lg={6}>
                  <InputField
                    name="capham"
                    form={form}
                    label="Tên cấp bậc hàm *"
                    type="text"
                    disabled={false}
                  />
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                  <InputField
                    name="nienhanlenham"
                    form={form}
                    label="Niên hạn lên quân hàm kế tiếp tính theo năm*"
                    type="number"
                    disabled={false}
                  />
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                  <InputField
                    name="thutu"
                    form={form}
                    label="Thứ tự"
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
                  <span>Cập nhật</span>
                </Button>
              </DialogActions>
            </form>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
