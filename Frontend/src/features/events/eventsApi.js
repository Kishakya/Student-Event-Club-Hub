import apiClient from '../../api/client'

export const getEvents = () => apiClient.get('/events').then((res) => res.data)

export const getEvent = (id) =>
  apiClient.get(`/events/${id}`).then((res) => res.data)

export const createEvent = (event) =>
  apiClient.post('/events', event).then((res) => res.data)

export const updateEvent = (id, event) =>
  apiClient.put(`/events/${id}`, event)

export const deleteEvent = (id) => apiClient.delete(`/events/${id}`)
