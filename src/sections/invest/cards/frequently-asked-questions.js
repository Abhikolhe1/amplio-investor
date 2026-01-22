import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import Iconify from 'src/components/iconify';

export default function FrequentlyAskedQuestions({ currentDetails }) {
  const { faqs } = currentDetails || {};

  const STEP = 5;
  const MIN_VISIBLE = 5;

  const [visibleCount, setVisibleCount] = useState(MIN_VISIBLE);

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + STEP, faqs.length));
  };

  const handleShowLess = () => {
    setVisibleCount((prev) => Math.max(prev - STEP, MIN_VISIBLE));
  };

  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Grid item xs={12}>
        <Typography fontWeight={700}>Frequently Asked Questions</Typography>
      </Grid>

      <Grid item xs={12}>
        {faqs.slice(0, visibleCount).map((faq) => (
          <Accordion
            key={faq.id}
            sx={{
              mb: 1.5,
              borderRadius: 1.5,
              '&:before': { display: 'none' },
            }}
          >
            <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
              <Typography variant="subtitle1" color="text.secondary" fontWeight={600}>
                {faq.question}
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Typography color="text.secondary">{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Grid>

      {faqs.length > MIN_VISIBLE && (
        <Stack direction="row" spacing={2} mt={1}>
          <Button
            fullWidth
            variant="outlined"
            disabled={visibleCount >= faqs.length}
            onClick={handleShowMore}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Show more
          </Button>

          <Button
            fullWidth
            variant="outlined"
            disabled={visibleCount === MIN_VISIBLE}
            onClick={handleShowLess}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Show less
          </Button>
        </Stack>
      )}
    </Card>
  );
}

FrequentlyAskedQuestions.propTypes = {
  currentDetails: PropTypes.shape({
    faqs: PropTypes.array,
  }),
};
