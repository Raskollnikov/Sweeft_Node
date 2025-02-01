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

-Declared global Request type for Express to include user object:<br>
<br>
import { Request } from 'express';<br>
declare global {<br>
    namespace Express {<br>
        interface Request {<br>
            user?: {<br>
                companyId: string;<br>
                email: string;<br>
            };<br>
        }<br>
    }<br>
}<br>
