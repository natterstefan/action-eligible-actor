# action-eligible-actor

> Execute a GitHub Action only if the (triggering) actor is eligible (=authorised) to do so.

## Usage

Instead of adding

```yml
if: ${{ github.actor == 'username' }}
```

to individual workflows and steps, use this action to standardize and easily
manage which actor can perform which workflow.

```yml
# Setup Workflow
- name: Is eligible Actor?
  id: eligibleActor
  uses: ./
  with:
    rulesFile: 'eligible-actors-rules.json'
    ruleId: 1

## Use output
- name: Test
  env:
    IS_ELIGIBLE_ACTOR: ${{steps.eligibleActor.outputs.isEligibleActor}}
  run: |
    echo "action-eligible-actor outputs:"
    echo "$IS_ELIGIBLE_ACTOR"
```

### Example `rulesFile`

```json
[
  {
    "id": "1",
    "description": "Only repo owner and act",
    "eligibleActors": ["natterstefan", "nektos/act"],
    "failureMessage": "Only the repo owner and the actor of https://github.com/nektos/act can do this!",
    "failSilently": true
  }
]
```

## Development

> First, you'll need to have a reasonably modern version of `node` handy. This
> won't work with versions older than 16, for instance.

Install the dependencies

```bash
npm install
```

Build the package for distribution

```bash
# package the source files
npm run package
# afterward create a release with the release GitHub action
```

Run the tests

```bash
npm run package # or npm run dev (watch mode)
npm test
```

Test the workflow locally with <https://github.com/nektos/act>!

```bash
npm run package # or npm run dev (watch mode)
act -j testNoFail && act -j testFail
```

### LICENSE

[MIT](LICENSE)

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://natterstefan.me/"><img src="https://avatars.githubusercontent.com/u/1043668?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Stefan Natter</b></sub></a><br /><a href="#ideas-natterstefan" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/natterstefan/action-eligible-actor/commits?author=natterstefan" title="Code">💻</a> <a href="https://github.com/natterstefan/action-eligible-actor/commits?author=natterstefan" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
