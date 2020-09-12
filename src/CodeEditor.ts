import CodeMirror from "codemirror";

export default class CodeEditor {

	private readonly EXAMPLE_CODE = `{		
	onObstacleDetected: function(robot) {			
		// your code here		
	}	
}`
	private readonly config: CodeMirror.EditorConfiguration = {
		tabSize: 3,
		lineNumbers: true,
		mode: 'javascript',
		theme: 'vscode-dark'
	}

	private editor: CodeMirror.Editor

	constructor(element: HTMLTextAreaElement) {
		element.value = this.EXAMPLE_CODE
		this.editor = CodeMirror.fromTextArea(element, this.config)
	}
}