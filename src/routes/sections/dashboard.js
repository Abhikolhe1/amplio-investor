import { lazy, Suspense } from 'react';
import { Navigate, Outlet, useParams } from 'react-router-dom';
// auth
import { AuthGuard } from 'src/auth/guard';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// components
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

// OVERVIEW
const OverviewAppPage = lazy(() => import('src/pages/dashboard/app'));
const OverviewEcommercePage = lazy(() => import('src/pages/dashboard/ecommerce'));
const OverviewAnalyticsPage = lazy(() => import('src/pages/dashboard/analytics'));
const OverviewBankingPage = lazy(() => import('src/pages/dashboard/banking'));
const OverviewBookingPage = lazy(() => import('src/pages/dashboard/booking'));
const OverviewFilePage = lazy(() => import('src/pages/dashboard/file'));
const KycPendingPage = lazy(() => import('src/pages/kyc/kyc-pending'));
// PRODUCT
const ProductDetailsPage = lazy(() => import('src/pages/dashboard/product/details'));
const ProductListPage = lazy(() => import('src/pages/dashboard/product/list'));
const ProductCreatePage = lazy(() => import('src/pages/dashboard/product/new'));
const ProductEditPage = lazy(() => import('src/pages/dashboard/product/edit'));
// ORDER
const OrderListPage = lazy(() => import('src/pages/dashboard/order/list'));
const OrderDetailsPage = lazy(() => import('src/pages/dashboard/order/details'));
// INVOICE
const InvoiceListPage = lazy(() => import('src/pages/dashboard/invoice/list'));
const InvoiceDetailsPage = lazy(() => import('src/pages/dashboard/invoice/details'));
const InvoiceCreatePage = lazy(() => import('src/pages/dashboard/invoice/new'));
const InvoiceEditPage = lazy(() => import('src/pages/dashboard/invoice/edit'));
// USER
const UserProfilePage = lazy(() => import('src/pages/dashboard/user/profile'));
const UserCardsPage = lazy(() => import('src/pages/dashboard/user/cards'));
const UserListPage = lazy(() => import('src/pages/dashboard/user/list'));
const UserAccountPage = lazy(() => import('src/pages/dashboard/user/account'));
const UserCreatePage = lazy(() => import('src/pages/dashboard/user/new'));
const UserEditPage = lazy(() => import('src/pages/dashboard/user/edit'));
// BLOG
const BlogPostsPage = lazy(() => import('src/pages/dashboard/post/list'));
const BlogPostPage = lazy(() => import('src/pages/dashboard/post/details'));
const BlogNewPostPage = lazy(() => import('src/pages/dashboard/post/new'));
const BlogEditPostPage = lazy(() => import('src/pages/dashboard/post/edit'));
// NEED HELP
const NeedHelpPage = lazy(() => import('src/pages/dashboard/help/help'));
// INVEST TRANSACTION
const InvestTransactionViewPage = lazy(() => import('src/pages/dashboard/invest-transaction/view'));
const InvestTransactionDetailsPage = lazy(() =>
  import('src/pages/dashboard/invest-transaction/details')
);
const InvestTransactionAgreementPage = lazy(() =>
  import('src/pages/dashboard/invest-transaction/agreement')
);
const PaymentInstructionsPage = lazy(() =>
  import('src/pages/dashboard/invest-transaction/payment-instructions')
);
const InvestmentOrderDetailPage = lazy(() =>
  import('src/pages/dashboard/invest-transaction/order-detail')
);
// Portfolio
const PortfolioViewPage = lazy(() => import('src/pages/dashboard/portfolio/view'));
const PortfolioOnlinePaymentsPage = lazy(() => import('src/pages/dashboard/portfolio/online-payments'));
const PortfolioOnlineTransactionsPage = lazy(() => import('src/pages/dashboard/portfolio/online-transactions'));
// JOB
const JobDetailsPage = lazy(() => import('src/pages/dashboard/job/details'));
const JobListPage = lazy(() => import('src/pages/dashboard/job/list'));
const JobCreatePage = lazy(() => import('src/pages/dashboard/job/new'));
const JobEditPage = lazy(() => import('src/pages/dashboard/job/edit'));
// TOUR
const TourDetailsPage = lazy(() => import('src/pages/dashboard/tour/details'));
const TourListPage = lazy(() => import('src/pages/dashboard/tour/list'));
const TourCreatePage = lazy(() => import('src/pages/dashboard/tour/new'));
const TourEditPage = lazy(() => import('src/pages/dashboard/tour/edit'));
// FILE MANAGER
const FileManagerPage = lazy(() => import('src/pages/dashboard/file-manager'));
// APP
const ChatPage = lazy(() => import('src/pages/dashboard/chat'));
const MailPage = lazy(() => import('src/pages/dashboard/mail'));
const CalendarPage = lazy(() => import('src/pages/dashboard/calendar'));
const KanbanPage = lazy(() => import('src/pages/dashboard/kanban'));
// TEST RENDER PAGE BY ROLE
const PermissionDeniedPage = lazy(() => import('src/pages/dashboard/permission'));
// BLANK PAGE
const BlankPage = lazy(() => import('src/pages/dashboard/blank'));
// FAQS
const FaqsViewPage = lazy(() => import('src/pages/dashboard/faqs/view'))

// ----------------------------------------------------------------------

function InvestTransactionDetailsRedirect() {
  const { id } = useParams();

  return <Navigate to={`/dashboard/invest-transaction/${id}`} replace />;
}

