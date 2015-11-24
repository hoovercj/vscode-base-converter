# README

base-converter is an extension that allows selections to be converted from one base to another.

![VSCODE](https://media.giphy.com/media/3oEduOVcsSVQETFbOg/giphy.gif)

Select one more numbers that you'd like to convert (multiple sections can be done by holding the `alt` key), open the command palette (`ctrl+shift+p`), and search for "Convert Base" and select an option.

`Convert Base Any to Any` will prompt you to enter the source base and output base. These can be any two valid base-10 integers separated by any non-digit characters. `10 to 2`, `16, 10`, `10:64`, `2 10`, etc. should all work.  

The following keybinding is added by default. The other commands can can easily be added, or this can be overwritten, in the user settings.
```json
{
	"key": "ctrl+alt+c",
	"command": "extension.baseConverter.anyToAny"
}
```