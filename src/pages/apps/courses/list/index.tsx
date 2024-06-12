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

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Actions Imports
import Actions from 'src/pages/apps/action/ActionsCourses'

// ** Third Party Components
import AxiosInstance from 'src/configs/axios'

// ** Custom Table Components Imports
import TableHeader from 'src/views/apps/courses/list/TableHeader'
import AddCoursesDrawer from 'src/views/apps/courses/list/AddCoursesDrawer'
import { Category, Courses } from 'src/context/types'
import adminPathName from 'src/configs/endpoints/admin';
import Link from 'next/link'
import { useDispatch } from 'react-redux'
import { updateData, resetData } from 'src/store/apps/breadcrumbs'
import toast from 'react-hot-toast'

interface CellType {
  row: Courses
}

const CoursesList = () => {
  // ** State
  const [value, setValue] = useState<string>('')
  const [addCoursesOpen, setAddCoursesOpen] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 70 })
  const [dataCourses, setDataCourses] = useState<Courses[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCourseName, setSelectedCourseName] = useState('');
  const searchQuery = encodeURIComponent(value);
  const [totalCategories, setTotalCategories] = useState<number>(0);
  const [sortValue, setSortValue] = useState<string>('name');
  const [sortType, setSortType] = useState<string>('asc');
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const fetchDataList = async () => {
    try {
      const response = await AxiosInstance.get(`${adminPathName.listCoursesEndpoint}?page=${paginationModel.page + 1}&limit=${paginationModel.pageSize}&search=${searchQuery}&sort=${sortValue}:${sortType}`);
      setDataCourses(response.data.data);
      setTotalCategories(response.data.total);
    } catch (error: any) {
      if (error && error.response) {
        toast.error(error.response.data.message)
      }
    }
  };

  // Gọi API để lấy danh sách categories
  const fetchCategories = async () => {
    try {
      const response = await AxiosInstance.get(`${adminPathName.getallCategoryEndpoint}`)
      const categoriesData = response.data.map((category: Category) => ({
        _id: category._id,
        name: category.name,
        icon: category.icon
      }));
      setCategories(categoriesData)
    } catch (error: any) {
      if (error && error.response) {
        toast.error(error.response.data.message)
      }
    }
  }

  useEffect(() => {
    fetchDataList()
    fetchCategories()
  }, [paginationModel.page, paginationModel.pageSize, searchQuery, sortValue, sortType]);

  useEffect(() => {
    dispatch(resetData())
    dispatch(updateData(
      {
        title: t('Courses'),
        url: `/apps/courses/list/`
      }
    ))
  }, [])

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
  const RowOptions = ({ row }: { row: Courses }) => {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Actions
          row={row}
          setDataCourses={setDataCourses}
          fetchDataList={fetchDataList}
          fetchCategories={fetchCategories}
          categories={categories}
          selectedCourseName={selectedCourseName}
          setSelectedCourseName={setSelectedCourseName}
        />
      </Box>
    );
  };

  const renderCourses = (row: Courses) => {
    if (row.icon && row.icon.length) {
      return <CustomAvatar src={row.icon} sx={{ mr: 2.5, width: 38, height: 38 }} />
    } else {
      return <CustomAvatar src='/' sx={{ mr: 2.5, width: 38, height: 38 }} />;
    }
  }

  const renderCategory = (row: Courses) => {
    const category = categories.find(cat => cat._id === row.category_id);
    if (category) {
      return (
        <CustomAvatar src={category.icon} sx={{ mr: 2.5, width: 38, height: 38 }} />
      );
    } else {
      return <CustomAvatar src='/' sx={{ mr: 2.5, width: 38, height: 38 }} />;
    }
  };


  const columns = (): GridColDef[] => {
    return [
      {
        flex: 1,
        minWidth: 100,
        sortable: false,
        field: 'coursesName',
        headerName: `${t('Courses Name')}`,
        renderCell: ({ row }: CellType) => {
          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {renderCourses(row)}
              <Box
                component={Link}
                href={`/apps/courses/list/${row._id}`}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  flexDirection: 'column',

                }}>
                <Typography
                  noWrap
                  sx={{
                    fontWeight: 500,
                    textDecoration: 'none',
                    color: 'text.secondary',
                  }}
                >
                  {row.name || 'No Name'}
                </Typography>
              </Box>
            </Box>
          );
        }
      },
      {
        flex: 1,
        minWidth: 100,
        sortable: false,
        field: 'categoryName',
        headerName: `${t('Category Name')}`,
        renderCell: ({ row }: CellType) => {
          const category = categories.find(cat => cat._id === row.category_id);
          const categoryName = category ? category.name : 'No Name';

          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {renderCategory(row)}
              <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                <Typography
                  noWrap
                  sx={{
                    fontWeight: 500,
                    textDecoration: 'none',
                    color: 'text.secondary',
                  }}
                >
                  {categoryName}
                </Typography>
              </Box>
            </Box>
          );
        }
      },
      {
        flex: 1,
        minWidth: 150,
        field: 'status',
        sortable: false,
        headerName: `${t('Status')}`,
        renderCell: ({ row }: CellType) => (
          <Typography
            noWrap
            component="div"
            sx={{
              fontWeight: 500,
              textDecoration: 'none',
              color: 'text.secondary',
            }}
          >
            {row.status}
          </Typography>
        )
      },
      {
        field: 'actions',
        headerName: `${t('Actions')}`,
        flex: 0.5,
        minWidth: 100,
        sortable: false,
        renderCell: ({ row }: CellType) => <RowOptions row={row} />,
      }
    ]
  }

  const toggleAddCoursesDrawer = () => setAddCoursesOpen(!addCoursesOpen)

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <Divider sx={{ m: '0 !important' }} />
          <TableHeader
            value={value}
            handleFilter={handleFilter}
            toggle={toggleAddCoursesDrawer}
            sortValue={sortValue}
            sortType={sortType}
            handleSortValueChange={handleSortValueChange}
            handleSortTypeChange={handleSortTypeChange}
          />
          <DataGrid
            autoHeight
            rowHeight={62}
            rows={dataCourses}
            columns={columns()}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 70]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            getRowId={(row) => row._id}
            rowCount={totalCategories || 1}
            paginationMode='server'
          />
        </Card>
      </Grid>
      <AddCoursesDrawer open={addCoursesOpen} toggle={toggleAddCoursesDrawer} fetchDataList={fetchDataList} fetchCategories={fetchCategories} />
    </Grid>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const res = await AxiosInstance.get(`${adminPathName.listCoursesEndpoint}`);
    const apiData: Courses[] = res.data.map((user: any, index: number) => ({
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

CoursesList.acl = {
  action: 'manage',
  subject: 'teacher-page'
}

export default CoursesList
