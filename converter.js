const fs = require('fs');
const path = require('path');

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const directory = 'es6 & beyond';
const chapters = 8;
const appendices = 'A';
const title = 'ES6 & Beyond';
const workdir = path.join(__dirname, directory);

function increaseHeader(original) {
    const regex = /\#+\s/g;
    return original.replace(regex, (match, offset, string) => `#${match}`)
}

function removeFileHeader(original) {
    const regex = /^\#\s(.*)\n/g;
    return original.replace(regex, '');
}

function setChapterHeading(original, chapter) {
    const regex = /^\#{2}\s/g;
    return original.replace(regex, (match, offset, string) => `${match}<a name="${chapter}"></a>`);
}

function setSubheadings(original, chapter) {
    let counter = 0;
    const regex = /\s\#{3}\s/g;
    return original.replace(regex, (match, offset, string) => {
        counter++;
        return `${match}<a name="${chapter}-${counter}"></a>`;
    });
}

function formatFile(filename) {
    const original = fs.readFileSync(path.join(workdir, `${filename}.md`), 'utf8');
    let output = original;
    output = removeFileHeader(original);
    output = increaseHeader(output);
    output = setChapterHeading(output, filename);
    output = setSubheadings(output, filename);

    return output;
}

// function makeTOC() {
//     const original = fs.readFileSync(path.join(workdir, 'toc.md'), 'utf8');
//     let output = original;

//     const chapterRegex = /\n\*\s(.+)/g;
//     let chapterCount = 0;
//     let appendixCount = -1;
//     output = output.replace(chapterRegex, (match, offset, string) => {
//         const chapterNameRegex = /Chapter(.+)/g;
//         let modifiedString = match.replace(chapterNameRegex, (match) => {
//             chapterCount++;
//             return `[${match}](#ch${chapterCount})`;
//         });
//         return modifiedString;
//     });

//     output = output.replace(chapterRegex, (match, offset, string) => {
//         const appendixRegex = /Appendix(.+)/g;
//         let chapterString = `${match}`;
//         const modifiedString = chapterString.replace(appendixRegex, (match) => {
//             appendixCount++;
//             return `[${match}](#ap${letters[appendixCount]})`;
//         });
//         return modifiedString;
//     });

//     output += '\n';
//     return output;
// }

let output = `% You Don't Know JS: ${title}\n% Kyle Simpson\n\n`;


for (let i = 1; i <= chapters; i++) {
    const chapter = formatFile(`ch${i}`);
    output += chapter;
    output += '\n';
}

for (const letter of letters) {
    const appendix = formatFile(`ap${letter}`);
    output += appendix;
    output += '\n';
    if (letter === appendices) {
        break;
    }
}

fs.writeFileSync(path.join(workdir, 'book.md'), output, 'utf8');