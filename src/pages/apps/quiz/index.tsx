// ** React Imports
import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

// ** Next Imports
import { GetStaticProps } from 'next/types'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** Store Imports
import { useDispatch } from 'react-redux'

// ** Third Party Components
import AxiosInstance from 'src/configs/axios'

// ** Custom Table Components Imports
import TableHeader from 'src/views/apps/quiz/TableHeader'
import AddDrawer from 'src/views/apps/quiz/AddDrawer'
import { Quiz, QuizList } from 'src/context/types'
import Actions from 'src/pages/apps/action/ActionsQuiz'
import adminPathName from 'src/configs/endpoints/admin';
import { updateData, resetData } from 'src/store/apps/breadcrumbs'
import toast from 'react-hot-toast'

interface CellType {
  row: any
}

const UserList = () => {
  // ** State
  const [value, setValue] = useState<string>('')
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 70 })
  const [totalPage, setTotalPage] = useState<number>(0);
  const [dataQuiz, setDataQuiz] = useState<QuizList[]>([])
  const searchQuery = encodeURIComponent(value);
  const [sortValue, setSortValue] = useState<string>('title');
  const [sortType, setSortType] = useState<string>('asc');
  const dispatch = useDispatch()
  const { t } = useTranslation();

  const fetchDataList = async () => {
    try {
      const response = await AxiosInstance.get(`${adminPathName.listQuizEndpoint}?page=${paginationModel.page + 1}&limit=${paginationModel.pageSize}&search=${searchQuery}&sort=${sortValue}%3A${sortType}`);
      setDataQuiz(response.data.data);
      setTotalPage(response.data.total)
    } catch (error: any) {
      if (error && error.response) {
        toast.error(error.response.data.message)
      }
    }
  };

  useEffect(() => {
    fetchDataList()
  }, [paginationModel.page, paginationModel.pageSize, searchQuery, sortType, sortValue]);

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const handleSortValueChange = useCallback((val: string) => {
    setSortValue(val);
  }, []);

  const handleSortTypeChange = useCallback((val: string) => {
    setSortType(val);
  }, []);

  // ** Render Action Buttons
  const RowOptions = ({ row }: { row: QuizList }) => {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Actions row={row} setDataQuiz={setDataQuiz} fetchDataList={fetchDataList} />
      </Box>
    );
  };

  useEffect(() => {
    dispatch(resetData())
    dispatch(updateData(
      {
        title: t('Quiz'),
        url: `/apps/quiz/`
      }
    ))
  }, [])

  const columns = (): GridColDef[] => {
    return [
      {
        flex: 0.6,
        minWidth: 100,
        field: 'title',
        sortable: false,
        headerName: `${t('Title')}`,
        renderCell: ({ row }: CellType) => {
          return (
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography
                noWrap
                sx={{
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: 'text.secondary'
                }}
              >
                {row.quiz.title}
              </Typography>
            </Box>
          );
        }
      },
      {
        flex: 0.6,
        minWidth: 100,
        field: 'courses_name',
        sortable: false,
        headerName: `${t('Courses Name')}`,
        renderCell: ({ row }: CellType) => {
          return (
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography
                noWrap
                sx={{
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: 'text.secondary'
                }}
              >
                {row.course_id?.name}
              </Typography>
            </Box>
          );
        }
      },
      {
        flex: 0.5,
        minWidth: 100,
        field: 'createAt',
        sortable: false,
        headerName: `${t('Created At')}`,
        renderCell: ({ row }: CellType) => {
          return (
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography
                noWrap
                sx={{
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: 'text.secondary'
                }}
              >
                {row.quiz.createAt.toString().slice(0, 10)}
              </Typography>
            </Box>
          );
        }
      },
      {
        flex: 0.3,
        minWidth: 100,
        sortable: false,
        field: 'actions',
        headerName: `${t('Actions')}`,
        renderCell: ({ row }: CellType) => <RowOptions row={row} />,
      }
    ];
  };
  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <Divider sx={{ m: '0 !important' }} />
          <TableHeader
            value={value}
            handleFilter={handleFilter}
            toggle={toggleAddUserDrawer}
            sortValue={sortValue}
            sortType={sortType}
            handleSortValueChange={handleSortValueChange}
            handleSortTypeChange={handleSortTypeChange}
          />
          <DataGrid
            autoHeight
            rowHeight={62}
            rows={dataQuiz}
            columns={columns()}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 70]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            getRowId={(row) => row.quiz._id}
            paginationMode='server'
            rowCount={totalPage || 1}
          />
        </Card>
      </Grid>
      <AddDrawer open={addUserOpen} toggleAdd={toggleAddUserDrawer} fetchDataList={fetchDataList} />
    </Grid>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const res = await AxiosInstance.get(`${adminPathName.listQuizStoreEndpoint}`);
    const apiData: Quiz[] = res.data.map((user: any, index: number) => ({
      ...user,
      id: index.toString()
    }));

    return {
      props: {
        apiData
      }
    };
  } catch (error: any) {
    return {
      props: {
        apiData: []
      }
    };
  }
};

UserList.acl = {
  action: 'manage',
  subject: 'teacher-page'
}

export default UserList
