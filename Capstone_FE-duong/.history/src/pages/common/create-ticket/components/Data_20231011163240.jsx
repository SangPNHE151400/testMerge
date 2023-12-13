import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { Box, Button, Grid, MenuItem, Paper, Select, TextField, Typography } from '@mui/material';
import { useState } from 'react'

const Data = () => {

    const [age, setAge] = useState('');
    const [a, setA] = useState('');

    const handleChange = (event) => {
        setAge(event.target.value);
    };
    const handleChange2 = (event) => {
        setA(event.target.value);
    };
    return (
        <>
            <Box bgcolor='#e0e0e0'>
                <Box p={3}>
                    <Paper elevation={2} sx={{ p: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography fontSize='18px' fontWeight="700">Người tạo yêu cầu</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography fontWeight="500">Họ tên</Typography>
                                <TextField
                                    sx={{ bgcolor: '#EEEEEE', width: '100%' }}
                                    size="small" placeholder="Minh Anh Lê" />
                            </Grid>
                            <Grid item xs={6}>
                                <Typography fontWeight="500">Email</Typography>
                                <TextField sx={{ bgcolor: '#EEEEEE', width: '100%' }} size="small" placeholder="abc@gmail.com" />
                            </Grid>

                        </Grid>
                    </Paper>
                </Box>
                <Box p={3}>
                    <Paper elevation={2} sx={{ p: 3 }} >
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography fontWeight="700" fontSize='18px'>Chi tiết yêu cầu </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography fontWeight="500">Tiêu đề</Typography>
                                <TextField sx={{ width: '100%' }} size="small" placeholder="Nhập tiêu đề yêu cầu" />
                            </Grid>
                            <Grid item xs={6}>
                                <Typography fontWeight="500">Bộ phận</Typography>
                                <Select
                                    value={age}
                                    onChange={handleChange}
                                    sx={{ width: '100%', height: '38px' }}
                                    displayEmpty
                                >
                                    <MenuItem value="">
                                        <em>Phòng kĩ thuật</em>
                                    </MenuItem>
                                    <MenuItem value={10}>sssssss</MenuItem>
                                    <MenuItem value={20}>sssssssss</MenuItem>
                                    <MenuItem value={30}>cccccc</MenuItem>
                                </Select>
                            </Grid>

                            <Grid item xs={6}>
                                <Typography fontWeight="500">Dịch vụ</Typography>
                                <Select
                                    value={a}
                                    onChange={handleChange2}
                                    sx={{ width: '100%', height: '38px' }}
                                    displayEmpty
                                >
                                    <MenuItem value="">
                                        <em>Chọn dịch vụ cần hỗ trợ</em>
                                    </MenuItem>
                                    <MenuItem value={10}>sssssss</MenuItem>
                                    <MenuItem value={20}>sssssssss</MenuItem>
                                    <MenuItem value={30}>cccccc</MenuItem>
                                </Select>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography fontWeight="500">Nội dung</Typography>
                                <CKEditor editor={ClassicEditor} onInit={() => {}} />
                            </Grid>
                        </Grid>
                        <Box
                            pt={2}
                            display='flex'
                            alignItems='flex-end'
                            justifyContent='flex-end'
                        >
                            <Button variant="contained">Save</Button>
                        </Box>

                    </Paper>
                </Box>
            </Box>
        </>
    )
}

export default Data
