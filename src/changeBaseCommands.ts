import {TextEditor, TextEditorEdit, InputBoxOptions, window, Range, Selection } from 'vscode';

import * as vscode from 'vscode';

export function decimalToBinaryCommand() {
	applyBaseConversion(10, 2);
}

export function binaryToDecimalCommand() {
	applyBaseConversion(2, 10);
}

export function anyToAnyCommand() {
	let options: InputBoxOptions = {
		prompt: "InputBase, OutputBase",
		placeHolder: "10, 2"
	}
	window.showInputBox(options).then(value => {
		let matches:RegExpMatchArray = /(\d+)\D+(\d+)/.exec(value)
		if (matches[1] && matches[2]){
			applyBaseConversion(parseInt(matches[1]), parseInt(matches[2]));
		}
	});
}

function applyBaseConversion(inputBase: number, outputBase: number) {

	let editor = vscode.window.activeTextEditor;
	
	let selections = editor.selections.filter( selection => selection.isSingleLine && !selection.isEmpty );
	let selectionsMap: { [line:number] : Selection[] } = {};
	selections.forEach(selection => selectionsMap[selection.start.line] ?
		selectionsMap[selection.start.line].push(selection) :
		selectionsMap[selection.start.line] = [selection]);
	let newSelections: Selection[] = [];
	let lineOffset = 0;
	
	editor.edit(editBuilder => {
		for (var key in selectionsMap) {
			if (selectionsMap.hasOwnProperty(key)) {
				lineOffset = 0
				selectionsMap[key] = selectionsMap[key].sort((first, second) => first.end.isBefore(second.start) ? -1 : 1 )
				selectionsMap[key].forEach(selection => {
					let selectedRange = new Range(selection.start.line, selection.start.character, selection.end.line, selection.end.character);
					let selectedText = editor.document.getText(selectedRange);
					let newText = convertBase(selectedText, inputBase, outputBase);
					let delta = newText.length - selectedText.length;
					newSelections.push(new Selection(selection.start.line, selection.start.character + lineOffset, selection.end.line, selection.end.character + lineOffset + delta));
					lineOffset += delta;
					editBuilder.replace(selectedRange, newText);				
				});
			}
		}
	});	
	editor.selections = newSelections;
}

function convertBase(input:string, inputBase:number, outputBase:number) :string {
	return parseInt(input, inputBase).toString(outputBase)
}
