import * as React from 'react';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import NextLink from 'next/link';
import { Box } from '@mui/system';
import { Icon } from '@iconify/react';
import { useDispatch } from 'react-redux';
import { sliceData } from 'src/store/apps/breadcrumbs'

interface breacumbDataProps {
  title: string
  url: string
}

interface BreadcrumbsProps {
  breacumbData: breacumbDataProps[]
}

const BreadcrumbRouter = ({ breacumbData }: BreadcrumbsProps) => {
  const dispatch = useDispatch()

  return (
    <Box
      sx={{ display: 'flex', justifySelf: "flex-start" }}>
      {breacumbData.map((x, i) => (
        <Link
          key={i}
          onClick={() => (dispatch(sliceData(i)))}
          underline="hover"
          color="inherit"
          component={NextLink}
          href={`${x.url}`}
        >
          <Typography component="span" variant='h5' sx={{ display: 'flex', alignItems: 'center' }}>
            {i !== 0 && <Icon icon='material-symbols:arrow-forward-ios' />}{x.title}
          </Typography>
        </Link>
      ))}
    </Box>

  );
}

export default BreadcrumbRouter
