import axios from 'axios';

declare const process: {
    env: {
        API_BASE_URL?: string;
    };
};

interface Pet {
    id?: number;
    name?: string;
    age?: number;
    species?: string;
    breed?: string;
    adopted?: boolean;
    [key: string]: any;
}

interface Adopter {
    id?: number;
    name?: string;
    email?: string;
    phone?: string;
    [key: string]: any;
}

const apiClient = axios.create({
    baseURL: process.env.API_BASE_URL || 'http://localhost:3000/api',
    timeout: 1000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getPets = async (): Promise<Pet[]> => {
    const response = await apiClient.get<Pet[]>('/pets');
    return response.data;
};

export const getPetById = async (id: string | number): Promise<Pet> => {
    const response = await apiClient.get<Pet>(`/pets/${id}`);
    return response.data;
};

export const createPet = async (petData: Omit<Pet, 'id'> | Partial<Pet>): Promise<Pet> => {
    const response = await apiClient.post<Pet>('/pets', petData);
    return response.data;
};

export const updatePet = async (id: string | number, petData: Partial<Pet>): Promise<Pet> => {
    const response = await apiClient.put<Pet>(`/pets/${id}`, petData);
    return response.data;
};

export const deletePet = async (id: string | number): Promise<void> => {
    const response = await apiClient.delete<void>(`/pets/${id}`);
    return response.data;
};

export const getAdopters = async (): Promise<Adopter[]> => {
    const response = await apiClient.get<Adopter[]>('/adopters');
    return response.data;
};

export const getAdopterById = async (id: string | number): Promise<Adopter> => {
    const response = await apiClient.get<Adopter>(`/adopters/${id}`);
    return response.data;
};

export const createAdopter = async (adopterData: Omit<Adopter, 'id'> | Partial<Adopter>): Promise<Adopter> => {
    const response = await apiClient.post<Adopter>('/adopters', adopterData);
    return response.data;
};

export const updateAdopter = async (id: string | number, adopterData: Partial<Adopter>): Promise<Adopter> => {
    const response = await apiClient.put<Adopter>(`/adopters/${id}`, adopterData);
    return response.data;
};

export const deleteAdopter = async (id: string | number): Promise<void> => {
    const response = await apiClient.delete<void>(`/adopters/${id}`);
    return response.data;
};