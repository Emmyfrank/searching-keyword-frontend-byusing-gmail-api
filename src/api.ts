import axiosInstance from './api/axios';
import { Applicant } from './Data/dummyData';

export const searchApplicants = async (keyword: string): Promise<Applicant[]> => {
  try {
    const response = await axiosInstance.get(`/search?q=${encodeURIComponent(keyword)}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const generateCode = async (code: string): Promise<string> => {
  try {
    const response = await axiosInstance.post('/generate', { code });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

