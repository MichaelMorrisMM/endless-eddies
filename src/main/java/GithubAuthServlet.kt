import okhttp3.HttpUrl
import org.apache.commons.lang3.RandomStringUtils
import javax.servlet.annotation.WebServlet
import javax.servlet.http.HttpServlet
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse
import java.io.IOException

@WebServlet("/github-login")
class GithubSetupServlet : HttpServlet() {

    @Throws(IOException::class)
    override fun doGet(request: HttpServletRequest, response: HttpServletResponse) {
        val githubState = RandomStringUtils.randomAlphanumeric(32)

        request.session.setAttribute(Github.STATE_KEY, githubState)

        response.sendRedirect(
            HttpUrl.Builder()
                .scheme(Github.API_URL_SCHEME)
                .host(Github.API_URL_HOSTNAME)
                .addPathSegments(Github.API_URL_OAUTH_AUTHORIZE_PATH)
                .addQueryParameter(Github.CLIENT_ID_KEY, System.getenv(Github.CLIENT_ID_ENV_KEY))
                .addQueryParameter(Github.SCOPE_KEY, Github.USER_EMAIL_SCOPE)
                .addQueryParameter(Github.STATE_KEY, githubState)
                .build()
                .toString()
        )
    }
}

@WebServlet("/github-callback")
class GithubAuthServlet : HttpServlet() {

    @Throws(IOException::class)
    override fun doGet(request: HttpServletRequest, response: HttpServletResponse) {

        // To prevent cross-site forgery the state parameter must have been set by /github-setup
        val sessionState = request.session.getAttribute(Github.STATE_KEY)
        if (sessionState !is String) {
            response.sendError(HttpServletResponse.SC_PRECONDITION_FAILED)
            servletContext.log("GITHUB_CALLBACK_ERROR: missing session state parameter")
            return
        }

        // The session `state` must match the github `state`
        val githubState = request.getParameter(Github.STATE_KEY)
        if (githubState == null || githubState != sessionState) {
            response.sendError(HttpServletResponse.SC_PRECONDITION_FAILED)
            servletContext.log(
                "GITHUB_CALLBACK_ERROR: unequal states: github state: '$githubState', session state: '$sessionState'"
            )
            return
        }

        // Github must have returned a code to exchange for an access token
        val githubCode = request.getParameter(Github.CODE_KEY)
        if (githubCode == null || githubCode.isEmpty()) {
            response.sendError(HttpServletResponse.SC_PRECONDITION_FAILED)
            servletContext.log("GITHUB_CALLBACK_ERROR: null or empty github code")
            return
        }

        val userAccessToken = Github.getUserAccessToken(githubCode)
        val userEmail = Github.getUserPrimaryEmail(userAccessToken)

        // Register the user if not already registered
        var user = DatabaseConnector.getUserByEmail(userEmail)
        if (user == null) {
            if (!DatabaseConnector.createNewUser(userEmail, "", "", false)) {
                response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR)
                servletContext.log("GITHUB_CALLBACK_ERROR: failed to create new user with github email: $userEmail")
                return
            }

            user = DatabaseConnector.getUserByEmail(userEmail)
            if (user == null) {
                response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR)
                servletContext.log("GITHUB_CALLBACK_ERROR: failed to get newly created user: $userEmail")
                return
            }
        }

        // The email has been authenticated and registered create a new user session
        if (!SessionManager.createSession(user, response)) {
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR)
            servletContext.log("GITHUB_CALLBACK_ERROR: failed to create new user session")
            return
        }

        // Success
        response.sendRedirect("/endless-eddies")
    }
}
