'use strict';

import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {


	const writeEmitter = new vscode.EventEmitter<string>();
	

	let jsonText = 'some';
	let terminalName = 'JSON Search';
	let terminal;

	// let activeEditor = vscode.window.activeTextEditor;
	
	context.subscriptions.push(vscode.commands.registerCommand('rapidJSONSearch.create', () => {
		let activeEditor = vscode.window.activeTextEditor;
		if (activeEditor)
		{
			jsonText = (activeEditor.document.getText());
			// terminalName = activeEditor.document.fileName;
		} else
		{
			return;
		}

		let line = '';
		writeEmitter.fire('\x1b[2J\x1b[3J\x1b[;H');
		
		let jsObject = JSON.parse('{}');
		try {
			jsObject = JSON.parse(jsonText);
		} catch(ex)
		{
			
		}
		
	

		let pty = {
			onDidWrite: writeEmitter.event,
			open: () => writeEmitter.fire('Type and press enter to search:\r\n\r\n'),
			close: () => {},
			handleInput: (data: string) => {
				if (data === '\r') { // Enter
					
					//clear the teminal on :clear
					if (line.trim() === ':clear')
					{
						line = '';
						
						if (typeof terminal !== 'undefined')
						{
							
							writeEmitter.fire('\x1b[2J\x1b[3J\x1b[;H');
							return;
						}
					}

					if (line.trim() === ':kaput')
					{
						line = '';
						if (typeof terminal !== 'undefined')
						{
							terminal.dispose();
							terminal = null;
							return;
						}
					}

					if (line.trim() === ':reload')
					{
						try
						{
							line = '';
							jsonText = (activeEditor.document.getText());
							jsObject = JSON.parse(jsonText);
							writeEmitter.fire('\x1b[2J\x1b[3J\x1b[;H');
							return;
						} catch(e)
						{
							console.log(e);
							return;
						}
						
					}

					let result = findVal(jsObject, line);
					

					
					writeEmitter.fire(`\r\nResult: ${result[0]}\r\n`);
					writeEmitter.fire(`\r\nMatch paths:\r\n   `);

					if (Array.isArray(result[1]))
					{
						for (let p in result[1])
						{
							writeEmitter.fire(`${result[1][p].substr(1)}\r\n   `);
						}
					}
					
					writeEmitter.fire('\r\n------------------------\r\n')
					writeEmitter.fire('Type and press enter to search:\r\n\r\n')
					line = '';
					
					return;
				}
				if (data === '\x7f') { // Backspace
					if (line.length === 0) {
						return;
					}
					line = line.substr(0, line.length - 1);
					// Move cursor backward
					writeEmitter.fire('\x1b[D');
					// Delete character
					writeEmitter.fire('\x1b[P');
					// writeEmitter.fire(v1.window.activeTextEditor?.document.fileName);
					return;
				}
				
				line += data;
				console.log('line now is: ', line);
				writeEmitter.fire(data);

				
			}
		};

		
		
		if (typeof terminal === "undefined" || terminal == null)
			terminal = (<any>vscode.window).createTerminal({ name: terminalName, pty });
		terminal.show();
	}));

	context.subscriptions.push(vscode.commands.registerCommand('rapidJSONSearch.clear', () => {
		writeEmitter.fire('\x1b[2J\x1b[3J\x1b[;H');
	}));
}

function getPaths(data) {
	var validId = /^[a-z_$][a-z0-9_$]*$/i;
	var result = [];
	doIt(data, "");
	return result;
  
	function doIt(data, s) {
	  if (data && typeof data === "object") {
		if (Array.isArray(data)) {
		  for (var i = 0; i < data.length; i++) {
			doIt(data[i], s + "[" + i + "]");
		  }
		} else {
		  for (var p in data) {
			if (validId.test(p)) {
				doIt(data[p], s + "." + p);
			} else {
			  doIt(data[p], s + "[\"" + p + "\"]");
			}
		  }
		}
	  } else {
		result.push(s);
	  }
	}
  }

function findVal(jsonObject:JSON, searchTerms:string)
{
	let allPaths = getPaths(jsonObject);
	let searchTree = searchTerms.split(".");

	let currentObj = jsonObject;
	for (let i = 0; i < searchTree.length; i++)
	{
		if (typeof currentObj[searchTree[i]] === 'undefined')
		{
			currentObj = null;
			break;
		}
		currentObj = currentObj[searchTree[i]];
	}

	let result = '';
	if (currentObj)
		result = JSON.stringify(currentObj);
	
	//find the possible path
	let matchPaths = allPaths.filter(v => 
		v.indexOf(searchTerms) > -1
	)
	
	return [result, matchPaths];
	
}