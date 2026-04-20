import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { Document, Page, View, Text, Image, Font, StyleSheet } from '@react-pdf/renderer';

Font.register({
  family: 'Roboto',
  fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }],
});

const useStyles = () =>
  useMemo(
    () =>
      StyleSheet.create({
        page: {
          backgroundColor: '#FFFFFF',
          fontFamily: 'Roboto',
          paddingTop: 42,
          paddingHorizontal: 54,
          paddingBottom: 60,
        },
        header: {
          flexDirection: 'row',
          alignItems: 'flex-start',
          marginBottom: 22,
        },
        logo: {
          width: 28,
          height: 28,
          marginRight: 10,
          marginTop: 2,
        },
        companyBlock: {
          flexDirection: 'column',
        },
        companyName: {
          fontSize: 8,
          color: '#222222',
          marginBottom: 2,
        },
        title: {
          fontSize: 18,
          fontWeight: 700,
          color: '#111111',
          textTransform: 'uppercase',
          marginBottom: 2,
        },
        period: {
          fontSize: 7,
          color: '#7A7A7A',
        },
        infoGrid: {
          flexDirection: 'row',
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: '#D9D9D9',
          marginBottom: 16,
        },
        infoCol: {
          flex: 1,
          paddingTop: 8,
          paddingBottom: 8,
          paddingHorizontal: 10,
          borderRightWidth: 1,
          borderColor: '#D9D9D9',
        },
        infoColLast: {
          borderRightWidth: 0,
        },
        infoLabel: {
          fontSize: 7,
          color: '#707070',
          marginBottom: 4,
        },
        infoValue: {
          fontSize: 8,
          color: '#111111',
          fontWeight: 700,
        },
        summaryTable: {
          width: '100%',
        },
        summaryRow: {
          flexDirection: 'row',
          backgroundColor: '#000000',
          minHeight: 26,
          alignItems: 'center',
          borderBottomWidth: 1,
          borderBottomColor: '#FFFFFF',
        },
        summaryLabel: {
          flex: 1,
          color: '#FFFFFF',
          fontSize: 8,
          fontWeight: 700,
          textTransform: 'uppercase',
          paddingLeft: 10,
        },
        summaryValue: {
          width: 110,
          color: '#FFFFFF',
          fontSize: 8,
          fontWeight: 700,
          textAlign: 'right',
          paddingRight: 10,
        },
      }),
    []
  );

export default function PortfolioRedeemPDF({ statement }) {
  const styles = useStyles();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image source="/logo/logo_single.png" style={styles.logo} />

          <View style={styles.companyBlock}>
            <Text style={styles.title}>
              {statement?.statementTitle || 'EARNINGS STATEMENT'}
            </Text>
            <Text style={styles.period}>{statement?.statementPeriod || '2024-25'}</Text>
          </View>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Name</Text>
            <Text style={styles.infoValue}>{statement?.investorName || 'N/A'}</Text>
          </View>

          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Registered email ID</Text>
            <Text style={styles.infoValue}>{statement?.investorEmail || 'N/A'}</Text>
          </View>

          <View style={[styles.infoCol, styles.infoColLast]}>
            <Text style={styles.infoLabel}>Contact Number</Text>
            <Text style={styles.infoValue}>{statement?.investorPhone || 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.summaryTable}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Realized Earnings</Text>
            <Text style={styles.summaryValue}>
              {statement?.totalRealizedEarnings ?? '₹0'}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Annualized Earnings (%)</Text>
            <Text style={styles.summaryValue}>
              {statement?.annualizedEarnings ?? 'NaN%'}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

PortfolioRedeemPDF.propTypes = {
  statement: PropTypes.object,
};
