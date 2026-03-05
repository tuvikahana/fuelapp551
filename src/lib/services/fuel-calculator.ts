import type { FuelStatus, FuelBand, ActionStatus, VehicleTypeParams } from '@/lib/types';

export function calculateFuelStatus(
  latestConfirmedOdometer: number | null,
  lastFullRefuelOdometer: number | null,
  params: VehicleTypeParams
): FuelStatus {
  const estimatedFullRangeKm = params.fuelTankCapacityLiters * params.estimatedKmPerLiter;

  if (latestConfirmedOdometer === null || lastFullRefuelOdometer === null) {
    return {
      distanceSinceRefuel: 0,
      estimatedFullRangeKm,
      estimatedRemainingRange: 0,
      estimatedRemainingPercentage: 0,
      fuelBand: 'רזרבה',
      actionStatus: 'לתדלק עכשיו',
      hasMissingBaseline: true,
    };
  }

  const distanceSinceRefuel = latestConfirmedOdometer - lastFullRefuelOdometer;
  const estimatedRemainingRange = Math.max(0, estimatedFullRangeKm - distanceSinceRefuel);
  const estimatedRemainingPercentage =
    estimatedFullRangeKm > 0
      ? Math.max(0, (estimatedRemainingRange / estimatedFullRangeKm) * 100)
      : 0;

  return {
    distanceSinceRefuel,
    estimatedFullRangeKm,
    estimatedRemainingRange: Math.round(estimatedRemainingRange),
    estimatedRemainingPercentage: Math.round(estimatedRemainingPercentage * 10) / 10,
    fuelBand: getFuelBand(estimatedRemainingPercentage, params),
    actionStatus: getActionStatus(estimatedRemainingPercentage, params),
    hasMissingBaseline: false,
  };
}

function getFuelBand(percentage: number, params: VehicleTypeParams): FuelBand {
  if (percentage >= params.fuelBandThreshold75) return 'מלא / כמעט מלא';
  if (percentage >= params.fuelBandThreshold50) return 'כ־3/4 מיכל';
  if (percentage >= params.fuelBandThreshold25) return 'כ־חצי מיכל';
  if (percentage >= params.fuelBandThreshold10) return 'כ־רבע מיכל';
  return 'רזרבה';
}

function getActionStatus(percentage: number, params: VehicleTypeParams): ActionStatus {
  if (percentage >= params.actionThresholdPlanRefuel) return 'תקין';
  if (percentage >= params.actionThresholdRefuelSoon) return 'להיערך לתדלוק';
  if (percentage >= params.actionThresholdRefuelNow) return 'לתדלק בקרוב';
  return 'לתדלק עכשיו';
}
