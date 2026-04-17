import { buildQueryString } from "../utils/helpers";
import api from "./api";

export const getOverviewAnalytics = async () => {
  const { data } = await api.get("/analytics/overview");
  return data;
};

export const getTopStudentsAnalytics = async (filters = {}) => {
  const { data } = await api.get(`/analytics/top-students${buildQueryString(filters)}`);
  return data;
};

export const getBestClassesAnalytics = async () => {
  const { data } = await api.get("/analytics/best-classes");
  return data;
};

export const getSubjectPerformanceAnalytics = async (filters = {}) => {
  const { data } = await api.get(`/analytics/subject-performance${buildQueryString(filters)}`);
  return data;
};

export const getDepartmentComparisonAnalytics = async () => {
  const { data } = await api.get("/analytics/department-comparison");
  return data;
};
