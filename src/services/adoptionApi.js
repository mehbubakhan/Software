import api from './api';

export const getOrphanages = () => api.get('/adoption/orphanages');
export const getOrphanageById = (id) => api.get(`/adoption/orphanages/${id}`);
export const getChildren = () => api.get('/adoption/children');
export const getChildById = (id) => api.get(`/adoption/children/${id}`);

export const createOrphanage = (data) => api.post('/adoption/orphanages', data);
export const getMyOrphanage = () => api.get('/adoption/manager/my-orphanage');
export const createChild = (data) => api.post('/adoption/children', data);

export const createApplication = (data) => api.post('/adoption/applications', data);
export const getApplications = () => api.get('/adoption/applications');
export const updateApplicationStatus = (id, status) => api.patch(`/adoption/applications/${id}/status`, { status });

export const createMeetup = (data) => api.post('/adoption/meetups', data);
export const getApplicationMeetups = (id) => api.get(`/adoption/applications/${id}/meetups`);

export const submitQA = (data) => api.post('/adoption/qa', data);
