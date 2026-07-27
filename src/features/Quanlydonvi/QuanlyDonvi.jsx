import React, { useEffect, useState, useMemo, lazy } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSearchParams } from "react-router-dom";
import { InputField } from "../../components/form-control/InputField";
import { Button, Paper } from "@mui/material";
import ModalLoading from "../../components/ModalLoading";
import AddIcon from "@mui/icons-material/Add";
import { useSelector } from "react-redux";
import cauhoiApi from "../../api/cauhoiApi";
import DashboardIcon from "@mui/icons-material/Dashboard";
import monthiApi from "../../api/monthiApi";
import DialogAdd from "./components/DialogAdd";
import CustomPaginationActionsTable from "./components/CustomPaginationActionsTable";
import DialogEdit from "./components/DialogEdit";
import DialogDelete from './../../components/DialogDelete';
import c08Api from "../../api/c08Api";
import { Try } from "@mui/icons-material";
const schema = yup.object({}).required();

const QuanlyDiaphuong = () => {
  const form = useForm({
    defaultValues: {
      hoten: "",
      donvi: ""
    },
    resolver: yupResolver(schema),
  });

  const roles = useSelector((state) => state.authReducer.roles_x01);
  const [donviList, setDonviList] = useState([]);
  const [id_monthi, setIdMonthi] = useState(null);
  const [list, setList] = useState([]);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  let [searchParams, setSearchParams] = useSearchParams();
  const [openModalLoading, setOpenModalLoading] = useState(false);

  const [openDialogEdit, setOpenDialogEdit] = useState({
    status: false,
    item: null,
  });

  //open dialog edit
  const handleOpenDialogEdit = (item) => {
    setOpenDialogEdit({
      item,
      status: true,
    });
  };

  //close dialog edit
  const handleCloseDialogEdit = () => {
    setOpenDialogEdit({
      ...openDialogEdit,
      status: false,
    });
  };

  //state mở hộp thoại delete
  const [openDialogDelete, setOpenDialogDelete] = useState({
    status: false,
    id_Delete: null,
  });

  //open dialog delete
  const handleOpenDialogDelete = (id) => {
    setOpenDialogDelete({
      status: true,
      id_Delete: id,
    });
  };

  const handleCloseDialogDelete = () => {
    setOpenDialogDelete({
      ...openDialogDelete,
      status: false,
    });
  };

  const handleCancelDelete = () => {
    setOpenDialogDelete({
      ...openDialogDelete,
      status: false,
    });
  };

useEffect(()=>{
  const fetch = async () => {
   try {
    let res = await c08Api.getDiaphuongs();
    setList(res.data)
   } catch (error) {
    alert(error.message)
   }
  };

  fetch()
},[])

  // handle submit search
  const handleFormSearchSubmit = async (values) => {
    // setSearchParams({  ...values });
  };

  //func xóa trắng các trường tìm kiếm
  const handleDeleteField = () => {
    form.reset();
  };

  const [openDialogAdd, setOpenDialogAdd] = useState(false);

  const handleCloseDialogAdd = () => {
    setOpenDialogAdd(false);
  };

  const handleOpenDialogAdd = () => {
    setOpenDialogAdd(true);
  };

  const handleSubmitAdd = async (values) => {
    try {
      let data = { ...values };
      let res = await c08Api.addDiaphuong(data);
      setList(res.data.items);
      enqueueSnackbar("Thêm mới thành công!", {
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
        variant: "success",
      });
    } catch (error) {
      if (
        error.message ===
        "Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại"
      ) {
        navigate("/login");
        enqueueSnackbar(error.message, {
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
          variant: "error",
        });
      }

      enqueueSnackbar(error.message, {
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
        variant: "error",
      });
      setOpenModalLoading(false);
    }
  };

  //handle submit edit
  const handleSubmitEdit = async (values) => {
    // console.log(values)
    const obj = { ...values };
    try {
      let res = await c08Api.editDiaphuong(obj);
      setList(res.data.items);

      enqueueSnackbar(res.data.message, {
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
        variant: "success",
      });
    } catch (error) {
      if (
        error.message ===
        "Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại"
      ) {
        navigate("/login");
        enqueueSnackbar(error.message, {
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
          variant: "error",
        });
      }

      enqueueSnackbar(error.message, {
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
        variant: "error",
      });
    }
  };

  const handleConfirmDelete = async () => {
    try {
      let res = await c08Api.deleteDiaphuong(openDialogDelete.id_Delete);

      setList(res.data.items);
      setOpenDialogDelete({
        ...openDialogDelete,
        status: false,
      });

      enqueueSnackbar(res.data.message, {
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
        variant: "success",
      });
    } catch (error) {
      if (
        error.message ===
        "Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại"
      ) {
        navigate("/login");
        enqueueSnackbar(error.message, {
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
          variant: "error",
        });
      }
      enqueueSnackbar(error.message, {
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
        variant: "error",
      });
    }
  };


  return (
    <div className="mx-2 bg-white pb-2 px-4 shadow-2xl">
      <div className="py-4 ml-4 mt-2">
        <h3 className="flex items-center space-x-2">
          <DashboardIcon />
          <span className="md:text-md text-sm uppercase font-semibold">Quản lý domain Công an địa phương</span>
        </h3>



        <div className="text-end mb-4 mt-8">
          <Button variant="contained" onClick={handleOpenDialogAdd}>
            <AddIcon />
            Thêm mới domain
          </Button>
        </div>
        {openModalLoading && <ModalLoading open={openModalLoading} />}
      </div>


      <DialogAdd
        open={openDialogAdd}
        onCloseDialogAdd={handleCloseDialogAdd}
        onSubmit={handleSubmitAdd}
        donviList={donviList}
      />

      <CustomPaginationActionsTable
        list={list}
        item={openDialogEdit.item}
        onClickOpenDialogDelete={handleOpenDialogDelete}
        onClickOpenDialogEdit={handleOpenDialogEdit}
      />

      <DialogEdit
        open={openDialogEdit.status}
        item={openDialogEdit.item}
        onCloseDialogEdit={handleCloseDialogEdit}
        onSubmit={handleSubmitEdit}
        donviList={donviList}
      />

      <DialogDelete
        open={openDialogDelete.status}
        onCloseDialogDelete={handleCloseDialogDelete}
        onConfirmDelete={handleConfirmDelete}
        onCancelDelete={handleCancelDelete}
      />
    </div>
  );
};

export default QuanlyDiaphuong;
