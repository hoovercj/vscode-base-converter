import {InputBoxOptions, window, Range, Selection } from 'vscode';

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
		if (!value) return;
		
		let matches:RegExpMatchArray = /(\d+)\D+(\d+)/.exec(value)
		if (matches && matches[1] && matches[2]){
			applyBaseConversion(parseInt(matches[1]), parseInt(matches[2]));
		} else {
			window.showErrorMessage("Cannot convert between the bases you specified. Please try again.");
		}
	});
}

function applyBaseConversion(inputBase: number, outputBase: number) {
	replaceSelections(convertBase, {inputBase: inputBase, outputBase:outputBase});
}

function convertBase(input:string, opts:{inputBase:number, outputBase:number}) :string {
	return parseInt(input, opts.inputBase).toString(opts.outputBase).toUpperCase();
}

function replaceSelections(func:(s:string, o:any) => string, opts?:any) {
	let editor = window.activeTextEditor;

	let selectionsMap: { [line:number] : Selection[] } = {};	
	let selections = editor.selections.filter( selection => selection.isSingleLine && !selection.isEmpty );
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
					
					let newText = func(selectedText, opts);
					
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