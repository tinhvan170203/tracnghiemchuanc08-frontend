import axiosConfig from "./axiosConfig";

const learningApi = {
    getDashboard(params){
        const url = `c08/learning/dashboard`;
        return axiosConfig.get(url, {params})
    },
    getChuyendesOfMonthi(id_monthi){
        const url = `c08/learning/${id_monthi}/chuyendes`;
        return axiosConfig.get(url)
    },
    getCauhoisOfChuyende(chuyendeId){
        const url = `c08/learning/chuyendes/${chuyendeId}/cauhois`;
        return axiosConfig.get(url)
    },
    // getCauhoisOfChuyende(data){
    //     const url =`c08/learning/edit/${data.id_edit}`;
    //     return axiosConfig.put(url, data)
    // },
    deleteDoi(id, params){
        const url = `c08/learning/delete/${id}`;
        return axiosConfig.delete(url,{params})
    }
};

export default learningApi;