// @mui
import {
  Box,
  Card,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';

export default function RMVerificationPending() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const Content = (
    <Box
      sx={{
        borderRadius: isMobile ? 0 : 3,
        backgroundColor: '#FAFAFA',
        p: isMobile ? 2 : 4,
        textAlign: 'center',
      }}
    >
      <Box
        component="img"
        src="/assets/images/invest/invest.png"
        alt="No data"
        sx={{
          width: isMobile ? 220 : 300,
          mb: 2,
          mx: 'auto',
          display: 'block',
        }}
      />

    
      <Typography
        sx={{
          fontSize: isMobile ? '18px' : '22px',
          fontWeight: 700,
          color: '#1C1C1C',
          mb: 1,
        }}
      >
        There’s nothing to show
      </Typography>

      <Typography
        sx={{
          fontSize: '15px',
          color: '#6B7280',
        }}
      >
        Contact your RM and start investing
      </Typography>
    </Box>
  );

  return (
    <Box
      sx={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      {isMobile ? (
     
         Content
      ) : (
    
        <Card
          sx={{
            width: '100%',
            maxWidth: 600,
            borderRadius: 4,
            p: 3,
            backgroundColor: '#FFFFFF',
            boxShadow: '0px 8px 24px rgba(0,0,0,0.06)',
          }}
        >
          {Content}
        </Card>
      )}
    </Box>
  );
}
