const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const os = require('os');

let childProcess = null;

function readConfig() {
    const configPath = path.join(process.cwd(), 'config.json');
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

function writeConfig(config) {
    const configPath = path.join(process.cwd(), 'config.json');
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

function displayConfig() {
    const config = readConfig();
    document.getElementById('config-display').innerText = JSON.stringify(config, null, 2);
}

document.getElementById('test-button').addEventListener('click', () => {
    const config = readConfig();
    config.testValue = new Date().toISOString();
    writeConfig(config);
    displayConfig();
});

function processHandler() {
    const platform = os.platform();
    const scriptsDir = path.join(process.cwd(), 'scripts');
    
    if (platform === 'win32') {
        return path.join(scriptsDir, 'windows_script.bat');
    } else if (platform === 'darwin') {
        return spawn("/Applications/Aseprite.app/Contents/MacOS/aseprite", []);
        return path.join(scriptsDir, 'macos_script.sh');
    } else {
        return path.join(scriptsDir, 'linux_script.sh');
    }
}

function startProcess() {
    if (childProcess) {
        document.getElementById('process-output').innerText += 'Process is already running\n';
        return;
    }

    childProcess = processHandler();

    childProcess.stdout.on('data', (data) => {
        document.getElementById('process-output').innerText += data.toString();
    });

    childProcess.stderr.on('data', (data) => {
        document.getElementById('process-output').innerText += 'Error: ' + data.toString();
    });

    childProcess.on('close', (code) => {
        document.getElementById('process-output').innerText += `Child process exited with code ${code}\n`;
        childProcess = null;
    });
}

function stopProcess() {
    if (childProcess) {
        childProcess.kill();
        childProcess = null;
        document.getElementById('process-output').innerText += 'Process stopped\n';
    } else {
        console.log('No process to stop');
    }
}

function restartProcess() {
    stopProcess();
    startProcess();
}

document.getElementById('start-process').addEventListener('click', startProcess);
document.getElementById('stop-process').addEventListener('click', stopProcess);
document.getElementById('restart-process').addEventListener('click', restartProcess);

displayConfig();

// Ensure child process is terminated when the app closes
nw.Window.get().on('close', function() {
    if (childProcess) {
        childProcess.kill();
    }
    this.close(true);
});