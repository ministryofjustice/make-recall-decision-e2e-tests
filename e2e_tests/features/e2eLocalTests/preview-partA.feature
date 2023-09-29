Feature: Preview Part A Document from the Task List

  Preview the Part A Document from the link shown on the Task List

  Scenario: Contact information section is present when PO tries to complete Part A task list
    Given a PO has created a recommendation to recall with:
      | Indeterminate     | No      |
      | Extended          | No      |
      | LicenceConditions | All     |
      | AlternativesTried | Some    |
    And PO has created a Part A form without requesting SPO review with:
      | RecallType          | STANDARD   |
      | InCustody           | Yes Police |
      | VictimContactScheme | No         |
    And the probation admin flag is turned on
    When PO has updated the Contact Information section
    And PO selects Preview Part A option
    And PO downloads Part A document for Preview
    And PO can download preview of Part A
    Then Part A details are correct