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
const schema = yup.object({}).required();

const Chuyende = () => {
  const form = useForm({
    defaultValues: {
      question: ""
    },
    resolver: yupResolver(schema),
  });

  const roles = useSelector((state) => (state.authReducer.roles_x01));
  const [monthiList, setMonthiList] = useState([]);
  const [cauhoiList, setCauhoiList] = useState([])
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  let [searchParams, setSearchParams] = useSearchParams();
  const [openModalLoading, setOpenModalLoading] = useState(false);
  const [donviList, setDonviList] = useState([])
  const id_monthi = searchParams.get("id_monthi") || null;

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
  const [isDeleting, setIsDeleting] = useState(false);

  //open dialog delete
  const handleOpenDialogDelete = (id) => {
    setOpenDialogDelete({
      status: true,
      id_Delete: id,
    });
  };

  const handleCloseDialogDelete = () => {
    if (isDeleting) return;
    setOpenDialogDelete({
      ...openDialogDelete,
      status: false,
    });
  };

  const handleCancelDelete = () => {
    if (isDeleting) return;
    setOpenDialogDelete({
      ...openDialogDelete,
      status: false,
    });
  };



  useEffect(() => {
    const getMonthiOfUser = async () => {
      try {
        let res = await monthiApi.getMonthiOfUser();
        setMonthiList(res.data.quantrinhommonthi);
        setDonviList(res.data.donviList)
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

    getMonthiOfUser();
  }, [])

  useEffect(() => {
    if (!monthiList?.length || !id_monthi) return;
    const allowed = monthiList.some((i) => String(i._id) === String(id_monthi));
    if (!allowed) {
      const next = new URLSearchParams(searchParams);
      next.delete("id_monthi");
      setSearchParams(next, { replace: true });
      setCauhoiList([]);
    }
  }, [monthiList, id_monthi]);

  useEffect(() => {
    if (id_monthi) {
      const getCauhois = async () => {
        try {
          setOpenModalLoading(true);
          let res = await monthiApi.getChuyendes({ id_monthi });
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
    }
  }, [id_monthi]);

  const handleChangeMonthi = (event) => {
    const next = new URLSearchParams(searchParams);
    const value = event.target.value;
    if (value && value !== " ") next.set("id_monthi", value);
    else next.delete("id_monthi");
    setSearchParams(next, { replace: true });
  };

  const [openDialogAddCauhoi, setOpenDialogAddCauhoi] = useState(false);
  const handleCloseDialogAddCauhoi = () => {
    setOpenDialogAddCauhoi(false);
  };
  const handleOpenDialogAddCauhoi = () => {
    setOpenDialogAddCauhoi(true);
  };

  const handleSubmitAddCauhoi = async (values) => {
    if (!id_monthi) {
      enqueueSnackbar('Vui lòng chọn môn thi', {
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
        variant: "error",
      });
      return;
    }
    try {
      let data = { ...values, monthi: id_monthi };
      let res = await monthiApi.addChuyende(data)
      setCauhoiList(res.data.items)
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
    const obj = { ...values, monthi: id_monthi };
    // console.log(obj)
    try {
      let res = await monthiApi.editChuyende(obj);
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

  const handleToggleHoctap = async (row, checked) => {
    try {
      const res = await monthiApi.editChuyende({
        monthi: id_monthi,
        id_edit: row._id,
        title: row.title,
        link_test: row.link_test,
        hien_thi_hoctap: checked,
      });
      setCauhoiList(res.data.items);
    } catch (error) {
      enqueueSnackbar(error.message, {
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
        variant: "error",
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (isDeleting || !openDialogDelete.id_Delete) return;
    setIsDeleting(true);
    try {
      let res = await monthiApi.deleteChuyende(id_monthi, openDialogDelete.id_Delete);
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
      enqueueSnackbar(error.message, {
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
        variant: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="mx-2 bg-white pb-2 px-4 shadow-2xl">
      <div className="py-4 mt-2">
        <div className="my-2 mb-4">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              Kiến thức
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Chuyên đề"
              value={id_monthi !== null ? id_monthi : " "}
              size="small"
              onChange={handleChangeMonthi}
            >
              <MenuItem value=" " disabled hidden={true}>Vui lòng chọn kiến thức đánh giá</MenuItem>
              {monthiList.map((i) => (
                <MenuItem value={i._id} name={i.tenmonthi} key={i._id}>{i.tenmonthi}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>


        {roles && roles.includes("thêm chuyên đề") && id_monthi && (
          <div className="text-end mb-4 mt-8">
            <Button variant="contained" onClick={handleOpenDialogAddCauhoi}>
              <AddIcon />
              Thêm mới chuyên đề
            </Button>
          </div>
        )}
        {monthiList.length === 0 && (
          <p className="text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-3">
            Tài khoản chưa được phân quyền kiến thức đánh giá nào nên không quản lý được chuyên đề. Liên hệ quản trị viên (mục Phân quyền QL kiến thức đánh giá).
          </p>
        )}
        {openModalLoading && <ModalLoading open={openModalLoading} />}
      </div>

      <div className="shadow-lg shadow-slate-400 pb-2 mb-4">

        <CustomPaginationActionsTable
          list={cauhoiList}
          item={openDialogEdit.item}
          onClickOpenDialogDelete={handleOpenDialogDelete}
          onClickOpenDialogEdit={handleOpenDialogEdit}
          onToggleHoctap={handleToggleHoctap}
        />
      </div>

      <DialogAddCauhoi
        open={openDialogAddCauhoi}
        onCloseDialogAddCauhoi={handleCloseDialogAddCauhoi}
        onSubmit={handleSubmitAddCauhoi}
      />

      <DialogEditCauhoi
        open={openDialogEdit.status}
        item={openDialogEdit.item}
        onCloseDialogEdit={handleCloseDialogEdit}
        onSubmit={handleSubmitEdit}
      />

      <DialogDelete
        open={openDialogDelete.status}
        onCloseDialogDelete={handleCloseDialogDelete}
        onConfirmDelete={handleConfirmDelete}
        onCancelDelete={handleCancelDelete}
        loading={isDeleting}
      />
    </div>
  );
};

export default Chuyende;
