import PropTypes from 'prop-types';
import { Grid, Stack, Typography, Button, Box, Card, Tooltip, IconButton, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import Iconify from 'src/components/iconify';

export default function RiskMititgationCard({ currentDetails }) {
  console.log('currentDetails', currentDetails);
  const { riskMitigation, shareDeal, faqs } = currentDetails || {};

  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 0,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h5" fontWeight={700}>
            Risk Mitigation
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Financial safeguards designed to reduce the risk of loss
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={3}>
            {riskMitigation?.items?.map((item, index) => (
              <Grid key={index} item xs={12} md={6}>
                <Stack spacing={0.5} direction="row">
                  {item?.value && <Typography fontWeight={600}>{item?.value}</Typography>}
                  <Typography variant="body2" color="text.secondary">
                    {item?.label}
                  </Typography>
                  <Tooltip title={item.description} arrow placement="top">
                    <IconButton size="small">
                      <Iconify icon="mdi:information-outline" width={18} height={18} />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Typography fontWeight={700}>Share this Deal</Typography>
        </Grid>

        <Grid item xs={12}>
          <Stack direction="row" spacing={2}>
            {shareDeal?.options?.map((item, index) => (
              <Button
                key={index}
                variant="outlined"
                startIcon={<Iconify icon={item?.icon} />}
                sx={{ textTransform: 'none' }}
              >
                {item?.label}
              </Button>
            ))}
          </Stack>
        </Grid>

        <Grid item xs={12}>
          <Typography fontWeight={700}>Frequently Asked Questions</Typography>
        </Grid>

        <Grid item xs={12}>
          {faqs?.map((faq) => (
            <Accordion
              key={faq.id}
              sx={{
                mb: 1.5,
                borderRadius: 1.5,
                '&:before': { display: 'none' },
              }}
            >
              <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {faq.question}
                </Typography>
              </AccordionSummary>

              <AccordionDetails>
                <Typography color="text.secondary">{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Grid>
      </Grid>
    </Card>
  );
}

RiskMititgationCard.propTypes = {
  currentDetails: PropTypes.shape({
    riskMitigation: PropTypes.object,
    shareDeal: PropTypes.object,
    faqs: PropTypes.array,
  }),
};
