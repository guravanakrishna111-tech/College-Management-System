import { buildQueryString } from "../utils/helpers";
import api from "./api";

export const getMyResults = async () => {
  const { data } = await api.get("/results/me");
  return data;
};

export const getResults = async (filters = {}) => {
  const { data } = await api.get(`/results${buildQueryString(filters)}`);
  return data;
};

export const saveResult = async (payload) => {
  const { data } = await api.post("/results", payload);
  return data;
};

export const bulkUploadResults = async (results) => {
  const { data } = await api.post("/results/bulk", { results });
  return data;
};

export const getRankings = async (filters = {}) => {
  const { data } = await api.get(`/results/rankings${buildQueryString(filters)}`);
  return data;
};

export const getStudentResults = async (studentId) => {
  const { data } = await api.get(`/results/student/${studentId}`);
  return data;
};

export const downloadResultsCsv = async (filters = {}) => {
  const response = await api.get(`/results/export/csv${buildQueryString(filters)}`, {
    responseType: "blob"
  });

  const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "results-export.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
