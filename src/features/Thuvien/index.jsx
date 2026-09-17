import React, { useState, useRef, useEffect } from 'react'
import {
    Button,
    Paper,
    TextField,
    Typography,
    Box,
    Stack,
    IconButton,
    Chip,
    CircularProgress,
    Divider,
} from '@mui/material'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined'
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined'
import { useSelector } from 'react-redux'
import commonApi from '../../api/commonApi'
import { API_SERVER } from '../../api/apiServer'

const ThuvienLuat = () => {
    const ref = useRef()
    const roles = useSelector((state) => state.authReducer.roles_x01)
    const canAdd = roles && roles.includes('thêm cẩm nang giao thông')
    const canDelete = roles && roles.includes('xóa cẩm nang giao thông')
    const [tieuDe, setTieuDe] = useState('')
    const [chuThich, setChuThich] = useState('')
    const [ghiChu, setGhiChu] = useState('')
    const [thutu, setThutu] = useState(1)
    const [file, setFile] = useState(null)
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        const fetch = async () => {
            setLoading(true)
            try {
                const res = await commonApi.fetchAuthTailieus()
                setList(res.data)
            } catch (error) {
                setList([])
                console.log(error.message)
            } finally {
                setLoading(false)
            }
        }
        fetch()
    }, [])

    const handleFileChange = (event) => {
        const selected = event.target.files?.[0]
        setFile(selected ?? null)
    }

    const handleSaveFile = async (e) => {
        e.preventDefault()
        if (!canAdd) {
            alert('Tài khoản chưa có quyền "thêm cẩm nang giao thông". Vào Quản lý tài khoản để cấp quyền, rồi đăng nhập lại.')
            return
        }
        if (!tieuDe.trim()) {
            alert('Vui lòng nhập tiêu đề tài liệu')
            return
        }
        if (!file) {
            alert('Vui lòng chọn file PDF')
            return
        }
        const formData = new FormData()
        formData.append('file', file)
        formData.append('tieu_de', tieuDe.trim())
        formData.append('chu_thich', chuThich)
        formData.append('ghi_chu', ghiChu)
        formData.append('thutu', thutu)
        setSaving(true)
        try {
            const res = await commonApi.saveFile(formData)
            setTieuDe('')
            setChuThich('')
            setGhiChu('')
            setThutu(1)
            setFile(null)
            if (ref.current) ref.current.value = ''
            setList(res.data)
            alert('Lưu tài liệu thành công')
        } catch (error) {
            alert(error?.message || 'Upload thất bại')
            console.log(error)
        } finally {
            setSaving(false)
        }
    }

    const deleteFile = async (id) => {
        const checked = confirm('Bạn có muốn xóa tài liệu này không?')
        if (!checked) return
        try {
            const res = await commonApi.deleteTailieu({ id })
            setList(res.data)
        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <Box
            className="mx-auto px-4 pb-10 pt-6"
            sx={{ bgcolor: 'transparent' }}
        >
            {/* Header */}
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 2.5, sm: 3.5 },
                    mb: 3,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)',
                    color: 'white',
                }}
            >
                <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Box
                        sx={{
                            p: 1.25,
                            borderRadius: 2,
                            bgcolor: 'rgba(255,255,255,0.15)',
                            display: 'flex',
                        }}
                    >
                        <GavelOutlinedIcon sx={{ fontSize: 32 }} />
                    </Box>
                    <Box>
                        <Typography
                            variant="overline"
                            sx={{ opacity: 0.85, letterSpacing: 1.2 }}
                        >
                            Thư viện pháp luật
                        </Typography>
                        <Typography
                            component="h1"
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                lineHeight: 1.4,
                                mt: 0.5,
                            }}
                            className='!text-[14px]'
                        >
                            Tài liệu liên quan đến luật giao thông và tuyên truyền phổ biến pháp luật
                        </Typography>
                    </Box>
                </Stack>
            </Paper>

            {/* Upload form */}
            {!canAdd && (
                <Paper
                    elevation={0}
                    sx={{
                        p: 2,
                        mb: 3,
                        borderRadius: 2,
                        border: '1px solid #fdba74',
                        bgcolor: '#fff7ed',
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        Tài khoản chưa có quyền <strong>thêm cẩm nang giao thông</strong>.
                        Vào <strong>Quản lý tài khoản</strong> → Phân quyền → nhóm{' '}
                        <strong>Cẩm nang giao thông</strong> → tick Thêm (hoặc Full),
                        Cập nhật, rồi <strong>đăng xuất / đăng nhập lại</strong>.
                    </Typography>
                </Paper>
            )}
            {canAdd && (
            <Paper
                elevation={0}
                component="form"
                onSubmit={handleSaveFile}
                sx={{
                    p: { xs: 2, sm: 3 },
                    mb: 4,
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: '0 4px 24px rgba(15, 23, 42, 0.06)',
                }}
            >
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Thêm tài liệu mới
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                    Nhập tiêu đề, ghi chú nhóm (vd: Luật GTĐB), chú thích, thứ tự và tải lên file PDF.
                </Typography>

                <Stack spacing={2.5}>
                    <TextField
                        required
                        fullWidth
                        label="Tiêu đề tài liệu"
                        value={tieuDe}
                        onChange={(e) => setTieuDe(e.target.value)}
                        size="small"
                        variant="outlined"
                    />

                    <TextField
                        fullWidth
                        label="Ghi chú (nhóm / loại)"
                        value={ghiChu}
                        onChange={(e) => setGhiChu(e.target.value)}
                        size="small"
                        variant="outlined"
                        placeholder='Ví dụ: Luật, Luật giao thông đường bộ, Luật giao thông đường sắt...'
                        helperText="Người dùng có thể tìm theo ghi chú này cùng với tiêu đề"
                    />

                    <TextField
                        fullWidth
                        label="Chú thích tài liệu"
                        value={chuThich}
                        onChange={(e) => setChuThich(e.target.value)}
                        size="small"
                        variant="outlined"
                        multiline
                        minRows={2}
                        placeholder="Mô tả ngắn về nội dung tài liệu (tùy chọn)"
                    />

                    <TextField
                        required
                        fullWidth
                        type="number"
                        label="Thứ tự xuất hiện"
                        value={thutu}
                        onChange={(e) => setThutu(Number(e.target.value) || 1)}
                        size="small"
                        inputProps={{ min: 1 }}
                    />

                    <Box>
                        <input
                            type="file"
                            accept=".pdf"
                            ref={ref}
                            required
                            onChange={handleFileChange}
                            id="thuvien-luat-file"
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="thuvien-luat-file">
                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 3,
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    borderStyle: 'dashed',
                                    borderRadius: 2,
                                    bgcolor: 'grey.50',
                                    transition: 'border-color 0.2s, background-color 0.2s',
                                    '&:hover': {
                                        borderColor: 'primary.main',
                                        bgcolor: 'action.hover',
                                    },
                                }}
                            >
                                <CloudUploadOutlinedIcon
                                    sx={{ fontSize: 40, color: 'primary.main', mb: 1 }}
                                />
                                <Typography variant="body2" fontWeight={500}>
                                    Chọn file PDF
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Nhấn để duyệt từ máy tính
                                </Typography>
                            </Paper>
                        </label>
                        {file && (
                            <Chip
                                icon={<PictureAsPdfOutlinedIcon />}
                                label={file.name}
                                size="small"
                                sx={{ mt: 1.5 }}
                                onDelete={() => {
                                    setFile(null)
                                    if (ref.current) ref.current.value = ''
                                }}
                            />
                        )}
                    </Box>

                    <Box>
                        <Button
                            variant="contained"
                            type="submit"
                            disabled={saving}
                            startIcon={
                                saving ? (
                                    <CircularProgress size={18} color="inherit" />
                                ) : (
                                    <CloudUploadOutlinedIcon />
                                )
                            }
                            sx={{
                                px: 3,
                                py: 1.25,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600,
                                boxShadow: 'none',
                                '&:hover': { boxShadow: 2 },
                            }}
                        >
                            {saving ? 'Đang lưu...' : 'Lưu tài liệu'}
                        </Button>
                    </Box>
                </Stack>
            </Paper>
            )}

            {/* List */}
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 2, sm: 3 },
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: '0 4px 24px rgba(15, 23, 42, 0.06)',
                }}
            >
                <Typography
                    align="center"
                    variant="subtitle1"
                    fontWeight={700}
                    sx={{ textTransform: 'uppercase', letterSpacing: 0.5, mb: 2 }}
                >
                    Danh sách tài liệu tuyên truyền, phổ biến giáo dục pháp luật
                </Typography>
                <Divider sx={{ mb: 2 }} />

                {loading ? (
                    <Box display="flex" justifyContent="center" py={6}>
                        <CircularProgress />
                    </Box>
                ) : list.length === 0 ? (
                    <Box py={6} textAlign="center">
                        <DescriptionPlaceholder />
                        <Typography color="text.secondary" variant="body2" sx={{ mt: 2 }}>
                            Chưa có tài liệu nào. Hãy thêm file PDF ở form phía trên.
                        </Typography>
                    </Box>
                ) : (
                    <Stack spacing={1.5}>
                        {list.map((i) => (
                            <Paper
                                key={i._id}
                                variant="outlined"
                                sx={{
                                    px: 2,
                                    py: 1.5,
                                    borderRadius: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: 2,
                                    transition: 'box-shadow 0.2s, border-color 0.2s',
                                    '&:hover': {
                                        borderColor: 'primary.light',
                                        boxShadow: 1,
                                    },
                                }}
                            >
                                <Stack direction="row" spacing={1.5} alignItems="center" minWidth={0}>
                                    <Chip
                                        label={i.thutu}
                                        size="small"
                                        color="primary"
                                        sx={{ fontWeight: 700, minWidth: 36 }}
                                    />
                                    <PictureAsPdfOutlinedIcon color="error" fontSize="small" />
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        {(i.ghi_chu || '').trim() && (
                                            <Chip
                                                label={i.ghi_chu}
                                                size="small"
                                                sx={{
                                                    mb: 0.5,
                                                    bgcolor: '#fff7ed',
                                                    color: '#c2410c',
                                                    fontWeight: 600,
                                                    maxWidth: '100%',
                                                }}
                                            />
                                        )}
                                        <Typography
                                            component="a"
                                            href={`${API_SERVER}api/uploads/${i.file}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{
                                                color: '#ea580c',
                                                fontWeight: 600,
                                                textDecoration: 'none',
                                                display: 'block',
                                                '&:hover': { textDecoration: 'underline' },
                                            }}
                                        >
                                            {i.tieu_de || i.text}
                                        </Typography>
                                        {(i.chu_thich || '').trim() && (
                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                                                {i.chu_thich}
                                            </Typography>
                                        )}
                                    </Box>
                                </Stack>
                                {canDelete && (
                                <IconButton
                                    aria-label="Xóa tài liệu"
                                    color="error"
                                    size="small"
                                    onClick={() => deleteFile(i._id)}
                                    sx={{
                                        flexShrink: 0,
                                        border: '1px solid',
                                        borderColor: 'error.light',
                                    }}
                                >
                                    <DeleteOutlineIcon fontSize="small" />
                                </IconButton>
                                )}
                            </Paper>
                        ))}
                    </Stack>
                )}
            </Paper>
        </Box>
    )
}

function DescriptionPlaceholder() {
    return (
        <PictureAsPdfOutlinedIcon sx={{ fontSize: 48, color: 'action.disabled' }} />
    )
}

export default ThuvienLuat
