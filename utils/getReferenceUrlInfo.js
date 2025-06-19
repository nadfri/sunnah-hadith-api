const getHadithInfoText = require('./getHadithInfoText');

module.exports = (
  collectionId,
  bookId,
  numero,
  hadithNumberInCollection,
) => {
  bookId = bookId === '-1' ? 'introduction' : bookId;

  return {
    collectionId,
    bookId,
    numero,
    hadithNumberInCollection,
    api: {
      hadith: hadithNumberInCollection
        ? `/v1/site/collections/${collectionId}/hadith/${hadithNumberInCollection}`
        : undefined,
      book: bookId
        ? `/v1/site/collections/${collectionId}/books/${bookId}`
        : undefined,
      hadithInBook:
        numero && bookId
          ? `/v1/site/collections/${collectionId}/books/${bookId}/hadith/${numero}`
          : undefined,
    },
    sunnahWebsite: {
      hadith: hadithNumberInCollection
        ? `https://sunnah.com/${collectionId}:${hadithNumberInCollection}`
        : undefined,
      collection: `https://sunnah.com/${collectionId}`,
      book: bookId
        ? `https://sunnah.com/${collectionId}/${bookId}`
        : undefined,
      hadithInBook:
        numero && bookId
          ? `https://sunnah.com/${collectionId}/${bookId}/${numero}`
          : undefined,
    },
  };
};
