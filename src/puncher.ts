'use strict';

import * as vscode from 'vscode'

let terminal: any
let docker = 'docker run -v';

export function runPuncher(filePath: any) {

    // Search a terminal name Puncher
    for (let index = 0; index < vscode.window.terminals?.length; index++) {
        if(vscode.window.terminals?.[index].name === "Puncher"){
            terminal =  vscode.window.terminals?.[index];
            break;
        }
    }

    // Create new terminal if terminal undefined
    if(terminal === undefined ){
        terminal = vscode.window.createTerminal("Puncher")
    }

    if (filePath != undefined) {
        // Get Image Tag
        let tag = vscode.workspace.getConfiguration('punch-puncher')['puncherTag'];

        // Tranform file path to get work directory and file name 
        filePath = filePath.toString();
        let rootPath = filePath.substring(0, filePath.lastIndexOf('/src/main/punchlang'));
        let folderPath = filePath.substring(filePath.lastIndexOf('/src/main/punchlang'), filePath.lastIndexOf('/'));
        let filename = filePath.substring(filePath.lastIndexOf('/') + 1);

        // Build command
        let command = docker + ' ' + rootPath + ':/workdir/ ghcr.io/punchplatform/puncher:' + tag +  ' -p /workdir/' + folderPath+'/'+filename;

        terminal.show()

        // Execute docker command
        terminal.sendText(command);

        // Reset terminal
        terminal = undefined
        
    } else {

        // Show message error if filepath undefined
        vscode.window.showErrorMessage("No punch file open");

    }

}
