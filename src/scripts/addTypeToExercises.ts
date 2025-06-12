import fs  from 'fs';

// Path to your JSON file
const filePath = '../../exercises/crossfitExercises.json'; // Replace with your actual file path

// Read the JSON file
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
console.log(data)

// Add "type: crossfit" to each object
// const updatedData = data.results.map((item) => ({ ...item, type: 'crossfit' }));

// // Write the updated data back to the file
// fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2), 'utf8');

// console.log('Added "type: crossfit" to each object in the JSON array.');
