const fsExtra = require("fs-extra");
const path = require("path");
const JavaScriptObfuscator = require("javascript-obfuscator");

async function copyAllRootFilestoDistFolderAndObfuscate() {
	// Source directory
	const sourceDir = "./src";

	// Destination directory
	const destDir = "./deploy";
	
	// Create the 'dist' directory if it doesn't exist
	if (!fsExtra.existsSync(destDir)) {
		// Copy the contents of the source directory to the 'dist' directory
		try {
			const files = fsExtra.readdirSync(sourceDir);

			fsExtra.mkdirSync(destDir);

			const substringsToCheck = [".git", "build.js"];

			files.forEach((file) => {
				const sourcePath = path.join(sourceDir, file);

				const destPath = path.join(destDir, file);

				let included = false;

				for (const substring of substringsToCheck) {
					if (sourcePath.includes(substring)) {
						included = true;

						break;
					}
				}

				// Exclude 'dist' directory from the copy

				if (sourcePath !== destPath && !included) {
					fsExtra.copySync(sourcePath, destPath);

					console.log("Copied", sourcePath, "to", destPath);
				}
			});
		} catch (err) {
			console.error(
				"Error reading source directory or copying files:",
				err
			);
		}

		// Code to execute after the copy operation
		console.log(
			"File copy operation completed. Continuing with other code."
		);

		obfuscateAllJSFiles();
	}
}

function obfuscateAllJSFiles() {
	const folderPath = "./deploy";

	// Replace with your folder path
	const excludedFolders = ["node_modules", ".vscode", "config", "logs"];
	
	// Replace with the folder to exclude
	function getJsFilePaths(folderPath, excludedFolders) {
		const jsFiles = [];

		const files = fsExtra.readdirSync(folderPath);

		files.forEach((file) => {
			const filePath = path.join(folderPath, file);

			const isDirectory = fsExtra.lstatSync(filePath).isDirectory();

			if (isDirectory && !excludedFolders.includes(file)) {
				// Recursively scan subdirectories
				jsFiles.push(...getJsFilePaths(filePath, excludedFolders));
			} else if (file.endsWith(".js")) {
				jsFiles.push(filePath);
			}
		});

		return jsFiles;
	}

	const jsFilePaths = getJsFilePaths(folderPath, excludedFolders);

	console.log("JavaScript file paths:", jsFilePaths);

	try {
		for (const filePath of jsFilePaths) {
			const data = fsExtra.readFileSync(filePath, "utf8");

			const obfuscatedCode =
				JavaScriptObfuscator.obfuscate(data).getObfuscatedCode();

			fsExtra.writeFileSync(filePath, obfuscatedCode);

			console.log(
				"Component obfuscated successfully! --------->",
				filePath
			);
		}
	} catch (err) {
		console.error("Error reading jsFilePath:", err);
	}
}

copyAllRootFilestoDistFolderAndObfuscate();
