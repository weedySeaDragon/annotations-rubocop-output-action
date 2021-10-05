export enum OffenseSeverity {
  CONVENTION = "convention",
  WARNING = "warning",
  ERROR = "error"
}

export type OffenseLocation = {
  column: number
  line: number
}

class Offense {
  severity: OffenseSeverity = OffenseSeverity.ERROR
  cop_name: String = ""
  message: String = ""
  location: OffenseLocation

  constructor(
    severity: OffenseSeverity,
    cop_name: "",
    message: "",
    location: OffenseLocation
  ) {
    this.severity = severity
    this.cop_name = cop_name
    this.message = message
    this.location = location
  }
}

export default Offense
