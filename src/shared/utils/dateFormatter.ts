export const formatInterviewDateTime = (date: Date) => {
  const datePart = date.toISOString().split("T")[0]; // YYYY-MM-DD

  const timePart = date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return { date: datePart, time: timePart };
};