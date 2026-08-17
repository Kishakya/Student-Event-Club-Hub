import apiClient from '../../api/client'

export const getRsvps = (eventId) =>
  apiClient
    .get('/rsvps', { params: eventId ? { eventId } : {} })
    .then((res) => res.data)

export const getRsvp = (id) => apiClient.get(`/rsvps/${id}`).then((res) => res.data)

export const createRsvp = (rsvp) =>
  apiClient.post('/rsvps', rsvp).then((res) => res.data)

export const updateRsvp = (id, rsvp) => apiClient.put(`/rsvps/${id}`, rsvp)

export const updateRsvpStatus = (id, status) =>
  apiClient.patch(`/rsvps/${id}/status`, { status })

export const deleteRsvp = (id) => apiClient.delete(`/rsvps/${id}`)
