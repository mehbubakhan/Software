// src/services/adoptionApi.js
// Axios wrappers for the Adoption module backend endpoints

import api from './api'; // Use shared api instance with auth interceptor

// Base path for adoption module
const adoptionApi = api; // baseURL already set in api.js; we'll prefix with /adoption via full paths

// Orphanage endpoints
export const getOrphanages = () => adoptionApi.get('/adoption/orphanages');
export const getOrphanageById = (id) => adoptionApi.get(`/adoption/orphanages/${id}`);
export const createOrphanage = (data) => adoptionApi.post('/adoption/orphanages', data);
export const getMyOrphanage = () => adoptionApi.get('/adoption/manager/my-orphanage');

// Child endpoints
export const getChildren = () => adoptionApi.get('/adoption/children');
export const getChildById = (id) => adoptionApi.get(`/adoption/children/${id}`);
export const createChild = (data) => adoptionApi.post('/adoption/children', data);

// Application endpoints
export const getApplications = () => adoptionApi.get('/adoption/applications');
export const createApplication = (data) => adoptionApi.post('/adoption/applications', data);
export const updateApplicationStatus = (id, status) =>
  adoptionApi.patch(`/adoption/applications/${id}/status`, { status });

// Meetup endpoints
export const createMeetup = (data) => adoptionApi.post('/adoption/meetups', data);
export const getApplicationMeetups = (applicationId) =>
  adoptionApi.get(`/adoption/applications/${applicationId}/meetups`);

// QA / Compatibility endpoint
export const submitQA = (data) => adoptionApi.post('/adoption/qa', data);

export default {
  getOrphanages,
  getOrphanageById,
  createOrphanage,
  getMyOrphanage,
  getChildren,
  getChildById,
  createChild,
  getApplications,
  createApplication,
  updateApplicationStatus,
  createMeetup,
  getApplicationMeetups,
  submitQA
};
