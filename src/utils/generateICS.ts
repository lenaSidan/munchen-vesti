import { createEvent, EventAttributes } from "ics";

export function generateICS(event: {
  title: string;
  content: string;
  ort?: string;
  date: Date;
  endDate?: Date;
}): Promise<string> {
  const startDate = new Date(event.date);
  const endDate = event.endDate
    ? new Date(event.endDate)
    : new Date(startDate.getTime() + 60 * 60 * 1000); // +1 час по умолчанию

  const eventData: EventAttributes = {
    title: event.title,
    description: event.content,
    location: event.ort || "",
    start: [
      startDate.getFullYear(),
      startDate.getMonth() + 1,
      startDate.getDate(),
      startDate.getHours(),
      startDate.getMinutes(),
    ],
    end: [
      endDate.getFullYear(),
      endDate.getMonth() + 1,
      endDate.getDate(),
      endDate.getHours(),
      endDate.getMinutes(),
    ],
  };

  return new Promise<string>((resolve, reject) => {
    createEvent(eventData, (error, value) => {
      if (error) reject(error);
      else resolve(value);
    });
  });
}
