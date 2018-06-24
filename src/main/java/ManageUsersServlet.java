import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.ArrayList;
import java.util.List;

@WebServlet("/manage-user-accounts")
public class ManageUsersServlet extends HttpServlet {

    private static final String ACTION_DELETE = "delete";
    private static final String ACTION_MAKE_ADMIN = "makeAdmin";
    private static final String ACTION_MAKE_NORMAL = "makeNormal";

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

        String action = request.getParameter("action");
        if (!Util.isNonEmpty(action)) {
            HttpUtil.printPOSTResult(response, false, "No action specified");
            return;
        }
        boolean deleteMode = action.equals(ACTION_DELETE);
        boolean makeAdminMode = action.equals(ACTION_MAKE_ADMIN);
        boolean makeNormalMode = action.equals(ACTION_MAKE_NORMAL);
        if (!deleteMode && !makeAdminMode && !makeNormalMode) {
            HttpUtil.printPOSTResult(response, false, "Invalid action");
            return;
        }

        String idUsers = request.getParameter("idUsers");
        if (!Util.isNonEmpty(idUsers)) {
            HttpUtil.printPOSTResult(response, false, "No user(s) specified");
            return;
        }

        try {
            List<Integer> idUsersParsed = new ArrayList<>();
            String[] idUsersArray = idUsers.split(",");
            for (String id : idUsersArray) {
                idUsersParsed.add(Integer.parseInt(id));
            }

            boolean success = true;
            if (deleteMode) {
                for (Integer idUser : idUsersParsed) {
                    if (!DatabaseConnector.deleteUser(idUser)) {
                        success = false;
                    }
                }
                handleSuccess(response, success, "User(s) deleted", "Unable to delete user(s)");
            } else if (makeAdminMode) {
                for (Integer idUser : idUsersParsed) {
                    if (!DatabaseConnector.setUserPermissions(idUser, true)) {
                        success = false;
                    }
                }
                handleSuccess(response, success, "User(s) given admin permissions", "Unable to give user(s) admin permissions");
            } else {
                for (Integer idUser : idUsersParsed) {
                    if (!DatabaseConnector.setUserPermissions(idUser, false)) {
                        success = false;
                    }
                }
                handleSuccess(response, success, "User(s) given normal permissions", "Unable to give user(s) normal permissions");
            }
        } catch (Exception e) {
            HttpUtil.printPOSTResult(response, false, "An error occurred");
        }
    }

    private static void handleSuccess(HttpServletResponse response, boolean success, String successMessage, String failureMessage) throws IOException {
        if (success) {
            HttpUtil.printPOSTResult(response, true, successMessage);
        } else {
            HttpUtil.printPOSTResult(response, false, failureMessage);
        }
    }

}
