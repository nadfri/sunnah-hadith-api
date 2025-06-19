// extractMuslimBook.js
const fs = require('fs').promises;
const path = require('path');

async function extractBook(bookId) {
  const url = `http://localhost:3000/v1/site/collections/muslim/books/${bookId}`;
  const res = await fetch(url);
  const json = await res.json();

  const bookName = json.metadata.english.bookName;
  const allHadiths = [];

  for (const section of json.data) {
    for (const h of section.ahadith) {
      allHadiths.push({
        bookName,
        numero: h.reference.hadithNumberInCollection,
        hadithNarrated: h.english.hadithNarrated,
        matn_en: h.english.fullHadith,
        matn_ar: h.arabic.fullHadith,
      });
    }
  }

  // Filtrage : pour chaque baseId, si une version 'a' existe, on ne garde qu'elle (numero devient number), sinon la version sans lettre
  const byBaseId = new Map();
  
  for (const h of allHadiths) {
    const numStr = String(h.numero);
    const baseId = numStr.replace(/([a-z])$/i, '');
    const suffix = numStr.slice(baseId.length);
    if (!byBaseId.has(baseId)) byBaseId.set(baseId, []);
    byBaseId.get(baseId).push({ h, suffix });
  }
  const filtered = [];
  for (const [baseId, variants] of byBaseId.entries()) {
    const aVariant = variants.find(
      (v) => v.suffix.toLowerCase() === 'a',
    );

    if (aVariant) {
      const hadith = { ...aVariant.h };
      hadith.numero = Number(baseId);
      filtered.push(hadith);
    } else {
      const noLetter = variants.find((v) => v.suffix === '');

      if (noLetter) {
        const hadith = { ...noLetter.h };
        hadith.numero = Number(baseId);
        filtered.push(hadith);
      }
    }
  }

  // Crée le dossier data/ s'il n'existe pas
  const outputDir = path.join(__dirname, 'data');
  await fs.mkdir(outputDir, { recursive: true });

  const outputPath = path.join(
    outputDir,
    `muslim_book${bookId}.json`,
  );
  await fs.writeFile(
    outputPath,
    JSON.stringify(filtered, null, 2),
    'utf8',
  );
  console.log(
    `✅ Livre ${bookId} : ${filtered.length} hadiths filtrés écrits dans ${outputPath}`,
  );
}

async function main() {
  const totalBooks = 54; // Ajuste si besoin
  for (let id = 1; id <= totalBooks; id++) {
    await extractBook(id);
  }
}

main().catch(console.error);
