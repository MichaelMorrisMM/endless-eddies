import javax.json.Json;
import javax.json.JsonObject;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;

@WebServlet("/check-session-expiration-status")
public class CheckSessionExpirationServlet extends HttpServlet {

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        boolean sessionFound = false;
        try {
            User user = HttpUtil.checkForUserSessionAllowingForGuest(request);
            if (user != null) {
                sessionFound = true;
                if (SessionManager.isSessionTimeAlmostExpired(request)) {
                    SessionManager.addTimeToCurrentSession(user, request, response);
                }
            }
        } catch (Exception e) {
        }

        JsonObject result = Json.createObjectBuilder()
            .add("sessionPresent", sessionFound)
            .build();
        HttpUtil.printJSONResponse(response, result);
    }

}
