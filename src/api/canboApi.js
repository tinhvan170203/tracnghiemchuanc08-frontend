import axiosConfig from "./axiosConfig";

const canboApi = {
    getCanbos(params){
        const url = `quan-tri/can-bo/fetch`;
        return axiosConfig.get(url, {params})
    },
    addCanbo(data){
        const url = "quan-tri/can-bo/add";
        return axiosConfig.post(url, data)
    },
    editCanbo(data){
        const url =`quan-tri/can-bo/edit/${data.id_edit}`;
        return axiosConfig.put(url, data)
    },
    editBachamCanbo(data){
        const url =`quan-tri/can-bo/edit/bac-ham/${data.id_edit}`;
        return axiosConfig.put(url, data)
    },
    editChucvuCanbo(data){
        const url =`quan-tri/can-bo/edit/chuc-vu/${data.id_edit}`;
        return axiosConfig.put(url, data)
    },
    editHesoluongCanbo(data){
        const url =`quan-tri/can-bo/edit/he-so-luong/${data.id_edit}`;
        return axiosConfig.put(url, data)
    },
    moveCanbo(data){
        const url =`quan-tri/can-bo/move/${data.id_move}`;
        return axiosConfig.put(url, data)
    },
    deleteCanbo(id){
        const url = `quan-tri/can-bo/delete/${id}`;
        return axiosConfig.delete(url)
    },

    //advanced
    getThongtinCanbo(id){
        const url = `quan-tri/can-bo/fetch/advanced/${id}`;
        return axiosConfig.get(url)
    },
    editChucvuCanboAdvanced(data){
        const url =`quan-tri/can-bo/edit/chuc-vu-nang-cao/${data.id_edit}/${data.id_row}`;
        return axiosConfig.put(url, data)
    },
    deleteChucvuCanboAdvanced(data){
        const url =`quan-tri/can-bo/delete/chuc-vu-nang-cao/${data.id_delete}/${data.id_row}`;
        return axiosConfig.delete(url)
    },
    editBachamCanboAdvanced(data){
        const url =`quan-tri/can-bo/edit/bac-ham-nang-cao/${data.id_edit}/${data.id_row}`;
        return axiosConfig.put(url, data)
    },
    deleteBachamCanboAdvanced(data){
        const url =`quan-tri/can-bo/delete/bac-ham-nang-cao/${data.id_delete}/${data.id_row}`;
        return axiosConfig.delete(url)
    },
    editHesoluongCanboAdvanced(data){
        const url =`quan-tri/can-bo/edit/he-so-luong-nang-cao/${data.id_edit}/${data.id_row}`;
        return axiosConfig.put(url, data)
    },
    deleteHesoluongCanboAdvanced(data){
        const url =`quan-tri/can-bo/delete/he-so-luong-nang-cao/${data.id_delete}/${data.id_row}`;
        return axiosConfig.delete(url)
    },
    editDonviCanboAdvanced(data){
        const url =`quan-tri/can-bo/edit/don-vi-nang-cao/${data.id_edit}/${data.id_row}`;
        return axiosConfig.put(url, data)
    },
    deleteDonviCanboAdvanced(data){
        const url =`quan-tri/can-bo/delete/don-vi-nang-cao/${data.id_delete}/${data.id_row}`;
        return axiosConfig.delete(url)
    },
    editDoiCanboAdvanced(data){
        const url =`quan-tri/can-bo/edit/doi-nang-cao/${data.id_edit}/${data.id_row}`;
        return axiosConfig.put(url, data)
    },
    deleteDoiCanboAdvanced(data){
        const url =`quan-tri/can-bo/delete/doi-nang-cao/${data.id_delete}/${data.id_row}`;
        return axiosConfig.delete(url)
    },
};

export default canboApi;