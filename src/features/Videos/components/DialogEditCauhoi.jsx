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
import { SelectFieldNoneAll } from "../../../components/form-control/SelectFieldNoneAll";
import { API_SERVER } from "../../../api/apiServer";
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
    name: yup
      .string()
      .required("Lỗi: Vui lòng nhập trường này"),

    thutu: yup
      .number()
      .required("Lỗi: Vui lòng nhập trường này"),
  })
  .required();

export default function DialogEditCauhoi({
  open,
  onCloseDialogEdit,
  item,
  onSubmit
}) {

  const refEdit = React.useRef();
  const [file, setFile] = React.useState(null);

  const form = useForm({
    defaultValues: {
      name: "",
      mota: "",
      thutu: 1,
      active: true
    },
    resolver: yupResolver(schema),
  });

  const setValue = form.setValue;
  const watch = form.watch;

  useEffect(() => {
    if (item) {
      setValue("mota", item.mota);
      setValue("name", item.name, { shouldValidate: true });
      setValue("thutu", item.thutu, { shouldValidate: true });
      setValue("active", item.active !== false);
    }
  }, [item]);

  const handleFormSubmit = async (values) => {
    if (onSubmit) {
      await onSubmit(values);
      onCloseDialogEdit()
    }
  };

  const { isSubmitting } = form.formState;

  return (
    <>
      <Dialog
        maxWidth="xl"
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
          <span>Chỉnh sửa video tuyên truyền</span>
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
                    name="name"
                    form={form}
                    label="Tiêu đề, nội dung video *"
                    type="text"
                    disabled={false}
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  <InputField
                    name="mota"
                    form={form}
                    label="Mô tả *"
                    type="text"
                    disabled={false}
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  <InputField
                    name="thutu"
                    form={form}
                    label="Thứ tự xuất hiện"
                    type="text"
                    disabled={false}
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={watch("active") !== false}
                        onChange={(e) => setValue("active", e.target.checked)}
                      />
                    }
                    label="Hiển thị trên trang người tham gia"
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
