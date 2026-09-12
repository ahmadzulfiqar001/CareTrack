import {
  CARETRACK_ADVICE_TERMS,
  CARETRACK_ASSISTANT,
  CARETRACK_EMERGENCY_TERMS,
  CARETRACK_RECORD_TERMS,
  CARETRACK_TOPICS,
} from '../data/caretrackKnowledge';

function normalize(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^a-z0-9/\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function includesAny(text, terms) {
  return terms.some((term) => text.includes(term));
}

function scoreTopic(query, topic) {
  let score = 0;
  for (const keyword of topic.keywords) {
    if (query.includes(keyword)) {
      score += keyword.length > 8 ? 3 : 2;
    }
  }
  if (query.includes(normalize(topic.title))) score += 4;
  return score;
}

export function answerCareTrackQuestion(rawQuery) {
  const query = normalize(rawQuery);

  if (!query) {
    return {
      text: 'Please type a question about CareTrack, logging, reminders, or the patient and doctor workspaces.',
    };
  }

  if (includesAny(query, CARETRACK_EMERGENCY_TERMS)) {
    return { text: CARETRACK_ASSISTANT.emergency, tone: 'urgent' };
  }

  if (includesAny(query, CARETRACK_ADVICE_TERMS)) {
    return {
      text: `${CARETRACK_ASSISTANT.disclaimer} For personal medical questions, please contact your clinic or a qualified healthcare professional.`,
    };
  }

  if (includesAny(query, CARETRACK_RECORD_TERMS) && !query.includes('how do i log') && !query.includes('how to log')) {
    return { text: CARETRACK_ASSISTANT.noRecords };
  }

  const ranked = CARETRACK_TOPICS.map((topic) => ({
    topic,
    score: scoreTopic(query, topic),
  })).sort((a, b) => b.score - a.score);

  const best = ranked[0];
  if (!best || best.score < 2) {
    return { text: CARETRACK_ASSISTANT.fallback };
  }

  return { text: best.topic.answer, topicId: best.topic.id };
}
