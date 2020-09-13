import CodeMirror from "codemirror";

export default class CodeEditor {

    private readonly EXAMPLE_SOLUTION = 
`{
    onObstacleDetected: (robot) => {
        let randomAngle = Math.floor(Math.random() * Math.floor(360))
        if(robot.angle > 0){
            randomAngle = randomAngle * -1                    
        }
        robot.angle = randomAngle
    },
    onMove: (robot) => {
    }
}`
    private readonly config: CodeMirror.EditorConfiguration = {
        indentUnit: 4,
        lineNumbers: true,
        mode: 'javascript',
        theme: 'vscode-dark'
    }

    private editor: CodeMirror.Editor

    constructor(element: HTMLTextAreaElement) {
        element.value = this.EXAMPLE_SOLUTION
        this.editor = CodeMirror.fromTextArea(element, this.config)
    }

    get(): any {
        const code = eval(`( ${this.editor.getValue()} )`)

        return {
            onObstacleDetected: code.onObstacleDetected,
            onMove: code.onMove
        }
    }
}