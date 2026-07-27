import axiosConfig from "./axiosConfig";
import axiosMulter from "./axiosMulter";

const cauhoiApi = {
    getCauhois(params){
        const url = `/c08/cau-hoi/fetch/${params.id_monthi}`;
        return axiosConfig.get(url, {params})
    },
    addCauhoi(data){
        const url = "/c08/cau-hoi/add";
        return axiosMulter.post(url, data)
    },
    editCauhoi(data){
        const url =`/c08/cau-hoi/edit/${data.id_edit}`;
        return axiosMulter.put(url, data)
    },
    deleteCauhoi(id,params){
        const url = `/c08/cau-hoi/delete/${id}`;
        return axiosConfig.delete(url, {params})
    }
};

export default cauhoiApi;