

-----SETUP-----
1. Use the EDIT.env files to enter your environment variables. For this project I made the assumption Dunkin Donuts is already onboarded as an entity so all
    we have to do is provide the entity id
2. In the EDIT.env file enter your api key and then rename this file to just .env

Hi welcome to my project!

I am Lindsey Myers, a software developer with one year of experience at Visa on the B2B Payables Automation team, automating the B2B payment flow.
Most of my experience is in Java using the Spring Framework so developing this project in Node.js, Express.js, and React.js was a challenge for me
that pushed me to learn a lot about these stacks in a short amount of time. I developed this in my freetime (after work) so some of this code is rushed
and could use a later refactoring.

The biggest challenge for me in this project was working with asynchronous functions, this was something I was familiar with but did not have much 
experience with prior. Going forward, I would like to learn more about asynchronous functions at a deeper level so in the future I can write them
more efficiently and take advantage of their performance boosts.

A design choice I made in this project was to aggregate all of the payments that were being made from the same source account to the same destination 
account. This is a similar thing we do in our B2B payments system at Visa (reduces a lot of work), and this reduces the amount of api calls we would have to make in this project. It is also important in payments to never use a float type to hold currency amounts, so I avoided this by using the Dinero library and converting the values to 
strings. 

Backend: The backend is reliant on the local file system in this implementation. I made this decision so that I could develop this project quicker and also
maintain the files for auditing reasons. Preferably, I would set up a S3 bucket (all sensitive information masked) and keep my files there or use another kind of datastore (mongodb would work!). There are three stages to this payment processing flow: 
    1. payments are loaded into the system and a file id is assigned (for tracking)
    2. caches are loaded (in cases like where source accounts, and merchant ids are commonly accessed
       and does not take up too much in memory space), then individual entities are created with their liabilities linked on the fly.
       The staging data is then written to a .csv for an intermediatory stage
    3. payments are processed using staging data written to the csv file from the previous step. as the payments are processed they 
        are then written to a final payments csv file with processing data
    4. (reports) if a report is initiated => the final payment processing file loaded and the report is generated based on branch,
        source account, or all accounts
File ids are used to keep track of the data, this could be better replaced by taking advantage of a data store to handle this processing
instead of the local file system. Another way to improve the system (yes I know this is slow) would be to use a data store for data that 
will be routinely accessed, this could be employees and their linked liabilities that are paid every two weeks. This way, we no longer 
have to create a new entity and link their liability every time, but instead do it once and reuse thier entity and liability for other
payments in the future. This also improves the trackability of payments over time and speeds up our processing by reducing api calls.
I can also speed up the proccessing by processing payments in parallel but this requires me to be cautious about memory and cpu usage.

Frontend: The frontend is simplistic and there could be some enhancements here to display data in a more meaningful way. The user will
start by viewing a table with all of their previous files that have been processed (currently persisting this in the local file system).
Each of these files will have an assigned file id which is part of the file name.
From there they can upload a file to be staged or view their previous files. Uploading a file will initiate the staging process and 
the file will be displayed as loading. Once the staging is complete the user will need to refresh their browser to see that the file
has been staged (this could be more responsive). The user can then click on their staged file and choose to reject or initiating payment
processing. Processing the payments is slower than staging so this will take some time (I would really like to speed this up in the future).
Then the user will have to comeback and refresh their page to see if the file has completed processing. Then they will see the amount of payments
rejected or successfully processed along with the first 50 payments. The user can then also download three reports (all, branch, account).