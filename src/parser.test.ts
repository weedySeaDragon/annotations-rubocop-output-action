import parse from "./parser"
import Annotation from "./annotation"

import tempWrite from "temp-write"
import {promises as fs} from "fs"
import {resolve} from "path"
import {OffenseSeverity} from "./offense"

let malformedFilePath: string
let jsonFilePath: string

beforeAll(async () => {
  malformedFilePath = await tempWrite("yo", ".json")
  jsonFilePath = await tempWrite(`{
  "files": [
    {
      "path": "Gemfile",
      "offenses": [
        {
          "severity": "convention",
          "message": "Missing frozen string literal comment.",
          "cop_name": "Style/FrozenStringLiteralComment",
          "corrected": false,
          "correctable": true,
          "location": {
            "start_line": 1,
            "start_column": 1,
            "last_line": 1,
            "last_column": 1,
            "length": 1,
            "line": 1,
            "column": 1
          }
        }
      ]
    },{
      "path": "Gemfile.2",
      "offenses": [
        {
          "severity": "error",
          "message": "This is some error found in the file",
          "cop_name": "Bundler/OrderedGems",
          "corrected": false,
          "correctable": true,
          "location": {
            "start_line": 5,
            "start_column": 1,
            "last_line": 5,
            "last_column": 24,
            "length": 24,
            "line": 5,
            "column": 1
          }
        }
      ]
    },
    {
      "path": "app/controllers/users_controller.rb",
      "offenses": [
        {
          "severity": "convention",
          "message": "Metrics/MethodLength: Method has too many lines. [36/30]",
          "cop_name": "Metrics/MethodLength",
          "corrected": false,
          "location": {
            "start_line": 85,
            "start_column": 3,
            "last_line": 127,
            "last_column": 5,
            "length": 2033,
            "line": 85,
            "column": 3
          }
        }
      ]
    },
    {
      "path": "app/services/memberships/become_former_individual_member_actions.rb",
      "offenses": [
        {
          "severity": "warning",
          "message": "Lint/UnusedMethodArgument: Unused method argument - \`other_keyword_args\`. If it's necessary, use \`_\` or \`_other_keyword_args\` as an argument name to indicate that it won't be used.",
          "cop_name": "Lint/UnusedMethodArgument",
          "corrected": false,
          "location": {
            "start_line": 27,
            "start_column": 74,
            "last_line": 27,
            "last_column": 91,
            "length": 18,
            "line": 27,
            "column": 74
          }
        }
      ]
    }
  ]
}`)
})

afterAll(async () => {
  await fs.unlink(malformedFilePath)
  await fs.unlink(jsonFilePath)
})

it("fails with error when file is missing", async () => {
  try {
    await parse("asd")
  } catch (err) {
    const fullPath = resolve("asd")
    expect(err).toEqual(new Error(`File '${fullPath}' doesn't exist`))
  }
})

it("fails when json is invalid", async () => {
  try {
    await parse(malformedFilePath)
  } catch (err) {
    expect(err).toEqual(new Error("Mailformed JSON"))
  }
})

describe("valid json file", () => {
  it("parse offenses from all files", async () => {
    const annotations: Annotation[] = await parse(jsonFilePath)

    expect(annotations.length).toEqual(4)

    // expect(annotations[0].level).toEqual(OffenseSeverity.CONVENTION)
    expect(annotations[0].message).toEqual(
      "[Style/FrozenStringLiteralComment] Missing frozen string literal comment."
    )
    expect(annotations[0].properties.file).toEqual("Gemfile")
    expect(annotations[0].properties.line).toEqual(1)
    expect(annotations[0].properties.col).toEqual(1)

    expect(annotations[1].message).toEqual(
      "[Bundler/OrderedGems] This is some error found in the file"
    )
    expect(annotations[1].level).toEqual(OffenseSeverity.ERROR)
    expect(annotations[1].properties.file).toEqual("Gemfile.2")
    expect(annotations[1].properties.line).toEqual(5)
    expect(annotations[1].properties.col).toEqual(1)

    expect(annotations[2].message).toEqual(
      "[Metrics/MethodLength] Metrics/MethodLength: Method has too many lines. [36/30]"
    )
    expect(annotations[2].level).toEqual(OffenseSeverity.CONVENTION)
    expect(annotations[2].properties.file).toEqual(
      "app/controllers/users_controller.rb"
    )
    expect(annotations[2].properties.line).toEqual(85)
    expect(annotations[2].properties.col).toEqual(3)

    expect(annotations[3].message).toEqual(
      "[Lint/UnusedMethodArgument] Lint/UnusedMethodArgument: Unused method argument - `other_keyword_args`. If it's necessary, use `_` or `_other_keyword_args` as an argument name to indicate that it won't be used."
    )
    expect(annotations[3].level).toEqual(OffenseSeverity.WARNING)
    expect(annotations[3].properties.file).toEqual(
      "app/services/memberships/become_former_individual_member_actions.rb"
    )
    expect(annotations[3].properties.line).toEqual(27)
    expect(annotations[3].properties.col).toEqual(74)
    expect(annotations[3].properties.cop_name).toEqual(
      "Lint/UnusedMethodArgument"
    )
  })
})
