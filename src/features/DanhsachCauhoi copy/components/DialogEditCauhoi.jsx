import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import AutoAwesomeMotionIcon from "@mui/icons-material/AutoAwesomeMotion";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import { Box, Button, Checkbox, FormControlLabel, Grid, IconButton, LinearProgress, styled, Typography } from "@mui/material";
import { InputField } from "../../../components/form-control/InputField";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import { useEffect } from "react";
import { RadioField } from "../../../components/form-control/RadioField";
import { MultipleSelect } from "../../../components/form-control/MultipeSelect";
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
    title: yup
      .string()
      .required("Lỗi: Vui lòng nhập nội dung chuyên đề"),
  })
  .required();

export default function DialogEditCauhoi({
  open,
  onCloseDialogEdit,
  item,
  onSubmit
}) {
  const form = useForm({
    defaultValues: {
      title: "",
      link_test: "",
      hien_thi_hoctap: false,
    },
    resolver: yupResolver(schema),
  });

  const setValue = form.setValue;

  useEffect(() => {
    if (item) {
      setValue("title", item.title, { shouldValidate: true });
      setValue("link_test", item.link_test);
      setValue("hien_thi_hoctap", !!item.hien_thi_hoctap);
    }
  }, [item]);

  const handleFormSubmit = async (values) => {
    if (onSubmit) {
      const data = { ...values, id_edit: item._id }
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
          <span>Chỉnh sửa chuyên đề, phần thi</span>
          <CancelButton onClick={() => onCloseDialogEdit()}>
            <CancelIcon style={{ color: "#d32b2b" }} />
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
                    name="title"
                    form={form}
                    label="Nội dung chuyên đề, phần thi *"
                    type="text"
                    disabled={false}
                  />
                  <Grid item xs={12} md={12} lg={12}>
                    <InputField
                      name="link_test"
                      form={form}
                      label="Id cuộc thi để tự kiểm tra đánh giá kiến thức tổng hợp"
                      type="text"
                      disabled={false}
                    />
                  </Grid>
                  <Grid item xs={12} md={12} lg={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={!!form.watch("hien_thi_hoctap")}
                          onChange={(e) => form.setValue("hien_thi_hoctap", e.target.checked)}
                        />
                      }
                      label="Hiện trên trang tự học"
                    />
                  </Grid>

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
