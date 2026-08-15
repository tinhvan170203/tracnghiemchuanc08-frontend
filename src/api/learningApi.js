import axiosConfig from "./axiosConfig";

const learningApi = {
    getDashboard(params){
        const url = `api/learning/dashboard`;
        return axiosConfig.get(url, {params})
    },
    getChuyendesOfMonthi(id_monthi){
        const url = `api/learning/${id_monthi}/chuyendes`;
        return axiosConfig.get(url)
    },
    getCauhoisOfChuyende(chuyendeId){
        const url = `api/learning/chuyendes/${chuyendeId}/cauhois`;
        return axiosConfig.get(url)
    },
    // getCauhoisOfChuyende(data){
    //     const url =`api/learning/edit/${data.id_edit}`;
    //     return axiosConfig.put(url, data)
    // },
    deleteDoi(id, params){
        const url = `api/learning/delete/${id}`;
        return axiosConfig.delete(url,{params})
    }
};

export default learningApi;