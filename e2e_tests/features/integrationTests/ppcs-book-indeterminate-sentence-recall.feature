Feature: e2e scenarios - Book a recall

  Scenario: PPCS user is able to book an Indeterminate sentence recall - default happy path test
    Given a recommendation exists for use in PPCS
    And the PPCS recommendation is submitted by a PO
    And the PPCS recommendation has had a recall decision recorded
    And the PPCS recommendation is counter-signed and downloaded
    When a PPCS user locates the existing recommendation ready to book
    And the user proceeds to book a INDETERMINATE sentence recall
    Then the INDETERMINATE booking reports successfully sent to PPUD