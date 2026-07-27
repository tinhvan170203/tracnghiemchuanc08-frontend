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
import dayjs from "dayjs";
import { RadioField } from "../../../components/form-control/RadioField";
import { DateTimeField } from "../../../components/form-control/DateTimeField";
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
    tencuocthi: yup
      .string()
      .required("Lỗi: Vui lòng nhập tên cuộc thi"),
    soluongcauhoi: yup.number().required("Lỗi: Vui lòng chọn số lượng câu hỏi"),
    thoigianthi: yup.number().required("Lỗi: Vui lòng chọn thời gian thi"),
    ngaytochucthi: yup.string().required("Lỗi: Vui lòng chọn ngày tổ chức thi"),
    // password: yup.number().required("Lỗi: Vui lòng chọn số điểm"),
    // password: yup
    // .string()
    // .required("Lỗi: Vui lòng đặt mật khẩu cho cuộc thi để tăng tính bảo mật"),
  })
  .required();

export default function DialogEditCauhoi({
  open,
  onCloseDialogEdit,
  item,
  onSubmit,
  chuyendeList
}) {

  const form = useForm({
    defaultValues: {
      tencuocthi: "",
      password: "",
      thoigianthi: 90,
      soluongcauhoi: 50,
      ngaytochucthi: dayjs(Date.now())
    },
    resolver: yupResolver(schema),
  });

  const setValue = form.setValue;

  useEffect(() => {
    if (item) {
      setValue("tencuocthi", item.tencuocthi, { shouldValidate: true });
      setValue("thoigianthi", item.thoigianthi);
      setValue("ngaytochucthi", dayjs(item.ngaytochucthi));
      setValue("soluongcauhoi", item.soluongcauhoi);
    }
  }, [item]);

  let [config, setConfig] = useState([]);
  let [optionsConfig, setOptionsConfig] = useState([]);
  let [configOld, setConfigOld] = useState([]);

  useEffect(() => {
    // setOptionsConfig(chuyendeList.map(i=>({chuyende: i.value, title: i.label})));
    if (item) {
      setConfig(chuyendeList.map(i => {
        let check = item.config.find(e => e.chuyende.toString() == i.value);
        if (check) {
          return { chuyende: i.value, title: i.label, soluongcauhoi: check.soluongcauhoi }
        } else {
          return { chuyende: i.value, title: i.label, soluongcauhoi: 0 }
        }
      }))

    }
  }, [chuyendeList, item])


  const handleFormSubmit = async (values) => {
    let arr = [...config];
    arr = config.map(i => ({
      ...i, soluongcauhoi: i.soluongcauhoi === "" ? 0 : Number(i.soluongcauhoi)
    }));

    let checkedNumberCauhoi = 0;
    arr.forEach(i => {
      checkedNumberCauhoi += Number(i.soluongcauhoi);
    });
// console.log(checkedNumberCauhoi)
    if (checkedNumberCauhoi === 0) {
      alert("Vui lòng nhập cấu hình số lượng câu hỏi cho mỗi chuyên đề thi");
      return;
    }
    if (onSubmit) {
      const data = { ...values, id_edit: item._id, config: arr }
      await onSubmit(data);
      onCloseDialogEdit()
    }
  };

  const { isSubmitting } = form.formState;

  const handleChangeNumber = (id, event) => {
    let arr = [...config];
    arr = arr.map(item => {
      if (item.chuyende === id) {
        return { ...item, soluongcauhoi: event.target.value }
      } else return { ...item }
    });
    setConfig(arr)
  };

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
          <span>Chỉnh sửa thông số cuộc đánh giá</span>
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
                    name="tencuocthi"
                    form={form}
                    label="Tên cuộc đánh giá *"
                    type="text"
                    disabled={false}
                  />
                </Grid>
                <Grid item xs={3} md={3} lg={3}>
                  <InputField
                    name="soluongcauhoi"
                    form={form}
                    label="Số lượng câu hỏi thi *"
                    type="number"
                    disabled={false}
                  />
                </Grid>
                <Grid item xs={3} md={3} lg={3}>
                  <InputField
                    name="thoigianthi"
                    form={form}
                    label="Thời gian làm bài thi tính bằng phút *"
                    type="number"
                    disabled={false}
                  />
                </Grid>
                <Grid item xs={3} md={3} lg={3}>
                  <DateTimeField
                    name="ngaytochucthi"
                    form={form}
                    label="Ngày tổ chức cuộc thi *"
                    disabled={false}
                  />
                </Grid>
              </Grid>
              <p className="font-semibold mt-4">Cấu hình số câu hỏi từng chuyên đề</p>

              <div className="border-t mt-4">
                {config.map(i => (
                  <div className="flex items-center justify-between border-b border-b-gray-500">
                    <p className="text-gray-800 text-sm">{i.title}</p>
                    <input className="outline-none w-[60px] p-2" value={i.soluongcauhoi} onChange={(e) => handleChangeNumber(i.chuyende, e)} placeholder="Số lượng câu hỏi" type="number" min={0} />
                  </div>
                ))}
              </div>
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
