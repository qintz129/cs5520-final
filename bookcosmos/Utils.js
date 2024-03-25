import { Timestamp } from 'firebase/firestore' 

// Function to convert the timestamp to a date
export const convertTimestamp = (timestamp) => { 
    const date = timestamp.toDate(); 
    return date.toLocaleDateString();
}  
