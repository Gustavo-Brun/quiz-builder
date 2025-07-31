export const formatDate = (dateString: string, options: Intl.DateTimeFormatOptions) => {
  return new Date(dateString).toLocaleDateString('en-US', options);
};
