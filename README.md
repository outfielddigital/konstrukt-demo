# Konstrukt Demo
Demo of Konstrukt, the back office UI builder for Umbraco v9+

## About

This demo consists of a super minimal blog with a comments section on the blog post pages. The comments section consists of a form to submit a comment aswell as a list of all approved comments. In the back end code, there is an example surface controller to handle submitted comments and then the Konstrukt configuration to display these comments in 3 locations.

### Context App

Comments relevant to a blog post are displayed in context via a context app. In this app you can only see comments that are relevant to the given page.

### Dashboard

On the content section there is a new "Pending Comments" dashboard that lists comments with a `Pending` status. This could be used as a fast window to approve new comments.

### Section

A repositories section is added with a comments collection to allow full management of all comments regardless of which blog post they are associated with.

## How to use

Pull the source for the project and launch the `Konstrukt.Demo.Web` project. You can access the back office at `/umbraco` with admin credentials beign `admin@admin.com` / `password1234`.

## Requirements

The demo uses a SQL Local DB file for SQL 2019 so you'll need to make sure you have the 2019 LocalDB files installed. You can get these from the SQL Express 2019 installer (you don't need to install SQL Express 2019, it's just one of the install options). If you have multiple versions of LocalDB installed you might need to create a new Local DB instance

````
sqllocaldb create MSSQLLocalDb15 15.0
````

...and then update the connection string in the web project app settings.

````
"ConnectionStrings": {
    "umbracoDbDSN": "Data Source=(localdb)\\MSSQLLocalDB15;AttachDbFilename=|DataDirectory|\\Umbraco.mdf;Integrated Security=True"
},
````
