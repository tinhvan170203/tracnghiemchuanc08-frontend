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
const schema = yup.object({}).required();

const DanhsachCauhoi = () => {
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
  const id_monthi = searchParams.get("id_monthi") || null;
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

  const queryParams = useMemo(() => {
    const params = querystring.parse(location.search);
    return {
      ...params,
      question: params.question || "",
      chuyende: params.chuyende || ""
    };
  }, [location.search]);

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
    if (id_monthi) {
      const getCauhois = async () => {
        try {
          setOpenModalLoading(true);
          let res = await cauhoiApi.getCauhois({ ...queryParams, id_monthi });
          let res1 = await monthiApi.getChuyendes({ id_monthi });
          // console.log(res1)
          setChuyendeList(res1.data.map(i => ({ label: i.title, value: i._id })))
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
  }, [id_monthi, queryParams]);

  const handleChangeMonthi = (event) => {
    const next = new URLSearchParams(searchParams);
    const value = event.target.value;
    if (value && value !== " ") next.set("id_monthi", value);
    else next.delete("id_monthi");
    setSearchParams(next, { replace: true });
  };

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
      // 1. XỬ LÝ FORMDATA: values lúc này đã là bản sao/chính thức của FormData từ con truyền lên
      // Thêm trường 'monthi' trực tiếp vào FormData
      values.append("monthi", id_monthi);
      values.append("queryParams", JSON.stringify(queryParams));


      // 2. GỬI REQUEST: Truyền thẳng đối tượng values (FormData) vào API
      let res = await cauhoiApi.addCauhoi(values);
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

  const handleToggleActive = async (row, active) => {
    try {
      let res = await cauhoiApi.setActive(row._id, {
        active,
        monthi: id_monthi,
        queryParams,
      });
      setCauhoiList(res.data.items);
    } catch (error) {
      if (
        error.message ===
        "Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại"
      ) {
        navigate("/login");
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

  //handle submit edit
  const handleSubmitEdit = async (values) => {
    values.append("monthi", id_monthi);
    values.append("queryParams", JSON.stringify(queryParams));

    try {
      let res = await cauhoiApi.editCauhoi(values);
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
    if (isDeleting || !openDialogDelete.id_Delete) return;
    setIsDeleting(true);
    try {
      let res = await cauhoiApi.deleteCauhoi(openDialogDelete.id_Delete, { ...queryParams, monthi: id_monthi });
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
              Ngân hàng câu hỏi
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Ngân hàng câu hỏi của môn thi"
              value={id_monthi !== null ? id_monthi : " "}
              size="small"
              onChange={handleChangeMonthi}
            >
              <MenuItem value=" " disabled hidden={true}>Vui lòng chọn kiến thức đánh giá</MenuItem>
              {monthiList.map((i) => (
                <MenuItem value={i._id} key={i._id}>{i.tenmonthi}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <form onSubmit={form.handleSubmit(handleFormSearchSubmit)} className="shadow-lg shadow-slate-400 rounded-xl mt-8">
          <fieldset
            style={{ border: "1px solid #ccc", paddingBlockEnd: "12px" }}
          >
            <legend style={{ paddingInline: "12px", fontWeight: "bold" }}>
              Tra cứu câu hỏi:
            </legend>
            <div className="flex p-4 flex-1 flex-wrap">
              <div className="px-1 w-full md:basis-1/2">
                <InputField
                  name="question"
                  form={form}
                  label="Nội dung câu hỏi"
                  type="text"
                  disabled={false}
                />
              </div>
              <div className="px-1 w-full md:basis-1/2">
                <SelectField
                  name="chuyende"
                  form={form}
                  label="Chuyên đề, phần thi"
                  disabled={false}
                  options={chuyendeList}
                />
              </div>
            </div>
            <div className="flex px-4 flex-col space-y-2 md:space-y-0 md:space-x-2 md:items-center md:justify-center md:flex-row">
              <Button
                color="primary"
                variant="contained"
                type="submit"
              >
                <SearchIcon />
                <span>Tìm kiếm câu hỏi</span>
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

        {roles && roles.includes("thêm câu hỏi") && (
          <div className="text-end mb-4 mt-8">
            <Button variant="contained" onClick={handleOpenDialogAddCauhoi}>
              <AddIcon />
              Thêm mới câu hỏi
            </Button>
          </div>
        )}

        {openModalLoading && <ModalLoading open={openModalLoading} />}
      </div>

      <div className="shadow-lg shadow-slate-400 pb-2 mb-4">
        <CustomPaginationActionsTable
          list={cauhoiList}
          item={openDialogEdit.item}
          onClickOpenDialogDelete={handleOpenDialogDelete}
          onClickOpenDialogEdit={handleOpenDialogEdit}
          onToggleActive={handleToggleActive}
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
        loading={isDeleting}
      />
    </div>
  );
};

export default DanhsachCauhoi;
