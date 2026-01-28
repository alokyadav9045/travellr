import { api } from './axios';

export interface ContactData {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
}

export const contactApi = {
    submitContact: async (data: ContactData) => {
        const response = await api.post('/contact', data);
        return response.data;
    },

    subscribeNewsletter: async (email: string) => {
        const response = await api.post('/contact/newsletter', { email });
        return response.data;
    },
};
