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
import dayjs from "dayjs";
import { DateTimeField } from "../../../components/form-control/DateTimeField";
import { useEffect } from "react";
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
      // .string()
      // .required("Lỗi: Vui lòng đặt mật khẩu cho cuộc thi để tăng tính bảo mật"),
  })
  .required();

export default function DialogAddCauhoi({
  open,
  onCloseDialogAddCauhoi,
  onSubmit,
  chuyendeList
}) {
  const form = useForm({
    defaultValues:  {
      tencuocthi: "",
      password: "",
      thoigianthi: 90,
      soluongcauhoi: 50,
      ngaytochucthi: dayjs(Date.now())
    },
    resolver: yupResolver(schema),
  });

  const handleFormSubmit = async (values) => {
    let arr = [...config];
    arr = config.map(i=>({
      ...i, soluongcauhoi: i.soluongcauhoi === "" ? 0 : Number(i.soluongcauhoi)
    }));

    let checkedNumberCauhoi = 0;
    arr.forEach(i => {
      checkedNumberCauhoi += Number(i.soluongcauhoi);
    });
 console.log(checkedNumberCauhoi)
    if(checkedNumberCauhoi === 0){
      alert("Vui lòng nhập cấu hình số lượng câu hỏi cho mỗi chuyên đề thi");
      return;
    };

    let data = {...values, config: arr}
    if (onSubmit) {
      await onSubmit(data);
      setConfig([]);
      form.reset();
      onCloseDialogAddCauhoi()
    }
  };

  let [config, setConfig] = useState([]);

  useEffect(()=>{
    setConfig(chuyendeList.map(i=>({chuyende: i.value, title: i.label, soluongcauhoi: 0})))
  },[chuyendeList])

  const { isSubmitting } = form.formState;
  const handleChangeNumber = (id, event) => {
    let arr =[...config];
    arr = arr.map(item=>{
      if(item.chuyende === id){
        return {...item, soluongcauhoi: event.target.value}
      }else return {...item}
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
          <span>Thêm mới cuộc đánh giá</span>
          <CancelButton onClick={() => onCloseDialogAddCauhoi()}>
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
                {/* <Grid item xs={3} md={3} lg={3}>
                  <InputField
                    name="password"
                    form={form}
                    label="Số điểm cuộc thi *"
                    type="number"
                    disabled={false}
                  />
                </Grid> */}
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
                {config.map(i=>(
                 <div className="flex items-center justify-between border-b border-b-gray-500">
                    <p className="text-gray-800 text-sm">{i.title}</p>
                    <input className="outline-none w-[60px] p-2" value={i.soluongcauhoi} onChange={(e)=>handleChangeNumber(i.chuyende,e)} placeholder="Số lượng câu hỏi" type="number" min={0}/>
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
                  <span>Thêm mới cuộc thi</span>
                </Button>
              </DialogActions>
            </form>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}

