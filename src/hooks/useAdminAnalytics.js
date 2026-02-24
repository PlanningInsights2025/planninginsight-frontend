import { useCallback, useEffect, useMemo, useState } from 'react'
import * as adminService from '../services/api/admin'

export const useAdminAnalyticsOverview = ({ period = '7d', stream = 'public' } = {}) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchOverview = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await adminService.getAnalyticsOverview(period, stream)
      setData(response.data?.overview || response.overview || null)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [period, stream])

  useEffect(() => {
    fetchOverview()
  }, [fetchOverview])

  return {
    data,
    loading,
    error,
    refresh: fetchOverview
  }
}

export const useRealtimeAnalytics = ({
  stream = 'public',
  refreshIntervalMs = 30000,
  enabled = true
} = {}) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchRealtime = useCallback(async () => {
    if (!enabled) {
      setLoading(false)
      return
    }

    if (!data) {
      setLoading(true)
    }

    setError(null)

    try {
      const response = await adminService.getRealtimeAnalytics(stream)
      setData(response.data?.realtime || response.realtime || null)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [enabled, stream, data])

  useEffect(() => {
    fetchRealtime()

    if (!enabled) {
      return undefined
    }

    const interval = window.setInterval(fetchRealtime, refreshIntervalMs)

    return () => {
      window.clearInterval(interval)
    }
  }, [enabled, fetchRealtime, refreshIntervalMs])

  return {
    data,
    loading,
    error,
    lastUpdated,
    refresh: fetchRealtime
  }
}

export const useCombinedAnalyticsData = ({ period = '7d', stream = 'public' } = {}) => {
  const overview = useAdminAnalyticsOverview({ period, stream })
  const realtime = useRealtimeAnalytics({ stream })

  const loading = overview.loading || realtime.loading

  const error = useMemo(() => {
    return overview.error || realtime.error || null
  }, [overview.error, realtime.error])

  return {
    overview,
    realtime,
    loading,
    error
  }
}
