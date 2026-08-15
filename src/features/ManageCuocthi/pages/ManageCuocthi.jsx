import React, { useEffect, useState, useMemo, lazy, Suspense } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import SearchIcon from "@mui/icons-material/Search";
import BackspaceIcon from "@mui/icons-material/Backspace";
import querystring from "query-string";

import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { InputField } from "../../../components/form-control/InputField";
import { Button, Paper } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ModalLoading from "../../../components/ModalLoading";

import DashboardIcon from "@mui/icons-material/Dashboard";
// import DialogAddCauhoi from "./../components/DialogAddCauhoi";
import monthiApi from "./../../../api/monthiApi";
import CustomPaginationActionsTable from "../components/CustomPaginationActionsTable";
// import DialogDelete from "./../../../components/DialogDelete";

// import DialogEditCauhoi from "./../components/DialogEditCauhoi";
const DialogAddCauhoi = lazy(() => import("./../components/DialogAddCauhoi"));
const DialogEditCauhoi = lazy(() => import("./../components/DialogEditCauhoi"));
const DialogDelete = lazy(() => import("./../../../components/DialogDelete"));

const schema = yup.object({}).required();

const ManageCuocthi = () => {
  const form = useForm({
    defaultValues: {
      tencuocthi: "",
    },
    resolver: yupResolver(schema),
  });

  const roles = useSelector((state) => state.authReducer.roles_x01);

  const [list, setList] = useState([]);
  const [listBase, setListBase] = useState([]);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  let [searchParams, setSearchParams] = useSearchParams();
  const [openModalLoading, setOpenModalLoading] = useState(false);
  const [monthiList, setMonthiList] = useState([]);
  const [id_monthi, setIdMonthi] = useState(null);
  const [chuyendeList, setChuyendeList] = useState([]);
  const [text, setText] = useState('');
  const [tungay, setTungay] = useState("");
  const [denngay, setDenngay] = useState("");
  const [xeploai, setXeploai] = useState("");
  const [exportingId, setExportingId] = useState(null);
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

  const queryParams = useMemo(() => {
    const params = querystring.parse(location.search);
    return {
      ...params,
      tencuocthi: params.tencuocthi || "",
    };
  }, [location.search]);

  useEffect(() => {
    const getMonthiOfUser = async () => {
      try {
        let res = await monthiApi.getMonthiOfUser();
        setMonthiList(res.data.quantrinhommonthi);
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
  }, []);

  useEffect(() => {
    if (id_monthi) {
      const getCuocthis = async () => {
        try {
          setOpenModalLoading(true);
          let res = await monthiApi.getCuocthis({ ...queryParams, id_monthi });
          let res1 = await monthiApi.getChuyendes({ id_monthi });
          setChuyendeList(res1.data.map(i => ({ label: i.title, value: i._id })))
          setList(res.data);
          setListBase(res.data)
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

      getCuocthis();
    }
  }, [id_monthi, queryParams]);

  // handle submit search
  const handleFormSearchSubmit = async (values) => {
    setSearchParams({ ...queryParams, ...values });
  };

  //func xóa trắng các trường tìm kiếm
  const handleDeleteField = () => {
    form.reset();
  };

  const [openDialogAddCauhoi, setOpenDialogAddCauhoi] = useState(false);

  const handleCloseDialogAddCauhoi = () => {
    setOpenDialogAddCauhoi(false);
  };

  const handleOpenDialogAddCauhoi = () => {
    setOpenDialogAddCauhoi(true);
  };

  const handleExportExcel = async (row) => {
    if (!row?._id) return;
    setExportingId(row._id);
    try {
      const res = await monthiApi.exportKetquaExcel(row._id, {
        tungay,
        denngay,
        xeploai,
      });
      const contentType = res.headers?.["content-type"] || "";
      if (contentType.includes("application/json")) {
        const textRes = await res.data.text();
        const parsed = JSON.parse(textRes);
        throw new Error(parsed.message || "Không xuất được file Excel");
      }
      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const safe =
        String(row.tencuocthi || "export")
          .replace(/[^\w\-]+/g, "_")
          .slice(0, 60) || "export";
      a.download = `KetQuaThi_${safe}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      enqueueSnackbar(error?.message || "Không xuất được file Excel", {
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
        variant: "error",
      });
    } finally {
      setExportingId(null);
    }
  };

  const handleChangeMonthi = (event) => {
    setIdMonthi(event.target.value);
  };

  const handleSubmitAdd = async (values) => {
    if (!id_monthi) {
      enqueueSnackbar("Vui lòng chọn môn thi trắc nghiệm", {
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
        variant: "error",
      });
      return;
    }
    try {
      let data = { ...values, queryParams };
      let res = await monthiApi.addCuocthi(id_monthi, data);
      setList(res.data.items);
      setListBase(res.data.items);
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
      navigate("/login");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      let res = await monthiApi.deleteCuocthi(openDialogDelete.id_Delete, { ...queryParams, id_monthi: id_monthi });
      setList(res.data.items)
      setListBase(res.data.items)
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

  const handleChangeStatusCuocthi = async (id_cuocthi) => {
    let data = {
      ...queryParams,
      id_monthi,
      id_cuocthi,
    };
    try {
      let res = await monthiApi.editStatusCuocthi(data);
      setList(res.data);
      setListBase(res.data);
      enqueueSnackbar("Thay đổi trạng thái cuộc đánh giá thành công!", {
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

  const handleSubmitEdit = async (values) => {
    let data = {
      ...values,
      queryParams: {
        ...queryParams,
      },
      id_cuocthi: values.id_edit,
      id_monthi,
    };
    try {
      let res = await monthiApi.updateOptionCuocthi(data);
      setList(res.data.items);
      setListBase(res.data.items);
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
      setOpenModalLoading(false);
    };
  };

  useEffect(() => {
    // Nếu listBase chưa có dữ liệu thì không chạy
    if (listBase.length === 0) return;

    const timer = setTimeout(() => {
      const dataDisplay = listBase.filter(i =>
        i.tencuocthi.toLowerCase().includes(text.toLowerCase())
      );
      setList(dataDisplay);
    }, 500);

    return () => clearTimeout(timer);
  }, [text, listBase]); // Thêm listBase vào dependency để cập nhật khi dữ liệu API về

  return (
    <div className="mx-2 bg-white pb-2 px-4 shadow-2xl py-2">
      <h3 className="flex items-center space-x-2">
        <DashboardIcon />
        <span className="text-lg font-semibold">
          Quản lý cuộc đánh giá
        </span>
      </h3>
      <div className="py-4 ml-4 mt-2">
        <div className="my-2 mb-4">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              Kiến thức đánh giá
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Kiến thức đánh giá"
              value={id_monthi !== null ? id_monthi : " "}
              size="small"
              onChange={handleChangeMonthi}
            >
              <MenuItem value=" " disabled hidden={true}>
                Vui lòng chọn kiến thức đánh giá
              </MenuItem>
              {monthiList.map((i) => (
                <MenuItem value={i._id} key={i._id}>
                  {i.tenmonthi}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <form
          onSubmit={form.handleSubmit(handleFormSearchSubmit)}
          className="bg-gray-100 rounded-xl mt-8"
        >
          <fieldset
            style={{ border: "1px solid #ccc", paddingBlockEnd: "12px" }}
          >
            <legend style={{ paddingInline: "12px", fontWeight: "bold" }}>
              Tra cứu cuộc đánh giá:
            </legend>
            <div className="flex p-4 flex-1 flex-wrap">
              <div className="px-1 w-full">
                <InputField
                  name="tencuocthi"
                  form={form}
                  label="Tên cuộc đánh giá"
                  type="text"
                  disabled={false}
                />
              </div>
            </div>
            <div className="flex flex-col px-4 space-y-2 md:space-y-0 md:space-x-2 md:items-center md:justify-center md:flex-row">
              <Button
                color="primary"
                variant="contained"
                type="submit"
              >
                <SearchIcon />
                <span>Tìm kiếm cuộc đánh giá</span>
              </Button>
              <Button
                variant="contained"
                onClick={handleDeleteField}
                color="warning"
              >
                <span className="mr-2">Xóa trắng</span>
                <BackspaceIcon />
              </Button>
            </div>
          </fieldset>
        </form>

        {roles && roles.includes("thêm cuộc thi") && id_monthi && (
          <div className="text-end mb-4 mt-8">
            <Button variant="contained" onClick={handleOpenDialogAddCauhoi}>
              <AddIcon />
              Tạo mới cuộc đánh giá
            </Button>
          </div>
        )}

        {openModalLoading && <ModalLoading open={openModalLoading} />}
      </div>

      <div className="mb-4 flex flex-col md:flex-row md:items-end gap-3 flex-wrap">
        <input type="text" onChange={(e) => setText(e.target.value)} placeholder="Tìm kiếm cuộc thi" className="outline-none border rounded-sm border-slate-400 py-2 px-4" />
        <div className="flex items-center justify-between space-x-2">
          <label className="text-[12px] font-semibold whitespace-nowrap">Từ ngày</label>
          <input type="date" value={tungay} onChange={(e) => setTungay(e.target.value)} className="outline-none border text-[12px] p-1 bg-gray-100" />
        </div>
        <div className="flex items-center justify-between space-x-2">
          <label className="text-[12px] font-semibold whitespace-nowrap">Đến ngày</label>
          <input type="date" value={denngay} onChange={(e) => setDenngay(e.target.value)} className="outline-none border text-[12px] p-1 bg-gray-100" />
        </div>
        <div className="flex items-center justify-between space-x-2">
          <label className="text-[12px] font-semibold whitespace-nowrap">Xếp loại</label>
          <select value={xeploai} onChange={(e) => setXeploai(e.target.value)} className="outline-none border text-[12px] p-1 bg-gray-100">
            <option value="">Tất cả</option>
            <option value="Xuất sắc">Xuất sắc</option>
            <option value="Giỏi">Giỏi</option>
            <option value="Khá">Khá</option>
            <option value="Trung bình">Trung bình</option>
            <option value="Không đạt">Không đạt</option>
          </select>
        </div>
      </div>

      <CustomPaginationActionsTable
        list={list}
        item={openDialogEdit.item}
        onClickOpenDialogDelete={handleOpenDialogDelete}
        onClickOpenDialogEdit={handleOpenDialogEdit}
        onHandleChangeStatusCuocthi={handleChangeStatusCuocthi}
        onExportExcel={handleExportExcel}
        exportingId={exportingId}
      />

      <Suspense fallback={<ModalLoading open={true} />}>
        <DialogAddCauhoi
          open={openDialogAddCauhoi}
          onCloseDialogAddCauhoi={handleCloseDialogAddCauhoi}
          onSubmit={handleSubmitAdd}
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
      </Suspense>
    </div>
  );
};

export default ManageCuocthi;
