# Annotations from Rubocop Output Action
A Github action that creates annotations are created for errors, warnings, and convention offenses in a JSON Rubocp output file.

_Based on https://github.com/duderman/rubocop-annotate-action_


### Why process Rubocop output intead of running an action that both runs Rubocop _and_ generates annotations?

**You can run _any_ version of Rubocop with _any_ configuration you like, with _any_ plugins, 
   and _any_ version of Ruby**

All this action cares about is that you have a JSON file that is full of Rubocop output.

## Inputs

### `rubocop.json`

- **Required** 
- The name of the JSON file that will be parsed.
- Default `rubocop.json`.


## Example Usage

```yml
name: Rubocop

on: push

jobs:
  rubocop:
    name: Rubocop
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-ruby@v1
        with:
          ruby-version: '2.7'
      - run: gem install rubocop --no-doc
      
      - name: Run Rubocop and create a JSON output file named "rubocop.json"
        run: rubocop --format progress --format json --out rubocop.json
        
      - name: Create annotations from Rubocop offenses found in rubocop.json if there is a failure in the steps above  
        uses: weedySeaDragon/rubocop-annotate-action@v0.1.0
        with:
          path: rubocop.json
        if: ${{ failure() }}
```
