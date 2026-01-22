import { Box, Card, Grid, Typography, Tabs, Tab, Button } from '@mui/material';
import { useState } from 'react';
import Iconify from 'src/components/iconify';

const stepsData = [
  {
    id: 1,
    label: 'Step 1',
    image: '/assets/images/invest/step1.svg',
  },
  {
    id: 2,
    label: 'Step 2',
    image: '/assets/images/invest/step2.svg',
  },
  {
    id: 3,
    label: 'Step 3',
    image: '/assets/images/invest/step3.svg',
  },
];

export default function HowItWorksCard() {
  const [activeStep, setActiveStep] = useState(0);

  const handleChange = (event, newValue) => {
    setActiveStep(newValue);
  };

  return (
    <Card
      sx={{
        p: 4,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
      }}
    >
      <Grid container spacing={3}>
        {/* Left Side - Title */}
        <Grid item xs={12} md={4}>
          <Typography variant="h4" fontWeight={700} color="text.primary">
            How it works
          </Typography>
        </Grid>

        {/* Right Side - Tabs */}
        <Grid item xs={12} md={8}>
          <Box display="flex" justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
            <Tabs
              value={activeStep}
              onChange={handleChange}
              sx={{
                minHeight: 'auto',
                '& .MuiTabs-indicator': {
                  display: 'none',
                },
                '& .MuiTabs-flexContainer': {
                  gap: 2,
                },
                '& .MuiTab-root': {
                  minWidth: 0,
                  margin: 0,
                },
              }}
            >
              {stepsData.map((step, index) => (
                <Tab
                  key={step.id}
                  label={step.label}
                  value={index}
                  sx={{
                    minHeight: 'auto',
                    minWidth: 'auto',
                    px: 2,
                    py: 1.2,
                    margin: '0px !important',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    textTransform: 'none',
                    bgcolor: 'grey.400',
                    color: '#ffffff',
                    '&.Mui-selected': {
                      bgcolor: 'primary.dark',
                      color: '#ffffff',
                    },
                    '&:hover': {
                      bgcolor: 'primary.black',
                    },
                  }}
                />
              ))}
            </Tabs>
          </Box>
        </Grid>

        {/* Image Section */}
        <Grid item xs={12}>
          <Box
            sx={{
              width: '100%',
              minHeight: 300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'grey.50',
              borderRadius: 2,
              p: 4,
              position: 'relative',
            }}
          >
            <Box
              component="img"
              src={stepsData[activeStep].image}
              alt={stepsData[activeStep].label}
              sx={{
                maxWidth: '100%',
                maxHeight: 400,
                objectFit: 'contain',
              }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            {/* Fallback content if image doesn't load */}
            <Box
              sx={{
                display: 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
              }}
            >
              <Typography variant="h6" color="text.secondary" mb={1}>
                {stepsData[activeStep].label}
              </Typography>
              <Typography variant="body2" color="text.disabled">
                Image not available
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Know More Button */}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center">
            <Button
              variant="outlined"
              fullWidth
              endIcon={<Iconify icon="eva:external-link-outline" width={20} />}
              sx={{
                py: 1.2,
                borderRadius: 20,
                fontSize: 15,
                fontWeight: 600,

                color: 'text.primary',
                borderColor: 'divider',
                bgcolor: 'grey.100',
                '&:hover': {
                  bgcolor: 'grey.200',
                  borderColor: 'divider',
                },
              }}
            >
              Know more
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
}
