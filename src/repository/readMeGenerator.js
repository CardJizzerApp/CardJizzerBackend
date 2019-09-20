const fs = require('fs');

const path = require('path');

const {exec} = require('child_process');

/**
 * @param {number} num
 * @return {string}
 */
function kFormatter(num) {
    return Math.abs(num) > 999 ?
        Math.sign(num)*(Math.abs(num)/1000).toFixed(1) + 'k' :
        Math.sign(num)*Math.abs(num);
}

exec('cat ./src/* | wc -l', (_, stdout) => {
    const linesOfCode = kFormatter(stdout.replace(/[^0-9]/g, ''));
    console.log(linesOfCode);
    const badgeURL = `https://img.shields.io/static/v1?label=linesOfCode&message=${linesOfCode}&color=green&style=for-the-badge&logo=visual-studio-code`;
    const template = path.join(__dirname, '..', '..', 'README.template.md');
    const readme = path.join(__dirname, '..', '..', 'README.md');

    fs.readFile(template, (_, data) => {
        let text = data.toString();
        text = text.replace('%BADGE_LINES%', badgeURL);
        fs.writeFile(readme, text, (_) => {});
    });
});

