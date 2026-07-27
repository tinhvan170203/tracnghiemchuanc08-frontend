import React, { useState, useMemo, useEffect } from "react";
import PaginationComponent from "../../components/PaginationComponent";
import { Button, Skeleton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import SearchIcon from "@mui/icons-material/Search";
import doiApi from "../../api/doiApi";
import BackspaceIcon from "@mui/icons-material/Backspace";
import querystring from "query-string";
import DialogDelete from "../../components/DialogDelete";
import commonApi from "../../api/commonApi";
import DialogAddBacHam from "./components/DialogAddBacHam";
import DialogEditBacHam from "./components/DialogEditBacHam";
import TableBacHam from "./components/TableBacHam";
import quanhamApi from "../../api/quanham";
import { useSelector } from "react-redux";

const QuanlyBacHam = () => {
  const roles = useSelector((state) => state.authReducer.roles_x01);
  // state phân trang
  const [pagination, setPagination] = useState({
    page: 1,
    total: 1,
  });
  let [searchParams, setSearchParams] = useSearchParams();

  const [tongbanghi, setTongbanghi] = useState(0);

  const [list, setList] = useState([]);
  const navigate = useNavigate()

  const queryParams = useMemo(() => {
    const params = querystring.parse(location.search);
    return {
      ...params,
      page: Number(params.page) || 1,
    };
  }, [location.search]);

  //state mở hộp thoại delete
  const [openDialogDelete, setOpenDialogDelete] = useState({
    status: false,
    id_Delete: null,
  });

  const [openDialogEdit, setOpenDialogEdit] = useState({
    status: false,
    item: null,
  });

  const [openDialogAdd, setOpenDialogAdd] = useState(false);
  const [openModalLoading, setOpenModalLoading] = useState(false);

  const handleCloseDialogAdd = () => {
    setOpenDialogAdd(false);
  };

  const handleOpenDialogAdd = (user) => {
    setOpenDialogAdd(true);
  };

  const { enqueueSnackbar } = useSnackbar();

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
        let res = await quanhamApi.getQuanham(queryParams);
        setList(res.data.donvis);
        setPagination({
          page: res.data.page,
          total: res.data.total,
        });
        setTongbanghi(res.data.tongbanghi);
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

        enqueueSnackbar(error.response.data.message, {
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
  const handleSubmitAdd = async (values) => {
    try {
      let data = { ...values, queryParams };

      setOpenModalLoading(true);
      let res = await quanhamApi.addQuanham(data);

      setList(res.data.donvis);
      setPagination({
        ...pagination,
        total: res.data.total,
      });
      setTongbanghi(res.data.tongbanghi);
      setOpenModalLoading(false);
      enqueueSnackbar("Thêm mới cấp bậc hàm thành công!", {
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

      enqueueSnackbar(error.response.data.message, {
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
        variant: "error",
      });
      setOpenModalLoading(false);
    }
  };

  //open dialog delete
  const handleOpenDialogDelete = (id) => {
    setOpenDialogDelete({
      status: true,
      id_Delete: id,
    });
  };

  //close dialog edit
  const handleCloseDialogEdit = () => {
    setOpenDialogEdit({
      ...openDialogEdit,
      status: false,
    });
  };

  //open dialog edit
  const handleOpenDialogEdit = (item) => {
    setOpenDialogEdit({
      item,
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
  const handleSubmitEdit = async (values) => {
    const obj = { ...values, queryParams };

    try {
      let res = await quanhamApi.editQuanham(obj);
      setList(res.data.donvis);

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

      enqueueSnackbar(error.response.data.message, {
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
      let res = await quanhamApi.deleteQuanham(
        openDialogDelete.id_Delete,
        queryParams
      );
      setList(res.data.donvis);
      setTongbanghi(res.data.tongbanghi);
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
      enqueueSnackbar(error.response.data.message, {
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
      <img
        className="w-[80px] m-auto mt-2 pt-2"
        src="https://thuviensocongantinhhungyen.vercel.app/cong-an-hieu.png"
        alt="anhnen"
      />
      <h3 className="text-xl text-gray-900 text-center font-bold">
        Quản lý cấp bậc quân hàm và niên hạn lên hàm kế tiếp theo cấp bậc hàm
        trong lực lượng CAND
      </h3>

      {roles && roles.includes("thêm quân hàm") && (
        <div className="text-end mb-4">
          <Button variant="contained" onClick={handleOpenDialogAdd}>
            <AddIcon />
            Thêm mới cấp bậc hàm
          </Button>
        </div>
      )}
      <div>
        {openModalLoading ? (
          <Skeleton variant="rectangular" width="100%" height={400} />
        ) : (
          <TableBacHam
            list={list}
            page={pagination.page}
            onClickOpenDialogDelete={handleOpenDialogDelete}
            onClickOpenDialogEdit={handleOpenDialogEdit}
            tongbanghi={tongbanghi}
          />
        )}
      </div>

      <DialogAddBacHam
        open={openDialogAdd}
        onCloseDialogAdd={handleCloseDialogAdd}
        onSubmit={handleSubmitAdd}
      />

      <DialogEditBacHam
        open={openDialogEdit.status}
        item={openDialogEdit.item}
        onCloseDialogEdit={handleCloseDialogEdit}
        onSubmit={handleSubmitEdit}
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

export default QuanlyBacHam
