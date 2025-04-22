export const generateUniqueKey = () => {
  return `${Math.random().toString(36).slice(2, 11)}_${new Date().getTime()}`;
};
