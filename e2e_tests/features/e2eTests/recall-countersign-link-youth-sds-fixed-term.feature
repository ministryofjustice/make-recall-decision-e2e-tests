@E2E
Feature: E2E scenarios - Recall
  Recall Test Scenarios where rationale is recorded while SPO is countersigning,
  countersigning task list accessed using the link sent by PO

  @MRD-1320 @MRD-1268 @MRD-1305 @MRD-1252 @MRD-1262 @MRD-1311
  @MRD-1276 @MRD-1391 @MRD-1391 @MRD-1327 @MRD-1449 @MRD-1465
  Scenario: PO records a YOUTH_SDS FIXED_TERM recall while countersigning
    Given a PO has created a recommendation to recall with:
      | SentenceGroup     | YOUTH_SDS |
      | LicenceConditions | All       |
      | AlternativesTried | Some      |
    And PO has created a Part A form without requesting SPO review with:
      | RecallType          | FIXED_TERM |
      | InCustody           | Yes Prison |
      | VictimContactScheme | Yes        |
      | Vulnerabilities     | Some       |
      | HasContrabandRisk   | No         |
      | EmergencyRecall     | Yes        |
    And PO requests an SPO to countersign
    And SPO has visited the countersigning link
    And SPO has recorded rationale
    And a confirmation of the decision is shown to SPO
    And SPO countersigns after recording rationale
    And a confirmation of the countersigning is shown to SPO
    When SPO requests ACO to countersign
    And ACO visits the countersigning link
    And ACO countersigns
    And a confirmation of the countersigning is shown to ACO
    When PO logs back in to update Recommendation
    Then PO can create Part A
    And PO can download Part A
    And Part A details are correct
    And the Last Completed Document tab has a link to download the latest Part-A document