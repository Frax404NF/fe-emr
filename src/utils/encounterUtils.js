export const calculateEncounterStats = encounters => {
  return {
    total: encounters.length,
    triage: encounters.filter(e => e.status === 'TRIAGE' || !e.triage_level)
      .length,
    ongoing: encounters.filter(e => e.status === 'ONGOING').length,
    observation: encounters.filter(e => e.status === 'OBSERVATION').length,
    active: encounters.filter(e =>
      ['TRIAGE', 'ONGOING', 'OBSERVATION'].includes(e.status)
    ).length,
    newToday: encounters.filter(e => {
      const today = new Date().toDateString();
      return new Date(e.encounter_start_time).toDateString() === today;
    }).length,
  };
};
