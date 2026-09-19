import * as assert from 'assert';
import * as vscode from 'vscode';
import { isProjectRequirements, isSafeDependencyName } from '../extension';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('rejects unsafe dependency names', () => {
		assert.strictEqual(isSafeDependencyName('ms-vscode.cpptools', 'extension'), true);
		assert.strictEqual(isSafeDependencyName('DHT sensor library', 'library'), true);
		assert.strictEqual(isSafeDependencyName('esp32:3.0.7', 'core'), true);
		assert.strictEqual(isSafeDependencyName('evil; rm -rf /', 'library'), false);
		assert.strictEqual(isSafeDependencyName('bad && curl https://evil', 'core'), false);
		assert.strictEqual(isSafeDependencyName('bad`$(whoami)', 'extension'), false);
	});

	test('validates project requirements shape', () => {
		assert.strictEqual(
			isProjectRequirements({
				requiredVsCodeExtensions: ['ms-vscode.cpptools'],
				requiredArduinoLibs: ['DHT sensor library'],
				requiredArduinoCores: ['esp32:3.0.7'],
				projectName: 'esp32_weather',
				sketchCode: 'void setup() {}\nvoid loop() {}',
			}),
			true
		);
		assert.strictEqual(
			isProjectRequirements({
				requiredVsCodeExtensions: ['bad; rm -rf /'],
				requiredArduinoLibs: ['DHT sensor library'],
				requiredArduinoCores: ['esp32:3.0.7'],
				projectName: 'esp32_weather',
				sketchCode: 'void setup() {}\nvoid loop() {}',
			}),
			false
		);
	});
});
