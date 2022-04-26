// created to make it easier to call for next.config.js variables 
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

// const API is the backend url for prod and local servers
export const API = publicRuntimeConfig.PRODUCTION ? 'https://seoblog.com' : 'http://localhost:8000/api';

export const APP_NAME = publicRuntimeConfig.APP_NAME;

export const DOMAIN = publicRuntimeConfig.PRODUCTION 
                     ? publicRuntimeConfig.DOMAIN_PRODUCTION 
                     : publicRuntimeConfig.DOMAIN_DEVELOPMENT;

export const FB_APP_ID = publicRuntimeConfig.FB_APP_ID;
export const DISQUS_SHORTNAME = publicRuntimeConfig.DISQUS_SHORTNAME;