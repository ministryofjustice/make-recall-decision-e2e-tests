#!/bin/bash
set -euo pipefail

# Ensure these are all still being used

readonly UI_NAME=make-recall-decision-ui
readonly API_NAME=make-recall-decision-api
readonly AUTH_NAME=hmpps-auth

# readonly AUTH_DIR="${SCRIPT_DIR}/../../${AUTH_NAME}"
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly UI_DIR="${SCRIPT_DIR}/../../${UI_NAME}"
readonly API_DIR="${SCRIPT_DIR}/../../${API_NAME}"

printf "\n\nRunning 'docker compose pull' on all services...\n\n"
docker compose -f "${UI_DIR}/docker-compose.yml" pull
docker compose -f "${API_DIR}/docker-compose.yml" pull

pushd "${API_DIR}"
printf "\n\nBuilding/starting API components...\n\n"
export SPRING_PROFILES_ACTIVE=dev,seed-test-data
# temporary, in order to test the new tamplate in the ftr56 branch. Should be undone once FTR56 is released.
export DOCUMENTTEMPLATE_PARTATEMPLATESETTINGS_0_STARTDATETIME: "2025-08-20T23:00Z" # 2025-08-21T00:00Z in BST, bring forward dev for testing
export DOCUMENTTEMPLATE_PARTATEMPLATESETTINGS_0_TEMPLATENAME: "2025-09-02 - FTR48 Phase 1"
export DOCUMENTTEMPLATE_PARTATEMPLATESETTINGS_1_STARTDATETIME: "2026-01-28T00:00Z" # same time in GMT
export DOCUMENTTEMPLATE_PARTATEMPLATESETTINGS_1_TEMPLATENAME: "2026-02-02 - Risk to self"
export DOCUMENTTEMPLATE_PARTATEMPLATESETTINGS_2_STARTDATETIME: "2026-03-23T00:00Z" # same time in GMT, brought forward for testing in FTR56 e2e branch
export DOCUMENTTEMPLATE_PARTATEMPLATESETTINGS_2_TEMPLATENAME: "2026-03-31 - FTR56"
export POSTGRES_OPTIONS=sslmode=disable
docker compose build
docker compose up -d
popd

pushd "${UI_DIR}"
printf "\n\nBuilding/starting UI components...\n\n"
export FEATURE_FLAGFTR56ENABLED=2026-03-13T00:00Z # remove once FTR56 is released
docker compose build
docker compose up -d
popd

function wait_for {
  printf "\n\nWaiting for %s to be ready.\n\n" "${2}"
  docker run --rm --network host docker.io/jwilder/dockerize -wait "${1}" -wait-retry-interval 2s -timeout 120s
}

wait_for "http://localhost:9090/auth/health/ping" "${AUTH_NAME}"
wait_for "http://localhost:3000/ping" "${UI_NAME}"
wait_for "http://localhost:8080/health/readiness" "${API_NAME}"

printf "\n\nAll services are ready.\n\n"