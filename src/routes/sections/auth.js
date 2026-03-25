import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
// auth
import { GuestGuard } from 'src/auth/guard';
// layouts
import CompactLayout from 'src/layouts/compact';
import AuthClassicLayout from 'src/layouts/auth/classic';
// components
import { SplashScreen } from 'src/components/loading-screen';


// ----------------------------------------------------------------------

// AMPLIFY
const AmplifyLoginPage = lazy(() => import('src/pages/auth/amplify/login'));
const AmplifyRegisterPage = lazy(() => import('src/pages/auth/amplify/register'));
const AmplifyVerifyPage = lazy(() => import('src/pages/auth/amplify/verify'));
const AmplifyNewPasswordPage = lazy(() => import('src/pages/auth/amplify/new-password'));
const AmplifyForgotPasswordPage = lazy(() => import('src/pages/auth/amplify/forgot-password'));

// JWT
const JwtLoginPage = lazy(() => import('src/pages/auth/jwt/login'));
const JwtRegisterEmailPage = lazy(() => import('src/pages/auth/jwt/register-email'));
const JwtRegisterMobilePage = lazy(() => import('src/pages/auth/jwt/register-mobile'));
const JwtRegisterInstitutionalPage = lazy(() => import('src/pages/kyc/register-institutional'));
const OptionPage = lazy(() => import('src/pages/kyc/option'));
const KycPendingPage = lazy(() => import('src/pages/kyc/kyc-pending'));

// KYV Pages 
const KYCBasicInfoPage = lazy(() => import('src/pages/kyc/kyc-basic-info'));
const InvestorKycPage = lazy(()=> import('src/pages/kyc/investor-kyc'))

// FIREBASE
const FirebaseLoginPage = lazy(() => import('src/pages/auth/firebase/login'));
const FirebaseRegisterPage = lazy(() => import('src/pages/auth/firebase/register'));
const FirebaseVerifyPage = lazy(() => import('src/pages/auth/firebase/verify'));
const FirebaseForgotPasswordPage = lazy(() => import('src/pages/auth/firebase/forgot-password'));

// AUTH0
const Auth0LoginPage = lazy(() => import('src/pages/auth/auth0/login'));
const Auth0Callback = lazy(() => import('src/pages/auth/auth0/callback'));

// ----------------------------------------------------------------------

const authAmplify = {
  path: 'amplify',
  element: (
    <GuestGuard>
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    </GuestGuard>
  ),
  children: [
    {
      path: 'login',
      element: (
        <AuthClassicLayout>
          <AmplifyLoginPage />
        </AuthClassicLayout>
      ),
    },
    {
      path: 'register',
      element: (
        <AuthClassicLayout title="Manage the job more effectively with Minimal">
          <AmplifyRegisterPage />
        </AuthClassicLayout>
      ),
    },
    {
      element: (
        <CompactLayout>
          <Outlet />
        </CompactLayout>
      ),
      children: [
        { path: 'verify', element: <AmplifyVerifyPage /> },
        { path: 'new-password', element: <AmplifyNewPasswordPage /> },
        { path: 'forgot-password', element: <AmplifyForgotPasswordPage /> },
      ],
    },
  ],
};

const authJwt = {
  path: 'jwt',
  element: (
    <GuestGuard>
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    </GuestGuard>
  ),
  children: [
    {
      path: 'login',
      element: (
        <AuthClassicLayout>
          <JwtLoginPage />
        </AuthClassicLayout>
      ),
    },
    {
      path: 'register-email',
      element: (
        <AuthClassicLayout title="Manage the job more effectively with Minimal">
          <JwtRegisterEmailPage />
        </AuthClassicLayout>
      ),
    },
    {
      path: 'register-mobile',
      element: (
        <AuthClassicLayout title="Manage the job more effectively with Minimal">
          <JwtRegisterMobilePage />
        </AuthClassicLayout>
      ),
    },
    {
      path: 'register-institutional',
      element: (
        // <AuthClassicLayout title="Manage the job more effectively with Minimal">
          <JwtRegisterInstitutionalPage />
        // </AuthClassicLayout>
      ),
    },
    {
      path: 'kyc',
      element: (
        // <AuthClassicLayout  maxWidth={false}>
          <OptionPage />
        // </AuthClassicLayout>
      ),
    },    
    {
      path: 'kyc-pending',
      element: (
          <KycPendingPage />
      ),
    }
  ],
};

const authFirebase = {
  path: 'firebase',
  element: (
    <GuestGuard>
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    </GuestGuard>
  ),
  children: [
    {
      path: 'login',
      element: (
        <AuthClassicLayout>
          <FirebaseLoginPage />
        </AuthClassicLayout>
      ),
    },
    {
      path: 'register',
      element: (
        <AuthClassicLayout title="Manage the job more effectively with Minimal">
          <FirebaseRegisterPage />
        </AuthClassicLayout>
      ),
    },
    {
      element: (
        <CompactLayout>
          <Outlet />
        </CompactLayout>
      ),
      children: [
        { path: 'verify', element: <FirebaseVerifyPage /> },
        { path: 'forgot-password', element: <FirebaseForgotPasswordPage /> },
      ],
    },
  ],
};

const authAuth0 = {
  path: 'auth0',
  element: (
    <GuestGuard>
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    </GuestGuard>
  ),
  children: [
    {
      path: 'login',
      element: (
        <AuthClassicLayout>
          <Auth0LoginPage />
        </AuthClassicLayout>
      ),
    },
    {
      path: 'callback',
      element: <Auth0Callback />,
    },
  ],
};


const authKyc = {
  path: 'kyc',
  element: (
    <Suspense fallback={<SplashScreen />}>
      <Outlet />
    </Suspense>
  ),
  children: [
    {
      path: 'basic-info',
      element: <KYCBasicInfoPage />,
    },
    {
      path: 'investor-kyc',
      element: <InvestorKycPage />,
    },
  ],
};

export const authRoutes = [
  {
    path: 'auth',
    children: [authAmplify, authJwt, authFirebase, authAuth0, authKyc],
  },
];
