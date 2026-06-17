# E2E tests

[![Ministry of Justice Repository Compliance Badge](https://github-community.service.justice.gov.uk/repository-standards/api/make-recall-decision-e2e-tests/badge?style=flat)](https://github-community.service.justice.gov.uk/repository-standards/make-recall-decision-e2e-tests)

[![GitHub Actions](https://github.com/ministryofjustice/make-recall-decision-e2e-tests/actions/workflows/pipeline.yml/badge.svg)](https://github.com/ministryofjustice/make-recall-decision-ui)

This repo is for the e2e tests for Make Recall Decision Project. They run using Cypress.

There's a HMPPS dev 'community of practice' talk on [how the E2E tests are set up](https://justiceuk.sharepoint.com/:v:/r/sites/HMPPSDeveloperCommunityofPractice/Shared%20Documents/COP%20Recordings/HMPPS%20Dev%20CoP_%20lightning%20talks%20(2022-09-07%2015_03%20GMT+3)%20(1).mp4?csf=1&web=1&e=XtIcxp&nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJTdHJlYW1XZWJBcHAiLCJyZWZlcnJhbFZpZXciOiJTaGFyZURpYWxvZy1MaW5rIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXcifX0%3D).

## Run E2E tests against local containers

All dependencies will be mocked, including upstream APIs used by make-recall-decision-api, and HMPPS Auth.

Create a copy of the [.env.local.sample](./.env.local.sample) and rename it to `.env`.

Run the following command two in the root of the project from `make-recall-decision-ui` project. It will start `make-recall-decision-api` and other dependencies required for this service:

```
./scripts/start-services-for-e2e-tests-local.sh
```

```
npm run start:e2e
```

Now from the E2E test repo, Open Cypress, from there you can run the tests:
```
npm run e2e-ui
```

### Parameter supported
The following parameters can be passed during a test run
- `TAGS`: Cucumber tag expression can be passed to restrict the scenarios that get run in a test run
- `ENV`: environment where you want to run the tests, e.g. `dev` or `preprod`. If nothing is passed tests are run on
  local instance.

#### Passing parameters
To pass any parameter to tests, use the `--env` param of cypress, e.g.
```
npm run e2e-ui -- --env TAGS='@E2E and not @ignore',ENV=dev
```

## E2E Tests on GitHub Actions

E2E tests are not run on a feature branch; only unit, integration and accessibility tests are run. Once a feature branch
is merged into `main`, the E2E tests are run both locally and against the `dev` environment (after deployment). The user
credentials used to log into the service are stored as [environment variables in GitHub](https://github.com/ministryofjustice/make-recall-decision-ui/settings/secrets/actions) called
`DEV_USERNAME_PO`, `DEV_PASSWORD_PO`, `DEV_USERNAME_SPO`, `DEV_PASSWORD_SPO`,`DEV_USERNAME_ACO`, `DEV_PASSWORD_ACO`,
`DEV_USERNAME_PPCS` and `DEV_PASSWORD_PPCS`.

### Running E2E tests on GitHub Actions on demand

The E2E test can be run manually on `dev` from either [the UI Pipeline](https://github.com/ministryofjustice/make-recall-decision-ui/actions/workflows/e2e_dev_tests.yml)
or [the e2e tests Pipeline](https://github.com/ministryofjustice/make-recall-decision-e2e-tests/actions/workflows/pipeline.yml) pages

To run the tests:
1. Click on the **Run workflow** button (in the row above the one listing the latest run of the workflow)
2. Select the branch you want the tests run for (only branches of the repository you're checking from are available)
3. Click on the **Run workflow** button.

If a test fails, open the workflow run and scroll down beyond the pipeline graph. You should see a report with the
results. For more details, you can click on the failed workflow and expand the 'Upload X' steps. Each one should include
a link to download the relevant artifact. There should be such steps for screenshots, videos, test logs and JUnit
results of the failed workflow.

## Running E2E tests locally against the service deployed on dev

You can run the E2E tests in your local repo against dev. Useful in case the GitHub Actions tests are failing and you
want to reproduce the issue locally.

You can run your local tests against dev env using:

```
npx cypress open --env USERNAME=<username>,PASSWORD=<password>,USERNAME_SPO=<username_spo>,PASSWORD_SPO=<password_spo>,USERNAME_ACO=<username_aco>,PASSWORD_ACO=<password_aco>,ENV=dev --config-file e2e_tests/cypress.config.ts --config baseUrl=https://make-recall-decision-dev.hmpps.service.justice.gov.uk
```

With params replaced as follows:
- USERNAME - your Delius username for `dev`
- PASSWORD - your Delius password for `dev`
- USERNAME_SPO - the SPO username set up for the team, which you can get from a team member or the team's 1Password vault
- PASSWORD_SPO - the SPO password set up for the team, which you can get from a team member or the team's 1Password vault
- USERNAME_ACO - the ACO username set up for the team, which you can get from a team member or the team's 1Password vault
- PASSWORD_ACO - the ACO password set up for the team, which you can get from a team member or the team's 1Password vault
