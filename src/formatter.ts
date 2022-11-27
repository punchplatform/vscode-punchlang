'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
import * as vscode from "vscode";
import * as cp from "child_process";
import * as stream from 'stream';
import * as os from "os";

export const MODE = { language: 'punch' };

class PunchFormatter {
    public machine_os: any;
    public py : any; 
    public formatter: any; 
    public stdin : any
    constructor() {
        this.machine_os = os.platform();
        this.py = vscode.workspace.getConfiguration('punch-formatter')['pythonPath'];
        if (this.py == '' && this.machine_os == 'win32') {
            this.py = 'python ';
        }
        this.formatter = vscode.workspace.getConfiguration('punch-formatter')['formatterPath'];
        if (this.formatter == '') {
            this.formatter = '"'+ __dirname + '/../formatter/formatter.py"';
        }
    }

    formatDocument(document: vscode.TextDocument, range :vscode.Range) {
        return new Promise((resolve, reject) => {
            this.format(document, range).then((res) => {
                return resolve(res);
            });

        });
    }

    format(document: vscode.TextDocument, range : vscode.Range) {
        this.stdin = null
        return new Promise((resolve, reject) => {

            let indentwidth = " --indentWidth=" + vscode.workspace.getConfiguration('punch-formatter')['indentwidth'];
            let filename = ' -';
            let start = " --startLine=" + (range.start.line + 1);
            let end = " --endLine=" + (range.end.line + 1);
            var p = cp.exec(this.py + " " + this.formatter + " " + filename + indentwidth + start + end, (err, stdout, stderr) => {
                if (stdout != '') {
                    let toreplace = document.validateRange(new vscode.Range(range.start.line, 0, range.end.line + 1, 0));
                    var edit = [vscode.TextEdit.replace(toreplace, stdout)];
                    if (stderr != '') {
                        vscode.window.showWarningMessage('formatting warning:\n'+stderr);
                    }
                    return resolve(edit);
                }
                vscode.window.showErrorMessage('Formatting failed:\n'+stderr);
                return resolve(null);
            });

            this.stdin = p.stdin
            var stdinStream = new stream.Readable();
            stdinStream.push(document.getText());
            stdinStream.push(null);
            stdinStream.pipe(this.stdin);
            let message = "Document " + vscode.window.activeTextEditor?.document.fileName + " has been formatting"
            vscode.window.showInformationMessage(message);
        });
    }
}


export class PunchDocumentRangeFormatter {
    public formatter: any; 
    constructor() {
        this.formatter = new PunchFormatter();
    }
    provideDocumentFormattingEdits(document : vscode.TextDocument) {
        return this.formatter.formatDocument(document, document.validateRange(new vscode.Range(0, 0, Number.MAX_VALUE, Number.MAX_VALUE)));
    }
    provideDocumentRangeFormattingEdits(document: vscode.TextDocument, range :vscode.Range) {
        return this.formatter.formatDocument(document, range);
    }
}