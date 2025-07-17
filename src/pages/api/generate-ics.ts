import { NextApiRequest, NextApiResponse } from 'next';
import { generateICS } from '@/utils/generateICS';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { title, description, location, start, end } = req.query;

  if (!title || !start || !end) {
    res.status(400).send('Missing required parameters');
    return;
  }

const event = {
  title: String(title),
  content: String(description || ''),    
  ort: String(location || ''),           
  date: new Date(String(start)),         
  endDate: new Date(String(end)),       
};

  try {
    const icsContent = await generateICS(event);

    res.setHeader('Content-Disposition', `attachment; filename="event.ics"`);
    res.setHeader('Content-Type', 'text/calendar');
    res.send(icsContent);
  } catch (error) {
    res.status(500).send('Error generating .ics');
  }
}
