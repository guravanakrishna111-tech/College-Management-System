export const formatDate = (value, options = {}) => {
  if (!value) {
    return "-";
  }

  const formatOptions =
    Object.keys(options).length > 0
      ? options
      : {
          dateStyle: "medium"
        };

  return new Intl.DateTimeFormat("en-IN", formatOptions).format(new Date(value));
};

export const buildQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, value);
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
};

export const getMonthMatrix = (date = new Date()) => {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const startDay = startOfMonth.getDay();
  const days = [];

  for (let i = 0; i < startDay; i += 1) {
    days.push(null);
  }

  for (let day = 1; day <= endOfMonth.getDate(); day += 1) {
    days.push(new Date(date.getFullYear(), date.getMonth(), day));
  }

  while (days.length % 7 !== 0) {
    days.push(null);
  }

  return Array.from({ length: days.length / 7 }, (_, index) => days.slice(index * 7, index * 7 + 7));
};

export const toTitleCase = (value = "") =>
  value
    .toLowerCase()
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
