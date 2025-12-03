/**
 * Hook for snapping pick positions to local peaks in probability data
 * Uses prominence-based peak detection
 */

export interface Peak {
  index: number;
  position: number; // 0-100 percentage
  value: number;
  prominence: number;
}

/**
 * Find local peaks with prominence above threshold
 * Prominence = height of peak above the higher of its two neighboring valleys
 */
export function findLocalPeaks(
  data: number[],
  threshold: number
): Peak[] {
  const peaks: Peak[] = [];
  
  if (data.length < 3) return peaks;
  
  // Find all local maxima
  for (let i = 1; i < data.length - 1; i++) {
    if (data[i] > data[i - 1] && data[i] > data[i + 1]) {
      // Found a local maximum, calculate prominence
      const prominence = calculateProminence(data, i);
      
      if (prominence >= threshold) {
        peaks.push({
          index: i,
          position: (i / (data.length - 1)) * 100,
          value: data[i],
          prominence,
        });
      }
    }
  }
  
  return peaks;
}

/**
 * Calculate prominence of a peak
 * Prominence = peak value - max of the two neighboring valleys
 */
function calculateProminence(data: number[], peakIndex: number): number {
  const peakValue = data[peakIndex];
  
  // Find left valley (lowest point until we hit a higher peak or edge)
  let leftValley = peakValue;
  for (let i = peakIndex - 1; i >= 0; i--) {
    if (data[i] > peakValue) break;
    leftValley = Math.min(leftValley, data[i]);
  }
  
  // Find right valley
  let rightValley = peakValue;
  for (let i = peakIndex + 1; i < data.length; i++) {
    if (data[i] > peakValue) break;
    rightValley = Math.min(rightValley, data[i]);
  }
  
  // Prominence is peak height above the higher valley
  const higherValley = Math.max(leftValley, rightValley);
  return peakValue - higherValley;
}

/**
 * Snap a click position to the nearest peak above threshold
 * @param clickPosition - position in percentage (0-100)
 * @param probData - probability data array
 * @param threshold - minimum prominence for a peak
 * @param maxSnapDistance - maximum distance to snap (percentage)
 * @returns snapped position or original if no peak nearby
 */
export function snapToNearestPeak(
  clickPosition: number,
  probData: number[],
  threshold: number,
  maxSnapDistance: number = 10
): { position: number; snapped: boolean; peak?: Peak } {
  const peaks = findLocalPeaks(probData, threshold);
  
  if (peaks.length === 0) {
    return { position: clickPosition, snapped: false };
  }
  
  // Find nearest peak within snap distance
  let nearestPeak: Peak | undefined;
  let minDistance = Infinity;
  
  for (const peak of peaks) {
    const distance = Math.abs(peak.position - clickPosition);
    if (distance < minDistance && distance <= maxSnapDistance) {
      minDistance = distance;
      nearestPeak = peak;
    }
  }
  
  if (nearestPeak) {
    return {
      position: nearestPeak.position,
      snapped: true,
      peak: nearestPeak,
    };
  }
  
  return { position: clickPosition, snapped: false };
}
