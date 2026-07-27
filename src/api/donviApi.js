import axiosConfig from "./axiosConfig";

const donviApi = {
    getDonvi(params){
        const url = `api/donvi/fetch`;
        return axiosConfig.get(url, {params})
    },
    getDonviQuanly(params){
        const url = `api/donviquanly/fetch`;
        return axiosConfig.get(url, {params})
    },
    addDonvi(data){
        const url = "api/donvi/add";
        return axiosConfig.post(url, data)
    },
    editDonvi(data){
        const url =`api/donvi/edit/${data.id_edit}`;
        return axiosConfig.put(url, data)
    },
    deleteDonvi(id, params){
        const url = `api/donvi/delete/${id}`;
        return axiosConfig.delete(url,{params})
    }
};

export default donviApi;