import React, { useState, useMemo, useEffect } from "react";
import PaginationComponent from "../../components/PaginationComponent";
import { Button, Grid, Skeleton, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { InputField } from "../../components/form-control/InputField";
import { useForm } from "react-hook-form";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import SearchIcon from "@mui/icons-material/Search";
import BackspaceIcon from "@mui/icons-material/Backspace";
import querystring from "query-string";
import DialogDelete from "../../components/DialogDelete";
import { useSelector } from "react-redux";
import { SelectField } from './../../components/form-control/SelectField/index';
import DialogAddMonthi from "./components/DialogAddMonthi";
import TableMonthi from "./components/TableMonthi";
import DialogEditMonthi from "./components/DialogEditMonthi";
import monthiApi from "../../api/monthiApi";

const Monthi = () => {
  // state phân trang
  const roles = useSelector((state) =>(state.authReducer.roles_x01));
  const [pagination, setPagination] = useState({
    page: 1,
    total: 1,
  });
  let [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate()
  const [tongbanghi, setTongbanghi] = useState(0);
  const [donviList, setDonviList] = useState([]);

  const queryParams = useMemo(() => {
    const params = querystring.parse(location.search);
    return {
      ...params,
      mota: params.mota || "",
      tenmonthi: params.tenmonthi || "",
      page: Number(params.page) || 1,
    };
  }, [location.search]);

  //state mở hộp thoại delete
  const [openDialogDelete, setOpenDialogDelete] = useState({
    status: false,
    id_Delete: null,
  });

  const [openDialogEditDonvi, setOpenDialogEditDonvi] = useState({
    status: false,
    donvi: null,
  });

  const [openDialogAddDonvi, setOpenDialogAddDonvi] = useState(false);
  const [openModalLoading, setOpenModalLoading] = useState(false);

  const handleCloseDialogAddDonvi = () => {
    setOpenDialogAddDonvi(false);
  };

  const handleOpenDialogAddDonvi = (user) => {
    setOpenDialogAddDonvi(true);
  };

  const { enqueueSnackbar } = useSnackbar();

  //khởi tạo form tìm kiếm
  const form = useForm({
    defaultValues: {
      tenmonthi: "",
      mota: ""
    },
  });

  // func thay đổi số trang và đồng bộ lên url
  const handleChangePage = (value) => {
    setPagination({
      ...pagination,
      page: value,
    });

    const newFilters = {
      ...queryParams,
      page: value,
    };

    setSearchParams(newFilters);
  };

  // handle submit search
  const handleFormSearchSubmit = async (values) => {
    setSearchParams({ ...queryParams, ...values, page: 1 });
  };


  // useEffect get list table
  useEffect(() => {
    const fetchData = async () => {
      try {
        setOpenModalLoading(true);
        let res = await monthiApi.getMonthi(queryParams);
        // console.log(res)
        setDonviList(res.data.donvis);
        setPagination({
          page: res.data.page,
          total: res.data.total,
        });
        setTongbanghi(res.data.tongbanghi)
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
        setOpenModalLoading(false);
      }
    };

    fetchData();
  }, [queryParams]);

  //handle thêm mới đơn vị
  const handleSubmitAddDonvi = async (values) => {
    try {
      let data = { ...values, queryParams };

      setOpenModalLoading(true);
      let res = await monthiApi.addMonthi(data);
    
      setDonviList(res.data.donvis);
      setPagination({
        ...pagination,
        total: res.data.total,
      });
      setTongbanghi(res.data.tongbanghi)
      setOpenModalLoading(false);
      enqueueSnackbar("Thêm mới môn thi thành công!", {
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

  //func xóa trắng các trường tìm kiếm
  const handleDeleteField = () => {
    form.reset();
  };

  //open dialog delete
  const handleOpenDialogDelete = (id) => {
    setOpenDialogDelete({
      status: true,
      id_Delete: id,
    });
  };

  //close dialog edit
  const handleCloseDialogEditDonvi = () => {
    setOpenDialogEditDonvi({
      ...openDialogEditDonvi,
      status: false,
    });
  };

  //open dialog edit
  const handleOpenDialogEditDonvi = (donvi) => {
    setOpenDialogEditDonvi({
      donvi,
      status: true,
    });
  };

  const handleCloseDialogDelete = () => {
    setOpenDialogDelete({
      ...openDialogDelete,
      status: false,
    });
  };

  //handle submit edit
  const handleSubmitEditDonvi = async (values) => {
    const obj = { ...values, queryParams };

    try {
      let res = await monthiApi.editMonthi(obj);
      setDonviList(res.data.donvis);

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
      let res = await monthiApi.deleteMonthi(openDialogDelete.id_Delete, queryParams );
      setDonviList(res.data.donvis)
      setTongbanghi(res.data.tongbanghi)
      setPagination({
        ...pagination,
        total: res.data.total,
      });
      const newFilters = {
        ...queryParams,
        page: 1,
      };

      setSearchParams(newFilters);
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

  const handleCancelDelete = () => {
    setOpenDialogDelete({
      ...openDialogDelete,
      status: false,
    });
  };
  
  return (
    <div className="mx-2 bg-white pb-2 px-4">
      <h3 className="text-gray-900 text-center mt-2 pt-4 font-bold sm:text-[14px] md:text-[18px]">
        Quản lý kiến thức đánh giá
      </h3>

      <div className="p-2 rounded-md shadow-lg">
        <form
          onSubmit={form.handleSubmit(handleFormSearchSubmit)}
          style={{ width: "100%" }}
        >
          <fieldset
            style={{ border: "1px solid #ccc", paddingBlockEnd: "12px" }}
          >
            <legend style={{ paddingInline: "12px", fontWeight: "bold" }}>
              Tra cứu kiến thức đánh giá:
            </legend>
            <Grid container spacing={1} style={{ padding: "16px" }}>
              <Grid item xs={12} md={6} lg={6}>
                <InputField
                  name="tenmonthi"
                  label="Kiến thức đánh giá"
                  form={form}
                  disabled={false}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <InputField
                  name="mota"
                  label="Mô tả"
                  form={form}
                  disabled={false}
                />
              </Grid>
              <Grid
                item
                xs={12}
                md={12}
                lg={12}
              >
                 <div className="flex flex-col space-y-2 md:space-y-0 md:space-x-2 md:items-center md:justify-center md:flex-row">

                <Button
                  color="primary"
                  variant="contained"
                  type="submit"
                  style={{ marginRight: "4px" }}
                >
                  <SearchIcon />
                  <span>Tìm kiếm</span>
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
              </Grid>
            </Grid>
          </fieldset>
        </form>
      </div>

      {roles && roles.includes("thêm môn thi") && (
      <div className="text-end mb-4 mt-4">
        <Button variant="contained" onClick={handleOpenDialogAddDonvi}>
          <AddIcon />
          Thêm mới kiến thức đánh giá
        </Button>
      </div>
      )}

      <div>
        {openModalLoading ? (
          <Skeleton variant="rectangular" width="100%" height={400} />
        ) : (
          <TableMonthi
            donviList={donviList}
            page={pagination.page}
            onClickOpenDialogDelete={handleOpenDialogDelete}
            onClickOpenDialogEditDonvi={handleOpenDialogEditDonvi}
            tongbanghi={tongbanghi}
          />
        )}
      </div>

      <DialogAddMonthi
        open={openDialogAddDonvi}
        onCloseDialogAddDonvi={handleCloseDialogAddDonvi}
        onSubmit={handleSubmitAddDonvi}
      />

      <DialogEditMonthi
        open={openDialogEditDonvi.status}
        donvi={openDialogEditDonvi.donvi}
        onCloseDialogEditDonvi={handleCloseDialogEditDonvi}
        onSubmit={handleSubmitEditDonvi}
      />

      {/* <ModalLoading open={openModalLoading} /> */}

      <DialogDelete
        open={openDialogDelete.status}
        onCloseDialogDelete={handleCloseDialogDelete}
        onConfirmDelete={handleConfirmDelete}
        onCancelDelete={handleCancelDelete}
      />

      <PaginationComponent
        page={pagination.page}
        totalPage={pagination.total}
        onChangePage={handleChangePage}
      />
    </div>
  );
};

export default Monthi
