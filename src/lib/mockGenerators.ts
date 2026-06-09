import { DynatraceMetric, ElasticLog, VenueType, ProblemType } from './models';

export function generateBaselineDynatraceMetric(locationId: string, venueType: VenueType): DynatraceMetric {
  return {
    timestamp: new Date().toISOString(),
    location_id: locationId,
    packet_drop_rate: Math.random() * 2,
    crash_rate: Math.random() * 0.5,
    event_type: 'NORMAL_OPERATIONS',
  };
}

export function generateAnomalyDynatraceMetric(locationId: string, venueType: VenueType, problemType: ProblemType): DynatraceMetric {
  let eventType = 'UNKNOWN_ANOMALY';
  
  if (problemType === 'bottleneck') eventType = 'SYSTEM_TIMEOUT_SPIKE';
  if (problemType === 'surge') eventType = 'ZONE_CAPACITY_OVERLOAD';
  if (problemType === 'resource_exhaustion') eventType = 'POS_GATEWAY_FAILURE';
  if (problemType === 'transit_failure') eventType = 'TRANSIT_API_DELAY_WARNING';

  return {
    timestamp: new Date().toISOString(),
    location_id: locationId,
    packet_drop_rate: problemType === 'bottleneck' ? 85 + Math.random() * 15 : Math.random() * 5,
    crash_rate: problemType === 'resource_exhaustion' ? 60 + Math.random() * 20 : Math.random() * 2,
    event_type: eventType,
  };
}

export function generateBaselineElasticLog(locationId: string, venueType: VenueType): ElasticLog {
  let message = 'User authenticated/passed successfully.';
  if (venueType === 'stadium') message = 'Ticket scanned successfully.';
  if (venueType === 'concert') message = 'Wristband authenticated.';
  if (venueType === 'gathering') message = 'Area entry logged.';
  if (venueType === 'carnival') message = 'Ride pass validated.';

  return {
    timestamp: new Date().toISOString(),
    location_id: locationId,
    error_code: 200,
    message,
  };
}

export function generateAnomalyElasticLog(locationId: string, venueType: VenueType, problemType: ProblemType): ElasticLog {
  let message = 'CRITICAL: Unknown error.';
  
  // Matrix specific logs
  if (problemType === 'bottleneck') {
    if (venueType === 'stadium') message = 'CRITICAL: Ticketing Database Sync Timeout. Gate locked.';
    if (venueType === 'concert') message = 'CRITICAL: VIP RFID Scanners offline. Connection refused.';
    if (venueType === 'gathering') message = 'CRITICAL: Security metal detector API timeout.';
    if (venueType === 'carnival') message = 'CRITICAL: Parade float stalled blocking Main Concourse.';
  } else if (problemType === 'surge') {
    if (venueType === 'stadium') message = 'WARNING: Mass exit detected from Block 104 (Hooligan clash).';
    if (venueType === 'concert') message = 'WARNING: Sudden crowd rush to Main Stage barriers.';
    if (venueType === 'gathering') message = 'WARNING: Flash rainstorm causing panicked rush to covered shelter.';
    if (venueType === 'carnival') message = 'WARNING: Rollercoaster breakdown causing massive crowd dump.';
  } else if (problemType === 'resource_exhaustion') {
    if (venueType === 'concert') message = 'CRITICAL: Merch tent POS systems crashed.';
    else message = 'CRITICAL: Food/Water vendor supply offline.';
  } else if (problemType === 'transit_failure') {
    message = 'CRITICAL: Train services delayed 45 minutes. Station platform at maximum density.';
  }

  return {
    timestamp: new Date().toISOString(),
    location_id: locationId,
    error_code: problemType === 'surge' ? 429 : 500, // 429 too many requests for surge, 500 for breaks
    message,
  };
}
