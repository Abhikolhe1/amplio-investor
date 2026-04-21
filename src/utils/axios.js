import axios from 'axios';
// config
import { HOST_API ,JSON_SERVER_API} from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/investor-profiles/me',
    loginSendOtp: '/auth/investor-login/send-otp',
    loginVerifyOtp: '/auth/investor-login/verify-otp',
    register: '/api/auth/register',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  investorKyc: {
    kycProgress: (sessionId) => `/investor-profiles/kyc-progress/${sessionId}`,
    getSection: (section, profileId, route = '') =>
      `/investor-profiles/kyc-get-data/${section}/${profileId}?route=${encodeURIComponent(route)}`,
    details: (id) => `/investor-profiles/bank-details/${id}`,
    getBankDetails: `/investor-profiles/bank-details`,
    getDocuments: `/investor-profiles/documents`,
    getProfileData: `/investor-profiles/me`,
  },
  investorType: {
    list: '/investor-types'
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
  investTransaction:{
    list:`${JSON_SERVER_API}/investor_data`,
    details:(id)=>`${JSON_SERVER_API}/investor_data/${id}`,
  },
  bankDetail: {
    list: '/investor-profiles/bank-details',
  }
};
