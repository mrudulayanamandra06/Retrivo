// RETRIVO SMART MATCHING ENGINE
// Explainable Weighted Multi-Attribute Scoring Algorithm

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
  'my', 'has', 'have', 'is', 'it', 'its', 'near', 'found', 'lost', 'left'
]);

function tokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 1 && !STOP_WORDS.has(word));
}

function tokenOverlapRatio(tokens1, tokens2) {
  if (!tokens1.length || !tokens2.length) return 0;
  const set1 = new Set(tokens1);
  const set2 = new Set(tokens2);
  let intersection = 0;
  for (const token of set1) {
    if (set2.has(token)) {
      intersection++;
    } else {
      // Partial stem check
      for (const t of set2) {
        if ((token.length > 3 && t.startsWith(token)) || (t.length > 3 && token.startsWith(t))) {
          intersection += 0.7;
          break;
        }
      }
    }
  }
  const union = new Set([...tokens1, ...tokens2]).size;
  return Math.min(1, intersection / Math.min(tokens1.length, tokens2.length));
}

/**
 * Calculates similarity score (0 - 100) between a lost item and a found item
 */
export function calculateMatchScore(lostItem, foundItem) {
  // 1. Category Compatibility (25 pts max)
  let categoryScore = 0;
  let categoryNote = '';
  if (lostItem.category === foundItem.category) {
    categoryScore = 25;
    categoryNote = `Exact category match (${lostItem.category}, +25pts)`;
  } else {
    // Cross-category compatibility (e.g., Electronics & Accessories)
    const compatiblePairs = [
      ['Electronics', 'Accessories'],
      ['Books & Notes', 'Bags'],
      ['Accessories', 'Clothing']
    ];
    const isCompatible = compatiblePairs.some(
      ([c1, c2]) =>
        (lostItem.category === c1 && foundItem.category === c2) ||
        (lostItem.category === c2 && foundItem.category === c1)
    );
    if (isCompatible) {
      categoryScore = 10;
      categoryNote = `Compatible category intersection (${lostItem.category} & ${foundItem.category}, +10pts)`;
    } else {
      categoryScore = 0;
      categoryNote = `Mismatched categories (${lostItem.category} vs ${foundItem.category}, 0pts)`;
    }
  }

  // 2. Name Similarity (30 pts max)
  const lostTitleTokens = tokenize(lostItem.title);
  const foundTitleTokens = tokenize(foundItem.title);
  const nameRatio = tokenOverlapRatio(lostTitleTokens, foundTitleTokens);
  const nameScore = Math.round(nameRatio * 30 * 10) / 10;
  const nameNote = `Title keywords similarity (${Math.round(nameRatio * 100)}% keyword overlap, +${nameScore}pts)`;

  // 3. Location Similarity (20 pts max)
  let locationScore = 0;
  let locationNote = '';
  const lostLoc = (lostItem.location || '').toLowerCase();
  const foundLoc = (foundItem.location || '').toLowerCase();

  if (lostLoc === foundLoc && lostLoc.length > 0) {
    locationScore = 20;
    locationNote = `Exact location match ("${lostItem.location}", +20pts)`;
  } else {
    const campusZones = [
      ['library', 'main library', 'study'],
      ['student union', 'cafeteria', 'dining'],
      ['gym', 'gymnasium', 'court', 'fitness'],
      ['engineering', 'block c', 'block a', 'block b'],
      ['science quad', 'biology', 'chemistry'],
      ['math', 'mathematics'],
      ['admin', 'security', 'parking']
    ];

    let zoneMatched = false;
    for (const zone of campusZones) {
      const lostInZone = zone.some(z => lostLoc.includes(z));
      const foundInZone = zone.some(z => foundLoc.includes(z));
      if (lostInZone && foundInZone) {
        locationScore = 18;
        locationNote = `Same campus building/zone match (+18pts)`;
        zoneMatched = true;
        break;
      }
    }

    if (!zoneMatched) {
      const locTokensLost = tokenize(lostItem.location);
      const locTokensFound = tokenize(foundItem.location);
      const locOverlap = tokenOverlapRatio(locTokensLost, locTokensFound);
      if (locOverlap > 0) {
        locationScore = Math.round(locOverlap * 14 * 10) / 10;
        locationNote = `Related campus area overlap (+${locationScore}pts)`;
      } else {
        locationScore = 2;
        locationNote = `Campus general vicinity (+2pts)`;
      }
    }
  }

  // 4. Date Proximity (15 pts max)
  let dateScore = 0;
  let dateNote = '';
  const dLost = new Date(lostItem.event_date);
  const dFound = new Date(foundItem.event_date);
  const diffDays = Math.round(Math.abs(dFound - dLost) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    dateScore = 15;
    dateNote = `Same date reporting (+15pts)`;
  } else if (diffDays <= 1) {
    dateScore = 13;
    dateNote = `Reported within 24 hours of event (+13pts)`;
  } else if (diffDays <= 3) {
    dateScore = 10;
    dateNote = `Reported within 3 days (+10pts)`;
  } else if (diffDays <= 7) {
    dateScore = 6;
    dateNote = `Reported within 1 week (+6pts)`;
  } else if (diffDays <= 14) {
    dateScore = 3;
    dateNote = `Reported within 2 weeks (+3pts)`;
  } else {
    dateScore = 0;
    dateNote = `Over 2 weeks apart (0pts)`;
  }

  // 5. Description & Distinguishing Features Similarity (10 pts max)
  const desc1 = `${lostItem.description || ''} ${lostItem.distinguishing_features || ''}`;
  const desc2 = `${foundItem.description || ''} ${foundItem.distinguishing_features || ''}`;
  const descTokens1 = tokenize(desc1);
  const descTokens2 = tokenize(desc2);
  const descRatio = tokenOverlapRatio(descTokens1, descTokens2);
  const descScore = Math.round(descRatio * 10 * 10) / 10;
  const descNote = `Features & description keyword alignment (+${descScore}pts)`;

  // Total Score Calculation
  const totalScore = Math.min(100, Math.round((categoryScore + nameScore + locationScore + dateScore + descScore) * 10) / 10);

  // Classification
  let classification = 'Low-confidence match';
  let badgeVariant = 'badge-closed';
  if (totalScore >= 80) {
    classification = 'Strong potential match';
    badgeVariant = 'badge-active';
  } else if (totalScore >= 60) {
    classification = 'Possible match';
    badgeVariant = 'badge-pending';
  }

  // Human-readable explanation
  const explanation = `${classification}: ${categoryNote}, ${nameNote}, ${locationNote}, ${dateNote}, and ${descNote}. Total explainable score: ${totalScore}/100.`;

  return {
    score: totalScore,
    classification,
    badgeVariant,
    explanation,
    matched_attributes: {
      category: categoryScore,
      name: nameScore,
      location: locationScore,
      date: dateScore,
      description: descScore
    }
  };
}

