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
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ModalLoading from "../../../components/ModalLoading";

import DashboardIcon from "@mui/icons-material/Dashboard";
// import DialogAddCauhoi from "./../components/DialogAddCauhoi";
import monthiApi from "./../../../api/monthiApi";
import {
  downloadBlobFile,
  getBlobErrorMessage,
  parseExportResponse,
  waitForExportJob,
} from "../../../utils/excelDownload";
import CustomPaginationActionsTable from "../components/CustomPaginationActionsTable";
import ExportJobProgressDialog from "../components/ExportJobProgressDialog";
import CreatorAccountAutocomplete from "../../../components/CreatorAccountAutocomplete";
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
  const location = useLocation();
  const [openModalLoading, setOpenModalLoading] = useState(false);
  const [monthiList, setMonthiList] = useState([]);
  const id_monthi = searchParams.get("id_monthi") || null;
  const [chuyendeList, setChuyendeList] = useState([]);
  const [text, setText] = useState('');
  const [tungay, setTungay] = useState("");
  const [denngay, setDenngay] = useState("");
  const [xeploai, setXeploai] = useState("");
  const [exportingId, setExportingId] = useState(null);
  const [exportingAll, setExportingAll] = useState(false);
  const [isContestSuperAdmin, setIsContestSuperAdmin] = useState(false);
  const [creatorOptions, setCreatorOptions] = useState([]);
  const [creatorIds, setCreatorIds] = useState(
    () => searchParams.get("creatorIds") || ""
  );
  const [exportJobOpen, setExportJobOpen] = useState(false);
  const [exportJob, setExportJob] = useState(null);
  const [exportJobError, setExportJobError] = useState("");
  const [exportJobDownloading, setExportJobDownloading] = useState(false);
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
        setMonthiList(res.data.quantrinhommonthi || []);
        setIsContestSuperAdmin(!!res.data.isContestSuperAdmin);
        if (res.data.isContestSuperAdmin) {
          const scope = await monthiApi.getContestScopeOptions();
          setCreatorOptions(scope.data.creators || []);
          setIsContestSuperAdmin(!!scope.data.isContestSuperAdmin);
          if (scope.data.monthiList?.length) {
            setMonthiList(scope.data.monthiList);
          }
        }
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
          let res = await monthiApi.getCuocthis({
            ...queryParams,
            id_monthi,
            creatorIds: isContestSuperAdmin ? creatorIds : undefined,
          });
          let res1 = await monthiApi.getChuyendes({ id_monthi });
          setChuyendeList(res1.data.map(i => ({ label: i.title, value: i._id })))
          setList(res.data);
          setListBase(res.data)
          setOpenModalLoading(false);
        } catch (error) {
          setOpenModalLoading(false);
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
  }, [id_monthi, queryParams, creatorIds, isContestSuperAdmin]);

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

  const runExportJobFlow = async (jobSeed) => {
    const jobId = jobSeed?.jobId || jobSeed?._id;
    if (!jobId) throw new Error("Thiếu mã job xuất");
    setExportJobError("");
    setExportJob(jobSeed);
    setExportJobOpen(true);
    const finalJob = await waitForExportJob(
      (id) => monthiApi.getKetquaExportJob(id),
      jobId,
      { onProgress: setExportJob }
    );
    setExportJob(finalJob);
    try {
      const res = await monthiApi.downloadKetquaExportJob(jobId);
      const data = res.data;
      if (data instanceof Blob && data.type?.includes("application/json")) {
        const text = await data.text();
        const parsed = JSON.parse(text);
        throw new Error(parsed.message || "Không tải được file");
      }
      downloadBlobFile(
        data,
        finalJob?.fileName || "KetQuaThi.zip",
        "application/zip"
      );
    } catch (error) {
      const message = await getBlobErrorMessage(error, "Không tải được file");
      setExportJobError(message);
    }
    return finalJob;
  };

  const handleDownloadExportJob = async () => {
    const jobId = exportJob?.jobId || exportJob?._id;
    if (!jobId) return;
    setExportJobDownloading(true);
    try {
      const res = await monthiApi.downloadKetquaExportJob(jobId);
      const data = res.data;
      if (data instanceof Blob && data.type?.includes("application/json")) {
        const text = await data.text();
        const parsed = JSON.parse(text);
        throw new Error(parsed.message || "Không tải được file");
      }
      downloadBlobFile(
        data,
        exportJob?.fileName || "KetQuaThi.zip",
        "application/zip"
      );
    } catch (error) {
      const message = await getBlobErrorMessage(error, "Không tải được file");
      setExportJobError(message);
      enqueueSnackbar(message, {
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
        variant: "error",
      });
    } finally {
      setExportJobDownloading(false);
    }
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
      const parsed = await parseExportResponse(res);
      if (parsed.type === "job") {
        await runExportJobFlow(parsed.job);
        return;
      }
      const safe =
        String(row.tencuocthi || "export")
          .replace(/[^\w\-]+/g, "_")
          .slice(0, 60) || "export";
      downloadBlobFile(
        parsed.data,
        `KetQuaThi_${safe}.xlsx`,
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
    } catch (error) {
      const message = await getBlobErrorMessage(error);
      enqueueSnackbar(message, {
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
        variant: "error",
      });
    } finally {
      setExportingId(null);
    }
  };

  const handleExportExcelAll = async () => {
    const ids = list.map((item) => item._id).filter(Boolean);
    if (!ids.length) {
      enqueueSnackbar("Không có cuộc thi để xuất Excel", {
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
        variant: "warning",
      });
      return;
    }
    setExportingAll(true);
    try {
      const res = await monthiApi.createKetquaExportJob({
        type: "ketqua-many",
        ids,
        tungay,
        denngay,
        xeploai,
      });
      await runExportJobFlow(res.data);
    } catch (error) {
      const message = await getBlobErrorMessage(error);
      enqueueSnackbar(message, {
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
        variant: "error",
      });
    } finally {
      setExportingAll(false);
    }
  };

  const handleChangeMonthi = (event) => {
    const next = new URLSearchParams(searchParams);
    const value = event.target.value;
    if (value && value !== " ") next.set("id_monthi", value);
    else next.delete("id_monthi");
    setSearchParams(next, { replace: true });
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
        {isContestSuperAdmin && (
          <div className="flex items-center gap-2 min-w-[260px] max-w-[320px]">
            <label className="text-[12px] font-semibold whitespace-nowrap">Tài khoản tạo</label>
            <div className="flex-1">
              <CreatorAccountAutocomplete
                options={creatorOptions}
                value={creatorIds}
                size="small"
                variant="compact"
                placeholder="Tất cả — gõ tìm…"
                onChange={(value) => {
                  setCreatorIds(value);
                  const next = new URLSearchParams(searchParams);
                  if (value) next.set("creatorIds", value);
                  else next.delete("creatorIds");
                  setSearchParams(next, { replace: true });
                }}
              />
            </div>
          </div>
        )}
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
        {roles && roles.includes("xem cuộc thi") && (
          <Button
            variant="contained"
            color="success"
            size="small"
            startIcon={<FileDownloadIcon />}
            disabled={exportingAll || !list.length}
            onClick={handleExportExcelAll}
          >
            {exportingAll ? "Đang xuất..." : "Xuất Excel tất cả"}
          </Button>
        )}
      </div>

      <CustomPaginationActionsTable
        list={list}
        item={openDialogEdit.item}
        onClickOpenDialogDelete={handleOpenDialogDelete}
        onClickOpenDialogEdit={handleOpenDialogEdit}
        onHandleChangeStatusCuocthi={handleChangeStatusCuocthi}
        onExportExcel={handleExportExcel}
        exportingId={exportingId}
        isContestSuperAdmin={isContestSuperAdmin}
        creatorOptions={creatorOptions}
        onAssignOwner={async (row, userId) => {
          if (!id_monthi || !userId) return;
          try {
            const res = await monthiApi.assignCuocthiOwner(id_monthi, row._id, {
              userId,
              tencuocthi: queryParams.tencuocthi || "",
              creatorIds: isContestSuperAdmin ? creatorIds : undefined,
            });
            setList(res.data.items);
            setListBase(res.data.items);
            enqueueSnackbar(res.data.message || "Đã gán chủ sở hữu", {
              variant: "success",
              anchorOrigin: { vertical: "bottom", horizontal: "right" },
            });
          } catch (error) {
            enqueueSnackbar(error.message || "Không gán được chủ sở hữu", {
              variant: "error",
              anchorOrigin: { vertical: "bottom", horizontal: "right" },
            });
          }
        }}
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

      <ExportJobProgressDialog
        open={exportJobOpen}
        job={exportJob}
        error={exportJobError}
        downloading={exportJobDownloading}
        onClose={() => {
          setExportJobOpen(false);
          setExportJobError("");
        }}
        onDownload={handleDownloadExportJob}
      />
    </div>
  );
};

export default ManageCuocthi;
