// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import TextField from '@mui/material/TextField'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types Imports
import AxiosInstance from 'src/configs/axios'
import adminPathName from 'src/configs/endpoints/admin';
import { Category, Courses } from 'src/context/types'
import { MenuItem } from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select';

// ** Define Header component using styled function
const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const SidebarAddCourses = (props: any) => {
  const { open, toggle, fetchDataList } = props;
  const { control, handleSubmit } = useForm()
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    // Gọi API để lấy danh sách categories
    const fetchCategories = async () => {
      try {
        const response = await AxiosInstance.get(`${adminPathName.getallCategoryEndpoint}`)
        const categoriesData = response.data.map((category: Category) => ({
          _id: category._id,
          name: category.name
        }));
        setCategories(categoriesData)
      } catch (error: any) {
        if (error && error.response) {
          toast.error(error.response.data.message)
        }
      }
    }
    fetchCategories()
  }, [])

  const createCourses = async (data: Courses) => {
    try {
      const formData = new FormData();

      // Thêm dữ liệu của file vào formData
      formData.append('file', '/placeholder-image.jpg');

      // Thêm dữ liệu của category vào formData
      formData.append('name', data.name);
      formData.append('category_id', data.category_id);
      formData.append('status', data.status);

      // Gọi API để tạo category và gửi formData
      const response = await AxiosInstance.post(`${adminPathName.addCoursesEndpoint}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      fetchDataList(response.data);
      toast.success('Create Courses Successfully');
    } catch (error: any) {
      if (error && error.response) {
        toast.error(error.response.data.message)
      }
    }
  };

  const onSubmit = async (data: any) => {
    createCourses(data);
  };

  const handleClose = () => {
    toggle();
  };

  const { t } = useTranslation()

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Header sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px' }}>
        <Typography variant='h5'>{t('Add New Courses')}</Typography>
        <IconButton size='small' onClick={handleClose}>
          <Icon icon='tabler:x' fontSize='1.125rem' />
        </IconButton>
      </Header>
      <Box sx={{ padding: '16px' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name='name'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <TextField
                fullWidth
                value={value}
                sx={{ mb: 8 }}
                label={t('Name')}
                onChange={onChange}
                placeholder='Courses Name'
              />
            )}
          />
          <Controller
            name='category_id'
            control={control}
            rules={{ required: true }}
            defaultValue=''
            render={({ field: { value, onChange } }) => (
              <Select
                sx={{ mb: 8 }}
                value={value}
                onChange={(e: SelectChangeEvent<string>) => onChange(String(e.target.value))}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
                fullWidth
              >
                <MenuItem value='' disabled>
                  {t('Select a Category')}
                </MenuItem>
                {categories.map((category, index) => (
                  <MenuItem key={index} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          <Controller
            name='status'
            control={control}
            rules={{ required: true }}
            defaultValue="open"
            render={({ field }) => (
              <Select
                {...field}
                sx={{ mb: 8 }}
                value={field.value}
                onChange={(e: SelectChangeEvent<string>) => field.onChange(e.target.value)}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
                fullWidth
              >
                <MenuItem value='0' disabled>
                  {t('Select Status')}
                </MenuItem>
                <MenuItem value="open">{t('open')}</MenuItem>
                <MenuItem value="close">{t('close')}</MenuItem>
              </Select>
            )}
          />
          <Button type='submit' variant='contained' sx={{ mt: 5, mr: 3 }}>
            {t('Submit')}
          </Button>
          <Button variant='tonal' color='secondary' sx={{ mt: 5 }} onClick={handleClose}>
            {t('Cancel')}
          </Button>
        </form>
      </Box>
    </Drawer>
  );
};

export default SidebarAddCourses;
