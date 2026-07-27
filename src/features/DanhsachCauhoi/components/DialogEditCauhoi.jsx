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
    question: yup
      .string()
      .required("Lỗi: Vui lòng nhập nội dung câu hỏi"),
    chuyende: yup.string().required("Vui lòng chọn chuyên đề, phần thi"),
    answer: yup.string().required("Lỗi: Vui lòng chọn đáp án đúng"),
  })
  .required();

export default function DialogEditCauhoi({
  open,
  onCloseDialogEdit,
  chuyendeList,
  item,
  onSubmit
}) {

   const refEdit = React.useRef();
   const [file, setFile] = React.useState(null);

  const form = useForm({
    defaultValues: {
      question: "",
      option_a: "",
      option_b: "",
      option_c: "",
      option_d: "",
      option_e: "",
      image: "",
      answer: null,
      chuyende: ''
    },
    resolver: yupResolver(schema),
  });

  const setValue = form.setValue;
  const watch = form.watch;

  useEffect(() => {
    if (item) {
      setValue("question", item.question, { shouldValidate: true });
      setValue("chuyende", item.chuyende._id, { shouldValidate: true });
      setValue("image", item.image && item.image !== "" ? item.image : "");
      setValue("option_a", item.option_a);
      setValue("option_b", item.option_b);
      setValue("option_c", item.option_c);
      setValue("option_d", item.option_d);
      setValue("option_e", item.option_e);
      setValue("answer", item.answer, { shouldValidate: true });
    }
  }, [item]);

  const handleFormSubmit = async (values) => {
    if (onSubmit) {
            let formData = new FormData();
      formData.append('question', values.question);
      formData.append('chuyende', values.chuyende);
      formData.append('option_a', values.option_a);
      formData.append('option_b', values.option_b);
      formData.append('option_c', values.option_c);
      formData.append('option_d', values.option_d);
      formData.append('option_e', values.option_e);
      formData.append('answer', values.answer);
      formData.append('id_edit', item._id);
      formData.append('file', file);
      await onSubmit(formData);
       if (refEdit.current) refEdit.current.value = "";
      // const data = { ...values, id_edit: item._id }
      // await onSubmit(data);
      onCloseDialogEdit()
    }
  };

  const { isSubmitting } = form.formState;
  const handleFileChangeEdit = (e) => {
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
          <span>Chỉnh sửa câu hỏi trắc nghiệm</span>
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
                    name="question"
                    form={form}
                    label="Nội dung câu hỏi *"
                    type="text"
                    disabled={false}
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                <input type="file" ref={refEdit} onChange={handleFileChangeEdit} accept=".png, .jpg,.jpeg" />
                </Grid>
                <span>Ảnh đã lưu</span>
                {watch('image') !== "" && (
                  <div className="md:w-[400px]">
                    <img src={`${API_SERVER}c08/uploads/${watch('image')}`} alt="ảnh câu hỏi" />
                  </div>
                )}
                <Grid item xs={12} md={12} lg={12}>
                  <SelectFieldNoneAll
                    name="chuyende"
                    form={form}
                    label="Chuyên đề, phần thi"
                    options={chuyendeList}
                    disabled={false}
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  <InputField
                    name="option_a"
                    form={form}
                    label="Đáp án A"
                    type="text"
                    disabled={false}
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  <InputField
                    name="option_b"
                    form={form}
                    label="Đáp án B"
                    type="text"
                    disabled={false}
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  <InputField
                    name="option_c"
                    form={form}
                    label="Đáp án C"
                    type="text"
                    disabled={false}
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  <InputField
                    name="option_d"
                    form={form}
                    label="Đáp án D"
                    type="text"
                    disabled={false}
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  <InputField
                    name="option_e"
                    form={form}
                    label="Đáp án E"
                    type="text"
                    disabled={false}
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  <RadioField
                    name="answer"
                    form={form}
                    label="Đáp án đúng:"
                    type="text"
                    disabled={false}
                    options={[
                      { value: "option_a", label: "Đáp án A" },
                      { value: "option_b", label: "Đáp án B" },
                      { value: "option_c", label: "Đáp án C" },
                      { value: "option_d", label: "Đáp án D" },
                      { value: "option_e", label: "Đáp án E" },
                    ]}
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
