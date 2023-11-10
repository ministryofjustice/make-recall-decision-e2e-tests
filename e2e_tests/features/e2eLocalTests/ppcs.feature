Feature: PPCS user journey

  Tests that validates PPCS user journey

  Background: Create pre-condition for PPCS user by creating a recommendation
    Given a PO has created a recommendation to recall with:
      | Indeterminate | No |
      | Extended      | No |
    And PO has created a Part A form without requesting SPO review with:
      | RecallType          | STANDARD   |
      | InCustody           | Yes Police |
      | VictimContactScheme | No         |
    And PO requests an SPO to countersign
    And SPO has visited the countersigning link
    And SPO countersigns without recording rationale
    And SPO requests ACO to countersign
    And ACO visits the countersigning link
    And ACO countersigns
    And PO has logged in and downloaded Part A

  @MRD-1972 @MRD-1970 @MRD-1971 @MRD-1969
  Scenario: PPCS user logs in and searches for a CRN
    Given PPCS logs in and searches by a CRN
