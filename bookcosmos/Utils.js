import { Timestamp } from 'firebase/firestore' 

// Function to convert the timestamp to a date
export const convertTimestamp = (timestampString) => {
    const date = new Date(timestampString);
    return date.toLocaleDateString();
  };
