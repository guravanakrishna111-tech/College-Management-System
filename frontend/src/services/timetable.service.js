import { buildQueryString } from "../utils/helpers";
import api from "./api";

export const getTimetables = async (filters = {}) => {
  const { data } = await api.get(`/timetables${buildQueryString(filters)}`);
  return data;
};

export const saveTimetable = async (payload, id = null) => {
  const { data } = id ? await api.put(`/timetables/${id}`, payload) : await api.post("/timetables", payload);
  return data;
};

export const deleteTimetable = async (id) => {
  const { data } = await api.delete(`/timetables/${id}`);
  return data;
};

export const getExams = async (filters = {}) => {
  const { data } = await api.get(`/exams${buildQueryString(filters)}`);
  return data;
};

export const saveExam = async (payload, id = null) => {
  const { data } = id ? await api.put(`/exams/${id}`, payload) : await api.post("/exams", payload);
  return data;
};

export const deleteExam = async (id) => {
  const { data } = await api.delete(`/exams/${id}`);
  return data;
};
