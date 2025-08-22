const fs = require('fs');
const path = require('path');

// Get the project name from package.json
const packageJson = require('./package.json');
const projectName = "";

// Define the source and destination paths
const sourcePath = path.join(__dirname, 'dist/snacks-control/browser', projectName, 'index.html');
const destinationPath = path.join(__dirname, 'dist/snacks-control/browser', projectName, '404.html');

// Check if the source file exists
if (fs.existsSync(sourcePath)) {
  // Copy the file
  fs.copyFile(sourcePath, destinationPath, (err) => {
    if (err) {
      console.error('Error copying index.html to 404.html:', err);
    } else {
      console.log('index.html copied to 404.html successfully!');
    }
  });
} else {
  console.error(`Error: index.html not found at ${sourcePath}`);
}
