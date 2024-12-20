import { execFile } from 'child_process';
import * as path from 'path';

function runPythonScript(): Promise<string> {
  return new Promise((resolve, reject) => {
    // Resolve the paths to the Python interpreter and script
    const pythonPath = path.resolve(__dirname, '../venv', 'Scripts', 'python.exe');  // On Windows
    const scriptPath = path.resolve(__dirname, '../scripts/music_data.py');

    execFile(pythonPath, [scriptPath], (error, stdout, stderr) => {
      if (error) {
        return reject(error);
      }
      resolve(stdout.trim());
    });
  });
}

(async () => {
  try {
    const result = await runPythonScript();
    console.log("Python script output:", result);
  } catch (error) {
    console.error("Error running Python script:", error);
  }
})();
