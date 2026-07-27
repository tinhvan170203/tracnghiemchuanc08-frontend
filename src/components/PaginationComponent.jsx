import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import { Box } from '@mui/material';

export default function PaginationComponent({onChangePage, page, totalPage}) {

  const handleChange = (event, value) => {
    onChangePage(value);
  };


  return (
    <Box style={{justifyContent: "center", display: "flex"}} mt={2} pb={2}>
      <Pagination color='primary' count={totalPage} page={page} onChange={handleChange} />
    </Box>
  );
}