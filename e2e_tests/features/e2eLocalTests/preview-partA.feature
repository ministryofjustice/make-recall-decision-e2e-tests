Feature: Contact Information section on the Task List

  Contact Information is present on Part A Task List

  @MRD-1723 @MRD-1731 @MRD-1756
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
    Then the PO task-list has the following status:
      | WhoCompletedPartA      | Completed |
      | PractitionerForPartA   | Completed |
      | RevocationContact      | Completed |
      | PpcsQueryEmails        | Completed |