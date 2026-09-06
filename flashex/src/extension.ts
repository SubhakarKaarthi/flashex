import { exec } from 'child_process';
import * as vscode from 'vscode';

interface ProjectRequirements {
	requiredVsCodeExtensions: string[];
	requiredArduinoLibs: string[];
	requiredArduinoCores: string[];
	projectName: string;
	sketchCode: string;
}

const apiKeySecretName = 'flashex.geminiApiKey';

async function getApiKey(context: vscode.ExtensionContext): Promise<string | undefined> {
	let apiKey = await context.secrets.get(apiKeySecretName);
	if (apiKey) {
		return apiKey;
	}

	apiKey = await vscode.window.showInputBox({
		prompt: 'Enter your Google Gemini API key',
		placeHolder: 'AIza...',
		password: true,
		ignoreFocusOut: true,
	});

	if (!apiKey) {
		return undefined;
	}

	await context.secrets.store(apiKeySecretName, apiKey);
	return apiKey;
}

function isProjectRequirements(value: unknown): value is ProjectRequirements {
	if (!value || typeof value !== 'object') {
		return false;
	}

	const requirements = value as Record<string, unknown>;
	const arrayFields = [
		requirements.requiredVsCodeExtensions,
		requirements.requiredArduinoLibs,
		requirements.requiredArduinoCores,
	];

	return arrayFields.every(
		(field) => Array.isArray(field) && field.every((item) => typeof item === 'string')
	)
		&& typeof requirements.projectName === 'string'
		&& /^[a-z0-9_]+$/.test(requirements.projectName)
		&& typeof requirements.sketchCode === 'string';
}

async function getProjectRequirements(prompt: string, apiKey: string): Promise<ProjectRequirements> {
	const { GoogleGenAI } = await import('@google/genai');
	const ai = new GoogleGenAI({ apiKey });
	const response = await ai.models.generateContent({
		model: 'gemini-2.5-flash',
		contents: prompt,
		config: {
			systemInstruction: [
				'You are FlashEx, an expert Arduino hardware project planner.',
				'Return ONLY one raw JSON object with no markdown, backticks, or surrounding text.',
				'The object must contain exactly these fields: requiredVsCodeExtensions, requiredArduinoLibs, requiredArduinoCores, projectName, sketchCode.',
				'requiredVsCodeExtensions, requiredArduinoLibs, and requiredArduinoCores must be arrays of strings.',
				'projectName must contain only lowercase letters, numbers, and underscores, and must be safe as a directory name.',
				'sketchCode must be complete compilable Arduino C++ boilerplate for the requested project.',
			].join(' '),
			responseMimeType: 'application/json',
		},
	});

	const responseText = response.text;
	if (!responseText) {
		throw new Error('Gemini returned an empty response.');
	}

	let payload: unknown;
	try {
		payload = JSON.parse(responseText);
	} catch {
		throw new Error('Gemini returned invalid JSON.');
	}

	if (!isProjectRequirements(payload)) {
		throw new Error('Gemini returned JSON that does not match the required project format.');
	}

	return payload;
}

function runArduinoCli(command: string): Promise<void> {
	return new Promise((resolve, reject) => {
		exec(command, (error, _stdout, stderr) => {
			if (error) {
				reject(new Error(stderr.trim() || error.message));
				return;
			}

			resolve();
		});
	});
}

async function scaffoldProject(requirements: ProjectRequirements): Promise<vscode.Uri> {
	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (!workspaceFolders) {
		throw new Error('Open a workspace before setting up an Arduino project.');
	}

	const workspaceRoot = workspaceFolders[0].uri;
	const projectDirectory = vscode.Uri.joinPath(workspaceRoot, requirements.projectName);
	const sketchUri = vscode.Uri.joinPath(
		projectDirectory,
		`${requirements.projectName}.ino`
	);

	await vscode.workspace.fs.createDirectory(projectDirectory);
	await vscode.workspace.fs.writeFile(
		sketchUri,
		Buffer.from(requirements.sketchCode, 'utf8')
	);
	return sketchUri;
}

async function installDependencies(requirements: ProjectRequirements): Promise<void> {
	for (const extensionId of requirements.requiredVsCodeExtensions) {
		vscode.window.showInformationMessage(`Installing VS Code extension: ${extensionId}`);
		try {
			await vscode.commands.executeCommand(
				'workbench.extensions.installExtension',
				extensionId
			);
			vscode.window.showInformationMessage(`Installed VS Code extension: ${extensionId}`);
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			vscode.window.showErrorMessage(
				`Failed to install VS Code extension ${extensionId}: ${message}`
			);
		}
	}

	for (const library of requirements.requiredArduinoLibs) {
		vscode.window.showInformationMessage(`Installing Arduino library: ${library}`);
		try {
			await runArduinoCli(`arduino-cli lib install "${library}"`);
			vscode.window.showInformationMessage(`Installed Arduino library: ${library}`);
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			vscode.window.showErrorMessage(
				`Failed to install Arduino library ${library}: ${message}`
			);
		}
	}

	for (const core of requirements.requiredArduinoCores) {
		vscode.window.showInformationMessage(`Installing Arduino core: ${core}`);
		try {
			await runArduinoCli(`arduino-cli core install "${core}"`);
			vscode.window.showInformationMessage(`Installed Arduino core: ${core}`);
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			vscode.window.showErrorMessage(`Failed to install Arduino core ${core}: ${message}`);
		}
	}
}

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('flashex.setupProject', async () => {
		try {
			const prompt = await vscode.window.showInputBox({
				prompt: 'Describe your Arduino project',
				placeHolder: 'ESP32 web server with DHT22',
			});

			if (!prompt) {
				return;
			}

			const apiKey = await getApiKey(context);
			if (!apiKey) {
				vscode.window.showErrorMessage('A Gemini API key is required to set up a project.');
				return;
			}

			const requirements = await getProjectRequirements(prompt, apiKey);
			if (!vscode.workspace.workspaceFolders) {
				vscode.window.showErrorMessage('Open a workspace before setting up an Arduino project.');
				return;
			}

			const sketchUri = await scaffoldProject(requirements);
			const document = await vscode.workspace.openTextDocument(sketchUri);
			await vscode.window.showTextDocument(document);
			await installDependencies(requirements);
			vscode.window.showInformationMessage(
				`FlashEx project setup complete: ${requirements.projectName}`
			);
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			vscode.window.showErrorMessage(`FlashEx setup failed: ${message}`);
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
