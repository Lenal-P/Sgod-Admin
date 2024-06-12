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
import Grid from '@mui/material/Grid'

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
import ButtonsFab from 'src/views/pages/admin-profile/components/ButtonsFab'
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
  const { control, handleSubmit, setValue } = useForm()
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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

  const createCourses = async (data: Courses, file: File) => {
    try {
      const formData = new FormData();

      // Thêm dữ liệu của file vào formData
      formData.append('file', file);

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
    if (selectedFile) {
      createCourses(data, selectedFile);
    } else {
      toast.error('Please select an icon file');
    }
  };

  const handleClose = () => {
    toggle();
  };

  const handleChooseFile = async () => {
    try {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.click();
      fileInput.addEventListener('change', async event => {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const binaryString = event.target?.result as string;
            setValue('icon', binaryString);
            setSelectedFile(file);
          };
          reader.readAsDataURL(file);
        }
      });
    } catch (error) {
      console.error('Error choosing file:', error);
    }
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
            name='icon'
            control={control}
            render={({ field }) => (
              <Grid
                container
                alignItems='end'
                spacing={2}
                sx={{ display: 'flex', gap: 1, mb: 8 }}
              >
                <Grid item sx={{ position: 'relative', flex: 1 }} >
                  <TextField
                    fullWidth
                    placeholder='Icon'
                    defaultValue={field.value}
                    value={field.value}
                    onChange={e => {
                      setValue('icon', e.target.value)
                    }}
                  />
                  <Grid item className='buttonAvatar' onClick={handleChooseFile}
                    sx={{ position: 'absolute', top: '1.05rem', right: 3 }}
                  >
                    <ButtonsFab />
                  </Grid>
                </Grid>
              </Grid>
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
