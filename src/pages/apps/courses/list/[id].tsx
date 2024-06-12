// ** React Imports
import { Fragment, SyntheticEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// ** MUI Imports
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

// ** Third Party Components
import AxiosInstance from 'src/configs/axios';

// ** Custom Table Components Imports
import { Icon } from '@iconify/react';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Tab, TableHead } from '@mui/material';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import CustomAvatar from 'src/@core/components/mui/avatar';
import adminPathName from 'src/configs/endpoints/admin';
import { Quiz, UserDataType } from 'src/context/types';
import AddListUserDrawer from 'src/views/apps/courses/list/AddListUserDrawer';
import TableHeaderDetail from 'src/views/apps/courses/list/TableHeaderBreadcrumb';
import { Essay } from 'src/context/types'
import CardInfluencerQuiz from './quizCard';
import CardInfluencerEssay from './essayCard';

export default function CoursesDetail() {
  const router = useRouter();
  const { t } = useTranslation();
  const [dataList, setDataList] = useState<UserDataType[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [essayInCourses, setEssayInCourses] = useState<Essay[]>([]);
  const [selectedCourseName, setSelectedCourseName] = useState('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 70 });
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false)
  const [deleteUserOpen, setDeleteUserOpen] = useState<boolean>(false)
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [value, setValue] = useState<string>('1')

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  const fetchDataList = async () => {
    try {
      const response = await AxiosInstance.get(`${adminPathName.detailCoursesEndpoint}?id=${router.query.id}&query=user`);
      setDataList(response.data.response.res.data);
    } catch (error: any) {
      if (error && error.response) {
        toast.error(error.response.data.message)
      }
    }
  };

  const fetchQuizzes = async () => {
    try {
      const response = await AxiosInstance.get(`${adminPathName.detailCoursesEndpoint}?id=${router.query.id}&query=quiz`);
      setQuizzes(response.data.response.res);
    } catch (error: any) {
      if (error && error.response) {
        toast.error(error.response.data.message)
      }
    }
  };

  const fetchEssay = async () => {
    try {
      const response = await AxiosInstance.get(`${adminPathName.getallEssayEndpoint}?filterCourse=${router.query.id}`);
      setEssayInCourses(response.data.data);
    } catch (error: any) {
      if (error && error.response) {
        toast.error(error.response.data.message)
      }
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await AxiosInstance.get(`${adminPathName.getIdCoursesEndpoint}/${router.query.id}`);
      setSelectedCourseName(response.data.name);
    } catch (error: any) {
      if (error && error.response) {
        toast.error(error.response.data.message)
      }
    }
  }

  const handleDelete = async () => {
    try {
      await Promise.all(selectedItems.map(async (itemId) => {
        await AxiosInstance.put(`${adminPathName.deleteStudentToCoursesEndpoint}`, {
          id_course: router.query.id,
          id_student: [itemId]
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
    fetchQuizzes();
    fetchEssay();
  }, []);

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

  const renderClient = (row: UserDataType) => {
    if (row.avatar && row.avatar.length) {
      return <CustomAvatar src={row.avatar} sx={{ mr: 2.5, width: 38, height: 38 }} />
    } else {
      return <CustomAvatar src='/' sx={{ mr: 2.5, width: 38, height: 38 }} />;
    }
  }

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  return (
    <TabContext value={value}>
      <TabList onChange={handleChange} aria-label='customized tabs example'>
        <Tab value='1' label='Student in Courses' />
        <Tab value='2' label='Quiz in Courses' />
        <Tab value='3' label='Essay in Courses' />
      </TabList>
      <TabPanel value='1' sx={{ px: 0 }}>
        {dataList && dataList.length ? (
          <Paper>
            <TableContainer sx={{ borderRadius: 0 }} component={Paper} >
              <TableHeaderDetail />
              <Table aria-label="custom pagination table">
                <TableHead sx={{ backgroundColor: theme => `${theme.palette.customColors.tableHeaderBg}` }}>
                  <TableRow>
                    <TableCell style={{ width: '50%' }}>
                      {t('Full Name')}
                    </TableCell>
                    <TableCell style={{ width: '30%', textAlign: 'center' }}>
                      {t('Role')}
                    </TableCell>
                    <TableCell style={{ width: '20%', textAlign: 'center' }}>
                      {t('Actions')}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody >
                  {dataList.map((user: any) => (
                    <Fragment key={user._id}>
                      <TableRow >
                        <TableCell
                          sx={{
                            width: '50%',
                          }}
                        >
                          {user && (
                            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                              {renderClient(user)}
                              <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                                <Typography
                                  noWrap
                                  sx={{
                                    fontWeight: 500,
                                    textDecoration: 'none',
                                    color: 'text.secondary',
                                  }}
                                >
                                  {`${user.name && user.name.first_name || 'No Name'} ${user.name && user.name.last_name || ''}`}
                                </Typography>
                                <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
                                  {user.email}
                                </Typography>
                              </Box>
                            </Box>
                          )}
                        </TableCell>
                        <TableCell sx={{ fontSize: 15, width: '30%', textAlign: 'center' }}>
                          {user.role}
                        </TableCell>
                        <TableCell sx={{ fontSize: 15, width: '20%', textAlign: 'center' }}>
                          <Checkbox
                            size="small"
                            onChange={event => handleCheckboxChange(event, user._id)}
                          />
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
            <AddListUserDrawer
              open={addUserOpen}
              toggleAdd={toggleAddUserDrawer}
              fetchDataList={fetchDataList}
              courseId={router.query.id}
              courseName={selectedCourseName}
            />
          </Paper>
        ) : (
          <Paper>
            <TableContainer component={Paper}>
              <TableHeaderDetail />
              <Table aria-label="custom pagination table">
                <TableHead sx={{ backgroundColor: theme => `${theme.palette.customColors.tableHeaderBg}` }}>
                  <TableRow>
                    <TableCell style={{ width: '50%' }}>
                      {t('Full Name')}
                    </TableCell>
                    <TableCell style={{ width: '30%', textAlign: 'center' }}>
                      {t('Role')}
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
            <AddListUserDrawer
              open={addUserOpen}
              toggleAdd={toggleAddUserDrawer}
              fetchDataList={fetchDataList}
              courseId={router.query.id}
              courseName={selectedCourseName}
            />
          </Paper>
        )}
      </TabPanel>
      <TabPanel value='2' sx={{ px: 0, borderRadius: 0 }}>
        <TableContainer sx={{ borderRadius: 0, mb: 3 }} component={Paper} >
          <TableHeaderDetail />
        </TableContainer>
        {quizzes.length ? (
          <Grid container spacing={3}>
            {quizzes.map((quiz: Quiz) => (
              <Grid item key={quiz._id} xs={12} sm={3} md={3}>
                <CardInfluencerQuiz
                  quiz={quiz}
                  fetchQuizzes={fetchQuizzes}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body1" sx={{ textAlign: 'center', mt: 3 }}>
            {t('No quizzes available')}
          </Typography>
        )}
      </TabPanel>
      <TabPanel value='3' sx={{ px: 0 }}>
        <TableContainer sx={{ borderRadius: 0, mb: 3 }} component={Paper} >
          <TableHeaderDetail />
        </TableContainer>
        {essayInCourses.length > 0 ? (
          <Grid container spacing={3}>
            {essayInCourses.map((essay) => (
              <Grid item key={essay.exam._id} xs={12} sm={3} md={3}>
                <CardInfluencerEssay
                  essay={essay}
                  fetchEssay={fetchEssay}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body1" sx={{ textAlign: 'center', mt: 3 }}>
            {t('No essay available')}
          </Typography>
        )}
      </TabPanel>
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
    </TabContext >
  );
}

CoursesDetail.acl = {
  action: 'read',
  subject: 'teacher-page'
}
