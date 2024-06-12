// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      sectionTitle: 'Profile',
    },
    {
      title: 'Admin',
      icon: 'tabler:user-circle',
      path: '/pages/admin-profile/profile'
    },
    {
      sectionTitle: 'Pages',
      action: 'read',
      subject: 'teacher-page'
    },
    {
      title: 'Category',
      icon: 'tabler:category',
      action: 'read',
      subject: 'teacher-page',
      path: '/apps/category'
    },
    {
      title: 'Courses',
      action: 'read',
      subject: 'teacher-page',
      icon: 'mdi:learn-outline',
      path: '/apps/courses/list'
    },
    {
      title: 'Students',
      icon: 'mdi:account-student-outline',
      action: 'read',
      subject: 'teacher-page',
      path: '/apps/students'
    },
    {
      title: 'Teacher',
      icon: 'mdi:teacher',
      action: 'read',
      subject: 'teacher-page',
      path: '/apps/teacher'
    },
    {
      sectionTitle: 'Quiz Question',
      action: 'read',
      subject: 'teacher-page'
    },
    {
      title: 'Quiz Question Store',
      icon: 'material-symbols:quiz-outline',
      action: 'read',
      subject: 'teacher-page',
      path: '/apps/storeQuizQuestion'
    },
    {
      title: 'Create Quiz Question',
      icon: 'ion:create-outline',
      action: 'read',
      subject: 'teacher-page',
      path: '/apps/storeQuizQuestion/create'
    },
    {
      sectionTitle: 'Quiz Exam',
      action: 'read',
      subject: 'teacher-page'
    },
    {
      title: 'Quiz',
      icon: 'line-md:text-box-multiple-twotone-to-text-box-twotone-transition',
      action: 'read',
      subject: 'teacher-page',
      path: '/apps/quiz/'
    },
    {
      title: 'Create Quiz',
      icon: 'ion:create-outline',
      action: 'read',
      subject: 'teacher-page',
      path: '/apps/quiz/create'
    },
    {
      sectionTitle: 'Quiz Online',
      action: 'read',
      subject: 'teacher-page'
    },
    {
      title: 'Quiz Online',
      icon: 'heroicons-outline:clipboard-list',
      action: 'read',
      subject: 'teacher-page',
      path: '/apps/quiz-online',
    },
    {
      title: 'Create Quiz Online',
      icon: 'ion:create-outline',
      action: 'read',
      subject: 'teacher-page',
      path: '/apps/quiz-online/create',
    },
    {
      sectionTitle: 'Essay Exam',
      action: 'read',
      subject: 'teacher-page'
    },
    {
      title: 'Essay',
      icon: 'heroicons-outline:clipboard-list',
      action: 'read',
      subject: 'teacher-page',
      path: '/apps/essay',
    },
    {
      title: 'Create Essay',
      icon: 'ion:create-outline',
      action: 'read',
      subject: 'teacher-page',
      path: '/apps/essay/create'
    }
  ]
}

export default navigation
