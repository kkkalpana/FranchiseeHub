const PRODUCTION_API = 'https://franchiseehub.onrender.com';
const DEVELOPMENT_API = 'http://localhost:2016';

const API_BASE_URL = import.meta.env.MODE === 'production' ? PRODUCTION_API : DEVELOPMENT_API;

console.log('🚀 API Mode:', import.meta.env.MODE);
console.log('🌐 API URL:', API_BASE_URL);

export default API_BASE_URL;
