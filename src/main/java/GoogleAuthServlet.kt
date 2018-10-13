import java.io.IOException
import javax.servlet.annotation.WebServlet
import javax.servlet.http.HttpServlet
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

@WebServlet("/google-callback")
class GoogleAuthServlet : HttpServlet() {

    @Throws(IOException::class)
    override fun doGet(request: HttpServletRequest, response: HttpServletResponse) {
        val idTokenString = request.getParameter(GoogleOauth.ID_TOKEN_KEY)

        val userEmail = GoogleOauth.getUserEmail(idTokenString)

        if (userEmail.isEmpty()) {
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR)
            servletContext.log("GOOGLE_OAUTH_ERROR: failed to get user email for token: $idTokenString")
            return
        }

        OauthUser.registerAndCreateSession(userEmail, response, servletContext::log)
    }
}
