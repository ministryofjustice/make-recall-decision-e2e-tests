Feature: e2e scenarios - Book a recall

  Scenario: PPCS user is able to book a determinate sentence recall - default happy path test
    Given a recommendation exists for use in PPCS
    And the PPCS recommendation is submitted by a PO
    And the PPCS recommendation has had a recall decision recorded
    And the PPCS recommendation is counter-signed and downloaded
    When a PPCS user locates the existing recommendation ready to book
    And the user proceeds to book a new determinate sentence recall
    Then the determinate booking reports successfully sent to PPUD