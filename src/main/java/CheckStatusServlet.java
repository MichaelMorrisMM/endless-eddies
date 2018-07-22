import javax.json.Json;
import javax.json.JsonObjectBuilder;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;

@WebServlet("/check-status")
public class CheckStatusServlet extends HttpServlet {

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        JsonObjectBuilder builder = Json.createObjectBuilder();
        try {
            User user = HttpUtil.checkForUserSessionAllowingForGuest(request);
            if (user == null) {
                HttpUtil.printJSONResponse(response, builder.add("error", "No user session").build());
                return;
            }

            String requestName = request.getParameter("requestName");
            if (!Util.isNonEmpty(requestName)) {
                HttpUtil.printJSONResponse(response, builder.add("error", "No request name specified").build());
                return;
            }

            HttpUtil.printJSONResponse(response, builder.add("idRequest", DatabaseConnector.checkRequestStatus(requestName)).build());
        } catch (Exception e) {
            HttpUtil.printJSONResponse(response, builder.add("error", "An error occurred").build());
        }
    }

}
