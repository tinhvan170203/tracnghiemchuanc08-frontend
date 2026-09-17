import axiosConfig from "./axiosConfig";

const monthiApi = {
    getMonthi(params){
        const url = `api/mon-thi/fetch`;
        return axiosConfig.get(url, {params})
    },
    addMonthi(data){
        const url = "api/mon-thi/add";
        return axiosConfig.post(url, data)
    },
    editMonthi(data){
        const url =`api/mon-thi/edit/${data.id_edit}`;
        return axiosConfig.put(url, data)
    },
    deleteMonthi(id, params){
        const url = `api/mon-thi/delete/${id}`;
        return axiosConfig.delete(url,{params})
    },
    getMonthiDetail(id){
        const url = `api/mon-thi/detail/fetch/${id}`;
        return axiosConfig.get(url)
    },
    getMonthiOfUser(){
        const url = `api/mon-thi/fetch-monthiOfUser`;
        return axiosConfig.get(url)
    },
    getContestScopeOptions(){
        const url = `api/mon-thi/contest-scope-options`;
        return axiosConfig.get(url)
    },
    assignCuocthiOwner(id_monthi, id_cuocthi, data){
        const url = `api/mon-thi/${id_monthi}/cuoc-thi/${id_cuocthi}/assign-owner`;
        return axiosConfig.put(url, data)
    },

    addCuocthi(id,data){
        const url = `api/mon-thi/${id}/cuoc-thi/add`;
        return axiosConfig.post(url, data)
    },
    getCuocthis(params){
        const url = `/api/mon-thi/${params.id_monthi}/cuoc-thi-list/fetch`;
        return axiosConfig.get(url, {params})
    },
    editStatusCuocthi(data){
        const url =`api/mon-thi/${data.id_monthi}/cuoc-thi/${data.id_cuocthi}/edit-status`;
        return axiosConfig.put(url, data)
    },
    updateOptionCuocthi(data){
        const url =`api/mon-thi/${data.id_monthi}/cuoc-thi/${data.id_cuocthi}/update-option`;
        return axiosConfig.put(url, data)
    },
    deleteCuocthi(id, params){
        const url = `api/mon-thi/${params.id_monthi}/cuoc-thi/${id}/delete`;
        return axiosConfig.delete(url,{params})
    },
    getKetquaThi(id,params){
        const url = `/api/mon-thi/ket-qua/cuoc-thi/${id}`;
        return axiosConfig.get(url, {params})
    },
    exportKetquaExcel(id, params){
        const url = `/api/mon-thi/ket-qua/cuoc-thi/${id}/export-excel`;
        return axiosConfig.get(url, {
          params,
          responseType: "blob",
          timeout: 10 * 60 * 1000,
        });
    },
    exportKetquaExcelNhieu(params){
        const url = `/api/mon-thi/ket-qua/export-excel`;
        return axiosConfig.get(url, {
          params,
          responseType: "blob",
          timeout: 10 * 60 * 1000,
        });
    },
    createKetquaExportJob(data){
        const url = `/api/mon-thi/ket-qua/export-jobs`;
        return axiosConfig.post(url, data, { timeout: 60 * 1000 });
    },
    getKetquaExportJob(id){
        const url = `/api/mon-thi/ket-qua/export-jobs/${id}`;
        return axiosConfig.get(url, { timeout: 60 * 1000 });
    },
    downloadKetquaExportJob(id){
        const url = `/api/mon-thi/ket-qua/export-jobs/${id}/download`;
        return axiosConfig.get(url, {
          responseType: "blob",
          timeout: 10 * 60 * 1000,
        });
    },


    addThisinh(id, data){
        const url = `api/mon-thi/${id}/cuoc-thi/thi-sinh/add`;
        return axiosConfig.post(url, data)
    },
    getThisinhs(params){
        const url = `/api/mon-thi/${params.id_cuocthi}/cuoc-thi/thi-sinh/fetch`;
        return axiosConfig.get(url, {params})
    },
    editThisinh(data){
        const url =`api/mon-thi/${data.id_cuocthi}/cuoc-thi/thi-sinh/${data.id_thisinh}/edit`;
        return axiosConfig.put(url, data)
    },
    deleteThisinh(id_cuocthi, id_thisinh, params){
        const url = `api/mon-thi/${id_cuocthi}/cuoc-thi/thi-sinh/${id_thisinh}/delete`;
        return axiosConfig.delete(url,{params})
    },
    addChuyende(data){
        const url = `api/mon-thi/${data.monthi}/chuyen-de/add`;
        return axiosConfig.post(url, data)
    },
    getChuyendes(params){
        const url = `api/mon-thi/${params.id_monthi}/chuyen-de/fetch`;
        return axiosConfig.get(url, {params})
    },
    editChuyende(data){
        const url =`api/mon-thi/${data.monthi}/chuyen-de/${data.id_edit}/edit`;
        return axiosConfig.put(url, data)
    },
    deleteChuyende(id_monthi, id_chuyende){
        const url = `api/mon-thi/${id_monthi}/chuyen-de/${id_chuyende}/delete`;
        return axiosConfig.delete(url)
    },
      thongke(params){
        const url = `api/mon-thi/thongke`;
        return axiosConfig.get(url, {params})
    },
      thongkeCauhoiSai(params){
        const url = `api/mon-thi/top-cau-hoi-sai`;
        return axiosConfig.get(url, {params})
    },
      thongkeCauhoiSaiTonghop(params){
        const url = `api/mon-thi/thongke-cau-hoi-sai`;
        return axiosConfig.get(url, {params})
    },
    listFanpageClicks(params) {
        const url = `api/mon-thi/fanpage-clicks`;
        return axiosConfig.get(url, { params });
    },
    listFanpageCuocthiOptions(params) {
        const url = `api/mon-thi/fanpage-clicks/cuocthi-options`;
        return axiosConfig.get(url, { params });
    },
    exportFanpageClicksExcel(params) {
        const url = `api/mon-thi/fanpage-clicks/export-excel`;
        return axiosConfig.get(url, { params, responseType: "blob" });
    },
    listAiChatLogs(params) {
        const url = `api/mon-thi/ai-chat-logs`;
        return axiosConfig.get(url, { params });
    },
    exportAiChatLogsExcel(params) {
        const url = `api/mon-thi/ai-chat-logs/export-excel`;
        return axiosConfig.get(url, { params, responseType: "blob" });
    },
};

export default monthiApi;