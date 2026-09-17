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
        const url = `/api/public/fetch/danhsachmonthi`;
        return axiosCommon.get(url)
    },
    getInfoCuocthi(id) {
        const url = `/api/public/info/cuoc-thi/${id}`;
        return axiosCommon.get(url)
    },
    loginTest(data) {
        const url = "/api/public/loginTest";
        return axiosCommon.post(url, data)
    },
    checkedTest(id, secretKey) {
        const url = `/api/public/checkedTest/${id}`;
        return axiosCommon.get(url, {
            params: { secretKey },
            headers: { "x-exam-key": secretKey },
        })
    },
    previewTest(id, secretKey) {
        const url = `/api/public/preview/${id}`;
        return axiosCommon.get(url, {
            params: { secretKey },
            headers: { "x-exam-key": secretKey },
        })
    },
    previewTestAdmin(id) {
        const url = `/api/mon-thi/bai-thi/${id}/preview`;
        return axiosConfig.get(url)
    },
    submitTest(id, answers, secretKey) {
        const url = `/api/public/${id}/submitTest`;
        return axiosCommon.post(
            url,
            { secretKey, answers },
            { headers: { "x-exam-key": secretKey } }
        )
    },
    checkCuocthi(params) {
        const url = `/api/public/checkedCuocthi`;
        return axiosCommon.get(url, { params })
    },
    saveFile(data) {
        const url = "/api/public/save-file";
        return axiosMulter.post(url, data)
    },
    fetchTailieus(params) {
        const url = `/api/public/tai-lieu/fetch`;
        return axiosCommon.get(url, { params })
    },
    fetchAuthTailieus(params) {
        const url = `/api/public/auth/tai-lieu/fetch`;
        return axiosCommon.get(url, { params })
    },
    deleteTailieu(params) {
        const url = `/api/public/tai-lieu/delete`;
        return axiosConfig.delete(url, { params })
    },
    logFanpageClick(data) {
        const url = `/api/public/fanpage-click`;
        return axiosCommon.post(url, data);
    },
};

export default commonApi;