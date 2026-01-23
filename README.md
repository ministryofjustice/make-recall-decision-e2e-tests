# E2E tests

[![Ministry of Justice Repository Compliance Badge](https://github-community.service.justice.gov.uk/repository-standards/api/make-recall-decision-e2e-tests/badge?style=flat)](https://github-community.service.justice.gov.uk/repository-standards/make-recall-decision-e2e-tests)

This repo is for the e2e tests for Make Recall Decision Project. They run using Cypress.

There's a HMPPS dev 'community of practice' talk on [how the E2E tests are set up](https://drive.google.com/file/d/1OeekvkViazrYNJXGMZrlM8UZU-Z71x6X/view).

## Run E2E tests against local containers

All dependencies will be mocked, including upstream APIs used by make-recall-decision-api, and HMPPS Auth.

Set the `CYPRESS_PASSWORD`, `CYPRESS_PASSWORD_SPO` and `CYPRESS_PASSWORD_ACO` env vars in the [.env.local.sample](./.env.local.sample) file and copy it as `.env`.
The passwords can be obtained from the `CYPRESS_PASSWORD_local`, `CYPRESS_PASSWORD_SPO_local` and `CYPRESS_PASSWORD_ACO_local` env vars in [CircleCi](https://app.circleci.com/settings/project/github/ministryofjustice/make-recall-decision-ui/environment-variables)

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
- `ENV`: environment where you want to run the tests, e.g. `dev` or `preprod`. If nothing is passed tests are run on local instance.

#### Passing parameters
To pass any parameter to tests, use the `--env` param of cypress, e.g.
```
npm run e2e-ui -- --env TAGS='@E2E and not @ignore',ENV=dev
```

## E2E Tests on CircleCI

E2E tests are not run on a feature branch, only unit, integration and accessibility tests are run. Once a feature branch is merged into `main`, the E2E tests are ran against the `dev` environments after deployment. The user credentials they use to log into the service are stored as [environment variables (in CircleCI)](https://app.circleci.com/settings/project/github/ministryofjustice/make-recall-decision-ui/environment-variables) called `CYPRESS_USERNAME_PO<environment>`, `CYPRESS_PASSWORD_PO<environment>`, `CYPRESS_USERNAME_SPO_<environment>`, `CYPRESS_PASSWORD_SPO_<environment>`,`CYPRESS_USERNAME_ACO_<environment>`, `CYPRESS_PASSWORD_ACO_<environment>`,`CYPRESS_USERNAME_PPCS_<environment>`, `CYPRESS_PASSWORD_PPCS_<environment>`.

### Running E2E tests on CircleCI on demand

The E2E test can be run manually on `dev` from the [Pipeline](https://app.circleci.com/pipelines/github/ministryofjustice/make-recall-decision-ui?branch=main) page

To run the tests:
1. Click on **Trigger Pipeline** button
2. Click on **Add another parameter** button
3. Select `boolean` in **Parameter type** dropdown
4. Enter `e2e-check-dev` in **Name** field
5. Select `true` in the **Value** field
6. If you want to override the cucumber tags you can add another string parameter called `e2e-tags` and enter a valid cucumber tag expression, .e.g. `@E2E and not @ignore` without any quotes. This is optional, if not passed it defaults to `@E2E` when running on `dev`.

If a test fails, look under the **ARTIFACTS** tab for the CircleCI job to see a screenshot, video and logs of the failed step.

## Running E2E tests locally against the service deployed on dev or preprod

You can run the E2E tests in your local repo against dev or preprod env. Useful in case the CircleCI tests are failing and you want to reproduce the issue locally.

You can run your local tests against dev env using:

```
npx cypress open --env USERNAME=<username>,PASSWORD=<password>,USERNAME_SPO=<username_spo>,PASSWORD_SPO=<password_spo>,USERNAME_ACO=<username_aco>,PASSWORD_ACO=<password_aco>,ENV=dev --config-file e2e_tests/cypress.config.ts --config baseUrl=https://make-recall-decision-dev.hmpps.service.justice.gov.uk
```

With params replaced as follows:
- USERNAME - your Delius username for `dev`
- PASSWORD - your Delius password for `dev`
- USERNAME_SPO - the value of the `CYPRESS_USERNAME_SPO_dev` env var in [CircleCi](https://app.circleci.com/settings/project/github/ministryofjustice/make-recall-decision-ui/environment-variables)
- PASSWORD_SPO - the value of the `CYPRESS_PASSWORD_SPO_dev` env var in [CircleCi](https://app.circleci.com/settings/project/github/ministryofjustice/make-recall-decision-ui/environment-variables)
- USERNAME_ACO - the value of the `CYPRESS_USERNAME_ACO_dev` env var in [CircleCi](https://app.circleci.com/settings/project/github/ministryofjustice/make-recall-decision-ui/environment-variables)
- PASSWORD_ACO - the value of the `CYPRESS_PASSWORD_ACO_dev` env var in [CircleCi](https://app.circleci.com/settings/project/github/ministryofjustice/make-recall-decision-ui/environment-variables)

## Visual Regression Testing

Cypress allows for visual regression testing, this will take a series of "base" screenshots and then compare on further runs. Given that the screenshots currently contain data - albeit test data - which we may not want publicly available, visual regression is not currently monitored in the CI Pipelines and can only be run locally. As a result the base screenshots will have to be generated locally first.

**Please note, there are 2 sets of screenshots being captured by the e2e app: one for reporting purposes, the other for regression testing. This section of the readme only deals with files under the `e2e_tests/visualRegression` folder**

### Generating base screenshots

In order to generate the base screenshots, you must first run the existing UI app with no changes locally using the usual method. You can then run the following command:

```
npm run e2e:vrt:update
```

This should populate the folder `e2e_tests/visualRegression` with the required base screenshots taking during that test run.

### Comparing changes to base screenshots

Once your base snapshots are in place you can actually perform the visual regression testing. First make your changes, and then run the following command:

```
npm run e2e:vrt
```

This should throw warnings when the visual differences between the base screenshots and the new screenshots are significantly different. The CLI version will throw up what screens are different and pop a visual diff in the `e2e_tests/visualRegression/diff` folder, but these can be difficult to interpret, so it's generally better to find out which are causing errors and check them in the UI where the two can be compared with a user-friendly interface.

### Configuring the difference threshold

You can configure the threshold for the visual differences in the `e2e_tests/support/commands.ts` file:

```
addCompareSnapshotCommand({
    capture: 'fullPage',
    errorThreshold: 0.05,
})
```

at present the threshold is set to `0.05` as changes from things like UI library updates will be relatively small, but if you're getting a lot of false positives you can up this. The default is `0.1`.

### VRT: Todos
There are 2 improvements which could be made when time is less tight: 
- **Rename the screenshots to something more meaningful:** At present the screenshots names are fairly generic, named after the test and then a number. Whilst this allows for finding the location in the testing code easily, it's not particularly descriptive and the compareScreenshot commands could be   
- **Redact sensitive information so this can run in CI pipelines:** As mentioned above, this whole process is currently manual and can be time consuming due to the fact that the MoJ repos are publicly accessible and we don't want to give away potentially sensitive information. This can be fixed by overwriting the compareSnapshots commmand and having it blank out specific HTML elements before taking the screenshot, but this will be a lengthy process as it goes through every possible screen in CaR. An example of this can be found in the Risk Assessment repo: https://github.com/ministryofjustice/hmpps-risk-assessment-ui/blob/main/integration_tests/support/index.js