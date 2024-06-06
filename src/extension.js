const vscode = require('vscode');
const path = require('path');

function activate(context) {
    console.log('Extension "rePT" is now active!');

    const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBar.command = 'rePT.copyFilePaths';
    statusBar.text = '$(files) Copy File Paths';
    statusBar.tooltip = 'Copy paths of open files to clipboard';
    statusBar.show();

    console.log('Status bar item created and shown.');

    context.subscriptions.push(statusBar);

    const copyFilePathsCommand = vscode.commands.registerCommand('rePT.copyFilePaths', () => {
        // Gather URIs from all active tabs
        const activeTabUris = [];
        vscode.window.tabGroups.all.forEach(group => {
            group.tabs.forEach(tab => {
                if (tab.input && 'uri' in tab.input) {
                    activeTabUris.push(tab.input.uri.fsPath);
                }
            });
        });

        // Filter paths that start or end with "git"
        const filteredPaths = activeTabUris.filter(filePath => {
            const relativePath = vscode.workspace.asRelativePath(filePath);
            return !relativePath.startsWith('git') && !relativePath.endsWith('.git');
        });

        const pathsString = filteredPaths.map(filePath => `"${filePath}"`).join(' ');
        console.log('Formatted Paths:', pathsString); // Debug log to verify paths

        vscode.env.clipboard.writeText(pathsString).then(() => {
            vscode.window.showInformationMessage('File paths copied to clipboard!');
        });
    });

    context.subscriptions.push(copyFilePathsCommand);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