function InvestTransactionAgreementRedirect() {
  const { id } = useParams();

  return <Navigate to={`/dashboard/invest-transaction/${id}/agreement`} replace />;
}

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { element: <Navigate to="/dashboard/invest-transaction/view" replace />, index: true },
      { path: 'app', element: <OverviewAppPage /> },
      { path: 'ecommerce', element: <OverviewEcommercePage /> },
      { path: 'analytics', element: <OverviewAnalyticsPage /> },
      { path: 'wallet', element: <Navigate to="/dashboard/invest-transaction/view" replace /> },
      { path: 'activity', element: <Navigate to="/dashboard/invest-transaction/view" replace /> },
      { path: 'banking', element: <OverviewBankingPage /> },
      { path: 'booking', element: <OverviewBookingPage /> },
      { path: 'file', element: <OverviewFilePage /> },
      { path: 'kyc-pending', element: <KycPendingPage /> },
      {
        path: 'user',
        children: [
          { element: <UserProfilePage />, index: true },
          { path: 'profile', element: <UserProfilePage /> },
          { path: 'cards', element: <UserCardsPage /> },
          { path: 'list', element: <UserListPage /> },
          { path: 'new', element: <UserCreatePage /> },
          { path: ':id/edit', element: <UserEditPage /> },
          { path: 'account', element: <UserAccountPage /> },
        ],
      },
      {
        path: 'product',
        children: [
          { element: <ProductListPage />, index: true },
          { path: 'list', element: <ProductListPage /> },
          { path: ':id', element: <ProductDetailsPage /> },
          { path: 'new', element: <ProductCreatePage /> },
          { path: ':id/edit', element: <ProductEditPage /> },
        ],
      },
      {
        path: 'order',
        children: [
          { element: <OrderListPage />, index: true },
          { path: 'list', element: <OrderListPage /> },
          { path: ':id', element: <OrderDetailsPage /> },
        ],
      },
      {
        path: 'faqs',
        children: [
          { element: <FaqsViewPage />, index: true },
          { path: ':id', element: <FaqsViewPage /> },
        ],
      },
      {
        path: 'invoice',
        children: [
          { element: <InvoiceListPage />, index: true },
          { path: 'list', element: <InvoiceListPage /> },
          { path: ':id', element: <InvoiceDetailsPage /> },
          { path: ':id/edit', element: <InvoiceEditPage /> },
          { path: 'new', element: <InvoiceCreatePage /> },
        ],
      },
      {
        path: 'post',
        children: [
          { element: <BlogPostsPage />, index: true },
          { path: 'list', element: <BlogPostsPage /> },
          { path: ':title', element: <BlogPostPage /> },
          { path: ':title/edit', element: <BlogEditPostPage /> },
          { path: 'new', element: <BlogNewPostPage /> },
        ],
      },
      {
        path: 'help',
        children: [
          { element: <NeedHelpPage />, index: true },
          { path: 'helpPage', element: <NeedHelpPage /> },

        ],
      },
      {
        path: 'invest',
        children: [
          { element: <Navigate to='/dashboard/invest-transaction/view' replace />, index: true },
          { path: 'view', element: <Navigate to='/dashboard/invest-transaction/view' replace /> },
          { path: 'investPage', element: <Navigate to='/dashboard/invest-transaction/view' replace /> },
          { path: ':id', element: <InvestTransactionDetailsRedirect /> },
          { path: ':id/agreement', element: <InvestTransactionAgreementRedirect /> },

        ],
      },
      {
        path: 'invest-transaction',
        children: [
          { element: <InvestTransactionViewPage />, index: true },
          { path: 'view', element: <InvestTransactionViewPage /> },
          { path: 'orders/:orderId', element: <InvestmentOrderDetailPage /> },
          { path: ':id', element: <InvestTransactionDetailsPage /> },
          { path: ':id/agreement', element: <InvestTransactionAgreementPage /> },
        ],
      },
      {
        path: 'portfolio',
        children: [
          { element: <PortfolioViewPage />, index: true },
          { path: 'view', element: <PortfolioViewPage /> },
          { path: ':poolName/online-payments', element: <PortfolioOnlinePaymentsPage /> },
          { path: ':poolName/ptc-transactions', element: <PortfolioOnlineTransactionsPage /> },
          { path: ':poolName/online-transactions', element: <PortfolioOnlineTransactionsPage /> },
          { path: 'online-payments', element: <PortfolioOnlinePaymentsPage /> },
          { path: 'ptc-transactions', element: <PortfolioOnlineTransactionsPage /> },
          { path: 'online-transactions', element: <PortfolioOnlineTransactionsPage /> }
        ],
      },
      {
        path: 'job',
        children: [
          { element: <JobListPage />, index: true },
          { path: 'list', element: <JobListPage /> },
          { path: ':id', element: <JobDetailsPage /> },
          { path: 'new', element: <JobCreatePage /> },
          { path: ':id/edit', element: <JobEditPage /> },
        ],
      },
      {
        path: 'tour',
        children: [
          { element: <TourListPage />, index: true },
          { path: 'list', element: <TourListPage /> },
          { path: ':id', element: <TourDetailsPage /> },
          { path: 'new', element: <TourCreatePage /> },
          { path: ':id/edit', element: <TourEditPage /> },
        ],
      },
      { path: 'file-manager', element: <FileManagerPage /> },
      { path: 'mail', element: <MailPage /> },
      { path: 'chat', element: <ChatPage /> },
      { path: 'calendar', element: <CalendarPage /> },
      { path: 'kanban', element: <KanbanPage /> },
      { path: 'permission', element: <PermissionDeniedPage /> },
      { path: 'blank', element: <BlankPage /> },
    ],
  },
  // Standalone payment screen — rendered without DashboardLayout
  {
    path: 'dashboard/invest-transaction/payment/:verificationId',
    element: (
      <AuthGuard>
        <Suspense fallback={<LoadingScreen />}>
          <PaymentInstructionsPage />
        </Suspense>
      </AuthGuard>
    ),
  },
];


