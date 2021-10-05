import {issueCommand} from "@actions/core/lib/command"
import {OffenseSeverity} from "./offense"

export interface AnnotationProperties {
  file?: String
  line?: Number
  col?: Number
  cop_name?: String
}

class Annotation {
  message: string
  level: OffenseSeverity = OffenseSeverity.ERROR
  properties: AnnotationProperties

  constructor(
    level: OffenseSeverity,
    message: string,
    properties: AnnotationProperties = {}
  ) {
    this.level = level
    this.message = message
    this.properties = properties
  }

  write(): void {
    issueCommand(this.level, this.properties, this.message)
  }
}

export default Annotation
