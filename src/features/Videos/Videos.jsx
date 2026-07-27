import React, { useEffect, useState, useMemo, lazy } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import monthiApi from "../../api/monthiApi";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import commonApi from "../../api/commonApi";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import SearchIcon from "@mui/icons-material/Search";
import BackspaceIcon from "@mui/icons-material/Backspace";
import querystring from "query-string";
import dayjs from "dayjs";
import { useSearchParams } from "react-router-dom";
import { InputField } from "../../components/form-control/InputField";
import { Button, Paper } from "@mui/material";
import ModalLoading from "../../components/ModalLoading";
import AddIcon from "@mui/icons-material/Add";
import { useSelector } from "react-redux";
import DialogAddCauhoi from "./components/DialogAddCauhoi";
import cauhoiApi from "../../api/cauhoiApi";
import CustomPaginationActionsTable from "./components/CustomPaginationActionsTable";
import DialogEditCauhoi from "./components/DialogEditCauhoi";
import DialogDelete from "../../components/DialogDelete";
import { SelectFieldNoneAll } from "../../components/form-control/SelectFieldNoneAll";
import { SelectField } from "../../components/form-control/SelectField";
import videoApi from "../../api/videoApi";
import VideoViewer from "../../components/VideoViewer";
const schema = yup.object({}).required();

const Videos = () => {
  const form = useForm({
    defaultValues: {
      name: "",
      link: "",
      thutu: 1
    },
    resolver: yupResolver(schema),
  });

  const roles = useSelector((state) => (state.authReducer.roles_x01));
  const [monthiList, setMonthiList] = useState([]);
  const [display, setDisplay] = useState({
    status: false,
    video: null
  });
  const [cauhoiList, setCauhoiList] = useState([])
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  let [searchParams, setSearchParams] = useSearchParams();
  const [openModalLoading, setOpenModalLoading] = useState(false);
  const [donviList, setDonviList] = useState([]);
  const [chuyendeList, setChuyendeList] = useState([]);


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




  useEffect(() => {

    const getCauhois = async () => {
      try {
        setOpenModalLoading(true);
        let res = await videoApi.getVideos();
        console.log(res)
        setCauhoiList(res.data);
        setOpenModalLoading(false);
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

    getCauhois();

  }, []);


  const [openDialogAddCauhoi, setOpenDialogAddCauhoi] = useState(false);

  const handleCloseDialogAddCauhoi = () => {
    setOpenDialogAddCauhoi(false);
  };

  const handleOpenDialogAddCauhoi = () => {
    setOpenDialogAddCauhoi(true);
  };

  // Thêm tham số onProgress vào đây
  const handleSubmitAddCauhoi = async (values, onProgress) => {
    try {
      // 2. GỬI REQUEST: Truyền onProgress xuống hàm API
      let res = await videoApi.addVideo(values, onProgress);

      setCauhoiList(res.data.items);
      enqueueSnackbar("Thêm mới thành công!", {
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
        variant: "success",
      });
    } catch (error) {
      if (
        error.message ===
        "Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại"
      ) {
        navigate("/login");
      }

      enqueueSnackbar(error.message, {
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
        variant: "error",
      });
      setOpenModalLoading(false);
    }
  };

  //handle submit edit
  const handleSubmitEdit = async (values) => {
    try {
      let res = await videoApi.editVideo({ ...values, id_edit: openDialogEdit.item._id });
      setCauhoiList(res.data.items)

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
      let res = await videoApi.deleteVideo(openDialogDelete.id_Delete);
      setCauhoiList(res.data.items)

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

  const handlePlayVideo = (video)=>{
    setDisplay({
      ...display, status: true, video
    })
  };

  return (
    <div className="mx-2 bg-white pb-2 px-4 shadow-2xl">
      <p className="uppercase py-4 font-semibold">Quản lý video tuyên truyền</p>
      {display.status && (
        <div className="w-full md:w-[40%] mx-auto">
          <VideoViewer video={display.video}/>
        </div>
      )}
      <div className="text-end mb-4 mt-8">
        <Button variant="contained" onClick={handleOpenDialogAddCauhoi}>
          <AddIcon />
          Thêm mới video tuyên truyền
        </Button>
      </div>
      <div className="shadow-lg shadow-slate-400 pb-2 mb-4">
        <CustomPaginationActionsTable
          list={cauhoiList}
          onClickOpenDialogDelete={handleOpenDialogDelete}
          onClickOpenDialogEdit={handleOpenDialogEdit}
          onViewPlayer={handlePlayVideo}
        />
      </div>

      <DialogAddCauhoi
        open={openDialogAddCauhoi}
        onCloseDialogAddCauhoi={handleCloseDialogAddCauhoi}
        onSubmit={handleSubmitAddCauhoi}
        chuyendeList={chuyendeList}
      />

      <DialogEditCauhoi
        open={openDialogEdit.status}
        item={openDialogEdit.item}
        onCloseDialogEdit={handleCloseDialogEdit}
        onSubmit={handleSubmitEdit}
        chuyendeList={chuyendeList}
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

export default Videos;