/**
 * Run matching engine across an item and opposite candidates in the database
 */
export function findMatchesForItem(targetItem, allItems) {
  if (!targetItem || !allItems || targetItem.status === 'recovered' || targetItem.status === 'closed') {
    return [];
  }

  const oppositeType = targetItem.item_type === 'lost' ? 'found' : 'lost';
  const candidates = allItems.filter(
    item =>
      item.item_type === oppositeType &&
      item.status !== 'recovered' &&
      item.status !== 'closed' &&
      item.id !== targetItem.id
  );

  const results = [];
  for (const candidate of candidates) {
    const lost = targetItem.item_type === 'lost' ? targetItem : candidate;
    const found = targetItem.item_type === 'found' ? targetItem : candidate;

    const matchResult = calculateMatchScore(lost, found);

    // Keep candidate if score is >= 50
    if (matchResult.score >= 50) {
      results.push({
        id: `match-${lost.id.replace('item-', '')}-${found.id.replace('item-', '')}`,
        lost_item_id: lost.id,
        found_item_id: found.id,
        score: matchResult.score,
        classification: matchResult.classification,
        badgeVariant: matchResult.badgeVariant,
        explanation: matchResult.explanation,
        matched_attributes: matchResult.matched_attributes,
        counterpart: candidate,
        created_at: new Date().toISOString()
      });
    }
  }

  // Sort descending by match score
  results.sort((a, b) => b.score - a.score);
  return results;
}

