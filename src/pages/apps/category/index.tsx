// ** React Imports
import { useState, useEffect, useCallback } from 'react'

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

// ** Third Party Components
import AxiosInstance from 'src/configs/axios'

// ** Custom Table Components Imports
import TableHeader from 'src/views/apps/category/TableHeader'
import AddCategoryDrawer from 'src/views/apps/category/AddCategoryDrawer'
import { Category, Courses } from 'src/context/types'
import Actions from 'src/pages/apps/action/ActionsCategory'
import adminPathName from 'src/configs/endpoints/admin';
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

interface CellType {
  row: Category
}

const UserList = () => {
  // ** State
  const [value, setValue] = useState<string>('')
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 70 })
  const [dataCategory, setDataCategory] = useState<Category[]>([])
  const [categoryCourseCounts, setCategoryCourseCounts] = useState<{ [categoryId: string]: number }>({});
  const [totalCategories, setTotalCategories] = useState<number>(0);
  const searchQuery = encodeURIComponent(value);
  const [sortValue, setSortValue] = useState<string>('name');
  const [sortType, setSortType] = useState<string>('asc');
  const { t } = useTranslation()

  //Total Courses
  const fetchDataList = async () => {
    const counts: { [categoryId: string]: number } = {};
    try {
      const categoriesResponse = await AxiosInstance.get(`${adminPathName.listCategoryEndpoint}?page=${paginationModel.page + 1}&limit=${paginationModel.pageSize}&search=${searchQuery}&sort=${sortValue}:${sortType}`);
      const categories = categoriesResponse.data.data as Category[];
      setDataCategory(categories);
      setTotalCategories(categoriesResponse.data.total)
      const coursesResponse = await AxiosInstance.get<Courses[]>(`${adminPathName.getallCoursesEndpoint}`);
      const courses = coursesResponse.data;
      categories.forEach((category) => {
        counts[category._id] = 0;
      });
      courses.forEach((course) => {
        if (counts.hasOwnProperty(course.category_id)) {
          counts[course.category_id]++;
        }
      });
      setCategoryCourseCounts(counts);
    } catch (error: any) {
      if (error && error.response) {
        toast.error(error.response.data.message)
      }
    }
  };

  useEffect(() => {
    fetchDataList();
  }, [paginationModel.page, paginationModel.pageSize, searchQuery, sortValue, sortType]);


  // renders client column
  const renderIcon = (row: Category) => {
    if (typeof row.icon === 'string' && row.icon.startsWith('http')) {
      return <CustomAvatar src={row.icon} sx={{ mr: 2.5, width: 38, height: 38 }} />;
    } else {
      return <CustomAvatar src='/placeholder-image.jpg' sx={{ mr: 2.5, width: 38, height: 38 }} />;
    }
  }

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
  const RowOptions = ({ row }: { row: Category }) => {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Actions row={row} setDataCategory={setDataCategory} fetchDataList={fetchDataList} />
      </Box>
    );
  };

  const columns = (): GridColDef[] => {
    return [
      {
        flex: 1,
        minWidth: 100,
        field: 'name',
        sortable: false,
        headerName: `${t('Category Name')}`,
        renderCell: ({ row }: CellType) => {
          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {renderIcon(row)}
              <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                <Typography
                  noWrap
                  sx={{
                    fontWeight: 500,
                    textDecoration: 'none',
                    color: 'text.secondary'
                  }}
                >
                  {row.name}
                </Typography>
              </Box>
            </Box>
          );
        }
      },
      {
        field: 'totalCourses',
        headerName: `${t('Total Courses')}`,
        sortable: false,
        flex: 1,
        minWidth: 100,
        renderCell: ({ row }: CellType) => {
          const totalCourses = categoryCourseCounts[row._id] || 0;

          return <Box sx={{ display: "flex", gap: 2, fontSize: 15, }}>
            <Typography sx={{ fontWeight: 'bold', color: 'text.secondary' }}>{totalCourses}</Typography>
            <Typography sx={{ fontWeight: 400, color: 'text.secondary' }}>{t('Courses')}</Typography>
          </Box>;
        },
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
            rows={dataCategory}
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
      <AddCategoryDrawer open={addUserOpen} toggle={toggleAddUserDrawer} fetchDataList={fetchDataList} />
    </Grid>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const res = await AxiosInstance.get(`${adminPathName.listStudentEndpoint}`);
    const apiData: Category[] = res.data.map((user: any, index: number) => ({
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
