import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import NotListedLocationIcon from '@mui/icons-material/NotListedLocation';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import CircularProgress from '@mui/material/CircularProgress';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DialogDelete({
  open,
  onCloseDialogDelete,
  onConfirmDelete,
  onCancelDelete,
  loading = false,
}) {

  return (
    <div>
      <Dialog
        disableEscapeKeyDown={true}
        onClose={(event, reason) => { // bỏ click ở nền đen mà mất dialog
            if (!loading && reason !== "backdropClick") {
                onCloseDialogDelete(event, reason);
            }
          }}
        open={open}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle style={{display: "flex", borderBottom:"1px solid #ccc", margin: "0 12px"}}>
          <NotListedLocationIcon style={{color: "red", fontSize: "32px"}}/>
          <span>Bạn có chắc chắn muốn xóa mục này hay không?</span>
        </DialogTitle>
        <DialogContent>
          <img className='p-4 mx-auto' src="/garbage_delete.png" alt="icon-trash" />
          <DialogContentText id="alert-dialog-slide-description">
           
          </DialogContentText>
        </DialogContent>
            <div className="flex justify-evenly pb-4">
                <Button
                  variant="contained"
                  color='success'
                  onClick={onConfirmDelete}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <CheckIcon />}
                >
                  {loading ? "Đang xóa..." : "Đồng ý"}
                </Button>
                <Button
                  variant="contained"
                  color='error'
                  onClick={onCancelDelete}
                  disabled={loading}
                >
                  <CancelIcon/> Hủy
                </Button>
            </div>
      </Dialog>
    </div>
  );
}
