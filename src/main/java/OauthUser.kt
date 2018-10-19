import javax.servlet.http.HttpServletResponse

/**
 * This class contains shared logic for Google and Github Oauth Users
 */
class OauthUser {
    companion object {
        /**
         * Create a new Session for the user given their email address
         * Registers the user if not already registered
         */
        fun registerAndCreateSession(userEmail: String, response: HttpServletResponse, logger: (String) -> Unit) {
            // Register the user if not already registered
            var user = DatabaseConnector.getUserByEmail(userEmail)
            if (user == null) {
                if (!DatabaseConnector.createNewUser(userEmail, "", "", false)) {
                    response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR)
                    logger("OAUTH_USER_ERROR: failed to create new user with email: $userEmail")
                    return
                }

                user = DatabaseConnector.getUserByEmail(userEmail)
                if (user == null) {
                    response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR)
                    logger("OAUTH_USER_ERROR: failed to get newly created user: $userEmail")
                    return
                }
            }

            // The email has been authenticated and registered create a new user session
            if (!SessionManager.createSession(user, response)) {
                response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR)
                logger("OAUTH_USER_ERROR: failed to create new user session")
                return
            }

            // Success
            response.sendRedirect("/endless-eddies")
        }
    }
}
