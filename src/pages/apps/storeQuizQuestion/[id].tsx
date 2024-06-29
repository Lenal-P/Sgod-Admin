// ** React Imports
import { useState, useEffect, useCallback, Fragment } from 'react'
import { useTranslation } from 'react-i18next'

// ** MUI Imports
import Box from '@mui/material/Box'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import Typography from '@mui/material/Typography'

// ** Third Party Components
import AxiosInstance from 'src/configs/axios'

// ** Custom Table Components Imports
import adminPathName from 'src/configs/endpoints/admin';
import { useRouter } from 'next/router'
import { QuizQuestion } from 'src/context/types'
import { Button, IconButton, TableHead, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Checkbox } from '@mui/material'
import { Icon } from '@iconify/react'
import toast from 'react-hot-toast'
import Link from 'next/link';
import TableHeaderDetail from 'src/views/apps/storeQuizQuestion/TableHeaderDetail';

export default function QuizQuestionStoreDetail() {
  const router = useRouter();
  const { t } = useTranslation();
  const [values, setValues] = useState<string>('');
  const [dataList, setDataList] = useState<QuizQuestion[]>([]);
  const [idOwner, setIdOwner] = useState<string>('');
  const [data, setData] = useState<QuizQuestion[]>([]);

  const [selectedQuizStoreName, setSelectedQuizStoreName] = useState('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 70 });
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false)
  const [deleteUserOpen, setDeleteUserOpen] = useState<boolean>(false)
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedItemsCount, setSelectedItemsCount] = useState<number>(0);

  const handleFilter = useCallback((val: string) => {
    const temp = [...data]
    setValues(val);
    if (val === "") {
      setDataList(temp);
    } else {
      const filteredData = temp.filter((data: QuizQuestion) => {
        const question = data.question.toLowerCase();
        const level = data.level.toLowerCase();
        const result = question.includes(val.toLowerCase()) || level.includes(val.toLowerCase());

        return result
      });
      setDataList(filteredData);
    }
  }, [data]);
  const fetchDataList = async () => {
    try {
      const response = await AxiosInstance.get(`${adminPathName.getDetailQuizStoreEndpoint}/${router.query.id}`);
      setDataList(response.data.response.res.dataQuestion);
      setData(response.data.response.res.dataQuestion)
      setIdOwner(response.data.response.res.dataStore.owner)
    } catch (error: any) {
      toast.error(error.response.data.message)
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await AxiosInstance.get(`${adminPathName.getIdQuizStoreEndpoint}/${router.query.id}`);
      setSelectedQuizStoreName(response.data.res.title);
    } catch (error: any) {
      if (error && error.response) {
        toast.error(error.response.data.message)
      }
    }
  }

  const handleDelete = async () => {
    try {
      await Promise.all(selectedItems.map(async (itemId) => {
        await AxiosInstance.delete(`${adminPathName.deleteQuizQuestionEndpoint}/${router.query.id}`, {
          data: {
            id_Store: router.query.id,
            id_Question: [itemId]
          }
        });
      }));
      fetchDataList();
      toast.success(`Delete Successfully`);
      setDeleteUserOpen(false);
      setSelectedItems([]);
    } catch (error: any) {
      if (error && error.response) {
        toast.error(error.response.data.message)
      }
    }
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
    if (event.target.checked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    }
  };

  useEffect(() => {
    fetchDataList();
    fetchCourses();
  }, []);

  useEffect(() => {
    setSelectedItemsCount(selectedItems.length);
  }, [selectedItems]);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPaginationModel((prev) => ({ ...prev, page: newPage }));
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setPaginationModel((prev) => ({ ...prev, pageSize: parseInt(event.target.value, 10), page: 0 }));
  };

  const toggleAddDrawer = () => setAddUserOpen(!addUserOpen)
  const toggleDeleteDrawer = () => setDeleteUserOpen(!deleteUserOpen)

  const user = localStorage.getItem('userData')
  const userData = user ? JSON.parse(user) : null

  return (
    <>
      {dataList && dataList.length ? (
        <Paper>
          <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
            <TableHeaderDetail
              value={values}
              handleFilter={handleFilter}
              selectedQuizStoreName={selectedQuizStoreName}
              setSelectedQuizStoreName={setSelectedQuizStoreName}
              toggleAdd={toggleAddDrawer}
              toggleDelete={toggleDeleteDrawer}
              idOwner={idOwner}
              deleteCount={selectedItemsCount}
            />
            <Table sx={{
              "& img": {
                height: "100px !important", width: "auto !important"
              }
            }} aria-label="custom pagination table">
              <TableHead sx={{ backgroundColor: theme => `${theme.palette.customColors.tableHeaderBg}` }}>
                <TableRow>
                  <TableCell style={{ width: '50%' }}>
                    {t('Question')}
                  </TableCell>
                  <TableCell style={{ width: '30%', textAlign: 'center' }}>
                    {t('Level')}
                  </TableCell>
                  <TableCell style={{ width: '20%', textAlign: 'center' }}>
                    {t('Actions')}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody >
                {dataList.map((quiz: QuizQuestion) => (
                  <Fragment key={quiz._id}>
                    <TableRow >
                      <TableCell
                        sx={{
                          width: '50%',
                        }}
                      >
                        {quiz && (
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                            <Typography
                              noWrap
                              sx={{
                                fontWeight: 500,
                                textDecoration: 'none',
                                color: 'text.secondary',
                              }}
                            >
                              <div dangerouslySetInnerHTML={{ __html: quiz.question }}></div>

                            </Typography>
                          </Box>
                        )}
                      </TableCell>
                      <TableCell sx={{ fontSize: 15, width: '30%', textAlign: 'center' }}>
                        {quiz.level}
                      </TableCell>
                      <TableCell sx={{ width: '20%', textAlign: 'center' }}>
                        <>
                          <Tooltip title={t('View')}>
                            <IconButton
                              size='small'
                              component={Link}
                              sx={{ color: 'text.secondary', fontSize: 22, mx: 2 }}
                              href={`/apps/storeQuizQuestion/detail/${quiz._id}`}
                            >
                              <Icon icon='tabler:eye' />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t('Edit')}>
                            <IconButton
                              size='small'
                              component={Link}
                              disabled={userData._id !== idOwner}
                              sx={{ color: 'text.secondary', fontSize: 22, mx: 2 }}
                              href={`/apps/storeQuizQuestion/update/${quiz._id}`}
                            >
                              <Icon icon='tabler:edit' />
                            </IconButton>
                          </Tooltip>
                          <Checkbox
                            size="small"
                            disabled={userData._id !== idOwner}
                            onChange={event => handleCheckboxChange(event, quiz._id)}
                          />
                        </>
                      </TableCell>
                    </TableRow>
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[{ label: 'All', value: -1 }]}
            count={dataList.length || 1}
            rowsPerPage={paginationModel.pageSize}
            page={paginationModel.page}
            component="div"
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      ) : (
        <Paper>
          <TableContainer component={Paper}>
            <TableHeaderDetail
              value={values}
              handleFilter={handleFilter}
              selectedQuizStoreName={selectedQuizStoreName}
              setSelectedQuizStoreName={setSelectedQuizStoreName}
              toggleAdd={toggleAddDrawer}
              toggleDelete={toggleDeleteDrawer}
              idOwner={idOwner}
              deleteCount={selectedItemsCount}
            />
            <Table aria-label="custom pagination table">
              <TableHead sx={{ backgroundColor: theme => `${theme.palette.customColors.tableHeaderBg}` }}>
                <TableRow>
                  <TableCell style={{ width: '50%' }}>
                    {t('Question')}
                  </TableCell>
                  <TableCell style={{ width: '30%', textAlign: 'center' }}>
                    {t('Level')}
                  </TableCell>
                  <TableCell style={{ width: '20%', textAlign: 'center' }}>
                    {t('Actions')}
                  </TableCell>
                </TableRow>
              </TableHead>
            </Table>
          </TableContainer>
          <Box sx={{ textAlign: 'center', padding: 5 }}>
            {t('No rows')}
          </Box>
        </Paper>
      )}
      {/* Delete */}
      <Dialog open={deleteUserOpen} onClose={() => setDeleteUserOpen(false)}>
        <DialogTitle
          id='delete'
          sx={{
            textAlign: 'center',
            fontSize: '1.5rem !important',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          {t('Confirm Deletion')}
          <IconButton
            size='small'
            onClick={() => setDeleteUserOpen(false)}
            sx={{
              p: '0.438rem',
              borderRadius: 1,
              color: 'text.primary',
              top: '5%',
              position: 'absolute',
              right: '5%',
              backgroundColor: 'action.selected',
              '&:hover': {
                backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.16)`
              }
            }}
          >
            <Icon icon='tabler:x' fontSize='1.125rem' />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(8)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
          }}
        >
          <p>{t('Are you sure you want to delete this courses?')}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteUserOpen(false)}>{t('Cancel')}</Button>
          <Button
            onClick={() => {
              handleDelete();
              setDeleteUserOpen(false);
              setSelectedItems([]);
            }}
          >
            {t('Delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

QuizQuestionStoreDetail.acl = {
  action: 'read',
  subject: 'teacher-page'
}
