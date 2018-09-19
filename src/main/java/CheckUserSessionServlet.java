import javax.json.Json;
import javax.json.JsonObject;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;

@WebServlet("/check-user-session-status")
public class CheckUserSessionServlet extends HttpServlet {

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        User user = SessionManager.checkSession(request);
        JsonObject result;
        if (user != null) {
            result = Json.createObjectBuilder()
                .add("sessionPresent", true)
                .add("user", user.toJsonObject())
                .build();
        } else {
            result = Json.createObjectBuilder()
                .add("sessionPresent", false)
                .build();
        }
        HttpUtil.printJSONResponse(response, result);
    }

}
