Feature: Accepting terms

  As a As user who is in registration process
  I want to see if a user must accept terms
  In order to enter the website
  
  Background:
    Given the user is logged in
    Given invitation key exsists
    
  Scenario: I should see enter invitation code page
    Then I should see the words "Beta testing" and "Please enter your invitation code to continue, or request an invitation"
    
  Scenario: I should be lead to terms page when I enter the invitation
    Then I fill in active invitation
    And I press "Submit"
    Then I should see "TERMS AND CONDITIONS"

  Scenario: I should be able to decline terms
    Then I fill in active invitation
    And I press "Submit"
    Then I should see the words "TERMS AND CONDITIONS"
    Then I follow "Reject"

  Scenario: I should be able to accept terms
    Then I fill in active invitation
    And I press "Submit"
    Then I should see the words "TERMS AND CONDITIONS"
    When I follow "Accept"
    Then I should see "Important Information about sharedearth.net"
    
  Scenario: I should be able to decline terms of use
    Then I fill in active invitation
    And I press "Submit"
    Then I should see the words "TERMS AND CONDITIONS"
    When I follow "Accept"
    Then I should see "Important Information about sharedearth.net"
    When I follow "No thanks"
    Then I should see the words "Welcome" and "Connect"