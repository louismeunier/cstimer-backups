const fs = require("fs");

const param = process.argv[2];

if (!param) {
    console.log("Invalid update type, use one of major, minor, patch");
    return;
}

const packageJSON = require("../package.json");
const manifestJSON = require("../public/manifest.json");
const currentVersion = packageJSON.version;
const [currentMajor, currentMinor, currentPatch] = currentVersion.split(".").map(c => parseInt(c));

console.log("Current version: ", currentVersion);

let newVersion;

switch (param) {
    case "major":
        const newMajor = currentMajor + 1;
        newVersion = `${newMajor}.0.0`;
        break;
    case "minor":
        const newMinor = currentMinor + 1;
        newVersion = `${currentMajor}.${newMinor}.0`;
        break;
    case "patch":
        const newPatch = currentPatch + 1;
        newVersion = `${currentMajor}.${currentMinor}.${newPatch}`;
        break;
    default:
        console.log("Invalid update type, use one of major, minor, patch");
        process.exit()
    break;
}

console.log(`Updating ${param} version, ${currentVersion} => ${newVersion}`);

packageJSON.version = newVersion;
manifestJSON.version = newVersion;

fs.writeFile(
    "package.json", 
    JSON.stringify(packageJSON, null, 4), 
    "utf8",
    (e)=>{console.log(e)}
)
fs.writeFile(
    "public/manifest.json", 
    JSON.stringify(manifestJSON, null, 4), 
    "utf8",
    (e)=>{console.log(e)}
)
