import axiosConfig from "./axiosConfig";
import axiosMulter from "./axiosMulter";

const cauhoiApi = {
    getCauhois(params){
        const url = `/api/cau-hoi/fetch/${params.id_monthi}`;
        return axiosConfig.get(url, {params})
    },
    addCauhoi(data){
        const url = "/api/cau-hoi/add";
        return axiosMulter.post(url, data)
    },
    editCauhoi(data){
        const url =`/api/cau-hoi/edit/${data.id_edit}`;
        return axiosMulter.put(url, data)
    },
    deleteCauhoi(id,params){
        const url = `/api/cau-hoi/delete/${id}`;
        return axiosConfig.delete(url, {params})
    },
    setActive(id, data){
        const url = `/api/cau-hoi/${id}/active`;
        return axiosConfig.put(url, data)
    }
};

export default cauhoiApi;