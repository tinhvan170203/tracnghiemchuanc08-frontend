import axiosCommon from "./axiosCommon";
import axiosConfig from "./axiosConfig";
import axiosMulter from "./axiosMulter";

const commonApi = {
    getDanhsachDonvi() {
        const url = `fetch/danhsachdonvi`;
        return axiosCommon.get(url)
    },
    getDataForAddCanbo() {
        const url = 'them-can-bo/fetched/phuthuoc';
        return axiosConfig.get(url)
    },
    getDoiOfDonviChanged(donvi) {
        const url = 'them-can-bo/fetch/getDoiOfDonviChanged';
        return axiosConfig.get(url, { params: { donvi } })
    },
    getBacHams() {
        const url = `fetch/bacham`;
        return axiosCommon.get(url)
    },
    getChucvus() {
        const url = `fetch/chucvu`;
        return axiosCommon.get(url)
    },
    getHesoluongs() {
        const url = `fetch/hesoluong`;
        return axiosCommon.get(url)
    },
    getAllDoi() {
        const url = `fetch/all-doi`;
        return axiosCommon.get(url)
    },
    // thitracnghiem
    getAllMonthi() {
        const url = `/c08/public/fetch/danhsachmonthi`;
        return axiosCommon.get(url)
    },
    getInfoCuocthi(id) {
        const url = `/c08/public/info/cuoc-thi/${id}`;
        return axiosCommon.get(url)
    },
    loginTest(data) {
        const url = "/c08/public/loginTest";
        return axiosCommon.post(url, data)
    },
    checkedTest(id) {
        const url = `/c08/public/checkedTest/${id}`;
        return axiosCommon.get(url)
    },
    previewTest(id) {
        const url = `/c08/public/preview/${id}`;
        return axiosCommon.get(url)
    },
    submitTest(id, data) {
        const url = `/c08/public/${id}/submitTest`;
        return axiosCommon.post(url, data)
    },
    checkCuocthi(params) {
        const url = `/c08/public/checkedCuocthi`;
        return axiosCommon.get(url, { params })
    },
    saveFile(data) {
        const url = "/c08/public/save-file";
        return axiosMulter.post(url, data)
    },
    fetchTailieus(params) {
        const url = `/c08/public/tai-lieu/fetch`;
        return axiosCommon.get(url, { params })
    },
    fetchAuthTailieus(params) {
        const url = `/c08/public/auth/tai-lieu/fetch`;
        return axiosCommon.get(url, { params })
    },
    deleteTailieu(params) {
        const url = `/c08/public/tai-lieu/delete`;
        return axiosConfig.delete(url, { params })
    }
};

export default commonApi;