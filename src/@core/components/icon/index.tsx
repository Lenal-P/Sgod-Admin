// ** Icon Imports
import { Icon, IconProps } from '@iconify/react'
import { color } from '@mui/system'

const IconifyIcon = ({ icon, ...rest }: IconProps) => {
  return <Icon icon={icon} fontSize='1.375rem' {...rest} />
}

export default IconifyIcon
