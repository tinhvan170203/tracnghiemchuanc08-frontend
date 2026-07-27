import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import AutoAwesomeMotionIcon from "@mui/icons-material/AutoAwesomeMotion";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import { Box, Button, Grid, IconButton, LinearProgress, styled, Typography } from "@mui/material";
import { InputField } from "../../../components/form-control/InputField";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import { useEffect } from "react";
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
  hoten: yup
    .string()
    .required("Lỗi: Vui lòng nhập họ tên thí sinh"),
  sbd: yup
    .number()
    .required("Lỗi: Vui lòng nhập số báo danh"),
  capbac: yup
    .string()
    .required("Lỗi: Vui lòng chọn cấp hàm"),
  chucvu: yup
    .string()
    .required("Lỗi: Vui lòng chọn chức vụ"),
  donvi: yup
    .string()
    .required("Lỗi: Vui lòng chọn đơn vị công tác"),
  namsinh:  yup
    .string()
    .required("Lỗi: Vui lòng nhập năm sinh"),
})
  .required();

export default function DialogEdit({
  open,
  onCloseDialogEdit,
  item,
  onSubmit,
  donviList
}) {
  const form = useForm({
    defaultValues:  {
      hoten: "",
      sbd: 1,
      donvi: "",
      namsinh: "1996",
      capbac: "Trung úy",
      chucvu: "Chiến sĩ"
    },
    resolver: yupResolver(schema),
  });

  const setValue = form.setValue;

  useEffect(() => {
    if(item){
        setValue("hoten",item.hoten,{ shouldValidate: true });
        setValue("sbd",item.sbd,{ shouldValidate: true });
        setValue("namsinh",item.namsinh,{ shouldValidate: true });
        setValue("donvi",item.donvi._id,{ shouldValidate: true });
        setValue("capbac",item.capbac,{ shouldValidate: true });
        setValue("chucvu",item.chucvu,{ shouldValidate: true });
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
        // maxWidth="lg"
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
          <span>Chỉnh sửa thông tin thí sinh</span>
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
                <Grid item xs={12} md={12} lg={12}>
                  <InputField
                    name="hoten"
                    form={form}
                    label="Họ và tên *"
                    type="text"
                    disabled={false}
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  <InputField
                    name="sbd"
                    form={form}
                    label="Số báo danh *"
                    type="number"
                    disabled={false}
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  <InputField
                    name="namsinh"
                    form={form}
                    label="Năm sinh *"
                    type="text"
                    disabled={false}
                  />
                </Grid>
                       <Grid item xs={12} md={12} lg={12}>
                  <SelectFieldNoneAll
                    name="capbac"
                    form={form}
                    label="Cấp bậc hàm *"
                    disabled={false}
                    options={[
                      {value: "Trung sĩ", label: "Trung sĩ"},
                      {value: "Thượng sĩ", label: "Thượng sĩ"},
                      {value: "Thiếu úy", label: "Thiếu úy"},
                      {value: "Trung úy", label: "Trung úy"},
                      {value: "Thượng úy", label: "Thượng úy"},
                      {value: "Đại úy", label: "Đại úy"},
                      {value: "Thiếu tá", label: "Thiếu tá"},
                      {value: "Trung tá", label: "Trung tá"},
                      {value: "Thượng tá", label: "Thượng tá"},
                      {value: "Đại tá", label: "Đại tá"},
                    ]}
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  <SelectFieldNoneAll
                    name="chucvu"
                    form={form}
                    label="Chức vụ công tác *"
                    disabled={false}
                    options={[
                      {value: "Chiến sĩ", label: "Chiến sĩ"},
                      {value: "Cán bộ", label: "Cán bộ"},
                      {value: "Phó đội trưởng và tương đương", label: "Phó đội trưởng và tương đương"},
                      {value: "Đội trưởng và tương đương", label: "Đội trưởng và tương đương"},
                      {value: "Phó Trưởng Công an xã, phường, thị trấn", label: "Phó Trưởng Công an xã, phường, thị trấn"},
                      {value: "Trưởng Công an xã", label: "Trưởng Công an xã"},
                      {value: "Trưởng Công an phường", label: "Trưởng Công an phường"},
                      {value: "Trưởng Công an thị trấn", label: "Trưởng Công an thị trấn"},
                      {value: "Phó Trưởng Công an huyện, thị xã, thành phố", label: "Phó Trưởng Công an huyện, thị xã, thành phố"},
                      {value: "Trưởng Công an huyện, thị xã, thành phố", label: "Trưởng Công an huyện, thị xã, thành phố"},
                      {value: "Phó Trưởng phòng và tương đương", label: "Phó Trưởng phòng và tương đương"},
                      {value: "Trưởng phòng và tương đương", label: "Trưởng phòng và tương đương"}
                    ]}
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  <SelectFieldNoneAll
                    name="donvi"
                    form={form}
                    label="Đơn vị công tác *"
                    disabled={false}
                    options={donviList}
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
