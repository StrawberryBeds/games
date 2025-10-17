// Pseudocode for Cloud Function
exports.updateCardSetAverages = functions.firestore
  .document('players/{playerId}/scores/{scoreId}')
  .onCreate(async (snapshot, context) => {
    const { cardSet, turns } = snapshot.data();
    const playerId = context.params.playerId;

    // Fetch all scores for this cardSet
    const scoresSnapshot = await admin.firestore()
      .collection(`players/${playerId}/scores`)
      .where('cardSet', '==', cardSet)
      .get();

    const scores = scoresSnapshot.docs.map(doc => doc.data().turns);

    // Calculate averages
    const avgFirstThree = calculateAvg(scores.slice(0, 3));
    const avgLastThree = calculateAvg(scores.slice(-3));
    const avgAll = calculateAvg(scores);

    // Update player stats for this cardSet
    await admin.firestore()
      .collection('players')
      .doc(playerId)
      .collection('cardSetStats')
      .doc(cardSet)
      .set({
        avgFirstThree,
        avgLastThree,
        avgAll,
        gameCount: scores.length,
      });
  });
