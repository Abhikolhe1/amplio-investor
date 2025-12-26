import { useState, useCallback } from 'react';
import { Container, Card, Stack, Grid } from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useTable } from 'src/components/table';
import { INVESTMENTS } from 'src/_mock/_invest';
import InvestTableToolbar from '../invest-table-toolbar';
import InvestTableFiltersResult from '../invest-table-filters-result';
import InvestTableRow from '../invest-table-row';

const defaultFilters = {
  name: '',
  status: 'all',
  role: [],
};

export default function InvestListView() {
  const settings = useSettingsContext();
  const table = useTable();

  const [filters, setFilters] = useState(defaultFilters);
  const [selected, setSelected] = useState(null);

  const handleFilters = useCallback((name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleResetFilters = () => {
    setFilters(defaultFilters);
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Invest"
        links={[{ name: 'Dashboard', href: '/' }, { name: 'Invest' }]}
        sx={{ mb: 3 }}
      />

      <Card sx={{ p: 2 }}>
        <>
          <InvestTableToolbar filters={filters} onFilters={handleFilters} />

          <InvestTableFiltersResult
            filters={filters}
            onFilters={handleFilters}
            onResetFilters={handleResetFilters}
            results={INVESTMENTS.length}
          />

          <Grid container spacing={2}>
            {INVESTMENTS.map((row) => (
              <Grid item xs={12} sm={6} md={4} key={row.id}>
                <InvestTableRow
                  row={row}
                  selected={table.selected.includes(row.id)}
                  onSelectRow={() => table.onSelectRow(row.id)}
                  onViewRow={() => setSelected(row)}
                />
              </Grid>
            ))}
          </Grid>
        </>
      </Card>
    </Container>
  );
}
