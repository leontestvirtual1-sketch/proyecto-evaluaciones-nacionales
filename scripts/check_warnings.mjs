import { ESLint } from "eslint";

async function main() {
  const eslint = new ESLint();
  const results = await eslint.lintFiles(["src/**/*.{ts,tsx}"]);
  
  let totalWarnings = 0;
  let totalErrors = 0;
  const fileSummary = [];

  for (const result of results) {
    if (result.warningCount > 0 || result.errorCount > 0) {
      totalWarnings += result.warningCount;
      totalErrors += result.errorCount;
      fileSummary.push({
        filePath: result.filePath.replace(/\\/g, '/').split('Proyecto Evaluaciones Nacionales/')[1] || result.filePath,
        warnings: result.warningCount,
        errors: result.errorCount,
        messages: result.messages.map(m => `  L${m.line}:${m.column} [${m.ruleId}] ${m.message}`)
      });
    }
  }

  fileSummary.sort((a, b) => (b.warnings + b.errors) - (a.warnings + a.errors));

  console.log(`TOTAL ERRORS: ${totalErrors}`);
  console.log(`TOTAL WARNINGS: ${totalWarnings}`);
  console.log(`FILES WITH ISSUES: ${fileSummary.length}\n`);

  for (const f of fileSummary.slice(0, 15)) {
    console.log(`\n=== ${f.filePath} (${f.warnings} warnings, ${f.errors} errors) ===`);
    f.messages.slice(0, 12).forEach(m => console.log(m));
  }
}

main().catch(console.error);
