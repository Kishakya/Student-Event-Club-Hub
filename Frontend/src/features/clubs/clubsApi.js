import apiClient from '../../api/client'

export const getClubs = () => apiClient.get('/clubs').then((res) => res.data)

export const getClub = (id) =>
  apiClient.get(`/clubs/${id}`).then((res) => res.data)

export const createClub = (club) =>
  apiClient.post('/clubs', club).then((res) => res.data)

export const updateClub = (id, club) => apiClient.put(`/clubs/${id}`, club)

export const deactivateClub = (id) => apiClient.delete(`/clubs/${id}`)
