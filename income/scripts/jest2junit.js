// deprecated: jest2junit converter replaced by native jest-junit reporter in package.json
console.log('jest2junit deprecated; jest-junit reporter used instead');
const fs = require('fs');
const inFile = 'jest-output.json';
const outFile = 'test-results.xml';
if (!fs.existsSync(inFile)) {
  console.error('Missing', inFile);
  process.exit(1);
}
const r = JSON.parse(fs.readFileSync(inFile));
let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<testsuites>';
xml += `<testsuite name="income-tests" tests="${r.numTotalTests}" failures="${r.numFailedTests}">`;
r.testResults.forEach(tr => {
  tr.assertionResults.forEach(a => {
    const cls = (a.ancestorTitles && a.ancestorTitles.length) ? a.ancestorTitles.join(' > ') : tr.name || 'jest';
    xml += `<testcase classname="${escapeXml(cls)}" name="${escapeXml(a.title)}">`;
    if (a.status !== 'passed') {
      const msg = (a.failureMessages || []).join('\n');
      xml += `<failure>${escapeXml(msg)}</failure>`;
    }
    xml += `</testcase>`;
  });
});
xml += '</testsuite></testsuites>';
fs.writeFileSync(outFile, xml);
console.log('WROTE', outFile);

function escapeXml(s) {
  if (!s) return '';
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}
