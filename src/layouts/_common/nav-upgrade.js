// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
// hooks
import { useMockedUser } from 'src/hooks/use-mocked-user';
// routes
import { paths } from 'src/routes/paths';
// locales
import { useLocales } from 'src/locales';
// components
import Label from 'src/components/label';
import { RouterLink } from 'src/routes/components';
import { useRouter } from 'src/routes/hook';

// ----------------------------------------------------------------------

export default function NavUpgrade() {
  const { user } = useMockedUser();

  const router = useRouter();
  return (
    <Stack
      sx={{
        px: 2,
        py: 5,
        textAlign: 'center',
      }}
    >
      <Stack alignItems="center">
        <Box sx={{ position: 'relative' }}>
          <Avatar src={user?.photoURL} alt={user?.displayName} sx={{ width: 48, height: 48 }} />
          {/* <Label
            color="success"
            variant="filled"
            sx={{
              top: -6,
              px: 0.5,
              left: 40,
              height: 20,
              position: 'absolute',
              borderBottomLeftRadius: 2,
            }}
          >
            Free
          </Label> */}
        </Box>

        <Stack spacing={0.5} sx={{ mt: 1.5, mb: 2 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.displayName}
          </Typography>
          <Typography variant="body2" noWrap sx={{ color: 'text.disabled' }}>
            Support & contact
          </Typography>
          <Typography variant="body2" noWrap sx={{ color: 'text.disabled' }}>
            {user?.email}
          </Typography>
          <Typography variant="body2" noWrap sx={{ color: 'text.disabled' }}>
            {user?.phoneNumber}
          </Typography>
          <Typography
            variant="body2"
            noWrap
            component={RouterLink}
            to={paths.dashboard.help.help}
            sx={{
              color: '#363636',
              cursor: 'pointer',
              textDecoration: 'underline',
              '&:hover': {
                color: 'primary.main',
              },
            }}
          >
            Need Help?
          </Typography>


        </Stack>

        {/* <Button variant="contained" href={paths.minimalUI} target="_blank" rel="noopener">
          {t('upgrade_to_pro')}
        </Button> */}
      </Stack>
    </Stack>
  );
}
