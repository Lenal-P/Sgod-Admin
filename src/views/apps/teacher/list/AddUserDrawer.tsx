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

// ** Define Header component using styled function
const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const SidebarAddUser = (props: any) => {
  const { open, toggle, fetchDataList } = props;

  const { control, handleSubmit } = useForm();

  const createUser = async (data: any) => {
    try {
      const filteredData = {
        email: data.email,
        password: data.password,
        role: 'teacher'
      };
      const response = await AxiosInstance.post(`${adminPathName.addUserEndpoint}`, filteredData);
      toast.success('Create User Successfully');
      fetchDataList(response.data);
    } catch (error: any) {
      if (error && error.response) {
        toast.error(error.response.data.message)
      }
    }
  };


  const onSubmit = (data: any) => {
    createUser(data);
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
      <Header>
        <Typography variant='h5'>{t('Add New Teacher')}</Typography>
        <IconButton
          size='small'
          onClick={handleClose}
          sx={{
            p: '0.438rem',
            borderRadius: 1,
            color: 'text.primary',
            mb: 4,
            backgroundColor: 'action.selected',
            '&:hover': {
              backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.16)`
            }
          }}
        >
          <Icon icon='tabler:x' fontSize='1.125rem' />
        </IconButton>
      </Header>
      <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name='email'
            control={control}
            defaultValue=''
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <TextField
                fullWidth
                value={value}
                sx={{ mb: 6 }}
                label={t('Email')}
                onChange={onChange}
                placeholder='johndoe@email.com'
              />
            )}
          />
          <Controller
            name='password'
            control={control}
            defaultValue=''
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <TextField
                fullWidth
                value={value}
                sx={{ mb: 6 }}
                label={t('Password')}
                onChange={onChange}
                type='password'
                placeholder='********'
              />
            )}
          />
          <Button type='submit' variant='contained' sx={{ mr: 3 }}>
            {t('Submit')}
          </Button>
          <Button variant='tonal' color='secondary' onClick={handleClose}>
            {t('Cancel')}
          </Button>
        </form>
      </Box>
    </Drawer>
  );
};

export default SidebarAddUser;
