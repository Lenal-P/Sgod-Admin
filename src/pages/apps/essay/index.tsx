// ** React Imports
import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

// ** Next Imports
import { GetStaticProps, InferGetStaticPropsType } from 'next/types'

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
import TableHeader from 'src/views/apps/essay/TableHeader'
import AddDrawer from 'src/views/apps/essay/AddDrawer'
import { Essay } from 'src/context/types'
import Actions from 'src/pages/apps/action/ActionsEssay'
import adminPathName from 'src/configs/endpoints/admin';
import { updateData, resetData } from 'src/store/apps/breadcrumbs'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'

interface CellType {
  row: Essay
}

const UserList = ({ apiData }: InferGetStaticPropsType<typeof getStaticProps>) => {
  // ** State
  const router = useRouter()
  const [value, setValue] = useState<string>('')
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 70 })
  const [totalPage, setTotalPage] = useState<number>(0);
  const [dataEssay, setDataEssay] = useState<Essay[]>([])
  const searchQuery = encodeURIComponent(value);
  const [sortValue, setSortValue] = useState<string>('title');
  const [sortType, setSortType] = useState<string>('asc');
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const fetchDataList = async () => {
    try {
      const response = await AxiosInstance.get(`${adminPathName.getallEssayEndpoint}?pageNum=${paginationModel.page + 1}&limitPerPage=${paginationModel.pageSize}&sort=${sortValue}%3A${sortType}&searchKey=${searchQuery}`);
      const essayData = response.data.data.map((x: any) => ({
        teacher_name: x.teacher_name,
        exam: x.exam
      }))
      setDataEssay(essayData);
      setTotalPage(response.data.total)
    } catch (error: any) {
      toast.error(error.response.data.message)
    }
  };

  useEffect(() => {
    fetchDataList()
  }, [paginationModel.page, paginationModel.pageSize, searchQuery, sortValue, sortType]);

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
  const RowOptions = ({ row }: { row: Essay }) => {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Actions row={row} setDataEssay={setDataEssay} fetchDataList={fetchDataList} />
      </Box>
    );
  };

  useEffect(() => {
    dispatch(resetData())
    dispatch(updateData(
      {
        title: t('Essay'),
        url: `/apps/essay/`
      }
    ))
  }, [])

  const columns = (): GridColDef[] => {
    const { t } = useTranslation();

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
                {row.exam?.title}
              </Typography>
            </Box>
          );
        }
      },
      {
        flex: 0.6,
        minWidth: 100,
        field: 'content',
        sortable: false,
        headerName: `${t('Content')}`,
        renderCell: ({ row }: CellType) => {
          return (
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Box sx={{
                fontWeight: 500,
                fontSize: 15,
                textDecoration: 'none',
                color: 'text.secondary'
              }} dangerouslySetInnerHTML={{ __html: row.exam?.content }}></Box>
            </Box>
          );
        }
      },
      {
        flex: 0.6,
        minWidth: 100,
        field: 'teacher',
        sortable: false,
        headerName: `${t('Teacher')}`,
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
                {row.teacher_name}
              </Typography>
            </Box>
          );
        }
      },
      {
        flex: 0.3,
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
                {row.exam?.createAt.toString().slice(0, 10)}
              </Typography>
            </Box>
          );
        }
      },
      {
        flex: 0.5,
        minWidth: 100,
        sortable: false,
        field: 'actions',
        headerName: `${t('Actions')}`,
        renderCell: ({ row }: CellType) => <RowOptions row={row} />,
      }
    ];
  };

  const gridColumns = columns();
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
            rows={dataEssay}
            columns={columns()}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 70]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            getRowId={(row) => row.exam?._id}
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
    const res = await AxiosInstance.get(`${adminPathName.getallEssayEndpoint}`);
    const apiData: Essay[] = res.data.map((user: any, index: number) => ({
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
