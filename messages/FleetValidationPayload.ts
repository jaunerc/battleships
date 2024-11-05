export type ValidationResult = 'passed' | 'overlapping_ships' | 'no_distance_between_ships'

export interface FleetValidationPayload {
    validationResult: ValidationResult
}