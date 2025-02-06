🚀 **Live Deployment:** [Click Here](https://sweeft-node.onrender.com)

Sweeft Node <br>

added company authentication routes (registration, verify, login), controllers, validations, and utilities

- implementation of company registration, login, and verification endpoints.
- added middleware for authentication.
- created utility functions for token generation and email sending.
- modified Prisma schema and add migration for company table.
- updated package files with new dependencies.

<br>
Recent Improvements <br>

Enhancements & Features<br>

Profile Controller: Added new profile controller for handling company-related routes: <br>
<br>
GET /about - Fetch company details.<br>
<br>
PATCH /update - Update company details.<br>
<br>
PUT /change-password - Change company password.<br>

<br>
Authentication Middleware:<br>
<br>
Handles JWT cookie parsing.<br>
<br>
Protects routes by verifying authentication.<br>
<br>
Rate Limiter:<br>
<br>
Added protection against brute-force attacks.<br>
<br>
Helps secure authentication endpoints<br>
<br>
TypeScript Type Definitions:<br>

-Declared global Request type for Express to include user object


- subscription system implemented  
- subscription schema added (prisma/schema.prisma)  
- subscription table migration created (prisma/migrations/20250202214533_add_subscription_table/)  
- subscription routes added (src/routes/subscription.routes.ts)  
- subscription controllers implemented (src/controllers/subscription/)  
- authentication middleware integrated for subscription routes  
- subscription logic includes Free, Basic, and Premium plans  
- user limits and pricing for Basic and Premium plans  
--downgrade / upgrade controllers created
<br>
<br>
- User schema added and updated in Prisma 
- user table migration created
- user route added 
- user controllers implemented (only for admins yet!)
- Admin role validation middleware added (only admin can add and delete )
- Email verification for new users implemented
- user addition and removal integrated with subscription tracking
- MOST IMPORTANT - during the company verification phase i assign the company Gmail account the ADMIN role and attach the FREE subscription plan
<br>
<br>

File management implemented:
-S3(aws) storage integration: implemented file uploading via S3 using multer and multer-S3 + file extension validations
-File model in database added
-New route for file created (only for users + userAuthMiddleware correctly implemented)
-controllers for the file  + router added