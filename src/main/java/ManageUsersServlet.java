import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.List;

@WebServlet("/manage-user-accounts")
public class ManageUsersServlet extends HttpServlet {

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        JsonArrayBuilder builder = Json.createArrayBuilder();

        User user = SessionManager.checkAdminSession(request);
        if (user != null) {
            List<User> users = DatabaseConnector.getManageUsersList(user.idUser);
            if (users != null) {
                for (User u : users) {
                    builder = builder.add(u.toJsonObject());
                }
            }
        }

        HttpUtil.printJSONArray(response, builder.build());
    }

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        User user = SessionManager.checkAdminSession(request);
        if (user == null) {
            HttpUtil.printPOSTResult(response, false, "No user session");
            return;
        }
        if (!SessionManager.checkXSRFToken(request)) {
            HttpUtil.printPOSTResult(response, false, "Invalid XSRF token");
            return;
        }

        HttpUtil.printPOSTResult(response, false, "Not implemented");
    }

}
