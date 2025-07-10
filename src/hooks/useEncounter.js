import { useState, useCallback, useRef } from "react";
import encounterService from "../services/encounterService";

export const useEncounter = () => {
  const [encounters, setEncounters] = useState([]);
  const [currentEncounter, setCurrentEncounter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mountedRef = useRef(true);

  const clearError = useCallback(() => {
    if (mountedRef.current) {
      setError(null);
    }
  }, []);

  const startEncounter = useCallback(async (encounterData) => {
    if (!mountedRef.current) return;

    setLoading(true);
    setError(null);

    try {
      const newEncounter = await encounterService.startEncounter(encounterData);

      if (mountedRef.current) {
        setCurrentEncounter(newEncounter);
        // Add new encounter to the list if it exists
        setEncounters((prev) => [newEncounter, ...prev]);
      }

      return newEncounter;
    } catch (err) {
      if (mountedRef.current) {
        setError(err.message);
      }
      throw err;
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  /**
   * Update encounter status with optimistic updates
   */
  const updateEncounterStatus = useCallback(
    async (encounterId, newStatus) => {
      if (!mountedRef.current) return;

      setLoading(true);
      setError(null);

      // Store previous state for rollback if needed
      const previousEncounters = encounters;
      const previousCurrentEncounter = currentEncounter;

      try {
        // Optimistic update
        if (mountedRef.current) {
          setEncounters((prev) =>
            prev.map((encounter) =>
              encounter.encounter_id === encounterId
                ? { ...encounter, status: newStatus }
                : encounter
            )
          );

          if (currentEncounter?.encounter_id === encounterId) {
            setCurrentEncounter((prev) => ({ ...prev, status: newStatus }));
          }
        }

        const updatedEncounter = await encounterService.updateEncounterStatus(
          encounterId,
          newStatus
        );

        if (mountedRef.current) {
          // Update with actual server response
          setEncounters((prev) =>
            prev.map((encounter) =>
              encounter.encounter_id === encounterId
                ? updatedEncounter
                : encounter
            )
          );

          if (currentEncounter?.encounter_id === encounterId) {
            setCurrentEncounter(updatedEncounter);
          }
        }

        return updatedEncounter;
      } catch (err) {
        if (mountedRef.current) {
          // Rollback optimistic updates
          setEncounters(previousEncounters);
          setCurrentEncounter(previousCurrentEncounter);
          setError(err.message);
        }
        throw err;
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    },
    [encounters, currentEncounter]
  );

  /**
   * Fetch encounter details
   */
  const fetchEncounterDetails = useCallback(async (encounterId) => {
    if (!mountedRef.current) return;

    setLoading(true);
    setError(null);

    try {
      const encounter = await encounterService.getEncounterDetails(encounterId);

      if (mountedRef.current) {
        setCurrentEncounter(encounter);
      }

      return encounter;
    } catch (err) {
      if (mountedRef.current) {
        setError(err.message);
      }
      throw err;
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  /**
   * Fetch active encounters with filtering
   */
  const fetchActiveEncounters = useCallback(async (statusFilter = []) => {
    if (!mountedRef.current) return;

    setLoading(true);
    setError(null);

    try {
      const encounterList = await encounterService.listActiveEncounters(
        statusFilter
      );

      if (mountedRef.current) {
        setEncounters(encounterList);
      }

      return encounterList;
    } catch (err) {
      if (mountedRef.current) {
        setError(err.message);
      }
      throw err;
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  /**
   * Refresh encounters list
   */
  const refreshEncounters = useCallback(async () => {
    return fetchActiveEncounters();
  }, [fetchActiveEncounters]);

  /**
   * Clear current encounter
   */
  const clearCurrentEncounter = useCallback(() => {
    if (mountedRef.current) {
      setCurrentEncounter(null);
    }
  }, []);

  // Cleanup function to prevent memory leaks
  const cleanup = useCallback(() => {
    mountedRef.current = false;
  }, []);

  return {
    // State
    encounters,
    currentEncounter,
    loading,
    error,

    // Actions
    startEncounter,
    updateEncounterStatus,
    fetchEncounterDetails,
    fetchActiveEncounters,
    refreshEncounters,
    clearCurrentEncounter,
    clearError,
    cleanup,
  };
};
