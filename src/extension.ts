// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { PunchDocumentRangeFormatter, MODE } from './formatter';
import { runPuncher } from './puncher';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// class for formatting function
	const formatter = new PunchDocumentRangeFormatter();


	// Command Create New Punchlet 
	context.subscriptions.push(
		vscode.commands.registerCommand('punch.Punchlet', () => {
			vscode.workspace.openTextDocument({
				content: "// \n{\n\n}",
				language: "punch",
			}).then(newDocument => {
				vscode.window.showTextDocument(newDocument);
			})
		})
	);

	// Command Create New full Punchlet 
	context.subscriptions.push(
		vscode.commands.registerCommand('punch.ClassPunchlet', () => {
			vscode.workspace.openTextDocument({
				content: "/*\n" + 
				"*  This is my Punchlet\n" + 
				"*/\n" +
				"public class myPunchlet extends Punchlet {\n\n" +
					"\tprivate static final Logger log = LoggerFactory.getLogger(SampleFunction.class);\n" +
					"\tprivate Config hello ;\n\n" +
					"\tpublic void execute(Row row){\n\n" +
					"\t}\n\n" +
					"\t@Override\n" +
					"\tpublic void open () {\n" +
					"\t\tconfig = newObjectMapper().convertValue(settings, Config.class);\n" +
					"\t}\n" +
				"}\n"
				,
				language: "punch",
			}).then(newDocument => {
				vscode.window.showTextDocument(newDocument);
			})
		})
	);
	
	// Command Run Puncher
	context.subscriptions.push(vscode.commands.registerCommand('punch.Puncher', () => {
			runPuncher(vscode.window.activeTextEditor?.document.fileName)
		})
	);
	
	// Formatting Provider
	context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider(MODE, formatter));
}

// this method is called when your extension is deactivated
export function deactivate() {

}
