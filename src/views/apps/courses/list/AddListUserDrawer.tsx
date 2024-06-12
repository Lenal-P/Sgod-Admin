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
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Checkbox from '@mui/material/Checkbox';

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types Imports
import AxiosInstance from 'src/configs/axios'
import adminPathName from 'src/configs/endpoints/admin';
import { Courses, UserDataType } from 'src/context/types'
import { Autocomplete, createFilterOptions } from '@mui/material'

// ** Define Header component using styled function
const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}));

const SidebarAddCourses = (props: any) => {
  const { open, toggleAdd, fetchDataList, courseId } = props;
  const { control, handleSubmit, setValue } = useForm();
  const [options, setOptions] = useState<UserDataType[]>([]);
  const loading = open && options?.length === 0;
  const [selectedStudents, setSelectedStudents] = useState<UserDataType[]>([]);
  const [selectedCourseName, setSelectedCourseName] = useState<string>('');
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await AxiosInstance.get(`${adminPathName.getIdCoursesEndpoint}/${courseId}`);
        const coursesData = {
          _id: response.data._id,
          name: response.data.name
        } as Courses
        setSelectedCourseName(coursesData._id);
        setValue('courses_name', coursesData.name);
      } catch (error: any) {
        if (error && error.response) {
          toast.error(error.response.data.message)
        }
      }
    }
    fetchCourses();
  }, [selectedCourseName])

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const response = await AxiosInstance.get(`${adminPathName.studentWithoutCourseEndpoint}?id=${courseId}`, courseId);
        const students = response.data;
        if (active) {
          setOptions(students);
        }
      } catch (error: any) {
        if (error && error.response) {
          toast.error(error.response.data.message)
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [loading, fetchDataList]);

  const onSubmit = async () => {
    if (selectedStudents.length === 0 || !selectedCourseName) {
      return;
    }
    try {
      const response = await AxiosInstance.put(adminPathName.addStudentToCoursesEndpoint, {
        id_course: selectedCourseName,
        id_student: selectedStudents.map(student => student._id)
      });
      fetchDataList(response.data);
      toast.success('Add Students To Course Successfully');
      setSelectedStudents([]);
    } catch (error: any) {
      toast.error(error.response.data.message)
      toast.error(error.response.data.email);
    }
  };

  const handleClose = () => {
    toggleAdd();
  };

  const { t } = useTranslation();

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
        <Typography variant='h5'>{t('Add Student To Courses')}</Typography>
        <IconButton size='small' onClick={handleClose}>
          <Icon icon='tabler:x' fontSize='1.125rem' />
        </IconButton>
      </Header>
      <Box sx={{ padding: '16px' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name='courses_name'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                autoFocus
                fullWidth
                disabled
                value={field.value || ""}
                sx={{ marginBottom: '16px' }}
                label={t('Name')}
              />
            )}
          />
          <Autocomplete
            multiple
            id="student-search"
            options={options ?? []}
            disableCloseOnSelect
            getOptionLabel={(option: any) => option.email}
            value={selectedStudents}
            onChange={(event, newValue) => {
              if (newValue.find(option => option.all)) {
                return setSelectedStudents(selectedStudents.length === options?.length ? [] : options);
              }
              setSelectedStudents(newValue);
            }}
            filterOptions={(options, params) => {
              const filter = createFilterOptions();
              const filtered = filter(options, params);

              return [{ email: 'Select All', all: true }, ...filtered];
            }}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  checked={option.all ? !!(selectedStudents.length === options?.length) : selected}
                />
                {option.email}
              </li>
            )}
            renderInput={(params) => (
              <TextField {...params} label="Student Email" />
            )}
            defaultValue={selectedStudents || undefined}
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
