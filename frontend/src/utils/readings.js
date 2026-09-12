export const READING_META = {
  sugar: { label: 'Blood sugar', unit: 'mg/dL' },
  bp: { label: 'Blood pressure', unit: 'mmHg' },
  bp_sys: { label: 'Blood pressure (systolic)', unit: 'mmHg' },
  bp_dia: { label: 'Blood pressure (diastolic)', unit: 'mmHg' },
  weight: { label: 'Weight', unit: 'kg' },
};

export function formatReadingTypeLabel(type) {
  return READING_META[type]?.label || String(type || '').replace(/_/g, ' ');
}

export function formatReadingUnit(type) {
  return READING_META[type]?.unit || '';
}

export function formatBpDisplay(sys, dia) {
  const hasSys = sys !== undefined && sys !== null && sys !== '';
  const hasDia = dia !== undefined && dia !== null && dia !== '';
  if (hasSys && hasDia) return `${sys} / ${dia}`;
  if (hasSys) return `${sys} / —`;
  if (hasDia) return `— / ${dia}`;
  return null;
}

export function latestOfType(readings = [], type) {
  return [...readings]
    .filter((r) => r.type === type)
    .sort((a, b) => new Date(b.logged_at) - new Date(a.logged_at))[0];
}

export function latestBloodPressure(readings = []) {
  const sys = latestOfType(readings, 'bp_sys');
  const dia = latestOfType(readings, 'bp_dia');
  return {
    sys,
    dia,
    display: formatBpDisplay(sys?.value, dia?.value),
    logged_at: sys?.logged_at || dia?.logged_at || null,
  };
}

function closeInTime(a, b, ms = 120000) {
  if (!a?.logged_at || !b?.logged_at) return false;
  return Math.abs(new Date(a.logged_at) - new Date(b.logged_at)) <= ms;
}

export function pairReadingsForDisplay(readings = []) {
  const sorted = [...readings].sort((a, b) => new Date(b.logged_at) - new Date(a.logged_at));
  const used = new Set();
  const rows = [];

  for (const reading of sorted) {
    if (used.has(reading.id)) continue;

    if (reading.type === 'bp_sys' || reading.type === 'bp_dia') {
      const partnerType = reading.type === 'bp_sys' ? 'bp_dia' : 'bp_sys';
      const partner = sorted.find(
        (item) => !used.has(item.id) && item.type === partnerType && closeInTime(reading, item)
      );

      used.add(reading.id);
      if (partner) used.add(partner.id);

      const sys = reading.type === 'bp_sys' ? reading : partner;
      const dia = reading.type === 'bp_dia' ? reading : partner;

      rows.push({
        id: `bp-${reading.id}`,
        type: 'bp',
        valueLabel: formatBpDisplay(sys?.value, dia?.value) || '—',
        logged_at: sys?.logged_at || dia?.logged_at,
      });
      continue;
    }

    used.add(reading.id);
    rows.push({
      id: reading.id,
      type: reading.type,
      valueLabel: String(reading.value),
      logged_at: reading.logged_at,
    });
  }

  return rows;
}

export function parseBpField(raw) {
  const text = String(raw ?? '').trim();
  if (!text) return { value: '', leftover: '' };
  const slash = text.split('/');
  if (slash.length > 1) {
    return { value: slash[0].trim(), leftover: slash.slice(1).join('/').trim() };
  }
  return { value: text, leftover: '' };
}

export function validateBloodPressure(sysRaw, diaRaw) {
  const sysText = String(sysRaw ?? '').trim();
  const diaText = String(diaRaw ?? '').trim();

  if (!sysText && !diaText) {
    return 'Enter both systolic and diastolic values, e.g. 120 / 80.';
  }
  if (!sysText) return 'Enter the systolic value (the first number, e.g. 120).';
  if (!diaText) return 'Enter the diastolic value (the second number, e.g. 80).';
  if (/[^\d.]/.test(sysText) || /[^\d.]/.test(diaText)) {
    return 'Blood pressure values must be numbers. Use the two fields as 120 / 80.';
  }

  const sys = Number(sysText);
  const dia = Number(diaText);

  if (!Number.isFinite(sys) || !Number.isFinite(dia)) {
    return 'Both blood pressure values must be valid numbers.';
  }
  if (!Number.isInteger(sys) || !Number.isInteger(dia)) {
    return 'Enter whole numbers for blood pressure, e.g. 120 / 80.';
  }
  if (sys <= 0 || dia <= 0) {
    return 'Both blood pressure values must be greater than zero.';
  }
  if (sys < 70 || sys > 260) {
    return 'Systolic should be a realistic value between 70 and 260 mmHg.';
  }
  if (dia < 40 || dia > 160) {
    return 'Diastolic should be a realistic value between 40 and 160 mmHg.';
  }
  if (dia >= sys) {
    return 'Diastolic must be lower than systolic, e.g. 120 / 80.';
  }

  return '';
}
