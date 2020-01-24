# Authentication-Related Information

In order to access the Canvas API, an OAuth2 Token is needed. 

[This link](https://canvas.instructure.com/doc/api/file.oauth.html) contains information on the whole OAuth2 authentication workflow, and this document will include a simplified version of it.

## Backend Development: Simplified Workflow

The whole OAuth2 workflow is not required if the application is only used by very few people/one person, i.e. during development. These are the steps required to make an API call with the simplified workflow:

* Click on "Profile" on the sidebar, then click on "Settings"
* Under "Approved Integrations", click on "New Access Token"
* Enter Purpose and Expiry Date if applies, then click on "Generate Token"
* Note down the token generated for future use
* Include token in POST requests as an Authorization Header (Bearer Token)

## Authentication: Proper Workflow

This is the proper workflow required for an application to be used by users. 

**Note: Developer token from Admin is needed in order to proceed**
