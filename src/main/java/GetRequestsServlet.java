import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.List;

@WebServlet("/get-requests")
public class GetRequestsServlet extends HttpServlet {

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        JsonArrayBuilder builder = Json.createArrayBuilder();

        User user = SessionManager.checkSession(request);
        if (user != null) {
            List<Request> requests = DatabaseConnector.getRequestsList(user);
            if (requests != null) {
                for (Request r : requests) {
                    builder = builder.add(r.toJsonObject());
                }
            }
        }

        HttpUtil.printJSONArray(response, builder.build());
    }

}
