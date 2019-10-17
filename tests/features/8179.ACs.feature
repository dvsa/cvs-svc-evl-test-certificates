
Feature:  Valid Test Certificates Stubbed API for DVLA-EVL

  Scenario: AC1.1 Fetch all valid test certificates for today
    Given I am an API Consumer
    When I send a GET request to AWS_CVS_DOMAIN/evl-test-certificates
    Then the the system returns array of EvlTestCertificate stub data for today
    And the system returns an HTTP status code 200 OK