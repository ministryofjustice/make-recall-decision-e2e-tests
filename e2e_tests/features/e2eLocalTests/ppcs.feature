Feature: PPCS user journey

  Tests that check Task-list statuses

#  Background: Create pre-condition for PPCS user by creating a recommendation
#    Given a PO has created a recommendation to recall with:
#      | Indeterminate | No |
#      | Extended      | No |
#    And PO has created a Part A form without requesting SPO review with:
#      | RecallType          | STANDARD   |
#      | InCustody           | Yes Police |
#      | VictimContactScheme | No         |
#    And PO has requested an SPO to countersign
#    And SPO has visited the countersigning link
#    And SPO has recorded rationale
#    And SPO has countersigned after recording rationale
#    And SPO has requested ACO to countersign
#    And ACO has visited the countersigning link
#    And ACO has countersigned
#    When PO logs back in to download Part A

  @MRD-1972 @MRD-1970 @MRD-1971 @MRD-1969
  Scenario: PPCS user logs in and searches for a CRN
    Given PPCS logs in and searches by a CRN
    And the offender is found on PPUD
    When PPCS user checks booking details for the offender
    And selects the index offence
    And selects the matching index offence in PPUD
    Then PPCS user can book the offender in PPUD