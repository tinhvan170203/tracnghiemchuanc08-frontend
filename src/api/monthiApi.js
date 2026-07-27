import axiosConfig from "./axiosConfig";

const monthiApi = {
    getMonthi(params){
        const url = `c08/mon-thi/fetch`;
        return axiosConfig.get(url, {params})
    },
    addMonthi(data){
        const url = "c08/mon-thi/add";
        return axiosConfig.post(url, data)
    },
    editMonthi(data){
        const url =`c08/mon-thi/edit/${data.id_edit}`;
        return axiosConfig.put(url, data)
    },
    deleteMonthi(id, params){
        const url = `c08/mon-thi/delete/${id}`;
        return axiosConfig.delete(url,{params})
    },
    getMonthiDetail(id){
        const url = `c08/mon-thi/detail/fetch/${id}`;
        return axiosConfig.get(url)
    },
    getMonthiOfUser(){
        const url = `c08/mon-thi/fetch-monthiOfUser`;
        return axiosConfig.get(url)
    },

    addCuocthi(id,data){
        const url = `c08/mon-thi/${id}/cuoc-thi/add`;
        return axiosConfig.post(url, data)
    },
    getCuocthis(params){
        const url = `/c08/mon-thi/${params.id_monthi}/cuoc-thi-list/fetch`;
        return axiosConfig.get(url, {params})
    },
    editStatusCuocthi(data){
        const url =`c08/mon-thi/${data.id_monthi}/cuoc-thi/${data.id_cuocthi}/edit-status`;
        return axiosConfig.put(url, data)
    },
    updateOptionCuocthi(data){
        const url =`c08/mon-thi/${data.id_monthi}/cuoc-thi/${data.id_cuocthi}/update-option`;
        return axiosConfig.put(url, data)
    },
    deleteCuocthi(id, params){
        const url = `c08/mon-thi/${params.id_monthi}/cuoc-thi/${id}/delete`;
        return axiosConfig.delete(url,{params})
    },
    getKetquaThi(id,params){
        const url = `/c08/mon-thi/ket-qua/cuoc-thi/${id}`;
        return axiosConfig.get(url, {params})
    },


    addThisinh(id, data){
        const url = `c08/mon-thi/${id}/cuoc-thi/thi-sinh/add`;
        return axiosConfig.post(url, data)
    },
    getThisinhs(params){
        const url = `/c08/mon-thi/${params.id_cuocthi}/cuoc-thi/thi-sinh/fetch`;
        return axiosConfig.get(url, {params})
    },
    editThisinh(data){
        const url =`c08/mon-thi/${data.id_cuocthi}/cuoc-thi/thi-sinh/${data.id_thisinh}/edit`;
        return axiosConfig.put(url, data)
    },
    deleteThisinh(id_cuocthi, id_thisinh, params){
        const url = `c08/mon-thi/${id_cuocthi}/cuoc-thi/thi-sinh/${id_thisinh}/delete`;
        return axiosConfig.delete(url,{params})
    },
    addChuyende(data){
        const url = `c08/mon-thi/${data.monthi}/chuyen-de/add`;
        return axiosConfig.post(url, data)
    },
    getChuyendes(params){
        const url = `c08/mon-thi/${params.id_monthi}/chuyen-de/fetch`;
        return axiosConfig.get(url, {params})
    },
    editChuyende(data){
        const url =`c08/mon-thi/${data.monthi}/chuyen-de/${data.id_edit}/edit`;
        return axiosConfig.put(url, data)
    },
    deleteChuyende(id_monthi, id_chuyende){
        const url = `c08/mon-thi/${id_monthi}/chuyen-de/${id_chuyende}/delete`;
        return axiosConfig.delete(url)
    },
      thongke(params){
        const url = `c08/mon-thi/thongke`;
        return axiosConfig.get(url, {params})
    },
      thongkeCauhoiSai(params){
        const url = `c08/mon-thi/top-cau-hoi-sai`;
        return axiosConfig.get(url, {params})
    },
};

export default monthiApi;