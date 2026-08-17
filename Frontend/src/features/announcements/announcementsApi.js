import apiClient from '../../api/client'

export const getAnnouncements = () =>
  apiClient.get('/announcements').then((res) => res.data)

export const getAnnouncement = (id) =>
  apiClient.get(`/announcements/${id}`).then((res) => res.data)

export const createAnnouncement = (announcement) =>
  apiClient.post('/announcements', announcement).then((res) => res.data)

export const updateAnnouncement = (id, announcement) =>
  apiClient.put(`/announcements/${id}`, announcement)

export const deleteAnnouncement = (id) => apiClient.delete(`/announcements/${id}`)
