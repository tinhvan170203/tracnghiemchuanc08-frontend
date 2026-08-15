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
import { RadioField } from "../../../components/form-control/RadioField";
import { MultipleSelect } from "../../../components/form-control/MultipeSelect";
import { SelectField } from "../../../components/form-control/SelectField";
import { SelectFieldNoneAll } from "../../../components/form-control/SelectFieldNoneAll";
import { useState } from "react";

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

export default function DialogAddCauhoi({
  open,
  onCloseDialogAddCauhoi,
  onSubmit
}) {

  // 1. Khởi tạo state lưu % progress (null là chưa upload)
  const [uploadProgress, setUploadProgress] = useState(null);
  const ref = React.useRef();
  const [file, setFile] = useState(null);

  const form = useForm({
    defaultValues: {
      name: "",
      mota: "",
      thutu: 1,
      is_source_link_orther: false,
      link_orther: ""
    },
    resolver: yupResolver(schema),
  });

  const setValue = form.setValue;
  const watch = form.watch;
  const register = form.register;

  const handleFormSubmit = async (values) => {
    if (onSubmit) {
      let formData = new FormData();
      formData.append('name', values.name);
      formData.append('mota', values.mota);
      formData.append('thutu', values.thutu);
      formData.append('is_source_link_orther', values.is_source_link_orther);
      formData.append('link_orther', values.link_orther);

      if (file) {
        formData.append("file", file);
      };

      try {
        setUploadProgress(0); // Bắt đầu upload

        // Truyền callback để lấy % progress từ API service
        await onSubmit(formData, (percent) => {
          setUploadProgress(percent);
        });
        setFile(null);
        if (ref.current) ref.current.value = "";
      } catch (error) {
        console.error("Upload thất bại:", error);
      } finally {
        setUploadProgress(null); // Reset lại progress bar
      };
      setValue("mota", '');
      setValue("name", '');
      setValue("link_orther", '');
      setValue("thutu", Number(values.thutu) + 1);
    }
  };

  const { isSubmitting } = form.formState;
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(e.target.files[0])
  };
  return (
    <>
      <Dialog
        maxWidth="xl"
        fullWidth={true}
        disableEscapeKeyDown={true}
        onClose={(event, reason) => {
          // bỏ click ở nền đen mà mất dialog
          if (reason !== "backdropClick") {
            onCloseDialogAddCauhoi(event, reason);
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
          <span>Thêm mới video tuyên truyền</span>
          <CancelButton onClick={() => onCloseDialogAddCauhoi()}>
            <CancelIcon style={{ color: "#d32b2b" }} />
          </CancelButton>
        </DialogTitle>
        <DialogContent>
          <Box>
            {isSubmitting ? <>
              {uploadProgress !== null && (
                <Box sx={{ width: '100%', mb: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={uploadProgress}
                  />
                  <Typography variant="body2" color="text.secondary" align="right" sx={{ mt: 0.5 }}>
                    {`Đang tải lên: ${uploadProgress}%`}
                  </Typography>
                </Box>
              )}
            </> : ""}
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
                  <input type="file" ref={ref} onChange={handleFileChange} accept=".MKV,.AVI,.mp4" />
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
                  <div className="flex items-center space-x-2">
              <label htmlFor="is_source_link_orther" className="text-[13px] font-semibold">Sử dụng đường link từ nguồn khác</label>
              <input id="is_source_link_orther" type="checkbox" className="w-4 h-4" {...register('is_source_link_orther')}/>
                  </div>
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  <InputField
                    name="link_orther"
                    form={form}
                    label="Đường link nguồn video từ nguồn khác"
                    type="text"
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
                  <span>Thêm mới</span>
                </Button>
              </DialogActions>
            </form>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}

