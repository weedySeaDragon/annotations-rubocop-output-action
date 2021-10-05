import Annotation from "./annotation"
import {OffenseSeverity} from "./offense"

import {mockProcessStdout} from "jest-mock-process"

interface RestoresMock {
  mockRestore(): void
}

let mockStdout: RestoresMock

beforeEach(() => {
  mockStdout = mockProcessStdout()
})
afterEach(() => {
  mockStdout.mockRestore()
})

//  Example
// "files": [
//   {
//       "path": "app/controllers/users_controller.rb",
//       "offenses": [
//         {
//           "severity": "convention",
//           "message": "Metrics/MethodLength: Method has too many lines. [36/30]",
//           "cop_name": "Metrics/MethodLength",
//           "corrected": false,
//           "location": {
//             "start_line": 85,
//             "start_column": 3,
//             "last_line": 127,
//             "last_column": 5,
//             "length": 2033,
//             "line": 85,
//             "column": 3
//           }
//         }
//       ]
//     },
// ]

describe(".write", () => {
  test("with message only", () => {
    const annotation = new Annotation(OffenseSeverity.ERROR, "offense message")
    annotation.write()

    expect(mockStdout).toHaveBeenCalledWith("::error::offense message\n")
  })
  test("with file", () => {
    const annotation = new Annotation(
      OffenseSeverity.ERROR,
      "offense message",
      {file: "file.rb"}
    )
    annotation.write()

    expect(mockStdout).toHaveBeenCalledWith(
      "::error file=file.rb::offense message\n"
    )
  })
  test("with line", () => {
    const annotation = new Annotation(
      OffenseSeverity.ERROR,
      "offense message",
      {line: 1}
    )
    annotation.write()

    expect(mockStdout).toHaveBeenCalledWith("::error line=1::offense message\n")
  })

  test("with col", () => {
    const annotation = new Annotation(
      OffenseSeverity.ERROR,
      "offense message",
      {col: 1}
    )
    annotation.write()

    expect(mockStdout).toHaveBeenCalledWith("::error col=1::offense message\n")
  })

  test("with warning level", () => {
    const annotation = new Annotation(OffenseSeverity.WARNING, "is a warning")
    annotation.write()

    expect(mockStdout).toHaveBeenCalledWith("::warning::is a warning\n")
  })

  test("with convention level", () => {
    const annotation = new Annotation(
      OffenseSeverity.CONVENTION,
      "This is a convention offense"
    )
    annotation.write()

    expect(mockStdout).toHaveBeenCalledWith(
      "::convention::This is a convention offense\n"
    )
  })

  test("with cop_name", () => {
    const annotation = new Annotation(
      OffenseSeverity.CONVENTION,
      "This is a convention offense",
      {cop_name: "SomeRubocopCop"}
    )
    annotation.write()

    expect(mockStdout).toHaveBeenCalledWith(
      "::convention cop_name=SomeRubocopCop::This is a convention offense\n"
    )
  })

  test("with everything", () => {
    const annotation = new Annotation(
      OffenseSeverity.WARNING,
      "offense message",
      {file: "file.rb", line: 1, col: 1, cop_name: "BoboCop"}
    )
    annotation.write()

    expect(mockStdout).toHaveBeenCalledWith(
      "::warning file=file.rb,line=1,col=1,cop_name=BoboCop::offense message\n"
    )
  })
})
